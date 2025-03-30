import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 
import { ObjectId } from "mongodb";

export const GET = async (req) => {
  try {
    // Get authenticated user session
    const session = await getServerSession(authOptions);
    console.log(session.user)
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized! Please log in." },
        { status: 401 }
      );
    }

    // Convert session user ID to ObjectId
    const userId = new ObjectId(session.user.id);
    const { searchParams } = new URL(req.url);
    const conversationIdStr = searchParams.get("conversationId");

    if (!conversationIdStr) {
      return NextResponse.json(
        { message: "conversationId is required in query parameters." },
        { status: 400 }
      );
    }

    const conversationId = new ObjectId(conversationIdStr);

    console.log("Logged-in user ID:", userId);
    console.log("Fetching conversation ID:", conversationId);

    // Fetch the conversation by conversationId
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId.toString() }, // Prisma stores ObjectIds as strings
      include: {
        messages: {
          orderBy: { timestamp: "asc" },
        },
        user1: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePhoto: true,
            firmName: true,
            role: true,
          },
        },
        user2: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            profilePhoto: true,
            firmName: true,
            role: true,
          },
        },
      },
    });

    if (!conversation) {
      console.warn(`No conversation found with ID ${conversationId}`);
      return NextResponse.json(
        { message: "No conversation found with the provided ID." },
        { status: 404 }
      );
    }

    // Identify the other user in the conversation
    const otherUser =
      conversation.user1?.id.toString() === userId.toString() ? conversation.user2 : conversation.user1;

    if (!otherUser) {
      console.warn(`Conversation ${conversation.id} has missing user data`);
      return NextResponse.json(
        { message: "Invalid conversation data." },
        { status: 500 }
      );
    }

    const formattedConversation = {
      id: conversation.id,
      otherUser: {
        id: otherUser.id,
        name:
          otherUser.role === "INSTITUTION"
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
