import Link from "next/link";
import { auth, signOut } from "@/auth";

export async function SiteHeader() {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="border-b border-wood-200 bg-wood-50/90 backdrop-blur sticky top-0 z-40">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-4 gap-y-2 px-4 py-3 sm:px-6 sm:py-4">
        <Link
          href="/"
          className="font-display text-base text-wood-800 tracking-wide sm:text-lg"
        >
          The Global Moebius Family
        </Link>
        <nav className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-wood-700 sm:gap-x-5">
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
