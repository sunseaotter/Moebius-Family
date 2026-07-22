import Link from "next/link";
import { LoginForm } from "./login-form";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ registered?: string; reset?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="mx-auto max-w-sm px-6 py-16">
      <h1 className="font-display text-2xl text-wood-800 mb-6">Log in</h1>

      {params.registered && (
        <p className="mb-6 rounded-lg bg-sage-100 text-sage-800 text-sm px-4 py-3">
          Thanks for registering! Your account is pending admin approval — you
          can log in right away and browse the site in the meantime.
        </p>
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
