import nodemailer from "nodemailer";

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  if (transporter) return transporter;

  if (!process.env.SMTP_HOST) {
    // No SMTP configured (e.g. local dev) — log emails to the console instead of sending.
    transporter = nodemailer.createTransport({ jsonTransport: true });
    return transporter;
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
  return transporter;
}

export async function sendMail(to: string, subject: string, html: string) {
  const info = await getTransporter().sendMail({
    from: process.env.SMTP_FROM ?? "The Moebius Family <no-reply@example.com>",
    to,
    subject,
    html,
  });

  if (!process.env.SMTP_HOST) {
    console.log(`[mailer] (no SMTP configured, not actually sent) to=${to} subject="${subject}"`);
    console.log(JSON.stringify(info));
  }
}

export function adminNewRegistrationEmail(name: string, email: string) {
  return {
    subject: `[The Moebius Family] New registration to review: ${name}`,
    html: `<p>A new member has applied to join The Moebius Family:</p>
      <p><b>Name:</b> ${name}<br/><b>Email:</b> ${email}</p>
      <p>Review it here: <a href="${process.env.AUTH_URL}/admin">${process.env.AUTH_URL}/admin</a></p>`,
  };
}

export function userRegistrationApprovedEmail(name: string) {
  return {
    subject: `[The Moebius Family] Your account has been approved`,
    html: `<p>Hi ${name},</p><p>Your The Moebius Family account has been approved by an admin — you can now log in!</p>
      <p><a href="${process.env.AUTH_URL}/login">Log in</a></p>`,
  };
}

export function userRegistrationRejectedEmail(name: string) {
  return {
    subject: `[The Moebius Family] About your registration`,
    html: `<p>Hi ${name},</p><p>Unfortunately your registration was not approved. If you have questions, please contact an admin.</p>`,
  };
}

export function passwordResetEmail(resetUrl: string) {
  return {
    subject: `[The Moebius Family] Reset your password`,
    html: `<p>We received a request to reset your password. Click the link below to set a new one (valid for 30 minutes):</p>
      <p><a href="${resetUrl}">${resetUrl}</a></p>
      <p>If you didn't request this, you can safely ignore this email.</p>`,
  };
}
