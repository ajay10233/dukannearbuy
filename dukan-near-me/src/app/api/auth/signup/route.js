import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/utils/db";

export const POST = async (req) => {
    try {
        const { firstName, lastName, email, phone, password, role, username } = await req.json();

        const userExists = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { phone },{username}],
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
                username,
            },
        });

        return NextResponse.json(user, {message: `${role} create successfully`} ,{ status: 200 });
    } catch (error) {
        console.error("Prisma Validation Error:", error);
        return NextResponse.json({ message: "Registration failed!", error: error.message }, { status: 500 });
    }
};
