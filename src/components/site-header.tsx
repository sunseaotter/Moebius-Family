import Link from "next/link";
import { auth, signOut } from "@/auth";

export async function SiteHeader() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="border-b border-wood-200 bg-wood-50/90 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto max-w-5xl flex items-center justify-between px-6 py-4">
        <Link href="/" className="font-display text-lg text-wood-800 tracking-wide">
          The Global Moebius Family
        </Link>
        <nav className="flex items-center gap-5 text-sm text-wood-700">
          <Link href="/members" className="hover:text-sage-700">
            Members
          </Link>
          {user ? (
            <>
              <Link href="/profile" className="hover:text-sage-700">
                My Profile
              </Link>
              {user.role === "ADMIN" && (
                <Link href="/admin" className="hover:text-sage-700">
                  Admin
                </Link>
              )}
              <form
                action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}
              >
                <button
                  type="submit"
                  className="rounded-full border border-wood-300 px-4 py-1.5 hover:bg-wood-100"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-sage-700">
                Log in
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-sage-600 px-4 py-1.5 text-white hover:bg-sage-700"
              >
                Join
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
