import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { ProfileForm } from "./profile-form";

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const me = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!me) redirect("/login");

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <h1 className="font-display text-2xl text-wood-800 mb-1">My Profile</h1>
      <p className="text-sm text-wood-600 mb-8">{me.email}</p>
      <ProfileForm
        defaults={{
          name: me.name,
          nationality: me.nationality,
          tttStartYear: me.tttStartYear,
          tttStartMonth: me.tttStartMonth,
          tttGroupName: me.tttGroupName,
          lifePurpose: me.lifePurpose,
          gd: me.gd,
          contactEmail: me.contactEmail,
          contactEmailPublic: me.contactEmailPublic,
          fbId: me.fbId,
          personalWebsite: me.personalWebsite,
        }}
      />
    </div>
  );
}
