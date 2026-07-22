"use client";

import { useActionState } from "react";
import { changePasswordAction } from "@/lib/actions/change-password";

const inputClass =
  "w-full rounded-lg border border-wood-200 bg-white px-3 py-2 text-wood-900 focus:border-sage-500 focus:outline-none";
const labelClass = "block text-sm text-wood-700 mb-1";

export function ChangePasswordForm() {
  const [state, formAction, pending] = useActionState(changePasswordAction, undefined);

  return (
    <form
      key={state?.success ? "success" : "idle"}
      action={formAction}
      className="mt-10 space-y-4 rounded-2xl border border-wood-200 p-6"
    >
      <h2 className="font-display text-lg text-wood-800">Change Password</h2>

      <div>
        <label className={labelClass} htmlFor="currentPassword">
          Current Password
        </label>
        <input
          id="currentPassword"
          name="currentPassword"
          type="password"
          required
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass} htmlFor="newPassword">
          New Password
        </label>
        <input
          id="newPassword"
          name="newPassword"
          type="password"
          minLength={8}
          required
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass} htmlFor="confirmNewPassword">
          Confirm New Password
        </label>
        <input
          id="confirmNewPassword"
          name="confirmNewPassword"
          type="password"
          minLength={8}
          required
          className={inputClass}
        />
      </div>

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && (
        <p className="text-sm text-sage-700 bg-sage-100 rounded-lg px-4 py-3">
          Password updated.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-sage-600 py-2 text-white hover:bg-sage-700 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Update password"}
      </button>
    </form>
  );
}
