import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";

export const POST = async (req) => {
  try {
    const { senderId, senderType, receiverId, content } = await req.json();

    // Validate input
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

    // Create message in Prisma
    const newMessage = await prisma.message.create({
      data: {
        senderId,
        senderType,
        receiverId,
        content,
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
