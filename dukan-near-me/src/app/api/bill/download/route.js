import { getServerSession } from 'next-auth'
import { prisma } from '@/utils/db'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { NextResponse } from 'next/server'
import ExcelJS from 'exceljs'

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['INSTITUTION', 'SHOP_OWNER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { startDate, endDate } = await req.json();
    const bills = await prisma.bill.findMany({
      where: {
        institutionId: session.user.id,
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      },
      include: {
        user: true,
        items: true,
      },
      orderBy: {
        createdAt: 'desc',
      }
    })

    // Generate Excel
    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet('Bills')

    sheet.columns = [
      { header: 'Invoice #', key: 'invoiceNumber', width: 15 },
      { header: 'Date', key: 'createdAt', width: 20 },
      { header: 'User Name', key: 'userName', width: 25 },
      { header: 'Phone', key: 'phoneNumber', width: 15 },
      { header: 'Amount', key: 'totalAmount', width: 10 },
      { header: 'Payment Status', key: 'paymentStatus', width: 15 },
      { header: 'Remarks', key: 'remarks', width: 25 },
    ]

    bills.forEach(bill => {
      sheet.addRow({
        invoiceNumber: bill.invoiceNumber || '',
        createdAt: bill.createdAt.toISOString().split('T')[0],
        userName: bill.user ? `${bill.user.firstName || ''} ${bill.user.lastName || ''}` : '',
        phoneNumber: bill.phoneNumber || bill.user?.phone || '',
        totalAmount: bill.totalAmount || 0,
        paymentStatus: bill.paymentStatus || '',
        remarks: bill.remarks || '',
      })
    })

    const buffer = await workbook.xlsx.writeBuffer()

    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename=bills_${startDate}_to_${endDate}.xlsx`
      }
    })
  } catch (error) {
    console.error('Download Bills Error:', error)
    return NextResponse.json({ error: 'Failed to generate Excel' }, { status: 500 })
  }
}
