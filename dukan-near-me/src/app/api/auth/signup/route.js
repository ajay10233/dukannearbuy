import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/utils/db";
import { sendVerificationEmail } from "@/utils/sendVerificationEmail";

export const POST = async (req) => {
  try {
    const { firstName, lastName, email, phone, password, role } = await req.json();

    const randomNumber = Math.floor(1000 + Math.random() * 9000);
    const generatedUsername = `${firstName.toLowerCase()}${lastName.toLowerCase()}${randomNumber}`;

    const userExists = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }, { username: generatedUsername }],
      },
    });

    if (userExists) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        password: hashPassword,
        role,
        username: generatedUsername,
        verified: false, // make sure you have this field in your schema
      },
    });

    const emailOtp = Math.floor(1000 + Math.random() * 9000).toString();


    await Promise.all([
      prisma.verificationToken.create({
        data: {
          otp: emailOtp,
          contact: email,
          method: "email",
          userId: user.id,
          expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes expiry
        },
      }),
      sendVerificationEmail(email, emailOtp),
    ]);

    return NextResponse.json(
      { user, message: `${role} created successfully. OTP sent to email.` },
      { status: 200 }
    );
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { message: "Registration failed!", error: error.message },
      { status: 500 }
    );
  }
};
