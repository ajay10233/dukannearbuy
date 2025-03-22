import { NextResponse } from "next/server";
import {prisma} from "@/utils/db";

export async function POST(req) {
  try {
    const { senderId, receiverId, amount, status } = await req.json();

    if (!senderId || !receiverId || !amount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const payment = await prisma.paymentHistory.create({
      data: { senderId, receiverId, amount, status },
    });

    return NextResponse.json({ message: "Payment created", data: payment }, { status: 201 });
  } catch (error) {
    console.error("Error creating payment:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
