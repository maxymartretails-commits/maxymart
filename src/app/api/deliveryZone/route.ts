import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id as string;

        if (!userId) {
            return NextResponse.json(
                { message: "userId is missing" },
                { status: 400 }
            );
        }
        const locations = await prisma.deliveryZone.findMany();
        return NextResponse.json(locations);
    } catch (error: any) {
        return NextResponse.json(
            {
                message: error.message || "Internal Server Error",
            },
            { status: 500 }
        );
    }
}

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
        const locationId = searchParams.get('id');

        await prisma.deliveryZone.delete({
            where: {
                id: String(locationId)
            }
        })

        return NextResponse.json({
            message: "delivery zone deleted successfully"
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