import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { hashPassword } from "../src/lib/password";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME ?? "Admin";

  if (!email || !password) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env to seed the admin account.");
  }

  const passwordHash = await hashPassword(password);

  const admin = await prisma.user.upsert({
    where: { email },
    update: { role: "ADMIN", status: "APPROVED" },
    create: {
      email,
      passwordHash,
      name,
      role: "ADMIN",
      status: "APPROVED",
      nationality: "—",
      tttStartYear: new Date().getFullYear(),
      tttStartMonth: 1,
      tttGroupName: "—",
      lifePurpose: "Administering The Moebius Family.",
      gd: [],
      contactEmail: email,
      contactEmailPublic: false,
    },
  });

  console.log(`Admin account ready: ${admin.email} (role=${admin.role}, status=${admin.status})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
