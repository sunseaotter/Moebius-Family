"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { normalizeGd } from "@/lib/gd";
import { profileUpdateSchema } from "@/lib/validation";

export type ProfileUpdateState = { error?: string; success?: boolean } | undefined;

export async function updateProfileAction(
  _prevState: ProfileUpdateState,
  formData: FormData
): Promise<ProfileUpdateState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "You must be logged in." };
  }

  const raw = {
    name: formData.get("name"),
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

  const parsed = profileUpdateSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check your input and try again" };
  }
  const data = parsed.data;

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: data.name,
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

  revalidatePath("/profile");
  revalidatePath(`/members/${session.user.id}`);

  return { success: true };
}
