import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

export default async function MemberProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const member = await prisma.user.findUnique({ where: { id } });
  if (!member || member.status !== "APPROVED") notFound();

  const gd = member.gd.filter((g) => g.trim().length > 0);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-3xl text-wood-800">{member.name}</h1>
      <p className="mt-1 text-sage-700">
        {member.nationality} · {member.tttGroupName}
      </p>
      <p className="text-sm text-wood-500">
        TTT since {member.tttStartYear}/{String(member.tttStartMonth).padStart(2, "0")}
      </p>

      <section className="mt-8">
        <h2 className="font-display text-lg text-wood-800 mb-2">Life Purpose</h2>
        <p className="text-wood-700 whitespace-pre-wrap">{member.lifePurpose}</p>
      </section>

      {gd.length > 0 && (
        <section className="mt-8">
          <h2 className="font-display text-lg text-wood-800 mb-2">GD</h2>
          <ul className="grid grid-cols-2 gap-2 text-sm text-wood-700">
            {gd.map((g, i) => (
              <li key={i} className="rounded-lg bg-wood-100 px-3 py-2">
                {g}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-8">
        <h2 className="font-display text-lg text-wood-800 mb-2">Connect</h2>
        <ul className="space-y-1 text-sm">
          {member.contactEmailPublic && (
            <li>
              <span className="text-wood-500">Email: </span>
              <a href={`mailto:${member.contactEmail}`} className="text-sage-700 hover:underline">
                {member.contactEmail}
              </a>
            </li>
          )}
          {member.fbId && (
            <li>
              <span className="text-wood-500">FB: </span>
              <span className="text-wood-800">{member.fbId}</span>
            </li>
          )}
          {member.personalWebsite && (
            <li>
              <span className="text-wood-500">Website: </span>
              <a
                href={member.personalWebsite}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sage-700 hover:underline"
              >
                {member.personalWebsite}
              </a>
            </li>
          )}
          {!member.contactEmailPublic && !member.fbId && !member.personalWebsite && (
            <li className="text-wood-500">This member hasn&apos;t shared any contact details.</li>
          )}
        </ul>
      </section>
    </div>
  );
}
