import { notFound } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Avatar } from "@/components/avatar";
import { WorkPortfolioMindMap } from "@/components/work-portfolio-mindmap";

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
    <div className="profile-watercolor-bg">
      <div className="mx-auto max-w-2xl px-4 pb-16 pt-28 sm:px-6 sm:pb-24 sm:pt-40">
        <div className="flex items-center gap-4 sm:gap-5">
          <Avatar userId={member.id} name={member.name} hasPhoto={member.hasPhoto} size={77} />
          <div>
            <h1 className="font-display text-3xl text-wood-900 sm:text-4xl">{member.name}</h1>
            {member.alsoKnownAs && (
              <p className="text-base text-wood-600">Also known as {member.alsoKnownAs}</p>
            )}
            {!isAdmin && (
              <>
                <p className="mt-1 text-lg text-sage-700">
                  {member.nationality} · {member.tttGroupName}
                </p>
                <p className="text-base text-wood-600">
                  TTT since {member.tttStartYear}/{String(member.tttStartMonth).padStart(2, "0")}
                </p>
              </>
            )}
          </div>
        </div>

        <section className="mt-10">
          <h2 className="font-display text-xl text-wood-800 mb-3">Life Purpose</h2>
          <p className="text-lg text-wood-800 whitespace-pre-wrap">{member.lifePurpose}</p>
        </section>

        {member.aboutYourself && (
          <section className="mt-10">
            <h2 className="font-display text-xl text-wood-800 mb-3">About</h2>
            <p className="text-lg text-wood-800 whitespace-pre-wrap">{member.aboutYourself}</p>
          </section>
        )}

        {gd.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-xl text-wood-800 mb-3">GD</h2>
            <div className="flex flex-wrap gap-2.5">
              {gd.map((g, i) => (
                <span
                  key={i}
                  className="rounded-full border border-wood-300 bg-wood-50/60 px-4 py-2 text-base text-wood-800"
                >
                  {g}
                </span>
              ))}
            </div>
          </section>
        )}

        {workPortfolio.length > 0 && (
          <section className="mt-10">
            <h2 className="font-display text-xl text-wood-800 mb-4 text-center sm:text-left">
              Meaningful Work Portfolio
            </h2>
            <WorkPortfolioMindMap name={member.name} items={workPortfolio} />
          </section>
        )}

        <section className="mt-10">
          <h2 className="font-display text-xl text-wood-800 mb-3">Connect</h2>
          <ul className="space-y-1.5 text-base">
            {showEmail && (
              <li>
                <span className="text-wood-600">Email: </span>
                <a
                  href={`mailto:${member.contactEmail}`}
                  className="text-sage-700 hover:underline"
                >
                  {member.contactEmail}
                </a>
              </li>
            )}
            {member.fbId && (
              <li>
                <span className="text-wood-600">FB Page: </span>
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
                <span className="text-wood-600">Website: </span>
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
              <li className="text-wood-600">This member hasn&apos;t shared any contact details.</li>
            )}
          </ul>
        </section>
      </div>
    </div>
  );
}
