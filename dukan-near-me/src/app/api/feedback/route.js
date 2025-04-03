import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/utils/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req) {
    try {
        // Authenticate user
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Find feedbacks submitted by user
        const feedbacks = await prisma.userResponse.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ feedbacks }, { status: 200 });
    } catch (error) {
        console.error("Error fetching feedbacks:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req) {
    try {
        // Authenticate user
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Find the feedback
        const { id } = await req.json();
        const feedback = await prisma.userResponse.findUnique({ where: { id } });
        if (!feedback) {
            return NextResponse.json({ error: "Feedback not found" }, { status: 404 });
        }

        // Delete the feedback
        await prisma.userResponse.delete({ where: { id } });
        return NextResponse.json({ message: "Feedback deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error deleting feedback:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req) {
    try {
        // Authenticate user
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Find the feedback
        const { id, content } = await req.json();
        const feedback = await prisma.userResponse.findUnique({ where: { id } });
        if (!feedback) {
            return NextResponse.json({ error: "Feedback not found" }, { status: 404 });
        }

        // Update the feedback
        await prisma.userResponse.update({ where: { id }, data: { content } });
        return NextResponse.json({ message: "Feedback updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating feedback:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function POST(req) {
    try {
        // Authenticate user
        const session = await getServerSession(authOptions);
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Parse request body
        const { content, name, email, type } = await req.json();
        if (!content) {
            return NextResponse.json({ error: "Content is required" }, { status: 400 });
        }

        // Construct the data object dynamically
        const created_data = Object.assign(
            { content, userId: session.user.id },
            name && { name },
            email && { email },
            type && { type }
        );

        // Insert into database
        const feedback = await prisma.userResponse.create({ data: created_data });

        return NextResponse.json(feedback, { status: 201 });
    } catch (error) {
        console.error("Error adding feedback:", error);
        
        return NextResponse.json(
            { error: error.message || "Internal server error" },
            { status: 500 }
        );
    }
}
