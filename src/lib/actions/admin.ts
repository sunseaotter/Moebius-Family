"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import {
  sendMail,
  userRegistrationApprovedEmail,
  userRegistrationRejectedEmail,
} from "@/lib/mailer";

async function requireAdmin() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") {
    throw new Error("Forbidden");
  }
}

export async function approveUserAction(userId: string) {
  await requireAdmin();

  const user = await prisma.user.update({
    where: { id: userId },
    data: { status: "APPROVED" },
  });

  const { subject, html } = userRegistrationApprovedEmail(user.name);
  await sendMail(user.email, subject, html).catch((e) =>
    console.error("Failed to send approval email", e)
  );

  revalidatePath("/admin");
}

export async function rejectUserAction(userId: string) {
  await requireAdmin();

  const user = await prisma.user.update({
    where: { id: userId },
    data: { status: "REJECTED" },
  });

  const { subject, html } = userRegistrationRejectedEmail(user.name);
  await sendMail(user.email, subject, html).catch((e) =>
    console.error("Failed to send rejection email", e)
  );

  revalidatePath("/admin");
}
