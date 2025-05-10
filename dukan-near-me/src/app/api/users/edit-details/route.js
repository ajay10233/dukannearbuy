import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" },{ status: 401 });
  }

  try {
    const body = await req.json();

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) {
      return NextResponse.json({ error: "User not found" },{ status: 404 });
    }

    if (user.role !== "USER") {
      return NextResponse.json({ error: "Only users can update this profile" },{ status: 403 });
    }

    const updateData = {};

    const fields = [
      "firstName",
      "lastName",
      "username",
      "phone",
      "age",
      "gender",
      "houseNumber",
      "street",
      "buildingName",
      "landmark",
      "city",
      "state",
      "country",
      "zipCode",
      "mobileNumber",
    ];

    for (const field of fields) {
      if (body[field] !== undefined) {
        updateData[field] = body[field];
      }
    }

    if (updateData.username) {
      const existing = await prisma.user.findUnique({ where: { username: updateData.username } });
      if (existing && existing.id !== session.user.id) {
        return NextResponse.json({ error: "Username already taken" },{ status: 409 });
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: "No valid fields provided to update" },{ status: 400 });
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
    });

    return NextResponse.json({ message: "Profile updated successfully", user: updatedUser }, {
      status: 200,
    });
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    return NextResponse.json({ error: "Internal server error" },{ status: 500 });
  }
}
