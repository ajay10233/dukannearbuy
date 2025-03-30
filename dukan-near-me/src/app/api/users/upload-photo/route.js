import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/utils/db";
import cloudinary from "@/utils/cloudinary";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });

  try {
    const { image } = await req.json();
    if (!image || !image.startsWith("data:image/")) {
      return new Response(JSON.stringify({ error: "Invalid image format" }), { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id: session.user.id } });
    if (!user) return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });

    if (user.role === "INSTITUTION" || user.role === "SHOP_OWNER") {
      return new Response(JSON.stringify({ error: "Institutions should use the institution upload route" }), { status: 403 });
    }

    // Upload base64 image to Cloudinary
    const uploadRes = await cloudinary.uploader.upload(image, { folder: "profiles" });

    // Update user profile photo in the database
    await prisma.user.update({
      where: { id: session.user.id },
      data: { profilePhoto: uploadRes.secure_url },
    });

    return new Response(JSON.stringify({ message: "Profile photo updated successfully", url: uploadRes.secure_url }), { status: 200 });
  } catch (error) {
    console.error("❌ Error uploading profile photo:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
