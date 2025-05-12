import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const institutionId = searchParams.get('institutionId');

        const userId = institutionId || session.user.id;

        const user = await prisma.user.findUnique({
            where: { id: userId },
            include: {
                pastAddresses: {
                    take: 5,
                    orderBy: {
                        movedOutAt: 'desc',
                    },
                },
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const pastAddresses = user.pastAddresses || [];
        return NextResponse.json(pastAddresses, { status: 200 });

    } catch (error) {
        console.error("Error fetching past addresses:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

export async function PUT(req) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user.role !== "INSTITUTION" && session.user.role !== "SHOP_OWNER")) {
    return NextResponse({ error: "Unauthorized" },{ status: 401 });
  }

  try {
    const body = await req.json();
    const userId = session.user.id;

    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (!user) {
      return NextResponse({ error: "User not found" },{ status: 404 });
    }

    const addressFields = [
      "houseNumber",
      "street",
      "buildingName",
      "landmark",
      "city",
      "state",
      "country",
      "zipCode",
      "shopAddress",
      "latitude",
      "longitude",
    ];

    const updateData = {};
    let addressChanged = false;

    for (const field of addressFields) {
      if (body[field] !== undefined && body[field] !== user[field]) {
        updateData[field] = body[field];
        addressChanged = true;
      }
    }

    if (!addressChanged) {
      return NextResponse({ error: "No address changes detected" },{ status: 400 });
    }

    await prisma.pastAddress.create({
      data: {
        userId: userId,
        houseNumber: user.houseNumber,
        street: user.street,
        buildingName: user.buildingName,
        landmark: user.landmark,
        city: user.city,
        state: user.state,
        country: user.country,
        zipCode: user.zipCode,
        latitude: user.latitude,
        longitude: user.longitude,
        movedOutAt: new Date(),
      },
    });

    const pastAddresses = await prisma.pastAddress.findMany({
      where: { userId },
      orderBy: { movedOutAt: "asc" },
    });

    if (pastAddresses.length > 5) {
      const oldest = pastAddresses[0];
      await prisma.pastAddress.delete({ where: { id: oldest.id } });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
    });

    return new Response(
      JSON.stringify({ message: "Address updated successfully", user: updatedUser }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error updating address:", error);
    return NextResponse({ error: "Internal server error" },{ status: 500 });
  }
}