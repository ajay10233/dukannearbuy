import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/utils/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export const GET = async (req, { params }) => {
    const session = await getServerSession(authOptions);
    try {
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        
        const { id } = await params;

        const user = await prisma.user.findUnique({
            where: { id: id },
            include: {
                subscriptionPlan: true,
                paidProfilesGiven: true,
            },
        });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            username: user.username,
            phone: user.phone,
            role: user.role,
            profilePhoto: user.profilePhoto,
            photos: user.photos,
            address: {
                houseNumber: user.houseNumber,
                street: user.street,
                buildingName: user.buildingName,
                landmark: user.landmark,
                city: user.city,
                state: user.state,
                country: user.country,
                zipCode: user.zipCode,
            },
            mobileNumber: user.mobileNumber,
            firmName: user.firmName,
            shopAddress: user.shopAddress,
            contactEmail: user.contactEmail,
            paymentDetails: user.paymentDetails,
            description: user.description,
            hashtags: user.hashtags,
            shopOpenTime: user.shopOpenTime,
            shopCloseTime: user.shopCloseTime,
            shopOpenDays: user.shopOpenDays,
            latitude: user.latitude,
            longitude: user.longitude,
            createdAt: user.createdAt,
            upi_id: user.upi_id,
            scanner_image: user.scanner_image,
            allowedRoutes: user.allowedRoutes,
            subscriptionPlan: user.subscriptionPlan
                ? {
                    id: user.subscriptionPlan.id,
                    name: user.subscriptionPlan.name,
                    price: user.subscriptionPlan.price,
                    durationInDays: user.subscriptionPlan.durationInDays,
                    features: user.subscriptionPlan.features,
                    maxUploadSizeMB: user.subscriptionPlan.maxUploadSizeMB,
                    expiresAt: user.subscriptionPlan.expiresAt,
                }
                : null,
            paidPromotions: user.paidProfilesGiven.map((promo) => ({
                id: promo.id,
                amountPaid: promo.amountPaid,
                createdAt: promo.createdAt,
                expiresAt: promo.expiresAt,
                notes: promo.notes,
                image: promo.image,
                range: promo.range,
            })),

        });

    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

}
