import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Avatar } from "@/components/avatar";

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  const members = await prisma.user.findMany({
    where: {
      status: "APPROVED",
      ...(query
        ? {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { nationality: { contains: query, mode: "insensitive" } },
              { tttGroupName: { contains: query, mode: "insensitive" } },
              { lifePurpose: { contains: query, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      nationality: true,
      tttGroupName: true,
      lifePurpose: true,
      hasPhoto: true,
    },
  });

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-display text-2xl text-wood-800 mb-6">Members</h1>

      <form className="mb-8">
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Search by name, nationality, TTT group, or life purpose…"
          className="w-full rounded-full border border-wood-200 bg-white px-5 py-3 text-wood-900 focus:border-sage-500 focus:outline-none"
        />
      </form>

      {members.length === 0 ? (
        <p className="text-wood-600">No members found.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {members.map((m) => (
            <Link
              key={m.id}
              href={`/members/${m.id}`}
              className="flex gap-4 rounded-2xl border border-wood-200 bg-white/60 p-5 hover:border-sage-400 transition-colors"
            >
              <Avatar userId={m.id} name={m.name} hasPhoto={m.hasPhoto} size={48} />
              <div>
                <h2 className="font-display text-lg text-wood-800">{m.name}</h2>
                <p className="text-sm text-sage-700">{m.nationality} · {m.tttGroupName}</p>
                <p className="mt-2 text-sm text-wood-600 line-clamp-2">{m.lifePurpose}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
