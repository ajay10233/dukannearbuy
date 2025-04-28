import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const GET = async (req) => {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Unauthorized! Please log in." }, { status: 401 });
    }

    const userId = session.user.id;

    const conversations = await prisma.conversation.findMany({
      where: {
        hidden: true,
        OR: [{ user1Id: userId }, { user2Id: userId }],
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
      orderBy: { updatedAt: "desc" },
    });

    if (!conversations || conversations.length === 0) {
      return NextResponse.json({ message: "No hidden conversations found." }, { status: 200 });
    }

    const formattedConversations = conversations.map((conversation) => {
      const otherUser = conversation.user1?.id === userId ? conversation.user2 : conversation.user1;
      if (!otherUser) return null;

      return {
        conversationId: conversation.id,
        accepted: conversation.accepted,
        hidden: conversation.hidden,
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
    }).filter(Boolean);

    return NextResponse.json({ message: "Hidden conversations fetched successfully!", data: formattedConversations }, { status: 200 });

  } catch (error) {
    console.error("Fetch Hidden Conversations Error:", error);
    return NextResponse.json({ message: "Failed to fetch hidden conversations!", error: error.message }, { status: 500 });
  }
};
