import { NextResponse } from "next/server";
import { validateRequest } from "@/app/lib/validateRequest";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { userLocationSchema } from "./userLocationSchema";
import { createAddressRecord } from "@/app/services/addressService";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const session = await getServerSession(authOptions);
    const userId = session?.user.id;

    if (!userId) {
      return NextResponse.json({ message: "user id missing" }, { status: 404 });
    }

    const addressObj = {
      userId: userId,
      city: body.city,
      country: body.country,
      zipCode: body.zipCode,
      state: body.state,
      latitude: parseFloat(body.latitude),
      longitude: parseFloat(body.longitude),
    };
    console.log({ addressObj });

    const validation = await validateRequest(body, userLocationSchema);

    if (!validation.success) {
      return NextResponse.json({ errors: validation.error }, { status: 400 });
    }

    const address = await createAddressRecord(addressObj);

    console.log({ address });
    if (!address.id) {
      return NextResponse.json(
        { message: "error while creating address record" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "user location updated succesfully" },
      { status: 200 }
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
