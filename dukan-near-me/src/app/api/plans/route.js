
import { NextResponse } from "next/server";
import { prisma } from "@/utils/db";

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 });
    }
    const plans = await prisma.plan.findMany();
    return NextResponse.json(plans);
}
  