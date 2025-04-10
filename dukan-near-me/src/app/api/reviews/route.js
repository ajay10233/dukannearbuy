import {  NextResponse } from 'next/server';
import { prisma } from "@/utils/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const institutionId = searchParams.get("institutionId");
  
    if (!institutionId) {
      return NextResponse.json({ error: "Missing institutionId" }, { status: 400 });
    }
  
    const reviews = await prisma.review.findMany({
      where: { institutionId },
      include: {
        user: {
          select: { firstName: true, lastName: true, profilePhoto: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  
    return NextResponse.json(reviews);
}
  


export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'USER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { rating, comment, institutionId } = await req.json();
  if (!rating || !institutionId) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const userId = session.user.id;

  // Fetch institution and plan
  const institution = await prisma.user.findUnique({
    where: { id: institutionId },
    select: { subscriptionPlan: true },
  });

  if (!institution) {
    return NextResponse.json({ error: 'Institution not found' }, { status: 404 });
  }

  // Common checks for BUSINESS and PREMIUM plans
  let hasBill = false;
  let replyCount = 0;
  console.log("institution.subscriptionPlan",institution.subscriptionPlan)
  if (institution.subscriptionPlan !== 'FREE') {
    const bill = await prisma.bill.findFirst({
      where: {
        userId,
        institutionId,
      },
    });
    hasBill = !!bill;

    replyCount = await prisma.message.count({
      where: {
        senderId: institutionId,
        receiverId: userId,
        senderType: 'INSTITUTION',
      },
    });
  }

  const reviewCount = await prisma.review.count({
    where: {
      userId,
      institutionId,
    },
  });

  if (institution.subscriptionPlan === 'BUSINESS') {
    if (!hasBill && replyCount < 3) {
      return NextResponse.json({ error: 'You must be an actual customer (bill or sufficient chat) to review this institution.' }, { status: 403 });
    }

    if (reviewCount >= 3) {
      return NextResponse.json({ error: 'You have reached the review limit for this institution. Please edit your last review.' }, { status: 403 });
    }
  }

  if (institution.subscriptionPlan === 'PREMIUM') {
    if (!hasBill && replyCount < 3) {
      return NextResponse.json({ error: 'You must be an actual customer (bill or sufficient chat) to review this institution.' }, { status: 403 });
    }

    if (reviewCount >= 1) {
      return NextResponse.json({ error: 'You can only post one review for this institution. Please edit your existing review.' }, { status: 403 });
    }
  }

  try {
    const review = await prisma.review.create({
      data: {
        rating,
        comment,
        userId,
        institutionId,
      },
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}


export async function PUT(req) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== 'USER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { rating, comment, commentId } = await req.json();

  if (!commentId || (!rating && !comment)) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const userId = session.user.id;

  // Fetch the existing review by ID
  const existingReview = await prisma.review.findUnique({
    where: {
      id: commentId,
    },
  });

  if (!existingReview || existingReview.userId !== userId) {
    return NextResponse.json({ error: 'Review not found or unauthorized' }, { status: 404 });
  }

  try {
    const updatedReview = await prisma.review.update({
      where: {
        id: commentId,
      },
      data: {
        rating,
        comment,
      },
    });

    return NextResponse.json(updatedReview, { status: 200 });
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}
