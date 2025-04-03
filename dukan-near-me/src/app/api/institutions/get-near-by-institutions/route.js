import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/utils/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export default async function GET(req) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const longitude = parseFloat(req.nextUrl.searchParams.get("longitude"));
    const latitude = parseFloat(req.nextUrl.searchParams.get("latitude"));

    if (!longitude || !latitude) {
        return NextResponse.json({ error: "Longitude and latitude are required" }, { status: 400 });
    }

    try {
        const nearbyInstitutions = await prisma.$queryRaw`
            SELECT *, 
                (6371 * acos(
                    cos(radians(${latitude})) * cos(radians(latitude)) * 
                    cos(radians(longitude) - radians(${longitude})) + 
                    sin(radians(${latitude})) * sin(radians(latitude))
                )) AS distance 
            FROM User
            WHERE role IN ('INSTITUTION', 'SHOP_OWNER')
            HAVING distance <= 5
            ORDER BY distance ASC;
        `;

        return NextResponse.json(nearbyInstitutions, { status: 200 });
    } catch (error) {
        console.error("Error fetching nearby institutions:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}
