import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";

export async function PUT(req) {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role === "USER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "Image URL is required" }, { status: 400 });
    }

    // Fetch user to validate the image exists in their photo list
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { photos: true },
    });

    if (!user || !user.photos.includes(url)) {
      return NextResponse.json({ error: "Image URL not found in user's uploaded photos" }, { status: 400 });
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: { profilePhoto: url },
    });

    return NextResponse.json({ message: "Profile photo updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("❌ Error setting profile photo:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
