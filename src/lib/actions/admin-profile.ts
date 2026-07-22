"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { extractPhoto } from "@/lib/photo";
import { adminProfileUpdateSchema } from "@/lib/validation";

export type AdminProfileUpdateState = { error?: string; success?: boolean } | undefined;

export async function updateAdminProfileAction(
  _prevState: AdminProfileUpdateState,
  formData: FormData
): Promise<AdminProfileUpdateState> {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return { error: "You must be an admin to do this." };
  }

  const raw = {
    name: formData.get("name"),
    contactEmail: formData.get("contactEmail"),
    fbId: formData.get("fbId") || undefined,
  };

  const parsed = adminProfileUpdateSchema.safeParse(raw);
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check your input and try again" };
  }
  const data = parsed.data;

  const { photo, error: photoError } = await extractPhoto(formData);
  if (photoError) {
    return { error: photoError };
  }
  const removePhoto = formData.get("removePhoto") === "on";

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      name: data.name,
      contactEmail: data.contactEmail,
      fbId: data.fbId || null,
      ...(photo
        ? { photo: photo.buffer, photoType: photo.mimeType, hasPhoto: true }
        : removePhoto
          ? { photo: null, photoType: null, hasPhoto: false }
          : {}),
    },
  });

  revalidatePath("/profile");
  revalidatePath(`/members/${session.user.id}`);

  return { success: true };
}
