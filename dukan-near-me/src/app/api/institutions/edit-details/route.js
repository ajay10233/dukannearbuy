import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/utils/db";
import cloudinary from "@/utils/cloudinary";

export async function POST(req) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role != "INSTITUTION" && session.user.role != "SHOP_OWNER")) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }

    try {
        const body = await req.json();

        const user = await prisma.user.findUnique({ where: { id: session.user.id } });
        if (!user) {
            return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
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
            "upi_id",
            "profilePhoto",
            "firmName",
            "shopAddress",
            "contactEmail",
            "paymentDetails",
            "description",
            "hashtags",
            "photos",
            "shopOpenTime",
            "shopCloseTime",
            "shopOpenDays",
            "upi_id",
        ];

        for (const field of fields) {
            if (body[field] !== undefined) {
                updateData[field] = body[field];
            }
        }

        let scanner_image = body.scanner_image;
        if (scanner_image) {
            let result = await cloudinary.uploader.upload(scanner_image, { folder: "scanner_images" });
            updateData.scanner_image = result.secure_url;
        }

        if (Object.keys(updateData).length === 0) {
            return new Response(JSON.stringify({ error: "No valid fields provided to update" }), { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: updateData,
        });

        return new Response(JSON.stringify({ message: "Profile updated successfully", user: updatedUser }), {
            status: 200,
        });
    } catch (error) {
        console.error("❌ Error updating profile:", error);
        return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
    }
}
