// File: /src/app/api/user/delete/route.js

import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../auth/[...nextauth]/authOptions';
import prisma from '@/lib/prisma';

export async function DELETE(req) {
  const session = await getServerSession(authOptions);

  if(!session || !session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const userId = user.id;
    await prisma.$transaction([
      prisma.message.deleteMany({
        where: {
          OR: [{ senderId: userId }, { receiverId: userId }],
        },
      }),
      prisma.conversation.deleteMany({
        where: {
          OR: [{ user1Id: userId }, { user2Id: userId }],
        },
      }),
      prisma.paymentHistory.deleteMany({
        where: {
          OR: [{ senderId: userId }, { receiverId: userId }],
        },
      }),
      prisma.favoriteInstitution.deleteMany({
        where: {
          OR: [{ userId: userId }, { institutionId: userId }],
        },
      }),
      prisma.token.deleteMany({
        where: {
          OR: [{ userId: userId }, { institutionId: userId }],
        },
      }),
      prisma.bill.deleteMany({
        where: {
          OR: [{ userId: userId }, { institutionId: userId }],
        },
      }),
      prisma.userResponse.deleteMany({
        where: { userId: userId },
      }),
      prisma.passwordResetToken.deleteMany({
        where: { userId: userId },
      }),
      prisma.review.deleteMany({
        where: {
          OR: [{ userId: userId }, { institutionId: userId }],
        },
      }),
      prisma.paidProfile.deleteMany({
        where: { payerId: userId },
      }),
      prisma.abusiveComment.deleteMany({
        where: { reportedByUserId: userId },
      }),
      prisma.favoriteBills.deleteMany({
        where: { userId: userId },
      }),
      prisma.pastAddress.deleteMany({
        where: { userId: userId },
      }),
      prisma.notification.deleteMany({
        where: {
          OR: [{ senderId: userId }, { receiverId: userId }],
        },
      }),
      prisma.verificationToken.deleteMany({
        where: { userId: userId },
      }),
      prisma.session.deleteMany({
        where: { userId: userId },
      }),

      prisma.user.delete({
        where: { id: userId },
      }),
    ]);

    return NextResponse.json({ message: 'Account and related data deleted successfully.' }, { status: 200 });

  } catch (error) {
    console.error('Delete account error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
