"use client";

import { useActionState } from "react";
import { deleteAccountAction } from "@/lib/actions/account";

const inputClass =
  "w-full rounded-lg border border-wood-200 bg-white px-3 py-2 text-wood-900 focus:border-sage-500 focus:outline-none";
const labelClass = "block text-sm text-wood-700 mb-1";

export function DeleteAccountForm() {
  const [state, formAction, pending] = useActionState(deleteAccountAction, undefined);

  return (
    <form
      action={formAction}
      onSubmit={(e) => {
        if (
          !window.confirm(
            "Are you sure you want to permanently delete your account? This cannot be undone."
          )
        ) {
          e.preventDefault();
        }
      }}
      className="mt-10 space-y-4 rounded-2xl border border-red-200 bg-red-50/40 p-6"
    >
      <h2 className="font-display text-lg text-red-700">Delete Account</h2>
      <p className="text-sm text-wood-600">
        This will permanently delete your profile and all your data. This action cannot be
        undone.
      </p>

      <div>
        <label className={labelClass} htmlFor="deletePassword">
          Enter your password to confirm
        </label>
        <input
          id="deletePassword"
          name="password"
          type="password"
          required
          className={inputClass}
        />
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-red-600 py-2 text-white hover:bg-red-700 disabled:opacity-60"
      >
        {pending ? "Deleting…" : "Delete my account"}
      </button>
    </form>
  );
}
