import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/utils/db";
import cloudinary from "@/utils/cloudinary";
import { NextResponse } from "next/server";

export async function POST(req) {
    const session = await getServerSession(authOptions);
    if (!session || (session.user.role !== "INSTITUTION" && session.user.role !== "SHOP_OWNER")) {
        return NextResponse.json(json(json(json(json(json({ error: "Unauthorized" },{ status: 401 });
    }

    try {
        const formData = await req.formData();
        const updateData = {};

        const fields = [
            "firstName", "lastName", "username", "phone", "age", "gender",
            "houseNumber", "street", "buildingName", "landmark", "city", "state",
            "country", "zipCode", "mobileNumber", "upi_id", "profilePhoto",
            "firmName", "shopAddress", "contactEmail", "paymentDetails",
            "description", "hashtags", "photos", "shopOpenTime",
            "shopCloseTime", "shopOpenDays"
        ];

        const uniqueFields = ["phone", "email", "username"];

        for (const field of fields) {
            const value = formData.get(field);
            if (value !== null) {
                if (uniqueFields.includes(field)) {
                    if (value.trim() !== "") {
                        updateData[field] = value.trim();
                    }
                } else if (["hashtags", "photos", "shopOpenDays"].includes(field)) {
                    try {
                        updateData[field] = JSON.parse(value);
                    } catch (error) {
                        console.error(`Error parsing ${field}:`, error);
                        updateData[field] = [];
                    }
                } else {
                    updateData[field] = value;
                }
            }
        }

        // Handle scanner_image upload
        const file = formData.get('scanner_image');
        if (file && typeof file === 'object') {
            const arrayBuffer = await file.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);

            const result = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "scanner_images" },
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result);
                    }
                );
                uploadStream.end(buffer);
            });

            updateData.scanner_image = result.secure_url;
        }

        if (updateData.shopOpenDays && Array.isArray(updateData.shopOpenDays)) {
            const daysOfWeek = [
                "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"
            ];

            updateData.shopOpenDays = updateData.shopOpenDays.sort((a, b) => {
                return daysOfWeek.indexOf(a) - daysOfWeek.indexOf(b);
            });
        }

        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(json(json(json(json(json({ error: "No valid fields provided to update" },{ status: 400 });
        }

        if (updateData.phone) {
            const existingUser = await prisma.user.findFirst({
                where: {
                    phone: updateData.phone,
                    NOT: { id: session.user.id }
                },
                select: { id: true }
            });

            if (existingUser) {
                return NextResponse.json(json(json(json(json(json({ error: "Phone number already in use" },{ status: 409 });
            }
        }


        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: updateData,
        });

        return NextResponse.json(json(json(json(json(json({ message: "Profile updated successfully", user: updatedUser },{ status: 200 });

    } catch (error) {
        console.error("❌ Error updating profile:", error);
        return NextResponse.json(json(json(json(json(json({ error: "Internal server error" },{ status: 500 });
    }
}
