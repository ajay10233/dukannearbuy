import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";

export const POST = async (req) => {
  try {
    const { senderId, senderType, receiverId, content } = await req.json();

    if (!senderId || !senderType || !receiverId || !content) {
      return NextResponse.json(
        { message: "All fields are required!" },
        { status: 400 }
      );
    }

    // Validate senderType
    if (senderType !== "USER" && senderType !== "INSTITUTION") {
      return NextResponse.json(
        { message: "Invalid senderType. Must be 'USER' or 'INSTITUTION'." },
        { status: 400 }
      );
    }

    // Fetch user instances
    const user1 = await prisma.user.findUnique({ where: { id: senderId } });
    const user2 = await prisma.user.findUnique({ where: { id: receiverId } });

    if (!user1 || !user2) {
      return NextResponse.json(
        { message: "One or both users not found." },
        { status: 404 }
      );
    }

    // Check if a conversation already exists
    let conversation = await prisma.conversation.findFirst({
      where: {
        OR: [
          { user1Id: senderId, user2Id: receiverId },
          { user1Id: receiverId, user2Id: senderId },
        ],
      },
      select: { id: true }, // Only fetch the ID
    });

    // If no conversation exists, create a new one
    if (!conversation) {
      conversation = await prisma.conversation.create({
        data: {
          user1Id: senderId,
          user2Id: receiverId,
          user1: { connect: { id: senderId } }, // Link sender
          user2: { connect: { id: receiverId } }, // Link receiver
        },
        select: { id: true }, // Only fetch the ID
      });
    }

    if (!conversation?.id) {
      return NextResponse.json(
        { message: "Failed to create or fetch conversation." },
        { status: 500 }
      );
    }

    console.log("Conversation ID:", conversation.id);

    // Create and attach message to the conversation
    const newMessage = await prisma.message.create({
      data: {
        senderId,
        senderType,
        receiverId,
        content,
        conversationId: conversation.id, // Link message to conversation
      },
    });

    // Update conversation with last message details
    await prisma.conversation.update({
      where: { id: conversation.id },
      data: {
        lastMessageId: newMessage.id,
        lastMessageContent: newMessage.content,
        lastMessageTimestamp: newMessage.timestamp,
        lastMessageSenderId: newMessage.senderId,
      },
    });

    return NextResponse.json(
      { message: "Message sent successfully!", data: newMessage },
      { status: 201 }
    );
  } catch (error) {
    console.error("Send Message Error:", error);
    return NextResponse.json(
      { message: "Failed to send message!", error: error.message },
      { status: 500 }
    );
  }
};
