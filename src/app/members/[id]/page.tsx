import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Avatar } from "@/components/avatar";

function toAbsoluteUrl(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`;
}

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
      aboutYourself: true,
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

  const isAdmin = member.role === "ADMIN";
  const gd = member.gd.filter((g) => g.trim().length > 0);
  const workPortfolio = member.workPortfolio.filter((w) => w.trim().length > 0);
  const personalWebsites = member.personalWebsite.filter((w) => w.trim().length > 0);
  const showEmail = member.contactEmailPublic || isAdmin;

  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-16">
      <div className="flex items-center gap-4 sm:gap-5">
        <Avatar userId={member.id} name={member.name} hasPhoto={member.hasPhoto} size={64} />
        <div>
          <h1 className="font-display text-2xl text-wood-800 sm:text-3xl">{member.name}</h1>
          {member.alsoKnownAs && (
            <p className="text-sm text-wood-500">Also known as {member.alsoKnownAs}</p>
          )}
          {!isAdmin && (
            <>
              <p className="mt-1 text-sage-700">
                {member.nationality} · {member.tttGroupName}
              </p>
              <p className="text-sm text-wood-500">
                TTT since {member.tttStartYear}/{String(member.tttStartMonth).padStart(2, "0")}
              </p>
            </>
          )}
        </div>
      </div>

      <section className="mt-8">
        <h2 className="font-display text-lg text-wood-800 mb-2">Life Purpose</h2>
        <p className="text-wood-700 whitespace-pre-wrap">{member.lifePurpose}</p>
      </section>

      {member.aboutYourself && (
        <section className="mt-8">
          <h2 className="font-display text-lg text-wood-800 mb-2">About</h2>
          <p className="text-wood-700 whitespace-pre-wrap">{member.aboutYourself}</p>
        </section>
      )}

      {gd.length > 0 && (
        <section className="mt-8">
          <h2 className="font-display text-lg text-wood-800 mb-2">GD</h2>
          <ul className="grid grid-cols-1 gap-2 text-sm text-wood-700 sm:grid-cols-2">
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
          <ul className="grid grid-cols-1 gap-2 text-sm text-wood-700 sm:grid-cols-2">
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
          {showEmail && (
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
              <a
                href={toAbsoluteUrl(member.fbId)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sage-700 hover:underline"
              >
                {member.fbId}
              </a>
            </li>
          )}
          {personalWebsites.map((url, i) => (
            <li key={i}>
              <span className="text-wood-500">Website: </span>
              <a
                href={toAbsoluteUrl(url)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sage-700 hover:underline"
              >
                {url}
              </a>
            </li>
          ))}
          {!showEmail && !member.fbId && personalWebsites.length === 0 && (
            <li className="text-wood-500">This member hasn&apos;t shared any contact details.</li>
          )}
        </ul>
      </section>
    </div>
  );
}
