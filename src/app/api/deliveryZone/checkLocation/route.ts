import { NextResponse } from "next/server";
import { isUserWithinRadius } from "@/app/services/locationService";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;
    const { searchParams } = new URL(request.url);

    const latitude = searchParams.get("latitude") as string;
    const longitude = searchParams.get("longitude") as string;

    if (!latitude && !longitude) {
      return NextResponse.json(
        { message: "longitude and latitude is required" },
        { status: 404 }
      );
    }

    if (!userId) {
      return NextResponse.json({ message: "user id missing" }, { status: 404 });
    }

    const userZone = await isUserWithinRadius(latitude, longitude);
    if (userZone.isWithinRadius) {
      return NextResponse.json({
        message: `User is within the ${userZone.zoneName} delivery zone`,
        success: true,
      });
    }

    return NextResponse.json(
      {
        success: false,
        message: "Sorry, we do not deliver to your location yet.",
      },
      { status: 400 }
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
