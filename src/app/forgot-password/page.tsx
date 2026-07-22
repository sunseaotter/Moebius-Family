import { ForgotPasswordForm } from "./forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-sm px-6 py-16">
      <h1 className="font-display text-2xl text-wood-800 mb-2">Forgot password</h1>
      <p className="text-sm text-wood-600 mb-6">
        Enter the email you registered with and we&apos;ll send you a reset link.
      </p>
      <ForgotPasswordForm />
    </div>
  );
}
