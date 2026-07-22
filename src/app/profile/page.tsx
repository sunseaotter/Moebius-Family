import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "./profile-form";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const me = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      email: true,
      name: true,
      nationality: true,
      tttStartYear: true,
      tttStartMonth: true,
      tttGroupName: true,
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
  if (!me) redirect("/login");

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <h1 className="font-display text-2xl text-wood-800 mb-1">My Profile</h1>
      <p className="text-sm text-wood-600 mb-8">{me.email}</p>
      <ProfileForm
        photo={{ userId: me.id, hasPhoto: me.hasPhoto }}
        defaults={{
          name: me.name,
          nationality: me.nationality,
          tttStartYear: me.tttStartYear,
          tttStartMonth: me.tttStartMonth,
          tttGroupName: me.tttGroupName,
          lifePurpose: me.lifePurpose,
          gd: me.gd,
          workPortfolio: me.workPortfolio,
          contactEmail: me.contactEmail,
          contactEmailPublic: me.contactEmailPublic,
          fbId: me.fbId,
          personalWebsite: me.personalWebsite,
        }}
      />
    </div>
  );
}
