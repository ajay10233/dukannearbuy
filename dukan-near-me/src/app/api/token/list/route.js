
import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const institutionId = searchParams.get("institutionId");

    if (!institutionId) {
      return NextResponse.json({ error: "Missing institutionId" }, {
        status: 400,
      });
    }

    const tokens = await prisma.token.findMany({
      where: { institutionId },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            username: true,
            mobileNumber: true,
          },
        },
      },
    });

    return NextResponse.json(tokens, { status: 200 });
  } catch (error) {
    console.error("Error fetching tokens:", error);
    return NextResponse.json({ error: "Internal Server Error" }, {
      status: 500,
    });
  }
}
