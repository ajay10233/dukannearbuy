import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";

export async function POST(req) {
  try {
    const body = await req.json();
    const sessionToken = body?.sessionToken;
    // console.log("sessionToken: ", sessionToken);
    if (!sessionToken) {
      return NextResponse.json({ error: "Missing session token" }, { status: 400 });
    }

    const sessionInDb = await prisma.session.findUnique({
      where: { token: sessionToken },
    });

    if (!sessionInDb) {
      return NextResponse.json({ isValid: false }, { status: 404 });
    }

    return NextResponse.json({ isValid: true, session: sessionInDb });
  } catch (err) {
    console.error("Session validation failed:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
