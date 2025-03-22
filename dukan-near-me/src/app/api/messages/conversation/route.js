import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 

export const GET = async (req) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized! Please log in." },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { searchParams } = new URL(req.url);
    const institutionId = searchParams.get("receiverId");

    if (!institutionId) {
      return NextResponse.json(
        { message: "institutionId is required!" },
        { status: 400 }
      );
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: institutionId },
          { senderId: institutionId, receiverId: userId },
        ],
      },
      orderBy: { timestamp: "asc" },
    });

    return NextResponse.json(
      { message: "Conversation fetched successfully!", data: messages },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch Conversation Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch conversation!", error: error.message },
      { status: 500 }
    );
  }
};
