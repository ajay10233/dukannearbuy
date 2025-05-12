import { prisma } from "@/utils/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId");

  const session = await getServerSession(authOptions);
  if (!session || session.user.role!=='USER') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!userId) {
    return NextResponse.json({ error: "userId is required" }, { status: 400 });
  }

  const favorites = await prisma.favoriteBills.findMany({
    where: { userId },
    include: {
      bill: true,
    },
  });

  return NextResponse.json(favorites);
}
  

export async function POST(req) {
  const { userId, billId } = await req.json();
  const session = await getServerSession(authOptions)
  if (!session || session.user.role!=='USER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!userId || !billId) {
    return NextResponse.json({ error: "Missing userId or billId" }, { status: 400 });
  }

  try {
    const existingFavorite = await prisma.favoriteBills.findFirst({
      where: {
        userId,
        billId,
      },
    });

    if (existingFavorite) {
      return NextResponse.json({ message: "Already favorited", favorite: existingFavorite }, { status: 200 });
    }
    const favorite = await prisma.favoriteBills.create({
      data: { userId, billId },
    });

    return NextResponse.json(favorite);
  } catch (err) {
    return NextResponse.json({ error: "Error occurred", detail: err }, { status: 500 });
  }
}


export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const favoriteBillId = searchParams.get("favoriteBillId");
  const session = await getServerSession(authOptions)
  if (!session || session.user.role!=='USER') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  if (!favoriteBillId) {
    return NextResponse.json({ error: "Missing favoriteBillId" }, { status: 400 });
  }

  try {
    // Check if it exists
    const existing = await prisma.favoriteBills.findUnique({
      where: { id: favoriteBillId },
    });

    if (!existing) {
      return NextResponse.json({ error: "Favorite bill not found" }, { status: 404 });
    }

    await prisma.favoriteBills.delete({
      where: { id: favoriteBillId },
    });

    return NextResponse.json({ message: "Removed from favorites" });
  } catch (err) {
    return NextResponse.json({ error: "Failed to delete", details: err }, { status: 500 });
  }
}