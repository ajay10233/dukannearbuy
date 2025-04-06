import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";

export async function POST(req) {
  const { sessionToken } = await req.json();
  const sessionInDb = await prisma.session.findUnique({
    where: { token: sessionToken },
  });

  if (!sessionInDb) {
    return NextResponse.json({ isValid: false });
  }

  return NextResponse.json({ isValid: true });
}
