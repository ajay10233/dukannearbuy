import { getSession } from 'next-auth/react';
import { prisma } from "@/utils/db";
import { NextResponse } from 'next/server';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });

  const userId = session.user.id;

  await prisma.user.delete({ where: { id: userId } });

  await prisma.session.deleteMany({ where: { userId } });
  res.setHeader('Set-Cookie', ['next-auth.session-token=;Max-Age=0;Path=/;HttpOnly', 'next-auth.csrf-token=;Max-Age=0;Path=/;HttpOnly']);
  return NextResponse.json({ message: 'Account deleted successfully.' }, { status: 200 });
}
