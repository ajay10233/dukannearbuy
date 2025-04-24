import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/utils/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export async function GET(req) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  
    const userId = session.user.id;
  
    const notifications = await prisma.notification.findMany({
      where: { receiverId: userId },
      orderBy: { createdAt: "desc" },
    });
  
    return NextResponse.json(notifications);
}

export async function POST(req) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { senderId, receiverId, title, message, type } = await req.json();
    const notification = await prisma.notification.create({
        data: {
        title,
        message,
        type,
        senderId,
        receiverId,
        },
    });
    return NextResponse.json(notification);
}

  