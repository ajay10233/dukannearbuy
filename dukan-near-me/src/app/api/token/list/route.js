
import { prisma } from "@/utils/db";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const institutionId = searchParams.get("institutionId");

    if (!institutionId) {
      return new Response(JSON.stringify({ error: "Missing institutionId" }), {
        status: 400,
      });
    }

    const tokens = await prisma.token.findMany({
      where: { institutionId },
      orderBy: { createdAt: "desc" },
    });

    return new Response(JSON.stringify(tokens), { status: 200 });
  } catch (error) {
    console.error("Error fetching tokens:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
