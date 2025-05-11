import { prisma } from "@/utils/db";
import crypto from "crypto";
import { sendVerificationEmail } from "@/utils/sendVerificationEmail";
import { sendOtpToWhatsApp } from "@/utils/sendOtpToWhatsApp";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { email, phone } = await req.json();

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: email ?? undefined },
        { phone: phone ?? undefined },
      ],
    },
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  if(user.verified) return NextResponse.json({ error: "User already verified" }, { status: 400 });
  
  const tasks = [];

  if (email) {
    const emailOtp = Math.floor(1000 + Math.random() * 9000).toString();

    tasks.push(
      prisma.verificationToken.create({
        data: {
          otp: emailOtp,
          contact: email,
          method: "email",
          userId: user.id,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
      }),
      sendVerificationEmail(email, emailOtp)
    );
  }

  if (phone) {
    const phoneOtp = Math.floor(1000 + Math.random() * 9000).toString();
    tasks.push(
      prisma.verificationToken.create({
        data: {
          otp: phoneOtp,
          contact: phone,
          method: "phone",
          userId: user.id,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000),
        },
      }),
      sendOtpToWhatsApp(phone, phoneOtp)
    );
  }

  await Promise.all(tasks);

  return NextResponse.json({ message: "OTP(s) sent successfully" });
}
