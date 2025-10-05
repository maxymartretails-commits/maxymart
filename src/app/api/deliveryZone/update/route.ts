import { NextResponse } from "next/server";
import { validateAccess } from "@/lib/roles/validateAccess";
import { validateRequest } from "@/app/lib/validateRequest";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { deliveryZoneSchema } from "../add/deliveryZoneSchema";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const session = await getServerSession(authOptions);
        const userId = session?.user.id;

        if (!userId) {
            return NextResponse.json({ message: "user id missing" }, { status: 404 });
        }

        const { searchParams } = new URL(request.url);
        const locationId = searchParams.get('id');

        const { latitude, longitude, radiusKm, zoneName, state, district } = body;

        const validation = await validateRequest(body, deliveryZoneSchema);

        if (!validation.success) {
            return NextResponse.json({ errors: validation.error }, { status: 400 });
        }

        const hasAccess = await validateAccess({
            resource: "deliveryZone",
            action: "create",
            userId: userId,
        });

        if (!hasAccess) {
            return NextResponse.json(
                {
                    message:
                        "Access denied. You do not have permission to access this route.",
                },
                { status: 403 }
            );
        }

        await prisma.deliveryZone.update({
            where: {
                id: String(locationId)
            },
            data: {
                name: zoneName,
                latitude: latitude,
                longitude: longitude,
                radiusKm: radiusKm,
                state: state,
                district: district
            }
        })

        return NextResponse.json(
            { message: "delivery zone created succesfully" },
            { status: 201 }
        );
    } catch (error: any) {
        console.error("Internal server error", error);
        return NextResponse.json(
            {
                message: error.message || "Internal Server Error",
            },
            { status: 500 }
        );
    }
}
