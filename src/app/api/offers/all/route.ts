// app/api/offers/route.ts
import { getAllOffer } from "@/app/services/offerService";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const offers = await getAllOffer();
    return NextResponse.json({ success: true, offer: offers }, { status: 200 });
  } catch (error: any) {
    console.error("Internal Server Error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
