import { getServerSession } from 'next-auth'
import { prisma } from '@/utils/db'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['INSTITUTION', 'SHOP_OWNER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const institutionId = session.user.id
    const contentType = req.headers.get('content-type') || ''

    // Handle multipart/form-data
    if (contentType.includes('multipart/form-data')) {
      const form = await req.formData()

      const file = form.get('file')
      const userId = form.get('userId')
      const tokenId = form.get('tokenId')
      const remarks = form.get('remarks')
      const invoiceNumber = form.get('invoiceNumber')

      if (!file || typeof file === 'string') {
        return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 })
      }

      const arrayBuffer = await file.arrayBuffer()
      const buffer = Buffer.from(arrayBuffer)

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'auto',
            folder: 'bills',
          },
          (err, result) => {
            if (err) reject(err)
            else resolve(result)
          }
        ).end(buffer)
      })

      const bill = await prisma.bill.create({
        data: {
          user: { connect: { id: userId } },
          institution: { connect: { id: institutionId } },
          tokenNumber: { connect: { id: tokenId } },
          remarks,
          invoiceNumber,
          totalAmount: 0,
          fileUrl: uploadResult.secure_url,
          fileType: file.type || null,
          paymentStatus: 'PENDING',
        },
      })

      return NextResponse.json({ success: true, bill })
    }

    // Handle JSON request
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

    const parsedCharges = typeof otherCharges === 'string' ? parseFloat(otherCharges) : otherCharges
    if (isNaN(parsedCharges)) {
      return NextResponse.json({ success: false, error: 'Invalid otherCharges' }, { status: 400 })
    }

    const totalAmount = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    ) + (parsedCharges || 0)

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
        otherCharges: parsedCharges,
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
