
import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";
import { getServerSession } from "next-auth";
import { authOptions } from '@/app/api/auth/[...nextauth]/route'

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" },{ status: 401 });
    }
    const plans = await prisma.plan.findMany({
        orderBy: {
            price: 'asc',
        },
    });
    return NextResponse.json(plans);
}
  