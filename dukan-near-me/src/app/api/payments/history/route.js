import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const receiverId = searchParams.get("receiverId");

  if (!receiverId) return NextResponse.json({ error: "Receiver ID is required" }, { status: 400 });

  try {
    const payments = await prisma.paymentHistory.findMany({
      where: {
        OR: [
          { senderId: session.user.id, receiverId },
          { senderId: receiverId, receiverId: session.user.id }
        ],
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ payments }, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching payment history:", error);
    return NextResponse.json({ error: "Failed to fetch payment history" }, { status: 500 });
  }
}
