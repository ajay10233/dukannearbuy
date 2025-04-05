// pages/api/auth/reset-password.ts
import bcrypt from 'bcryptjs';
import { prisma } from "@/utils/db";
import { NextResponse } from 'next/server';

export async function POST(req) {
  const { token, password } = await req.json();
  console.log(token, password);

  const tokenRecord = await prisma.passwordResetToken.findUnique({ where: { token } });

  if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
    return NextResponse.json({ message: 'Token is invalid or expired.' }, { status: 400 });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await prisma.user.update({
    where: { id: tokenRecord.userId },
    data: { password: hashedPassword },
  });

  await prisma.passwordResetToken.delete({ where: { token } });
  return NextResponse.json({ message: 'Password has been reset.' }, { status: 200 });
}
