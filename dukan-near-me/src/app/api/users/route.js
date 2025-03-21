import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";

export const GET = async () => {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json({ data: users }, { status: 200 });
  } catch (error) {
    console.log("error",error);
    return NextResponse.json({ message: "Failed to fetch users", error }, { status: 500 });
  }
};
