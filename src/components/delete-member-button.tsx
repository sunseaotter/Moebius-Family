"use client";

import { deleteApprovedUserAction } from "@/lib/actions/admin";

export function DeleteMemberButton({ userId, name }: { userId: string; name: string }) {
  return (
    <form
      action={deleteApprovedUserAction.bind(null, userId)}
      onSubmit={(e) => {
        if (!window.confirm(`Permanently delete ${name}'s account? This cannot be undone.`)) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="rounded-full border border-red-300 px-3 py-1 text-xs text-red-600 hover:bg-red-50"
      >
        Delete
      </button>
    </form>
  );
}
