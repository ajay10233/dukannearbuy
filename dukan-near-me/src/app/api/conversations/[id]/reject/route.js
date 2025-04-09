import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";

export async function PATCH(req, { params }) {
    const id = params.id;

  try {
    const updated = await prisma.conversation.update({
      where: { id },
      data: { accepted: false, hidden: true },
    });

    return NextResponse.json({ message: "Conversation rejected", data: updated });
  } catch (error) {
    console.error("Reject error:", error);
    return NextResponse.json({ message: "Failed to reject conversation" }, { status: 500 });
  }
}
