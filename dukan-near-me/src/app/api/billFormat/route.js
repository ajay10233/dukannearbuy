import { prisma } from "@/utils/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import cloudinary from "@/utils/cloudinary";


export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: 'Unauthorized: Only institutions can fetch bill formats' }, { status: 401 });
        }

        const billFormat = await prisma.billFormat.findUnique({
            where: {
                institutionId: session.user.id,
            },
            include: {
                institutionRelation: {
                    select: {
                        firmName: true,
                        contactEmail: true,
                        phone: true,
                        shopAddress: true,
                        city: true,
                        state: true,
                        zipCode: true,
                        country: true,
                    }
                }
            }
        });

        if (!billFormat) {
            return NextResponse.json({ error: 'Bill format not found' }, { status: 404 });
        }

        return new Response(JSON.stringify(billFormat), { status: 200 });
    } catch (error) {
        console.error("Error fetching bill formats:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}



export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user.role !== 'INSTITUTION' && session.user.role !== 'SHOP_OWNER')) {
            return NextResponse.json({ error: 'Unauthorized: Only institutions can save bill formats' }, { status: 401 });
        }

        const existingBillFormat = await prisma.billFormat.findUnique({
            where: { institutionId: session.user.id },
        });

        if (existingBillFormat) {
            return NextResponse.json({ error: "A bill format already exists for this institution. You cannot create more than one." }, { status: 400 });
        }

        const { gstNumber, taxType, taxPercentage, proprietorSign, extraText } = await req.json();

        let uploadedImageUrl = null;
        if (proprietorSign) {
            const uploadRes = await cloudinary.uploader.upload(proprietorSign, {
                folder: 'dukan/proprietor_signs',
            });
            uploadedImageUrl = uploadRes.secure_url;
        }

        const data = {
            institutionId: session.user.id,
            gstNumber,
            taxType,
            taxPercentage,
            proprietorSign: uploadedImageUrl,
            extraText,
        };
        const billFormat = await prisma.billFormat.create({ data });

        return new Response(JSON.stringify(billFormat), { status: 201 });

    } catch (error) {
        console.error("Error creating bill format:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user.role !== 'INSTITUTION' && session.user.role !== 'SHOP_OWNER')) {
            return NextResponse.json({ error: 'Unauthorized: Only institutions can update bill formats' }, { status: 401 });
        }

        const { gstNumber, taxType, taxPercentage, proprietorSign, extraText } = await req.json();

        const existingBillFormat = await prisma.billFormat.findUnique({
            where: { institutionId: session.user.id },
        });

        let uploadedImageUrl = null;
        if (proprietorSign) {
            const uploadRes = await cloudinary.uploader.upload(proprietorSign, {
                folder: 'dukan/proprietor_signs',
            });
            uploadedImageUrl = uploadRes.secure_url;
        }

        const data = {
            gstNumber,
            taxType,
            taxPercentage,
            proprietorSign: uploadedImageUrl,
            extraText,
            institutionId: session.user.id,
        };

        let billFormat;

        if (existingBillFormat) {
            // Filter out undefined fields
            const updateData = {};
            if (gstNumber) updateData.gstNumber = gstNumber;
            if (taxType) updateData.taxType = taxType;
            if (taxPercentage) updateData.taxPercentage = taxPercentage;
            if (uploadedImageUrl) updateData.proprietorSign = uploadedImageUrl;
            if (extraText) updateData.extraText = extraText;

            billFormat = await prisma.billFormat.update({
                where: { institutionId: session.user.id },
                data: updateData,
            });
        } else {
            // Create new if doesn't exist
            billFormat = await prisma.billFormat.create({ data });
        }

        return new Response(JSON.stringify(billFormat), { status: 200 });

    } catch (error) {
        console.error("Error updating/creating bill format:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}



export async function DELETE(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || (session.user.role !== 'INSTITUTION' && session.user.role !== 'SHOP_OWNER')) {
            return NextResponse.json({ error: 'Unauthorized: Only institutions can delete bill formats' }, { status: 401 });
        }

        const existingBillFormat = await prisma.billFormat.findUnique({
            where: { institutionId: session.user.id },
        });

        if (!existingBillFormat) {
            return NextResponse.json({ error: "Bill format not found. Nothing to delete." }, { status: 404 });
        }

        await prisma.billFormat.delete({
            where: { institutionId: session.user.id },
        });

        return NextResponse.json({ message: "Bill format deleted successfully" }, { status: 200 });

    } catch (error) {
        console.error("Error deleting bill format:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}