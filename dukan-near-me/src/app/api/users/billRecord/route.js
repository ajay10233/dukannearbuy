import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "USER") {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const bills = await prisma.bill.findMany({
      where: {
        userId: session.user.id,
        type: "BILL",
      },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedBills = bills.map((bill) => ({
      id: bill.id,
      createdAt: bill.createdAt,
      expiresAt: bill.expiresAt,
      name: bill.name || null,
      phoneNumber: bill.phoneNumber || null,
      totalAmount: bill.totalAmount || 0,
      paymentStatus: bill.paymentStatus || "PENDING",
      remarks: bill.remarks || "",
      invoiceNumber: bill.invoiceNumber || null,
      otherCharges: bill.otherCharges || 0,
      fileUrl: bill.fileUrl || null,
      fileType: bill.fileType || null,
      items: bill.items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        total: item.total,
      })),
    }));

    return NextResponse.json({ success: true, bills: formattedBills });
    
  } catch (error) {
    console.error('Get Bills Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to get bills' }, { status: 500 });
  }
}