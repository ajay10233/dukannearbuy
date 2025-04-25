import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/utils/db";
import { NextResponse } from "next/server";

export async function GET(req) {
    const session = await getServerSession(authOptions)
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(req.url)
    const username = searchParams.get('username')
  
    if (!username) {
      return NextResponse.json({ error: 'Username query parameter is required.' }, { status: 400 })
    }
  
    try {
      const user = await prisma.user.findUnique({
        where: {
          username: username,
        },
        select: {
          id: true,
        },
      })
  
      return NextResponse.json({ available: !user })
    } catch (error) {
      console.error('Error checking username:', error)
      return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}