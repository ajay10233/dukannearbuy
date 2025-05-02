import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.json({ error: "Token is required" }, { status: 400 });
  }

  const existingToken = await prisma.verificationToken.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!existingToken) {
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });
  }

  if (existingToken.expiresAt < new Date()) {
    await prisma.verificationToken.delete({ where: { token } });
    return NextResponse.json({ error: "Token expired" }, { status: 400 });
  }

  await prisma.user.update({
    where: { id: existingToken.userId },
    data: { verified: true },
  });

  await prisma.verificationToken.delete({ where: { token } });

  return NextResponse.json({ message: "Email successfully verified!" }, { status: 200 });
}
