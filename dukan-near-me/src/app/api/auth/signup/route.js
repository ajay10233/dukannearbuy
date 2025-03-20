import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/utils/db";

export const POST = async(req) => {
    try {
        const {firstName, lastName, email, phone, password, role} = await req.json();

        const userExists = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { phone },
                ],
            },
        });

        if(userExists){
            return NextResponse.json({message:'User already exists'}, {status: 400})
        }

        const hashPassword = await bcrypt.hash(password, 10);
        

        const user = await prisma.user.create({
            data: {
                firstName, lastName, email, phone, password: hashPassword, role
            }
        })
        return NextResponse.json(user, {message:'Message received'}, {status: 200})
    } catch (error) {
        return NextResponse.json({message: "Registeration failed!"}, {status: 500})
    }

}