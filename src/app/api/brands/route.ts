import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const brands = await prisma.brand.findMany();
        return NextResponse.json(brands);
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
                { message: "userId is missing" },
                { status: 400 }
            );
        }

        const { name, image } = await request.json();

        const brand = await prisma.brand.create({
            data: {
                name,
                image
            }
        })

        return NextResponse.json({
            message: 'Brand added successfully',
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
        const brandId = searchParams.get('id');

        const body = await request.json();

        await prisma.brand.update({
            where: {
                id: String(brandId)
            },
            data: {
                ...body
            }
        })

        return NextResponse.json({
            message: "Brand updated successfully"
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
        const brandId = searchParams.get('id');

        await prisma.brand.delete({
            where: {
                id: String(brandId)
            }
        })

        return NextResponse.json({
            message: "Brand deleted successfully"
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

