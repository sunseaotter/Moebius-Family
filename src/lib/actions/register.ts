"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { normalizeGd, normalizeWorkPortfolio, normalizePersonalWebsite } from "@/lib/slots";
import { extractPhoto } from "@/lib/photo";
import { registerSchema } from "@/lib/validation";
import { sendMail, adminNewRegistrationEmail } from "@/lib/mailer";

export type RegisterFormState = { error?: string } | undefined;

export async function registerAction(
  _prevState: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  const raw = {
    name: formData.get("name"),
    alsoKnownAs: formData.get("alsoKnownAs") || undefined,
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
    nationality: formData.get("nationality"),
    nationalityOther: formData.get("nationalityOther") || undefined,
    tttStartYear: formData.get("tttStartYear"),
    tttGroupName: formData.get("tttGroupName"),
    lifePurpose: formData.get("lifePurpose"),
    gd: formData.getAll("gd"),
    workPortfolio: formData.getAll("workPortfolio"),
    contactEmail: formData.get("contactEmail"),
    contactEmailPublic: formData.get("contactEmailPublic") === "on",
    fbId: formData.get("fbId") || undefined,
    personalWebsite: formData.getAll("personalWebsite"),
    profilePublic: formData.get("profilePublic") === "on",
    aboutYourself: formData.get("aboutYourself") || undefined,
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check your input and try again" };
  }
  const data = parsed.data;
  const nationality = data.nationality === "Others" ? data.nationalityOther!.trim() : data.nationality;

  const { photo, error: photoError } = await extractPhoto(formData);
  if (photoError) {
    return { error: photoError };
  }

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    return { error: "This email is already registered" };
  }

  const passwordHash = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      alsoKnownAs: data.alsoKnownAs || null,
      email: data.email,
      passwordHash,
      nationality,
      tttStartYear: data.tttStartYear,
      tttGroupName: data.tttGroupName,
      lifePurpose: data.lifePurpose,
      gd: normalizeGd(data.gd),
      workPortfolio: normalizeWorkPortfolio(data.workPortfolio),
      contactEmail: data.contactEmail,
      contactEmailPublic: data.contactEmailPublic,
      fbId: data.fbId || null,
      personalWebsite: normalizePersonalWebsite(data.personalWebsite),
      profilePublic: data.profilePublic,
      aboutYourself: data.aboutYourself || null,
      ...(photo && { photo: photo.buffer, photoType: photo.mimeType, hasPhoto: true }),
    },
  });

  const admins = await prisma.user.findMany({
    where: { role: "ADMIN" },
    select: { email: true },
  });
  const { subject, html } = adminNewRegistrationEmail(user.name, user.email);
  await Promise.all(
    admins.map((admin) =>
      sendMail(admin.email, subject, html).catch((e) =>
        console.error("Failed to send admin notification email", e)
      )
    )
  );

  redirect("/login?registered=1");
}
