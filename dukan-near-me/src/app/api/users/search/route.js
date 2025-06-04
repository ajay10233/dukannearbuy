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
    let userResults = [];

    if (session.user.role === "USER") {
      searchResults = await prisma.user.findMany({
        where: {
          role: { in: ["INSTITUTION", "SHOP_OWNER"] },
          id: { not: session.user.id },
          OR: [
            { firmName: { contains: query, mode: "insensitive" } },
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
          firstName: true,
          lastName: true,
          username: true,
          email: true,
          planExpiresAt: true,
          subscriptionPlan: {
            select: {
              id: true,
              name: true,
              price: true,
              durationInDays: true,
            },
          },

        },
      });

      userResults = await prisma.user.findMany({
        where: {
          role: "USER",
          id: { not: session.user.id },
          username: query.trim().toLowerCase(),
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          username: true,
          email: true,
          description: true,
          profilePhoto: true,
          hashtags: true,
          role: true,
          firstName: true,
          lastName: true,
          username: true,
          email: true,
          planExpiresAt: true,
          subscriptionPlan: {
            select: {
              id: true,
              name: true,
              price: true,
              durationInDays: true,
            },
          },

        },
      });

      const mappedSearchResults = searchResults.map(item => ({ ...item, accepted: true }));
      const mappedUserResults = userResults.map(item => ({ ...item, accepted: true }));

      return NextResponse.json(
        { data: mappedSearchResults, users: mappedUserResults },
        { status: 200 }
      );

    } else if (session.user.role === "INSTITUTION" || session.user.role === "SHOP_OWNER") {
      searchResults = await prisma.user.findMany({
        where: {
          role: { in: ["INSTITUTION", "SHOP_OWNER"] },
          id: { not: session.user.id },
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
          firstName: true,
          lastName: true,
          username: true,
          email: true,
          planExpiresAt: true,
          subscriptionPlan: {
            select: {
              id: true,
              name: true,
              price: true,
              durationInDays: true,
            },
          },

        },
      });

      const mappedSearchResults = searchResults.map(item => ({ ...item, accepted: true }));

      return NextResponse.json(
        { data: mappedSearchResults },
        { status: 200 }
      );
    }

  } catch (error) {
    console.error("❌ Error searching users:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
