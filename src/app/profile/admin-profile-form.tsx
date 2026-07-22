"use client";

import { useActionState } from "react";
import { updateAdminProfileAction } from "@/lib/actions/admin-profile";
import {
  AdminProfileFields,
  AdminProfileFieldDefaults,
  ProfilePhoto,
} from "@/components/admin-profile-fields";

export function AdminProfileForm({
  defaults,
  photo,
}: {
  defaults: AdminProfileFieldDefaults;
  photo: ProfilePhoto;
}) {
  const [state, formAction, pending] = useActionState(updateAdminProfileAction, undefined);

  return (
    <form action={formAction} className="space-y-6">
      <AdminProfileFields defaults={defaults} photo={photo} />

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
