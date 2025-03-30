import { NextResponse } from "next/server";
import { prisma } from "@/utils/db"; // Import Prisma client
import { getServerSession } from "next-auth"; // Import NextAuth session

export async function GET(req) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        latitude: true,
        longitude: true,
        houseNumber: true,
        street: true,
        buildingName: true,
        landmark: true,
        city: true,
        state: true,
        country: true,
        zipCode: true,
      },
    });

    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    return NextResponse.json(user);
  } catch (error) {
    console.error("Error fetching user location:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const session = await getServerSession();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { lat, lng, houseNumber, street, buildingName, landmark, city, state, country, zipCode } = await req.json();
    
    if (!lat || !lng || !city || !state || !country || !zipCode) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { 
        latitude: lat, 
        longitude: lng, 
        houseNumber, 
        street, 
        buildingName, 
        landmark, 
        city, 
        state, 
        country, 
        zipCode 
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error updating user location:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
