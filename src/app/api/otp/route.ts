// /pages/api/send-otp.ts
import { prisma } from "@/lib/prisma";
import { randomInt } from "crypto";
import twilio from "twilio";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { phoneNumber } = body;
    if (!phoneNumber) {
      return NextResponse.json(
        {
          message: "Phone Number is required",
        },
        { status: 404 }
      );
    }

    const otp = randomInt(100000, 999999).toString();
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
    console.log("--- Your OTP ---", otp);

    await prisma.otpCode.create({
      data: {
        phoneNumber: `+91${phoneNumber}`,
        otpHash: otpHash,
        expiresAt: expiresAt,
      },
    });

    // send via Twilio
    const client = twilio(
      process.env.TWILIO_ACCOUNT_SID!,
      process.env.TWILIO_AUTH_TOKEN!
    );

    await client.messages.create({
      body: `Your login OTP is ${otp}`,
      to: `+91${phoneNumber}`,
      from: process.env.TWILIO_PHONE_NUMBER!,
    });

    return new Response(JSON.stringify({ message: "OTP sent" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log("Error in handler", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
