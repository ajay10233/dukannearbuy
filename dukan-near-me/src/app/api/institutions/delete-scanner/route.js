import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/utils/db";
import cloudinary from "@/utils/cloudinary";
import { NextResponse } from "next/server";

export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" },{ status: 401 });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: session.user.id } });

    if (!user || (user.role !== "INSTITUTION" && user.role !== "SHOP_OWNER")) {
      return NextResponse.json({ error: "Only institutions can delete images" },{ status: 403 });
    }

    if (!user.scanner_image) {
      return NextResponse.json({ error: "No scanner image found to delete" },{ status: 400 });
    }

    const urlParts = user.scanner_image.split("/");
    const publicIdWithExtension = urlParts[urlParts.length - 1]; // e.g., "imageName.jpg"
    const publicId = `scanner_images/${publicIdWithExtension.split(".")[0]}`; // Assuming .jpg/.png etc.
    await cloudinary.uploader.destroy(publicId);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { scanner_image: null },
    });

    return NextResponse.json({ message: "Image deleted successfully" },{ status: 200 });
  } catch (error) {
    console.error("❌ Error deleting institution photo:", error);
    return NextResponse.json({ error: "Internal server error" },{ status: 500 });
  }
}
