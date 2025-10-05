import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id as string;

        if (!userId) {
            return NextResponse.json(
                { message: "user id missing" },
                { status: 404 }
            );

        }

        const { searchParams } = new URL(request.url);
        const offerId = searchParams.get('id');

        await prisma.offers.delete({
            where: {
                id: String(offerId)
            }
        })

        return NextResponse.json({
            message: "Offer deleted successfully"
        })
    } catch (error: any) {
        return NextResponse.json(
            {
                message: error.message || "Internal Server Error",
            },
            { status: 500 }
        );
    }
}