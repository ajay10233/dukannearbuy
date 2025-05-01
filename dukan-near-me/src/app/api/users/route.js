import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";

export const GET = async (request) => {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim();

    let users;

    if (search) {
      users = await prisma.user.findMany({
        where: {
          role: "USER",
          username: {
            contains: search,
            mode: "insensitive",
          },
        },
      });
    } else {
      users = await prisma.user.findMany({
        where: {
          role: "USER",
        },
      });
    }

    return NextResponse.json({ data: users }, { status: 200 });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { message: "Failed to fetch users", error },
      { status: 500 }
    );
  }
};
