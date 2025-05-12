import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/utils/db";
import cloudinary from "@/utils/cloudinary";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(json({ error: "Unauthorized" },{ status: 401 });
  }

  try {
    const { imageUrl } = await req.json();
    if (!imageUrl) {
      return NextResponse.json(json({ error: "Image URL is required" },{ status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    
    if (!user || (user.role !== "INSTITUTION" && user.role !== "SHOP_OWNER")) {
      return NextResponse.json(json({ error: "Only institutions can delete images" },{ status: 403 });
    }

    if (!user.photos.includes(imageUrl)) {
      return NextResponse.json(json({ error: "Image not found in your uploaded photos" },{ status: 404 });
    }

    const publicIdMatch = imageUrl.match(/institution_photos\/([^/.]+)/);
    if (!publicIdMatch) {
      return NextResponse.json(json({ error: "Invalid image URL format" },{ status: 400 });
    }
    const publicId = `institution_photos/${publicIdMatch[1]}`;
    
    await cloudinary.uploader.destroy(publicId);

    const updatedPhotos = user.photos.filter(photo => photo !== imageUrl);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { photos: updatedPhotos },
    });

    return NextResponse.json(json({ message: "Image deleted successfully" },{ status: 200 });
  } catch (error) {
    console.error("❌ Error deleting institution photo:", error);
    return NextResponse.json(json({ error: "Internal server error" },{ status: 500 });
  }
}
