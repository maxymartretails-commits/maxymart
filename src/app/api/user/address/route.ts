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
                    { message: "user id missing" },
                    { status: 404 }
                  );

        }

        const address = await prisma.address.findMany({
            where: {
                userId: userId,
            }
        })

        return NextResponse.json(address)
    } catch (error: any) {
        console.error("Catalog API error:", error);
        return NextResponse.json(
            { message: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function PUT(request: Request) {
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
        const id = searchParams.get('id');

        const body = await request.json();

        await prisma.address.update({
            where: {
                id: String(id),
                userId: userId
            },
            data: {
                ...body
            }
        })

        return NextResponse.json({
            message: "Address updated successfully"
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

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id as string;

        if (!userId) {
                 return NextResponse.json(
                   { message: "user id missing" },
                   { status: 404 }
                 );

        }

        const body = await request.json();

        await prisma.address.create({
            data: {
                ...body,
                user: {
                    connect: { id: userId },
                },
            },
        })

        return NextResponse.json({
            message: "Address added successfully"
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