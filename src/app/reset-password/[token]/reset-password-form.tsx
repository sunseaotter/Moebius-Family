"use client";

import { useActionState } from "react";
import { resetPasswordAction } from "@/lib/actions/password-reset";

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(resetPasswordAction, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="token" value={token} />
      <div>
        <label className="block text-sm text-wood-700 mb-1" htmlFor="password">
          New password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          minLength={8}
          required
          className="w-full rounded-lg border border-wood-200 bg-white px-3 py-2 text-wood-900 focus:border-sage-500 focus:outline-none"
        />
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-sage-600 py-2 text-white hover:bg-sage-700 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Reset password"}
      </button>
    </form>
  );
}
