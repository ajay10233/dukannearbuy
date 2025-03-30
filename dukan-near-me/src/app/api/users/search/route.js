import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/utils/db";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query")?.trim() || "";

  if (!query) {
    return NextResponse.json({ data: [] }, { status: 200 });
  }

  try {
    let searchResults = [];
    console.log("User's role is:", session.user.role);

    if (session.user.role === "USER") {
      // Users can only search for institutions
      searchResults = await prisma.user.findMany({
        where: {
          role: {in: ["INSTITUTION", "SHOP_OWNER"] },
          id: { not: session.user.id }, // Exclude the logged-in user
          OR: [
            { firmName: { contains: query, mode: "insensitive" } },
            { shopAddress: { contains: query, mode: "insensitive" } },
            { contactEmail: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { hashtags: { hasSome: [query] } }, // Search within hashtags
          ],
        },
        select: {
          id: true,
          firmName: true,
          shopAddress: true,
          contactEmail: true,
          description: true,
          hashtags: true,
          profilePhoto: true,
          shopOpenTime: true,
          shopCloseTime: true,
          shopOpenDays: true,
          role: true,
        },
      });
    } else if (session.user.role === "INSTITUTION" || session.user.role === "SHOP_OWNER") {
      // Institutions can only search for other institutions
      searchResults = await prisma.user.findMany({
        where: {
          role: {in: ["INSTITUTION", "SHOP_OWNER"] },
          id: { not: session.user.id }, // Exclude the logged-in user
          OR: [
            { firmName: { contains: query, mode: "insensitive" } },
            { username: { contains: query, mode: "insensitive" } },
            { shopAddress: { contains: query, mode: "insensitive" } },
            { contactEmail: { contains: query, mode: "insensitive" } },
            { description: { contains: query, mode: "insensitive" } },
            { hashtags: { hasSome: [query] } },
          ],
        },
        select: {
          id: true,
          firmName: true,
          shopAddress: true,
          contactEmail: true,
          description: true,
          hashtags: true,
          profilePhoto: true,
          shopOpenTime: true,
          shopCloseTime: true,
          shopOpenDays: true,
          role: true,
        },
      });

      console.log("Search results for institutions:", searchResults);
    }

    return NextResponse.json({ data: searchResults }, { status: 200 });
  } catch (error) {
    console.error("❌ Error searching users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
