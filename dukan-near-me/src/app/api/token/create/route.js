import { prisma } from "@/utils/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role === 'USER') {
      return NextResponse.json(
        { error: 'Unauthorized: Only institutions can create tokens' },
        { status: 401 }
      );
    }

    const { userId, name, phoneNumber } = await req.json();
    const institutionId = session.user.id;

    const institution = await prisma.user.findUnique({
      where: { id: institutionId },
      include: { subscriptionPlan: true },
    });

    if (!institution) {
      return NextResponse.json(
        { error: 'Institution not found' },
        { status: 404 }
      );
    }

    const isFreePlan = institution.subscriptionPlan?.name === 'BASIC';

    if (isFreePlan) {
      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(startOfDay);
      endOfDay.setDate(endOfDay.getDate() + 1);

      const dailyTokenCount = await prisma.token.count({
        where: {
          institutionId,
          createdAt: {
            gte: startOfDay,
            lt: endOfDay,
          },
        },
      });

      if (dailyTokenCount >= 300) {
        return NextResponse.json(
          { error: 'Free plan limit reached. You can only generate 300 tokens daily.' },
          { status: 403 }
        );
      }
    }

    const lastToken = await prisma.token.findFirst({
      where: { institutionId },
      orderBy: { tokenNumber: 'desc' },
    });

    const tokenNumber = lastToken ? lastToken.tokenNumber + 1 : 1;

    const expiresAt = new Date();
    expiresAt.setHours(24, 0, 0, 0);

    let newToken;

    if (userId) {
      newToken = await prisma.token.create({
        data: {
          tokenNumber,
          userId,
          institutionId,
          expiresAt,
        },
      });
    } else {
      if (!name || !phoneNumber) {
        return NextResponse.json(
          { error: 'Name and phone number are required' },
          { status: 400 }
        );
      }

      newToken = await prisma.token.create({
        data: {
          tokenNumber,
          name,
          phoneNumber,
          institutionId,
          expiresAt,
        },
      });
    }

    if (global.io) {
      global.io.emit('tokenUpdated', { institutionId, newToken });
    }

    return NextResponse.json(newToken, { status: 201 });
  } catch (error) {
    console.error("Error creating token:", error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
