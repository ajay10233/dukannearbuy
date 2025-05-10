import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/utils/db";
import cloudinary from "@/utils/cloudinary";
import { NextResponse } from "next/server";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse({ error: "Unauthorized" },{ status: 401 });

  try {
    const { images } = await req.json();
    if (!images || !Array.isArray(images) || images.length === 0) {
      return NextResponse({ error: "No images provided" },{ status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user || user.role !== "INSTITUTION" && user.role !== "SHOP_OWNER") {
      return NextResponse({ error: "Only institutions can upload multiple images" },{ status: 403 });
    }

    // Check if institution already has 10 images
    if (user.photos.length + images.length > 10) {
      return NextResponse({ error: "Cannot upload more than 10 images" },{ status: 400 });
    }

    // Validate images (must be base64)
    const validImages = images.filter(img => img.startsWith("data:image/"));
    if (validImages.length !== images.length) {
      return NextResponse({ error: "Invalid image format" },{ status: 400 });
    }

    // Upload base64 images to Cloudinary
    const uploadPromises = validImages.map((img) => cloudinary.uploader.upload(img, { folder: "institution_photos" }));
    const uploadedImages = await Promise.all(uploadPromises);
    const imageUrls = uploadedImages.map((img) => img.secure_url);

    // Update institution's photos in the database
    await prisma.user.update({
      where: { id: session.user.id },
      data: { photos: { push: imageUrls } },
    });

    return NextResponse({ message: "Images uploaded successfully", urls: imageUrls },{ status: 200 });
  } catch (error) {
    console.error("❌ Error uploading institution photos:", error);
    return NextResponse({ error: "Internal server error" },{ status: 500 });
  }
}
