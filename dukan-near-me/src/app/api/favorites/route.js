import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse({ error: "Unauthorized" },{ status: 401 });
  try {
    var favorites = await prisma.favoriteInstitution.findMany({
      where: { userId: session.user.id },
      include: {
        institution: {
          select: {
            id: true,
            firmName: true,
            shopAddress: true,
            contactEmail: true,
            description: true,
            hashtags: true,
            photos: true,
            shopOpenTime: true,
            shopCloseTime: true,
            shopOpenDays: true,
            city: true,
            state: true,
            country: true,
            latitude: true,
            longitude: true,
            scanner_image: true,
            profilePhoto: true,
            mobileNumber: true,
            username:true,
          },
        },
      },
    });

    favorites = favorites.filter(fav => fav!=null);

    return NextResponse.json({ favorites });
  } catch (error) {
    console.error("Failed to fetch favorite institutions", error);
    return NextResponse.json({ error: "Failed to fetch favorites" }, { status: 500 });
  }
}


export async function POST(req) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse({ error: "Unauthorized" },{ status: 401 });

  const { institutionId } = await req.json();
  try {
    await prisma.favoriteInstitution.create({
      data: {
        userId: session.user.id,
        institutionId,
      },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
      console.log(error);
    return NextResponse.json({ error: "Failed to add favorite" }, { status: 500 });
  }
}

export async function DELETE(req) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse({ error: "Unauthorized" },{ status: 401 });
  
    const { institutionId } = await req.json();
    try {
      await prisma.favoriteInstitution.deleteMany({
        where: {
          userId: session.user.id,
          institutionId,
        },
      });
      return NextResponse.json({ success: true });
    } catch (error) {
        console.log(error);
      return NextResponse.json({ error: "Failed to remove favorite" }, { status: 500 });
    }
  }
  