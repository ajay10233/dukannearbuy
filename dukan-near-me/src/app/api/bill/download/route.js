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

    const includeOptions = {
      user: true,
      items: session.user.role === 'SHOP_OWNER',
      notes: session.user.role === 'INSTITUTION',
    }

    const bills = await prisma.bill.findMany({
      where: {
        institutionId: session.user.id,
        createdAt: {
          gte: new Date(startDate),
          lte: new Date(endDate)
        }
      },
      include: includeOptions,
      orderBy: {
        createdAt: 'desc',
      }
    })

    const workbook = new ExcelJS.Workbook()
    const sheet = workbook.addWorksheet('Bills')

    if (session.user.role === 'INSTITUTION') {
      sheet.columns = [
        { header: 'Invoice #', width: 15 },
        { header: 'Date', width: 20 },
        { header: 'User Name', width: 25 },
        { header: 'Phone', width: 15 },
        { header: 'Remarks', width: 25 },
        { header: 'Total Amount', width: 15 },
        { header: 'Chief Complaint', width: 25 },
        { header: 'Treatment', width: 25 },
        { header: 'Others', width: 25 },
        { header: 'Note Amount', width: 15 }
      ]
    } else {
      sheet.columns = [
        { header: 'Invoice #', width: 15 },
        { header: 'Date', width: 20 },
        { header: 'User Name', width: 25 },
        { header: 'Phone', width: 15 },
        { header: 'Remarks', width: 25 },
        { header: 'Total Amount', width: 15 },
        { header: 'Item Name', width: 25 },
        { header: 'Item Price', width: 12 },
        { header: 'Quantity', width: 10 },
        { header: 'Item Total', width: 12 }
      ]
    }

    let currentRowIndex = 2
    for (const bill of bills) {
      const userName = bill.user ? `${bill.user.firstName || ''} ${bill.user.lastName || ''}` : ''
      const phone = bill.phoneNumber || bill.user?.phone || ''
      const invoiceDate = bill.createdAt

      if (session.user.role === 'INSTITUTION') {
        const noteCount = bill.notes.length || 1

        if (bill.notes.length === 0) {
          const row = sheet.addRow([
            bill.invoiceNumber || '',
            invoiceDate,
            userName,
            phone,
            bill.remarks || '',
            bill.totalAmount || 0,
            '', '', '', ''
          ])
          formatInstitutionTypes(row)
          addBorderToRow(row)
          currentRowIndex++
        } else {
          bill.notes.forEach((note, i) => {
            const row = sheet.addRow([
              i === 0 ? bill.invoiceNumber || '' : '',
              i === 0 ? invoiceDate : '',
              i === 0 ? userName : '',
              i === 0 ? phone : '',
              i === 0 ? bill.remarks || '' : '',
              i === 0 ? bill.totalAmount || 0 : '',
              note.chief_complaint || '',
              note.treatment || '',
              note.others || '',
              note.amount || 0
            ])
            formatInstitutionTypes(row)
            addBorderToRow(row)
            currentRowIndex++
          })

          if (noteCount > 1) {
            ['A', 'B', 'C', 'D', 'E', 'F'].forEach(col => {
              sheet.mergeCells(`${col}${currentRowIndex - noteCount}:${col}${currentRowIndex - 1}`)
              sheet.getCell(`${col}${currentRowIndex - noteCount}`).alignment = { vertical: 'middle', horizontal: 'left' }
            })
          }
        }

      } else {
        const itemCount = bill.items.length || 1

        if (bill.items.length === 0) {
          const row = sheet.addRow([
            bill.invoiceNumber || '',
            invoiceDate,
            userName,
            phone,
            bill.remarks || '',
            bill.totalAmount || 0,
            '', '', '', ''
          ])
          formatTypes(row)
          addBorderToRow(row)
          currentRowIndex++
        } else {
          bill.items.forEach((item, i) => {
            const row = sheet.addRow([
              i === 0 ? bill.invoiceNumber || '' : '',
              i === 0 ? invoiceDate : '',
              i === 0 ? userName : '',
              i === 0 ? phone : '',
              i === 0 ? bill.remarks || '' : '',
              i === 0 ? bill.totalAmount || 0 : '',
              item.name,
              item.price,
              item.quantity || 1,
              item.total || (item.price * (item.quantity || 1))
            ])
            formatTypes(row)
            addBorderToRow(row)
            currentRowIndex++
          })

          if (itemCount > 1) {
            ['A', 'B', 'C', 'D', 'E', 'F'].forEach(col => {
              sheet.mergeCells(`${col}${currentRowIndex - itemCount}:${col}${currentRowIndex - 1}`)
              sheet.getCell(`${col}${currentRowIndex - itemCount}`).alignment = { vertical: 'middle', horizontal: 'left' }
            })
          }
        }
      }
    }

    sheet.getRow(1).font = { bold: true }
    addBorderToRow(sheet.getRow(1))

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

// Helpers

function addBorderToRow(row) {
  row.eachCell(cell => {
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    }
  })
}

function formatTypes(row) {
  row.getCell(2).numFmt = 'yyyy-mm-dd' // Date
  row.getCell(6).numFmt = '0.00'       // totalAmount
  row.getCell(8).numFmt = '0.00'       // item price
  row.getCell(9).numFmt = '0'          // quantity
  row.getCell(10).numFmt = '0.00'      // item total
}

function formatInstitutionTypes(row) {
  row.getCell(2).numFmt = 'yyyy-mm-dd' // Date
  row.getCell(6).numFmt = '0.00'       // totalAmount
  row.getCell(10).numFmt = '0.00'      // note amount
}
