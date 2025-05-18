import { prisma } from "@/utils/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" },{ status: 401 });
  }

  try {
    const { paymentId, status, amount } = await req.json();

    // Check if the payment exists
    const payment = await prisma.paymentHistory.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" },{ status: 404 });
    }

    const updateData = {};
    const allowedStatuses = ["PENDING", "COMPLETED", "CONFLICT"];

    if (status === "COMPLETED") {
      if (session.user.role !== "INSTITUTION" && session.user.role !== "SHOP_OWNER") {
        return NextResponse.json({ error: "Permission denied" },{ status: 403 });
      }
      if (session.user.id !== payment.senderId) {
        return NextResponse.json({ error: "Only the sender can complete the payment" },{ status: 403 });
      }
    }

    // Handle status update
    if (status) {
      if (!allowedStatuses.includes(status)) {
        return NextResponse.json({ error: "Invalid status value" },{ status: 400 });
      }
      updateData.status = status;
    }

    // Handle amount update (Only institutions/shop owners can update)
    if (amount !== undefined && amount!==payment?.amount) {
      if (session.user.role !== "INSTITUTION" && session.user.role !== "SHOP_OWNER") {
        return NextResponse.json({ error: "Permission denied" },{ status: 403 });
      }
      if (isNaN(amount) || amount <= 0) {
        return NextResponse.json({ error: "Invalid amount" },{ status: 400 });
      }

      updateData.amount = parseFloat(amount);

      // If status is not explicitly set, set it to "PENDING"
      if (!status) {
        updateData.status = "PENDING";
      }
    }

    // Update the payment in the database
    await prisma.paymentHistory.update({
      where: { id: paymentId },
      data: updateData,
    });

    return NextResponse.json({ message: "Payment updated successfully" },{ status: 200 });
  } catch (error) {
    console.error("❌ Error updating payment:", error);
    return NextResponse.json({ error: "Internal server error" },{ status: 500 });
  }
}
