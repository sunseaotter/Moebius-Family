import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Avatar } from "@/components/avatar";
import type { Prisma } from "@/generated/prisma/client";

export default async function MembersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; nationality?: string; tttGroup?: string }>;
}) {
  const { q, nationality, tttGroup } = await searchParams;
  const query = q?.trim() ?? "";

  const session = await auth();
  const visibilityWhere: Prisma.UserWhereInput = session?.user
    ? { status: "APPROVED" }
    : { status: "APPROVED", profilePublic: true };

  // Prisma's scalar array filters (has/hasSome/...) only do exact-value matching,
  // so a substring match against GD entries needs a raw query.
  const gdMatchIds = query
    ? (
        await prisma.$queryRaw<{ id: string }[]>`
          SELECT id FROM "User"
          WHERE status = 'APPROVED'
            AND EXISTS (SELECT 1 FROM unnest(gd) AS g WHERE g ILIKE ${`%${query}%`})
        `
      ).map((r) => r.id)
    : [];

  const [members, nationalityOptions, tttGroupOptions] = await Promise.all([
    prisma.user.findMany({
      where: {
        ...visibilityWhere,
        ...(nationality ? { nationality } : {}),
        ...(tttGroup ? { tttGroupName: tttGroup } : {}),
        ...(query
          ? {
              OR: [
                { name: { contains: query, mode: "insensitive" } },
                { nationality: { contains: query, mode: "insensitive" } },
                { tttGroupName: { contains: query, mode: "insensitive" } },
                { lifePurpose: { contains: query, mode: "insensitive" } },
                ...(gdMatchIds.length > 0 ? [{ id: { in: gdMatchIds } }] : []),
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
    }),
    prisma.user.findMany({
      where: visibilityWhere,
      distinct: ["nationality"],
      select: { nationality: true },
      orderBy: { nationality: "asc" },
    }),
    prisma.user.findMany({
      where: visibilityWhere,
      distinct: ["tttGroupName"],
      select: { tttGroupName: true },
      orderBy: { tttGroupName: "asc" },
    }),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="font-display text-2xl text-wood-800 mb-6">Members</h1>

      <form className="mb-8 space-y-3">
        <input
          type="text"
          name="q"
          defaultValue={query}
          placeholder="Search by name, nationality, TTT group, GD, or life purpose…"
          className="w-full rounded-full border border-wood-200 bg-white px-5 py-3 text-wood-900 focus:border-sage-500 focus:outline-none"
        />
        <div className="flex gap-3">
          <select
            name="nationality"
            defaultValue={nationality ?? ""}
            className="flex-1 rounded-full border border-wood-200 bg-white px-4 py-2 text-sm text-wood-900 focus:border-sage-500 focus:outline-none"
          >
            <option value="">Filter by nationality…</option>
            {nationalityOptions.map((n) => (
              <option key={n.nationality} value={n.nationality}>
                {n.nationality}
              </option>
            ))}
          </select>
          <select
            name="tttGroup"
            defaultValue={tttGroup ?? ""}
            className="flex-1 rounded-full border border-wood-200 bg-white px-4 py-2 text-sm text-wood-900 focus:border-sage-500 focus:outline-none"
          >
            <option value="">Filter by TTT group…</option>
            {tttGroupOptions.map((g) => (
              <option key={g.tttGroupName} value={g.tttGroupName}>
                {g.tttGroupName}
              </option>
            ))}
          </select>
        </div>
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
