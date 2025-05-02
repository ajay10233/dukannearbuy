import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/utils/db";
import cloudinary from "@/utils/cloudinary";

export async function DELETE(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  try {
    const { imageUrl } = await req.json();
    if (!imageUrl) {
      return new Response(JSON.stringify({ error: "Image URL is required" }), { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });

    if (user.profilePhoto !== imageUrl) {
      return new Response(JSON.stringify({ error: "Profile photo not found or does not belong to you" }), { status: 404 });
    }

    const publicIdMatch = imageUrl.match(/profiles\/([^/.]+)/);
    if (!publicIdMatch) {
      return new Response(JSON.stringify({ error: "Invalid image URL format" }), { status: 400 });
    }
    const publicId = `profiles/${publicIdMatch[1]}`;

    await cloudinary.uploader.destroy(publicId);
    await prisma.user.update({
      where: { id: session.user.id },
      data: { profilePhoto: null },
    });

    return new Response(JSON.stringify({ message: "Profile photo deleted successfully" }), { status: 200 });
  } catch (error) {
    console.error("❌ Error deleting profile photo:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
