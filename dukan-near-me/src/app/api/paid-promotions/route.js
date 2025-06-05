import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/utils/db';
import cloudinary from "@/utils/cloudinary";
import { addDays } from "date-fns";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const PaidProfiles = await prisma.paidProfile.findMany({
      orderBy: { createdAt: 'desc' },
      take: 10,
      include: {
        user: {
          select: {
            id: true,
            firmName: true,
            email: true,
            phone: true,
            profilePhoto: true,
            city: true,
            state: true,
            country: true,
            shopAddress: true,
            description: true,
            hashtags: true,
            photos: true,
            shopOpenTime: true,
            shopCloseTime: true,
            shopOpenDays: true,
            latitude: true,
            longitude: true,
            subscriptionPlan: {
              select: {
                id: true,
                name: true,
                features: true,
                price: true,
              },
            },
            planActivatedAt: true,
            planExpiresAt: true,
          },
        },
      },
    });

    return NextResponse.json({ success: true, data: PaidProfiles });
  } catch (error) {
    console.error('Error fetching paid promotions:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch paid promotions' }, { status: 500 });
  }
}

const kmCosts = { 5: 99, 20: 199, 50: 500, 100: 800 };

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const userId = session.user.id;

  try {
    const { couponId, notes, timeInDays, range, image } = await req.json();

    if (!range || !timeInDays || !notes) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const baseCostPerKm = kmCosts[range];
    if (!baseCostPerKm) {
      return NextResponse.json({ error: "Invalid range selected" }, { status: 400 });
    }

    const basePrice = baseCostPerKm * timeInDays;

    let finalPrice = basePrice;
    let coupon = null;

    if (couponId) {
      coupon = await prisma.coupon.findUnique({ where: { id: couponId } });
      if (!coupon) {
        return NextResponse.json({ error: "Invalid coupon" }, { status: 400 });
      }
      const discount = Math.round((basePrice * coupon.discountPercentage) / 100);
      finalPrice = basePrice - discount;
      coupon.limit -= 1;
      await prisma.coupon.update({ where: { id: couponId }, data: { limit: coupon.limit } });
    }

    const expiresAt = addDays(new Date(), timeInDays);

    // Optional image upload
    let image_src = null;
    if (image) {
      const result = await cloudinary.v2.uploader.upload(image, { folder: "paid_profiles" });
      image_src = result.secure_url;
    }

    // If free, create directly
    if (finalPrice <= 0) {
      const paidProfile = await prisma.paidProfile.create({
        data: {
          userId,
          amountPaid: 0,
          notes: notes || "",
          expiresAt,
          range,
          image: image_src,
        },
      });
      return NextResponse.json({ upgraded: true, paidProfile });
    }

    // Future Stripe logic (for paid promotions)
    return NextResponse.json({
      upgraded: false,
      finalPrice,
      message: "Proceed to Stripe payment",
    });

  } catch (error) {
    console.error('Error processing payment:', error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
