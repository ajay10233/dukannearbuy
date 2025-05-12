import { getServerSession } from 'next-auth'
import { prisma } from '@/utils/db'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { NextResponse } from 'next/server'

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['INSTITUTION', 'SHOP_OWNER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const {id:billId} = await params;

    const bill = await prisma.bill.findUnique({
      where: {
        id: billId,
        institutionId: session.user.id,
      },
      include: {
        items: true,
        user: true,
        institution: true,
      },
    });

    if (!bill) {
      return NextResponse.json({ error: 'Bill not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, bill });
  } catch (error) {
    console.error('Get Bill Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to get bill' }, { status: 500 });
  }
}
