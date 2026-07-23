import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { approveUserAction, rejectUserAction } from "@/lib/actions/admin";
import { DeleteMemberButton } from "@/components/delete-member-button";

export default async function AdminPage() {
  const session = await auth();
  if (session?.user.role !== "ADMIN") redirect("/login");

  const [pending, others] = await Promise.all([
    prisma.user.findMany({
      where: { status: "PENDING" },
      orderBy: { createdAt: "asc" },
      select: { id: true, name: true, email: true, nationality: true, tttGroupName: true },
    }),
    prisma.user.findMany({
      where: { status: { not: "PENDING" } },
      orderBy: { createdAt: "desc" },
      take: 50,
      select: { id: true, name: true, email: true, status: true, role: true },
    }),
  ]);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 sm:py-16">
      <h1 className="font-display text-2xl text-wood-800 mb-8">Admin</h1>

      <section>
        <h2 className="font-display text-lg text-wood-800 mb-4">
          Pending registrations ({pending.length})
        </h2>
        {pending.length === 0 ? (
          <p className="text-wood-600 text-sm">Nothing to review right now.</p>
        ) : (
          <ul className="space-y-3">
            {pending.map((u) => (
              <li
                key={u.id}
                className="flex flex-col gap-3 rounded-xl border border-wood-200 bg-white/60 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-wood-800">{u.name}</p>
                  <p className="text-sm text-wood-500">
                    {u.email} · {u.nationality} · {u.tttGroupName}
                  </p>
                </div>
                <div className="flex gap-2">
                  <form action={approveUserAction.bind(null, u.id)}>
                    <button
                      type="submit"
                      className="rounded-full bg-sage-600 px-4 py-1.5 text-sm text-white hover:bg-sage-700"
                    >
                      Approve
                    </button>
                  </form>
                  <form action={rejectUserAction.bind(null, u.id)}>
                    <button
                      type="submit"
                      className="rounded-full border border-wood-300 px-4 py-1.5 text-sm text-wood-700 hover:bg-wood-100"
                    >
                      Reject
                    </button>
                  </form>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-12">
        <h2 className="font-display text-lg text-wood-800 mb-4">Recent members</h2>
        <ul className="space-y-2 text-sm">
          {others.map((u) => (
            <li
              key={u.id}
              className="flex flex-col gap-1 text-wood-700 sm:flex-row sm:items-center sm:justify-between"
            >
              <span>
                {u.name} <span className="text-wood-400">({u.email})</span>
              </span>
              <span className="flex items-center gap-3">
                <span className={u.status === "APPROVED" ? "text-sage-700" : "text-red-600"}>
                  {u.status}
                </span>
                {u.status === "APPROVED" && u.role !== "ADMIN" && (
                  <DeleteMemberButton userId={u.id} name={u.name} />
                )}
              </span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
