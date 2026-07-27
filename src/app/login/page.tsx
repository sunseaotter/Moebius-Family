import Link from "next/link";
import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string; reset?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="mx-auto max-w-sm px-4 py-16 sm:px-6">
      <h1 className="font-display text-2xl text-wood-800 mb-6">Log in</h1>

      {params.registered && (
        <div className="mb-6 space-y-3 rounded-lg bg-sage-100 text-sage-800 text-sm px-4 py-3">
          <p className="font-semibold">
            Thank you for applying to join The Global Moebius Family! 🌱
          </p>
          <p>
            We&apos;ve received your application and our admin team will
            review it within 48 hours. The confirmation email will be sent
            from globalmoebius@gmail.com if approved — so please keep an eye
            on your inbox (and maybe your spam folder, just in case!).
          </p>
          <p>
            We appreciate your patience, and we&apos;re excited to welcome
            you to the family soon.
          </p>
        </div>
      )}
      {params.reset && (
        <p className="mb-6 rounded-lg bg-sage-100 text-sage-800 text-sm px-4 py-3">
          Your password has been reset. Please log in with your new password.
        </p>
      )}

      <LoginForm />

      <div className="mt-6 flex justify-between text-sm text-wood-600">
        <Link href="/forgot-password" className="hover:text-sage-700">
          Forgot password?
        </Link>
        <Link href="/register" className="hover:text-sage-700">
          Join the family →
        </Link>
      </div>
    </div>
  );
}
