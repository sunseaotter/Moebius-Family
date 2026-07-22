import { RegisterForm } from "./register-form";

export default function RegisterPage() {
  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <h1 className="font-display text-2xl text-wood-800 mb-2">Join The Moebius Family</h1>
      <p className="text-sm text-wood-600 mb-8">
        Fill in your details below. New accounts are reviewed by an admin
        before appearing in the member directory.
      </p>
      <RegisterForm />
    </div>
  );
}
