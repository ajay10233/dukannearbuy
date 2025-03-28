import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const DELETE = async (req, { params }) => {
  try {
    // Authenticate user
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized! Please log in." },
        { status: 401 }
      );
    }

    const userId = session.user.id;
    const { conversationId } = params;

    if (!conversationId) {
      return NextResponse.json(
        { message: "Conversation ID is required!" },
        { status: 400 }
      );
    }

    // Find the conversation
    const conversation = await prisma.conversation.findUnique({
      where: { id: conversationId },
    });

    if (!conversation) {
      return NextResponse.json(
        { message: "Conversation not found!" },
        { status: 404 }
      );
    }

    // Ensure the user is part of the conversation
    if (conversation.user1Id !== userId && conversation.user2Id !== userId) {
      return NextResponse.json(
        { message: "Unauthorized! You cannot delete this conversation." },
        { status: 403 }
      );
    }

    // Delete messages first (to maintain integrity)
    await prisma.message.deleteMany({
      where: { conversationId },
    });

    // Delete the conversation
    await prisma.conversation.delete({
      where: { id: conversationId },
    });

    return NextResponse.json(
      { message: "Conversation deleted successfully!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete Conversation Error:", error);
    return NextResponse.json(
      { message: "Failed to delete conversation!", error: error.message },
      { status: 500 }
    );
  }
};
