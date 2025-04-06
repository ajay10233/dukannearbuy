import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; 
import { ObjectId } from "mongodb";

export const GET = async (req) => {
  try {
    // Get authenticated user session
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json(
        { message: "Unauthorized! Please log in." },
        { status: 401 }
      );
    }

    const userId = session.user.id; // Keep it as a string for comparison
    // console.log("Logged-in user ID:", userId);
    // Fetch all conversations where the user is either user1 or user2
    const conversations = await prisma.conversation.findMany({
      where: {
        OR: [{ user1Id: new ObjectId(userId) }, { user2Id: new ObjectId(userId) }],
      },
      include: {
        messages: {
          orderBy: { timestamp: "desc" },
          take: 1, 
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
      orderBy: { updatedAt: "desc" }, // Sort by last activity
    });

    if (!conversations || conversations.length === 0) {
      return NextResponse.json(
        { message: "No conversations found." },
        { status: 200 }
      );
    }

    // Format conversations to include the other user's details
    const formattedConversations = conversations.map((conversation) => {
      const otherUser = conversation.user1?.id === userId ? conversation.user2 : conversation.user1;

      if (!otherUser) {
        console.warn(`Skipping conversation ${conversation.id} due to missing otherUser`);
        return null;
      }

      return {
        conversationId: conversation.id,
        otherUser: {
          id: otherUser.id,
          name: otherUser.role === "INSTITUTION" || otherUser.role === "SHOP_OWNER"
            ? otherUser.firmName 
            : `${otherUser.firstName || ""} ${otherUser.lastName || ""}`.trim(),
          profilePhoto: otherUser.profilePhoto || null,
          firmName: otherUser.firmName || null,
          role: otherUser.role,
        },
        lastMessage: conversation.messages[0] || null,
        updatedAt: conversation.updatedAt,
      };
    }).filter(Boolean); // Remove null values

    return NextResponse.json(
      { message: "Conversations fetched successfully!", data: formattedConversations },
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
