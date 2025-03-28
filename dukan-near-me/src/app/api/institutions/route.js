import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";

export const GET = async () => {
  try {
    const institutions = await prisma.user.findMany({ where: { role: "INSTITUTION" } });
    return NextResponse.json({ data: institutions }, { status: 200 });
  } catch (error) {
    console.log("error",error);
    return NextResponse.json({ message: "Failed to fetch institutions", error }, { status: 500 });
  }
};


// export const POST = async (req) => {
//   try {
//     const { name } = await req.json();

//     if (!name) {
//       return NextResponse.json({ message: "Institution name is required" }, { status: 400 });
//     }

//     const institution = await prisma.institution.create({
//       data: { name },
//     });

//     return NextResponse.json({ data: institution }, { status: 201 });
//   } catch (error) {
//     return NextResponse.json({ message: "Failed to create institution", error }, { status: 500 });
//   }
// };
