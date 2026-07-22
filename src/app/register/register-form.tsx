"use client";

import { useActionState } from "react";
import { registerAction } from "@/lib/actions/register";
import { CommunityProfileFields } from "@/components/community-profile-fields";

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerAction, undefined);

  const inputClass =
    "w-full rounded-lg border border-wood-200 bg-white px-3 py-2 text-wood-900 focus:border-sage-500 focus:outline-none";
  const labelClass = "block text-sm text-wood-700 mb-1";

  return (
    <form action={formAction} className="space-y-6">
      <div>
        <label className={labelClass} htmlFor="email">
          Login Email
        </label>
        <input id="email" name="email" type="email" required className={inputClass} />
      </div>
      <div>
        <label className={labelClass} htmlFor="password">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          minLength={8}
          required
          className={inputClass}
        />
      </div>
      <div>
        <label className={labelClass} htmlFor="confirmPassword">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          name="confirmPassword"
          type="password"
          minLength={8}
          required
          className={inputClass}
        />
      </div>

      <hr className="border-wood-200" />

      <CommunityProfileFields />

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-sage-600 py-2 text-white hover:bg-sage-700 disabled:opacity-60"
      >
        {pending ? "Submitting…" : "Register"}
      </button>
    </form>
  );
}
