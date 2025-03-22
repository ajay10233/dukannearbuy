import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";

export const GET = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const userType = searchParams.get("userType");

    
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

    
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, senderType: userType },
          { receiverId: userId },
        ],
      },
      orderBy: { timestamp: "desc" },
    });

    return NextResponse.json(
      { message: "Messages fetched successfully!", data: messages },
      { status: 200 }
    );
  } catch (error) {
    console.error("Fetch Messages Error:", error);
    return NextResponse.json(
      { message: "Failed to fetch messages!", error: error.message },
      { status: 500 }
    );
  }
};
