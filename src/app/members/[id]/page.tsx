import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Avatar } from "@/components/avatar";

export default async function MemberProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();

  const member = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      alsoKnownAs: true,
      status: true,
      role: true,
      profilePublic: true,
      nationality: true,
      tttGroupName: true,
      tttStartYear: true,
      tttStartMonth: true,
      lifePurpose: true,
      gd: true,
      workPortfolio: true,
      contactEmail: true,
      contactEmailPublic: true,
      fbId: true,
      personalWebsite: true,
      hasPhoto: true,
    },
  });
  if (!member || member.status !== "APPROVED") notFound();
  if (!session?.user && !member.profilePublic) notFound();

  const gd = member.gd.filter((g) => g.trim().length > 0);
  const workPortfolio = member.workPortfolio.filter((w) => w.trim().length > 0);
  const personalWebsites = member.personalWebsite.filter((w) => w.trim().length > 0);

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <div className="flex items-center gap-5">
        <Avatar userId={member.id} name={member.name} hasPhoto={member.hasPhoto} size={80} />
        <div>
          <h1 className="font-display text-3xl text-wood-800">{member.name}</h1>
          {member.alsoKnownAs && (
            <p className="text-sm text-wood-500">Also known as {member.alsoKnownAs}</p>
          )}
          <p className="mt-1 text-sage-700">
            {member.nationality} · {member.tttGroupName}
          </p>
          {member.role !== "ADMIN" && (
            <p className="text-sm text-wood-500">
              TTT since {member.tttStartYear}/{String(member.tttStartMonth).padStart(2, "0")}
            </p>
          )}
        </div>
      </div>

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

      {workPortfolio.length > 0 && (
        <section className="mt-8">
          <h2 className="font-display text-lg text-wood-800 mb-2">Meaningful Work Portfolio</h2>
          <ul className="grid grid-cols-2 gap-2 text-sm text-wood-700">
            {workPortfolio.map((w, i) => (
              <li key={i} className="rounded-lg bg-wood-100 px-3 py-2">
                {w}
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
              <span className="text-wood-500">FB Page: </span>
              <span className="text-wood-800">{member.fbId}</span>
            </li>
          )}
          {personalWebsites.map((url, i) => (
            <li key={i}>
              <span className="text-wood-500">Website: </span>
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sage-700 hover:underline"
              >
                {url}
              </a>
            </li>
          ))}
          {!member.contactEmailPublic && !member.fbId && personalWebsites.length === 0 && (
            <li className="text-wood-500">This member hasn&apos;t shared any contact details.</li>
          )}
        </ul>
      </section>
    </div>
  );
}
