import { prisma } from "@/utils/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'INSTITUTION') {
            return new Response(JSON.stringify({ error: 'Unauthorized: Only institutions can update tokens' }), { status: 401 });
        }

        const { tokenId } = await req.json();
        if (!tokenId) {
            return new Response(JSON.stringify({ error: 'Token ID is required' }), { status: 400 });
        }

        const token = await prisma.token.findUnique({ where: { id: tokenId } });

        if (!token) {
            return new Response(JSON.stringify({ error: 'Token not found' }), { status: 404 });
        }

        const updatedToken = await prisma.token.update({
            where: { id: tokenId },
            data: { completed: true },
        });

        if (global.io) {
            global.io.emit("tokenCompleted", { institutionId: token.institutionId, tokenId });
        }

        return new Response(JSON.stringify(updatedToken), { status: 200 });
    } catch (error) {
        console.error("Error updating token:", error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
