import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const userType = searchParams.get("userType");

    // Validate input
    if (!userId || !userType) {
      return NextResponse.json(
        { message: "userId and userType are required!" },
        { status: 400 }
      );
    }

    if (userType !== "USER" && userType !== "INSTITUTION") {
      return NextResponse.json(
        { message: "Invalid userType. Must be 'USER' or 'INSTITUTION'." },
        { status: 400 }
      );
    }

    // Fetch conversations where the user is either user1 or user2
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ user1Id: userId }, { user2Id: userId }],
      },
      include: {
        user1: {
          select: { id: true, firstName: true, lastName: true, profilePhoto: true },
        },
        user2: {
          select: { id: true, firstName: true, lastName: true, profilePhoto: true },
        },
        messages: {
          orderBy: { timestamp: "desc" },
        },
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json(
      { message: "Conversations fetched successfully!", data: conversations },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch Conversations Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch conversations!", error: error.message },
      { status: 500 }
    );
  }
};
