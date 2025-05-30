import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/utils/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export async function GET(req, { params }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const notification = await prisma.notification.findUnique({
    where: { id: params.id },
  });
  return NextResponse.json(notification, { status: 200 });
}

export async function PUT(req, { params }) {
  const param = await params;
  const id = await param.id;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const notification = await prisma.notification.update({
    where: { id: id },
    data: { isRead: true },
  });

  return NextResponse.json(notification);
}


export async function DELETE(req, { params }) {
  const param = await params;
  const id = await param.id;
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const notification = await prisma.notification.findUnique({
    where: { id: id },
  });

  if (!notification || notification.receiverId !== session.user.id) {
    return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  }

  await prisma.notification.delete({ where: { id: params.id } });
  return NextResponse.json({ message: "Deleted successfully" });
}
