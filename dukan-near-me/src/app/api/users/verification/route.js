import { prisma } from "@/utils/db";
import crypto from "crypto";
import { sendVerificationEmail } from "@/utils/sendVerificationEmail";
import { NextResponse } from "next/server";

export async function POST (req){
  const { email } = await req.json();
  const user = await prisma.user.findUnique({
    where: { email },
  });


  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.verified) {
    return NextResponse.json({ error: "User already verified" }, { status: 400 });
  }

  const verificationToken = crypto.randomBytes(32).toString("hex");

  await prisma.verificationToken.create({
    data: {
      token: verificationToken,
      userId: user.id,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60),
    },
  });

  await sendVerificationEmail(user.email, verificationToken);

  return NextResponse.json({ message: "Verification email sent" }, { status: 200 });
};
