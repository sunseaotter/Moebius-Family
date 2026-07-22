import Link from "next/link";

export default function Home() {
  return (
    <div>
      <section className="relative overflow-hidden bg-gradient-to-b from-wood-100 via-wood-50 to-wood-50">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-sage-200/60 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-wood-300/40 blur-3xl"
        />

        <div className="relative mx-auto max-w-4xl px-6 py-24 text-center">
          <p className="mb-4 text-sm uppercase tracking-[0.2em] text-sage-700">
            The Moebius Family
          </p>
          <h1 className="font-display text-4xl sm:text-5xl leading-tight text-wood-900">
            A Place for the Moebius to get to know each other, to connect,
            <br /> and to create our meaningful work together.
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-wood-700">
            Every member of the Moebius community has a story, a purpose,
            unique GD, and a group they grew with. This is the home base —
            let&apos;s find each other, learn from each other, stay
            connected, and together, create our meaningful work.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/register"
              className="rounded-full bg-sage-600 px-8 py-3 text-white hover:bg-sage-700 transition-colors"
            >
              Join the family
            </Link>
            <Link
              href="/members"
              className="rounded-full border border-wood-300 px-8 py-3 text-wood-800 hover:bg-wood-100 transition-colors"
            >
              Browse members
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20">
        <div className="grid gap-8 sm:grid-cols-3">
          <div className="rounded-2xl border border-wood-200 bg-white/60 p-6">
            <h2 className="font-display text-lg text-wood-800 mb-2">Register</h2>
            <p className="text-sm text-wood-600">
              Create your profile — your TTT group, your Life Purpose, and
              the GD moments that shaped you.
            </p>
          </div>
          <div className="rounded-2xl border border-wood-200 bg-white/60 p-6">
            <h2 className="font-display text-lg text-wood-800 mb-2">Discover</h2>
            <p className="text-sm text-wood-600">
              Search the directory by name, nationality, or TTT group to find
              members from across the family.
            </p>
          </div>
          <div className="rounded-2xl border border-wood-200 bg-white/60 p-6">
            <h2 className="font-display text-lg text-wood-800 mb-2">Connect</h2>
            <p className="text-sm text-wood-600">
              Reach out directly through the contact details members choose
              to share on their profile.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
