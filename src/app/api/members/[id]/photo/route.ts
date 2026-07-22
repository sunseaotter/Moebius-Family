import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: { photo: true, photoType: true, status: true },
  });

  if (!user?.photo) {
    return new Response(null, { status: 404 });
  }

  if (user.status !== "APPROVED") {
    const session = await auth();
    if (session?.user.id !== id) {
      return new Response(null, { status: 404 });
    }
  }

  return new Response(new Uint8Array(user.photo), {
    headers: {
      "Content-Type": user.photoType ?? "application/octet-stream",
      "Cache-Control": "private, max-age=3600",
    },
  });
}
