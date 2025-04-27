import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET() {
    const coupons = await prisma.coupon.findMany();
    return NextResponse.json(coupons, { status: 200 });
}
