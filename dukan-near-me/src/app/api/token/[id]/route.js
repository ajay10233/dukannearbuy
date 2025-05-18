

export async function GET(req, { params }) {
    const param = await params;
    const id = await param.id;
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const token = await prisma.token.findUnique({
        where: { id: id },
    });
    return NextResponse.json(token, { status: 200 });
}