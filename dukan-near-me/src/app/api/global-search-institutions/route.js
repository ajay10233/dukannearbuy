import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET(req) {
  const { search } = Object.fromEntries(new URL(req.url).searchParams);

  if (!search) {
    return NextResponse.json({ message: "Search query is required" }, { status: 400 });
  }

  const institutions = await prisma.user.findMany({
    where: {
      role: { in: ["INSTITUTION", "SHOP_OWNER"] },
      OR: [
        { city: { contains: search, mode: "insensitive" } },
        { state: { contains: search, mode: "insensitive" } },
        { zipCode: { contains: search, mode: "insensitive" } },
        { country: { contains: search, mode: "insensitive" } },
        { firmName: { contains: search, mode: "insensitive" } },
        { shopAddress: { contains: search, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      firmName: true,
      city: true,
      state: true,
      zipCode: true,
      profilePhoto: true,
      latitude: true,
      longitude: true,
    },
  });

  return NextResponse.json(institutions);
}
