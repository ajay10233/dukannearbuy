import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/utils/db';
import cloudinary from "@/utils/cloudinary";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const admin_banner = await prisma.paidProfile.findMany({where: {userId: null}, orderBy: {createdAt: 'desc'}, take: 2});
    const PaidProfiles = await prisma.paidProfile.findMany({ orderBy: { createdAt: 'desc' }, take: 8 });
    const combined = [...admin_banner, ...PaidProfiles];
    return NextResponse.json({ success: true, combined });
  } catch (error) {
    console.error('Error fetching paid promotions:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch paid promotions' }, { status: 500 });
  }
}

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const userId = session.user.id;
  try {
    const { amountPaid, notes, timeInDays,image } = await req.json();
    let image_src = null;
    if (!amountPaid || !timeInDays) {
      return NextResponse.json({ error: "Amount and timeInDays are required" }, { status: 400 });
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + timeInDays);
    if(image){
        let result = await cloudinary.v2.uploader.upload(image, { folder: "paid_profiles" });
        image_src = result.secure_url;
    }
    const paidProfile = await prisma.paidProfile.create({
      data: {
        userId,
        amountPaid: parseFloat(amountPaid),
        notes: notes || "",
        expiresAt,
      },
    });

    return NextResponse.json({ success: true, paidProfile });
  } catch (error) {
    console.error('Error creating paid promotion:', error);
    return NextResponse.json({ success: false, error: 'Failed to create paid promotion' }, { status: 500 });                            
  }
}

