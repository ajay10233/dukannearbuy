import { prisma } from "@/utils/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'INSTITUTION') {
            return new Response(JSON.stringify({ error: 'Unauthorized: Only institutions can create tokens' }), { status: 401 });
        }

        const { userId } = await req.json();
        if (!userId) {
            return new Response(JSON.stringify({ error: 'User ID is required' }), { status: 400 });
        }
        const institutionId = session.user.id;
        const lastToken = await prisma.token.findFirst({
            where: { institutionId },
            orderBy: { tokenNumber: 'desc' },
        });

        const tokenNumber = lastToken ? lastToken.tokenNumber + 1 : 1;

        
        const now = new Date();
        const expiresAt = new Date();
        expiresAt.setHours(24, 0, 0, 0); 

        
        const newToken = await prisma.token.create({
            data: {
                tokenNumber,
                userId,
                institutionId,
                expiresAt,
            },
        });

        //* format:  send it as a direct token update
        if (global.io) {
            global.io.emit('tokenUpdated', { institutionId, newToken });
        }

        return new Response(JSON.stringify(newToken), { status: 201 });
    } catch (error) {
        console.error("Error creating token:", error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
