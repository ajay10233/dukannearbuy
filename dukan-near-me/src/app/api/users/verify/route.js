import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { email, emailOtp, phone, phoneOtp } = await req.json();

  const updates = {};
  const deleteIds = [];

  if (email && emailOtp) {
    const emailToken = await prisma.verificationToken.findFirst({
      where: {
        contact: email,
        method: "email",
        otp: emailOtp,
      },
    });

    if (!emailToken || emailToken.expiresAt < new Date()) {
      if (emailToken) {
        await prisma.verificationToken.delete({ where: { id: emailToken.id } });
      }
      return NextResponse.json({ error: "Invalid or expired email OTP" }, { status: 400 });
    }

    updates.verified = true;
    deleteIds.push(emailToken.id);
  }

  if (phone && phoneOtp) {
    const phoneToken = await prisma.verificationToken.findFirst({
      where: {
        contact: phone,
        method: "phone",
        otp: phoneOtp,
      },
    });

    if (!phoneToken || phoneToken.expiresAt < new Date()) {
      if (phoneToken) {
        await prisma.verificationToken.delete({ where: { id: phoneToken.id } });
      }
      return NextResponse.json({ error: "Invalid or expired phone OTP" }, { status: 400 });
    }

    updates.phoneVerified = true;
    deleteIds.push(phoneToken.id);
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid OTPs provided" }, { status: 400 });
  }

  const user = await prisma.user.findFirst({
    where: {
      OR: [
        { email: email ?? undefined },
        { phone: phone ?? undefined },
      ],
    },
  });

  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  await prisma.user.update({
    where: { id: user.id },
    data: updates,
  });

  await prisma.verificationToken.deleteMany({
    where: { id: { in: deleteIds } },
  });

  return NextResponse.json({ message: "Verification successful", verified: updates });
}
