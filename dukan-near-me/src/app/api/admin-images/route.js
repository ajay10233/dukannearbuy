import { prisma } from '@/utils/db'
import { NextResponse } from 'next/server'

export async function GET() {
  const images = await prisma.adminImages.findMany({
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json(images,  { status: 200 });
}
