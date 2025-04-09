import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";

export async function PATCH(req, { params }) {
    const id = params.id;

  try {
    const updated = await prisma.conversation.update({
      where: { id },
      data: { accepted: true, hidden: false },
    });

    return NextResponse.json({ message: "Conversation accepted", data: updated });
  } catch (error) {
    console.error("Accept error:", error);
    return NextResponse.json({ message: "Failed to accept conversation" }, { status: 500 });
  }
}
