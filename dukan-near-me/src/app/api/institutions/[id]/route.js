import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";

export const GET = async (req, { params }) => {
  try {
    const { id } = params;

    const institution = await prisma.institution.findUnique({
      where: { id },
    });

    if (!institution) {
      return NextResponse.json({ message: "Institution not found" }, { status: 404 });
    }

    return NextResponse.json({ data: institution }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to fetch institution", error: error.message }, { status: 500 });
  }
};
