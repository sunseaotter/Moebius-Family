import { auth } from "@/auth";

export async function PendingBanner() {
  const session = await auth();
  if (session?.user.status !== "PENDING") return null;

  return (
    <div className="bg-wood-200 text-wood-800 text-sm text-center py-2 px-4">
      Your account is waiting for admin approval. You can browse and edit your
      profile, but other members won&apos;t see you in the directory yet.
    </div>
  );
}
