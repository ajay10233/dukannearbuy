import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const param = await params;
    const tokenNumberParam = await param?.tokenNumber;
    const tokenNumber = parseInt(tokenNumberParam, 10);

    if (isNaN(tokenNumber)) {
      return NextResponse.json({ error: "Invalid token number" }, { status: 400 });
    }

    const token = await prisma.token.findFirst({
      where: { tokenNumber },
      include: { user: true },
    });

    if (!token || !token.user) {
      return NextResponse.json({ error: "Token or user not found" }, { status: 404 });
    }

    const user = token.user;

    // Construct full address
    const addressParts = [
      user.houseNumber,
      user.buildingName,
      user.street,
      user.landmark,
      user.city,
      user.state,
      user.country,
      user.zipCode,
    ].filter(Boolean);

    const fullAddress = addressParts.join(", ");

    const result = {
      firstName: user.firstName || '',
      mobile: user.mobileNumber || user.phone || '',
      address: fullAddress,
      id: user.id,
    };

    return NextResponse.json(result, { status: 200 });

  } catch (error) {
    console.error("Error fetching token details:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
