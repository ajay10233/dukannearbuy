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

export const PUT = async (req, { params }) => {
  try {
    const { id } = params;
    const { name } = await req.json();

    if (!name) {
      return NextResponse.json({ message: "Institution name is required" }, { status: 400 });
    }

    const updatedInstitution = await prisma.institution.update({
      where: { id },
      data: { name },
    });

    return NextResponse.json({ data: updatedInstitution, message: "Institution updated successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to update institution", error: error.message }, { status: 500 });
  }
};

import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";

export const DELETE = async (req, { params }) => {
  try {
    const { id } = params;

    await prisma.institution.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Institution deleted successfully" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Failed to delete institution", error }, { status: 500 });
  }
};
