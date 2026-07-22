"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { normalizeGd } from "@/lib/gd";
import { registerSchema } from "@/lib/validation";
import { sendMail, adminNewRegistrationEmail } from "@/lib/mailer";

export type RegisterFormState = { error?: string } | undefined;

export async function registerAction(
  _prevState: RegisterFormState,
  formData: FormData
): Promise<RegisterFormState> {
  const raw = {
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    nationality: formData.get("nationality"),
    tttStartYear: formData.get("tttStartYear"),
    tttStartMonth: formData.get("tttStartMonth"),
    tttGroupName: formData.get("tttGroupName"),
    lifePurpose: formData.get("lifePurpose"),
    gd: formData.getAll("gd"),
    contactEmail: formData.get("contactEmail"),
    contactEmailPublic: formData.get("contactEmailPublic") === "on",
    fbId: formData.get("fbId") || undefined,
    personalWebsite: formData.get("personalWebsite") || undefined,
  };

  const parsed = registerSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check your input and try again" };
  }
  const data = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email: data.email } });
  if (existing) {
    return { error: "This email is already registered" };
  }

  const passwordHash = await hashPassword(data.password);

  const user = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      passwordHash,
      nationality: data.nationality,
      tttStartYear: data.tttStartYear,
      tttStartMonth: data.tttStartMonth,
      tttGroupName: data.tttGroupName,
      lifePurpose: data.lifePurpose,
      gd: normalizeGd(data.gd),
      contactEmail: data.contactEmail,
      contactEmailPublic: data.contactEmailPublic,
      fbId: data.fbId || null,
      personalWebsite: data.personalWebsite || null,
    },
  });

  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    const { subject, html } = adminNewRegistrationEmail(user.name, user.email);
    await sendMail(adminEmail, subject, html).catch((e) =>
      console.error("Failed to send admin notification email", e)
    );
  }

  redirect("/login?registered=1");
}
