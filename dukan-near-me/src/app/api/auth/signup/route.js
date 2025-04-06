import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/utils/db";

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
            },
        });

        return NextResponse.json(
            { user, message: `${role} created successfully` }, 
            { status: 200 }
        );

    } catch (error) {
        console.error("Prisma Validation Error:", error);
        return NextResponse.json(
            { message: "Registration failed!", error: error.message }, 
            { status: 500 }
        );
    }
};