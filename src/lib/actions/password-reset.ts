"use server";

import crypto from "crypto";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { forgotPasswordSchema, resetPasswordSchema } from "@/lib/validation";
import { sendMail, passwordResetEmail } from "@/lib/mailer";

export type ForgotPasswordState = { message?: string; error?: string } | undefined;

export async function forgotPasswordAction(
  _prevState: ForgotPasswordState,
  formData: FormData
): Promise<ForgotPasswordState> {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") });
  if (!parsed.success) return { error: "Please enter a valid email" };

  const user = await prisma.user.findUnique({ where: { email: parsed.data.email } });

  // Respond identically whether or not the email exists, to avoid leaking registered accounts.
  if (user) {
    const token = crypto.randomBytes(32).toString("hex");
    await prisma.passwordResetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt: new Date(Date.now() + 30 * 60 * 1000),
      },
    });
    const resetUrl = `${process.env.AUTH_URL}/reset-password/${token}`;
    const { subject, html } = passwordResetEmail(resetUrl);
    await sendMail(user.email, subject, html).catch((e) =>
      console.error("Failed to send password reset email", e)
    );
  }

  return {
    message: "If that email is registered, we've sent a password reset link — please check your inbox.",
  };
}

export type ResetPasswordState = { error?: string } | undefined;

export async function resetPasswordAction(
  _prevState: ResetPasswordState,
  formData: FormData
): Promise<ResetPasswordState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Please check your input and try again" };
  }

  const resetToken = await prisma.passwordResetToken.findUnique({
    where: { token: parsed.data.token },
  });

  if (!resetToken || resetToken.usedAt || resetToken.expiresAt < new Date()) {
    return { error: "This reset link has expired. Please request a new one." };
  }

  const passwordHash = await hashPassword(parsed.data.password);
  await prisma.$transaction([
    prisma.user.update({ where: { id: resetToken.userId }, data: { passwordHash } }),
    prisma.passwordResetToken.update({ where: { id: resetToken.id }, data: { usedAt: new Date() } }),
  ]);

  redirect("/login?reset=1");
}
