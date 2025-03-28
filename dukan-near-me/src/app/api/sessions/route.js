import { prisma } from "@/utils/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }

  // Fetch all active sessions of the user
  const sessions = await prisma.session.findMany({
    where: { userId: session.user.id },
    select: { id: true, device: true, ip: true, createdAt: true, token: true },
  });

  return new Response(JSON.stringify(sessions), { status: 200 });
}
