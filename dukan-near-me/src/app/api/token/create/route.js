import { prisma } from "@/utils/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || session.user.role !== 'INSTITUTION') {
            return new Response(JSON.stringify({ error: 'Unauthorized: Only institutions can create tokens' }), { status: 401 });
        }

        const { userId, name, phoneNumber } = await req.json();
        const institutionId = session.user.id;
        var newToken;
        const lastToken = await prisma.token.findFirst({
            where: { institutionId },
            orderBy: { tokenNumber: 'desc' },
        });
        const tokenNumber = lastToken ? lastToken.tokenNumber + 1 : 1;
        const expiresAt = new Date();
        expiresAt.setHours(24, 0, 0, 0); 
        if (userId) {
            newToken = await prisma.token.create({
                data: {
                    tokenNumber,
                    userId,
                    institutionId,
                    expiresAt,
                },
            });

        }else{
            if(!name || !phoneNumber){
                return new Response(JSON.stringify({ error: 'Name and phone number are required' }), { status: 400 });
            }
            
            newToken = await prisma.token.create({
                data: {
                    tokenNumber,
                    name,
                    phoneNumber,
                    institutionId,
                    expiresAt,
                },
            });
        }

        if (global.io) {
            global.io.emit('tokenUpdated', { institutionId, newToken });
        }
        return new Response(JSON.stringify(newToken), { status: 201 });
        
    } catch (error) {
        console.error("Error creating token:", error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
