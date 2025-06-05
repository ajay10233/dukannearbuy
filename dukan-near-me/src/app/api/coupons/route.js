import { NextResponse } from 'next/server';
import { prisma } from '@/utils/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';

export async function GET(req) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const purpose = searchParams.get("purpose");

    if (!purpose || !search) {
        return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    const today = new Date();

    const coupons = await prisma.coupon.findMany({
        where: {
            purpose: purpose,
            name: { contains: search, mode: "insensitive" }, 
            expiresAt: { gt: today }, 
            limit: { gt: 0 }, 
        },
        orderBy: {
            expiresAt: "asc",
        },
        select:{
            name:true,
            purpose:true,
            id:true,
            discountPercentage:true,
        },
    });


    if (coupons.length > 0) {
        return NextResponse.json({ isValid: true, coupon: coupons[0] }, { status: 200 });
    }

    return NextResponse.json({ isValid: false, coupon: null }, { status: 200 });
}
