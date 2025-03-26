import { prisma } from "@/utils/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { signOut } from "next-auth/react";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }

  const { sessionToken } = await req.json();
  console.log("seccion token is: ",sessionToken);
  if (sessionToken) {
      // Remove the session from DB
      await prisma.session.deleteMany({
        where: {
          userId: session.user.id,
          token: sessionToken,
        },
      });
    }else{
        signOut({ redirect: false });
    }


  return new Response(JSON.stringify({ message: "Session removed successfully" }), { status: 200 });
}
