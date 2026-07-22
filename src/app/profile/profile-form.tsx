"use client";

import { useActionState } from "react";
import { updateProfileAction } from "@/lib/actions/profile";
import { CommunityProfileFields, ProfileFieldDefaults } from "@/components/community-profile-fields";

export function ProfileForm({ defaults }: { defaults: ProfileFieldDefaults }) {
  const [state, formAction, pending] = useActionState(updateProfileAction, undefined);

  return (
    <form action={formAction} className="space-y-6">
      <CommunityProfileFields defaults={defaults} />

      {state?.error && <p className="text-sm text-red-600">{state.error}</p>}
      {state?.success && (
        <p className="text-sm text-sage-700 bg-sage-100 rounded-lg px-4 py-3">
          Profile updated.
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-sage-600 py-2 text-white hover:bg-sage-700 disabled:opacity-60"
      >
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
