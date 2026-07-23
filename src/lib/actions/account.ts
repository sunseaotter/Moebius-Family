"use server";

import { auth, signOut } from "@/auth";
import { prisma } from "@/lib/prisma";
import { verifyPassword } from "@/lib/password";

export type DeleteAccountState = { error?: string } | undefined;

export async function deleteAccountAction(
  _prevState: DeleteAccountState,
  formData: FormData
): Promise<DeleteAccountState> {
  const session = await auth();
  if (!session?.user) {
    return { error: "You must be logged in." };
  }

  const password = formData.get("password");
  if (typeof password !== "string" || !password) {
    return { error: "Please enter your password to confirm." };
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) {
    return { error: "You must be logged in." };
  }

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) {
    return { error: "Incorrect password." };
  }

  if (user.role === "ADMIN") {
    return { error: "Admin accounts can't be deleted from here." };
  }

  await prisma.user.delete({ where: { id: user.id } });

  await signOut({ redirectTo: "/" });
}
