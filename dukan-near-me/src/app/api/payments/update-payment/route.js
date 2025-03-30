import { prisma } from "@/utils/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
  }

  try {
    const { paymentId, status, amount } = await req.json();

    // Check if the payment exists
    const payment = await prisma.paymentHistory.findUnique({
      where: { id: paymentId },
    });

    if (!payment) {
      return new Response(JSON.stringify({ error: "Payment not found" }), { status: 404 });
    }

    const updateData = {};
    const allowedStatuses = ["PENDING", "COMPLETED", "CONFLICT"];

    // Handle status update
    if (status) {
      if (!allowedStatuses.includes(status)) {
        return new Response(JSON.stringify({ error: "Invalid status value" }), { status: 400 });
      }
      if (status === "COMPLETED" && session.user.role !== "INSTITUTION" && session.user.role !== "SHOP_OWNER") {
        return new Response(JSON.stringify({ error: "Permission denied" }), { status: 403 });
      }
      updateData.status = status;
    }

    // Handle amount update (Only institutions can update)
    if (amount !== undefined) {
      if (session.user.role !== "INSTITUTION" && session.user.role !== "SHOP_OWNER") {
        return new Response(JSON.stringify({ error: "Permission denied" }), { status: 403 });
      }
      if (isNaN(amount) || amount <= 0) {
        return new Response(JSON.stringify({ error: "Invalid amount" }), { status: 400 });
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

    return new Response(JSON.stringify({ message: "Payment updated successfully" }), { status: 200 });
  } catch (error) {
    console.error("❌ Error updating payment:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
