import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 
import { ObjectId } from "mongodb";

export const GET = async (req) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized! Please log in." },
        { status: 401 }
      );
    }

    const userId = new ObjectId(session.user.id);
    const { searchParams } = new URL(req.url);
    const conversationIdStr = searchParams.get("conversationId");
    const otherUserIdStr = searchParams.get("userId");

    let conversation;

    if (conversationIdStr) {
      const conversationId = new ObjectId(conversationIdStr);
      conversation = await prisma.conversation.findUnique({
        where: { id: conversationId.toString() },
        include: {
          messages: { orderBy: { timestamp: "asc" } },
          user1: { select: userSelection() },
          user2: { select: userSelection() },
        },
      });
    } else if (otherUserIdStr) {
      const otherUserId = new ObjectId(otherUserIdStr);
      conversation = await prisma.conversation.findFirst({
        where: {
          OR: [
            { user1Id: userId.toString(), user2Id: otherUserId.toString() },
            { user1Id: otherUserId.toString(), user2Id: userId.toString() },
          ],
        },
        include: {
          messages: { orderBy: { timestamp: "asc" } },
          user1: { select: userSelection() },
          user2: { select: userSelection() },
        },
      });
    } else {
      return NextResponse.json(
        { message: "conversationId or userId is required in query parameters." },
        { status: 400 }
      );
    }

    if (!conversation) {
      return NextResponse.json(
        { message: "No conversation found." },
        { status: 404 }
      );
    }

    const otherUser =
      conversation.user1?.id.toString() === userId.toString()
        ? conversation.user2
        : conversation.user1;

    if (!otherUser) {
      return NextResponse.json(
        { message: "Invalid conversation data." },
        { status: 500 }
      );
    }

    const formattedConversation = {
      conversationId: conversation.id,
      otherUser: {
        id: otherUser.id,
        name:
          otherUser.role === "INSTITUTION" || otherUser.role === "SHOP_OWNER"
            ? otherUser.firmName
            : `${otherUser.firstName || ""} ${otherUser.lastName || ""}`.trim(),
        profilePhoto: otherUser.profilePhoto || null,
        firmName: otherUser.firmName || null,
        role: otherUser.role,
      },
      messages: conversation.messages,
      updatedAt: conversation.updatedAt,
    };

    return NextResponse.json(
      { message: "Conversation fetched successfully!", data: formattedConversation },
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

const userSelection = () => ({
  id: true,
  firstName: true,
  lastName: true,
  profilePhoto: true,
  firmName: true,
  role: true,
});
