import { prisma } from "@/utils/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }

  const { sessionToken } = await req.json();

  if (sessionToken) {
    try {
      // Remove the session from the database
      await prisma.session.deleteMany({
        where: {
          userId: session.user.id, // Ensure this ID format matches the stored userId
          token: sessionToken, // Correct field name
        },
      });
    } catch (error) {
      console.error("Error deleting session:", error);
      return new Response(JSON.stringify({ message: "Error removing session" }), { status: 500 });
    }
  }

  const response = NextResponse.json({ message: "Session removed successfully" }, { status: 200 });
  response.cookies.set("next-auth.session-token", "", { path: "/", httpOnly: true, maxAge: 0 });
  response.cookies.set("next-auth.csrf-token", "", { path: "/", httpOnly: true, maxAge: 0 });
  return response;
}
