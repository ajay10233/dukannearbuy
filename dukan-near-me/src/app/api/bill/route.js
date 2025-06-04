import { getServerSession } from 'next-auth'
import { prisma } from '@/utils/db'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { NextResponse } from 'next/server'
import cloudinary from "@/utils/cloudinary";


export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !['INSTITUTION', 'SHOP_OWNER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const institutionId = session.user.id;

    const institution = await prisma.user.findUnique({
      where: { id: institutionId },
      include: { subscriptionPlan: true },
    });

    if (!institution) {
      return NextResponse.json({ error: 'Institution not found' }, { status: 404 });
    }

    // Bill count constraint for Free plan
    const isFreePlan = institution.subscriptionPlan == null ? true : institution.subscriptionPlan?.name === 'BASIC';
    if (isFreePlan) {
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const endOfMonth = new Date(startOfMonth);
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);

      const monthlyBillCount = await prisma.bill.count({
        where: {
          institutionId: institutionId,
          createdAt: {
            gte: startOfMonth,
            lt: endOfMonth,
          },
        },
      });

      if (monthlyBillCount >= 1000) {
        return NextResponse.json({
          success: false,
          error: 'Free plan limit reached. Upgrade to generate more than 1000 bills per month.',
        }, { status: 403 });
      }
    }

    const expiresAt = new Date();
    expiresAt.setMonth(expiresAt.getMonth() + 1);
    if (institution.subscriptionPlan?.name === "PREMIUM") {
      expiresAt.setMonth(expiresAt.getMonth() + 6);
    } else if (institution.subscriptionPlan?.name === "BUSINESS") {
      expiresAt.setMonth(expiresAt.getMonth() + 15);
    }

    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      const form = await req.formData();

      const file = form.get('file');
      const userId = form.get('userId');
      const tokenId = form.get('tokenId');
      const remarks = form.get('remarks');
      const invoiceNumber = form.get('invoiceNumber');
      const report = form.get('report') || false;
      console.log("report", report)
      if (!file || typeof file === 'string') {
        return NextResponse.json({ success: false, error: 'No file uploaded' }, { status: 400 });
      }

      const maxSizeMB = session.user.subscriptionPlan?.maxUploadSizeMB || 1;
      const maxSizeBytes = maxSizeMB * 1024 * 1024;

      if (file.size > maxSizeBytes) {
        return NextResponse.json({
          success: false,
          error: `File exceeds the upload limit of ${maxSizeMB}MB`,
        }, { status: 400 });
      }

      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json({
          success: false,
          error: 'Unsupported file type. Only PDFs and Images are allowed.',
        }, { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      let type = "auto";
      if (file.type === 'application/pdf') {
        type = "raw";
      }
      console.log("type", type)
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'raw',
            folder: 'bills',
          },
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        ).end(buffer);
      });
      const billData = {
        user: { connect: { id: userId } },
        institution: { connect: { id: institutionId } },
        // tokenNumber: { connect: { id: tokenId } },
        remarks,
        invoiceNumber,
        totalAmount: 0,
        fileUrl: uploadResult.secure_url,
        fileType: file.type || null,
        paymentStatus: 'PENDING',
        expiresAt: expiresAt,
        type: report == 'true' ? 'REPORT' : 'BILL',
      }

      if (tokenId) {
        billData.tokenNumber = { connect: { id: tokenId } };
      }
      const bill = await prisma.bill.create({
        data: billData,
      });

      return NextResponse.json({ success: true, bill });
    }
    
    // Handle JSON request
    const body = await req.json();
    console.log("body", body);
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
      generationToken = false,
      notes = [],
    } = body;


    const parsedCharges = typeof otherCharges === 'string' ? parseFloat(otherCharges) : otherCharges;
    if (isNaN(parsedCharges)) {
      return NextResponse.json({ success: false, error: 'Invalid otherCharges' }, { status: 400 });
    }
    let totalAmount = 0;
    if (items){
      const itemTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      totalAmount = itemTotal + (parsedCharges || 0);
    }else{
      const notesTotal = notes.reduce((sum,note)=> sum + note.price, 0);
      totalAmount = notesTotal + (parsedCharges||0);
    }

    const billData = {
      user: { connect: { id: userId } },
      institution: { connect: { id: institutionId } },
      name,
      phoneNumber,
      totalAmount,
      paymentStatus: 'PENDING',
      remarks,
      invoiceNumber,
      otherCharges: parsedCharges,
      expiresAt: expiresAt,
    };

    if (Array.isArray(notes) && notes.length > 0) {
      billData.notes = {
        create: notes.map((note) => ({
          chief_complaint: note.chief_complaint || null,
          treatment: note.treatment || null,
          others: note.others || null,
        })),
      };
    } else {
      billData.items = {
        create: items.map((item) => ({
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          total: item.price * item.quantity,
        })),
      };
    }
    
    if (tokenId) {
      billData.tokenNumber = { connect: { id: tokenId } };
    }
    // Create bill
    const bill = await prisma.bill.create({
      data: billData,
      include: {
        items: true,
        notes: true,
      },
    });

    let shortBill = null;
    if (generateShortBill) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
        select: {
          firstName: true,
          lastName: true,
          phone: true,
        },
      });

      shortBill = await prisma.shortBill.create({
        data: {
          billId: bill.id,
          summary: `ShortBill for ${name || `${user?.firstName || 'Unknown'} ${user?.lastName || ''}`} with ${items.length} items`,
          userName: `${user?.firstName || ''} ${user?.lastName || ''}`.trim(),
          userPhone: user?.phone || phoneNumber || null,
          total: totalAmount,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000), // 1 hour from now
        },
      });
    }

    let generatedToken = null;
    if (generationToken) {
      console.log("generationToken", generationToken);
      if (isFreePlan) {
        console.log("isFreePlan", isFreePlan);
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const endOfDay = new Date(startOfDay);
        endOfDay.setDate(endOfDay.getDate() + 1);

        const dailyTokenCount = await prisma.token.count({
          where: {
            institutionId,
            createdAt: {
              gte: startOfDay,
              lt: endOfDay,
            },
          },
        });

        if (dailyTokenCount >= 300) {
          return NextResponse.json(
            { error: 'Free plan limit reached. You can only generate 300 tokens daily.' },
            { status: 403 }
          );
        }
      }

      // Get the current highest token number for today
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const latestToken = await prisma.token.findFirst({
        where: {
          institutionId,
          createdAt: {
            gte: today,
          },
        },
        orderBy: {
          tokenNumber: 'desc',
        },
      });

      const nextTokenNumber = (latestToken?.tokenNumber || 0) + 1;
      const tokenExpiresAt = new Date();
      tokenExpiresAt.setHours(24, 0, 0, 0);
      generatedToken = await prisma.token.create({
        data: {
          user: { connect: { id: userId } },
          institution: { connect: { id: institutionId } },
          tokenNumber: nextTokenNumber,
          name,
          phoneNumber,
          expiresAt: tokenExpiresAt,
        },
      });
    }

    if (generatedToken) {
      await prisma.bill.update({
        where: { id: bill.id },
        data: { tokenNumber: { connect: { id: generatedToken.id } } },
      });
    }

    return NextResponse.json({ success: true, bill, shortBill, token: generatedToken });

  } catch (error) {
    console.error('Bill Creation Error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create bill' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !['INSTITUTION', 'SHOP_OWNER'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const bills = await prisma.bill.findMany({
      where: { institutionId: session.user.id },
      include: {
        items: true,
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
            username: true,
            phone: true,
            profilePhoto: true,
            gender: true,
            age: true,
            city: true,
            state: true,
            country: true,
          }
        },
        institution: {
          select: {
            id: true,
            firmName: true,
            email: true,
            phone: true,
            profilePhoto: true,
            shopAddress: true,
            city: true,
            state: true,
            country: true,
          }
        }
      },
      orderBy: { createdAt: 'desc' },
    });

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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { billId, ...updateFields } = body

    if (!billId) {
      return NextResponse.json({ success: false, error: 'billId is required' }, { status: 400 })
    }

    const updatedBill = await prisma.bill.update({
      where: {
        id: billId,
        institutionId: session.user.id,
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
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
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
