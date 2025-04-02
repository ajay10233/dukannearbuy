import { prisma } from "@/utils/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || session.user.role !== 'INSTITUTION') {
            return new Response(JSON.stringify({ error: 'Unauthorized: Only institutions can fetch bill formats' }), { status: 401 });
        }

        const billFormat = await prisma.billFormat.findUnique({  
            where: {
                institutionId: session.user.id,
            },
        });

        if (!billFormat) {
            return new Response(JSON.stringify({ error: 'Bill format not found' }), { status: 404 });
        }

        return new Response(JSON.stringify(billFormat), { status: 200 });
    } catch (error) {
        console.error("Error fetching bill formats:", error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}


export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'INSTITUTION') {
            return new Response(JSON.stringify({ error: 'Unauthorized: Only institutions can save bill formats' }), { status: 401 });
        }

        const existingBillFormat = await prisma.billFormat.findUnique({
            where: { institutionId: session.user.id },
        });

        if (existingBillFormat) {
            return new Response(JSON.stringify({ error: "A bill format already exists for this institution. You cannot create more than one." }), { status: 400 });
        }

        const { gstNumber, taxType, taxPercentage, proprietorSign, extraText } = await req.json();

        const data = {
            institutionId: session.user.id,
            gstNumber,
            taxType,
            taxPercentage,
            proprietorSign,
            extraText,
        };

        const billFormat = await prisma.billFormat.create({ data });

        return new Response(JSON.stringify(billFormat), { status: 201 });

    } catch (error) {
        console.error("Error creating bill format:", error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}

export async function PUT(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'INSTITUTION') {
            return new Response(JSON.stringify({ error: 'Unauthorized: Only institutions can update bill formats' }), { status: 401 });
        }

        const existingBillFormat = await prisma.billFormat.findUnique({
            where: { institutionId: session.user.id },
        });

        if (!existingBillFormat) {
            return new Response(JSON.stringify({ error: "Bill format not found. Please create one first." }), { status: 404 });
        }

        const { gstNumber, taxType, taxPercentage, proprietorSign, extraText } = await req.json();

        const data = {};
        if (gstNumber) data.gstNumber = gstNumber;
        if (taxType) data.taxType = taxType;
        if (taxPercentage) data.taxPercentage = taxPercentage;
        if (proprietorSign) data.proprietorSign = proprietorSign;
        if (extraText) data.extraText = extraText;

        const billFormat = await prisma.billFormat.update({
            where: { institutionId: session.user.id },
            data,
        });

        return new Response(JSON.stringify(billFormat), { status: 200 });

    } catch (error) {
        console.error("Error updating bill format:", error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}


export async function DELETE(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'INSTITUTION') {
            return new Response(JSON.stringify({ error: 'Unauthorized: Only institutions can delete bill formats' }), { status: 401 });
        }

        const existingBillFormat = await prisma.billFormat.findUnique({
            where: { institutionId: session.user.id },
        });

        if (!existingBillFormat) {
            return new Response(JSON.stringify({ error: "Bill format not found. Nothing to delete." }), { status: 404 });
        }

        await prisma.billFormat.delete({
            where: { institutionId: session.user.id },
        });

        return new Response(JSON.stringify({ message: "Bill format deleted successfully" }), { status: 200 });

    } catch (error) {
        console.error("Error deleting bill format:", error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}