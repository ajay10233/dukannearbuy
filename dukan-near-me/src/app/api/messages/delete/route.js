import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";

export const DELETE = async (req) => {
  try {
    const { searchParams } = new URL(req.url);
    const messageId = searchParams.get("messageId");

    if (!messageId) {
      return NextResponse.json(
        { message: "messageId is required!" },
        { status: 400 }
      );
    }

    const deletedMessage = await prisma.message.delete({
      where: { id: messageId },
    });

    return NextResponse.json(
      { message: "Message deleted successfully!", data: deletedMessage },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete Message Error:", error);
    return NextResponse.json(
      { message: "Failed to delete message!", error: error.message },
      { status: 500 }
    );
  }
};
