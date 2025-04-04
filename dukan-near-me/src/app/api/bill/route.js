import { NextResponse } from 'next/server'
import { prisma } from '@/utils/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/utils/authOptions'

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['INSTITUTION', 'SHOP_OWNER'].includes(session.user.role)) {
      return new Response(JSON.stringify({ error: 'Unauthorized: Only institutions or shop owners can generate bills' }), { status: 401 })
    }

    const institutionId = session.user.id
    const body = await req.json()
    const {
      userId,
      tokenId,
      name,
      phoneNumber,
      items,
      remarks,
      invoiceNumber,
      otherCharges,
      generateShortBill = true,
    } = body

    if (typeof otherCharges === 'string') {
      const parsed = parseFloat(otherCharges)
      if (isNaN(parsed)) {
        return NextResponse.json({ success: false, error: 'Invalid otherCharges' }, { status: 400 })
      }
      body.otherCharges = parsed
    }

    const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0) + (body.otherCharges || 0)

    const bill = await prisma.bill.create({
      data: {
        user: { connect: { id: userId } },
        institution: { connect: { id: institutionId } },
        tokenNumber: { connect: { id: tokenId } },
        name,
        phoneNumber,
        totalAmount,
        paymentStatus: 'PENDING',
        remarks,
        invoiceNumber,
        otherCharges: body.otherCharges,
        items: {
          create: items.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            total: item.price * item.quantity,
          })),
        },
      },
      include: { items: true },
    })

    let shortBill = null
    if (generateShortBill) {
      shortBill = await prisma.shortBill.create({
        data: {
          billId: bill.id,
          summary: `ShortBill for ${name || 'Unknown'} with ${items.length} item(s)`,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        },
      })
    }

    return NextResponse.json({ success: true, bill, shortBill })
  } catch (error) {
    console.error('Bill Creation Error:', error)
    return NextResponse.json({ success: false, error: 'Failed to create bill' }, { status: 500 })
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['INSTITUTION', 'SHOP_OWNER'].includes(session.user.role)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const bills = await prisma.bill.findMany({
      where: { institutionId: session.user.id },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json({ success: true, bills })
  } catch (error) {
    console.error('Get Bills Error:', error)
    return NextResponse.json({ success: false, error: 'Failed to get bills' }, { status: 500 })
  }
}

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['INSTITUTION', 'SHOP_OWNER'].includes(session.user.role)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const body = await req.json()
    const { billId, ...updateFields } = body

    if (!billId) {
      return NextResponse.json({ success: false, error: 'billId is required' }, { status: 400 })
    }

    const updatedBill = await prisma.bill.update({
      where: {
        id: billId,
        institutionId: session.user.id, // ensure ownership
      },
      data: updateFields,
      include: { items: true },
    })

    return NextResponse.json({ success: true, updatedBill })
  } catch (error) {
    console.error('Update Bill Error:', error)
    return NextResponse.json({ success: false, error: 'Failed to update bill' }, { status: 500 })
  }
}

export async function DELETE(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['INSTITUTION', 'SHOP_OWNER'].includes(session.user.role)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
    }

    const body = await req.json()
    const { billId } = body

    if (!billId) {
      return NextResponse.json({ success: false, error: 'billId is required' }, { status: 400 })
    }

    // Delete associated shortBill first (if exists)
    await prisma.shortBill.deleteMany({ where: { billId } })

    const deletedBill = await prisma.bill.delete({
      where: {
        id: billId,
        institutionId: session.user.id,
      },
    })

    return NextResponse.json({ success: true, deletedBill })
  } catch (error) {
    console.error('Delete Bill Error:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete bill' }, { status: 500 })
  }
}
