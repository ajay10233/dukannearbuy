import crypto from 'crypto';
import { prisma } from "@/utils/db";
import sendEmail from '@/utils/sendEmail'; 
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { email } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json({ message: 'If the email exists, a reset link has been sent.' }, { status: 200 });
  }

  const token = crypto.randomBytes(32).toString('hex');
  const expires = Date.now() + 3600000; // 1 hour

  await prisma.passwordResetToken.create({
    data: {
      userId: user.id,
      token,
      expiresAt: new Date(expires),
    },
  });

  const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;

  await sendEmail(email, 'Reset your password', `Click here: ${resetUrl}`);

  return NextResponse.json({ message: 'If the email exists, a reset link has been sent.' }, { status: 200 });
}
