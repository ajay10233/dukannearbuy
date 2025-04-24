
import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req) {
    const session = await getServerSession(authOptions);
    if(!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tokens = await prisma.token.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: "desc" },
        include: {
          institution: {
            select: {
              id: true,
              firmName: true,
              shopAddress: true,
              contactEmail: true,
              phone: true,
            },
          },
          user: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
              phone: true,
              profilePhoto: true,
              city: true,
              state: true,
              country: true,
            },
          },
        },
    });

    return NextResponse.json(tokens, { status: 200 });

}