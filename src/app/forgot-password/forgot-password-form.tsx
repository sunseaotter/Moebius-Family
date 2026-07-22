"use client";

import { useActionState } from "react";
import { forgotPasswordAction } from "@/lib/actions/password-reset";

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(forgotPasswordAction, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="block text-sm text-wood-700 mb-1" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          className="w-full rounded-lg border border-wood-200 bg-white px-3 py-2 text-wood-900 focus:border-sage-500 focus:outline-none"
        />
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.message && (
        <p className="text-sm text-sage-700 bg-sage-100 rounded-lg px-4 py-3">{state.message}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-sage-600 py-2 text-white hover:bg-sage-700 disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send reset link"}
      </button>
    </form>
  );
}
