import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const institutionId = searchParams.get("institutionId");

    
    if (!userId || !institutionId) {
      return NextResponse.json(
        { message: "userId and institutionId are required!" },
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
