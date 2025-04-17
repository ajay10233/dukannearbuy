import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";


export async function POST(req) {
    const { reviewId, reason, reportedBy } = await req.json();
  
    if (!reviewId || !reason || !reportedBy) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }
  
    const report = await prisma.abusiveComment.create({
      data: {
        reviewId,
        reason,
        reportedBy,
      },
    });
  
    return NextResponse.json(report);
  }