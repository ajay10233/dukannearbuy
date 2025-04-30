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

    const reports = await prisma.bill.findMany({
      where: {
        userId: session.user.id,
        type: "REPORT",
      },
      include: {
        items: true,
        institution: true, // Include institution relation
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
      institution: report.institution
        ? {
            id: report.institution.id,
            firmName: report.institution.firmName,
            contactEmail: report.institution.contactEmail,
            phone: report.institution.phone,
            shopAddress: report.institution.shopAddress,
            description: report.institution.description,
            hashtags: report.institution.hashtags,
            photos: report.institution.photos,
            shopOpenTime: report.institution.shopOpenTime,
            shopCloseTime: report.institution.shopCloseTime,
            shopOpenDays: report.institution.shopOpenDays,
            latitude: report.institution.latitude,
            longitude: report.institution.longitude,
            scanner_image: report.institution.scanner_image,
            profilePhoto: report.institution.profilePhoto,
          }
        : null,
    }));

    return NextResponse.json({ success: true, reports: formattedReports });

  } catch (error) {
    console.error('Get Reports Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to get reports' }, { status: 500 });
  }
}
