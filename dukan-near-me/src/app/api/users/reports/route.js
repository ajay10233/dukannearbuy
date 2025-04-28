import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { prisma } from "@/utils/db"; // Don't forget this import!
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "USER") {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const reports = await prisma.bill.findMany({
      where: {
        userId: session.user.id,
        type: "REPORT",
      },
      include: {
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const formattedReports = reports.map((report) => ({
      id: report.id,
      createdAt: report.createdAt,
      expiresAt: report.expiresAt,
      name: report.name || null,
      phoneNumber: report.phoneNumber || null,
      totalAmount: report.totalAmount || 0,
      paymentStatus: report.paymentStatus || "PENDING",
      remarks: report.remarks || "",
      invoiceNumber: report.invoiceNumber || null,
      otherCharges: report.otherCharges || 0,
      fileUrl: report.fileUrl || null,
      fileType: report.fileType || null,
      items: report.items.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        total: item.total,
      })),
    }));

    return NextResponse.json({ success: true, reports: formattedReports });
    
  } catch (error) {
    console.error('Get Reports Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to get reports' }, { status: 500 });
  }
}
