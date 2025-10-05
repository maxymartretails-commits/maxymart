import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { validateAccess } from "@/lib/roles/validateAccess";
import sendMail from "@/lib/sendEmail/sendEmail";
import { getVerificationEmailHtml } from "@/lib/sendEmail/veificationEmail";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { message: "userId is required" },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { message: "userId is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findMany({
      where: { id: userId },
    });

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const htmlTemplate = getVerificationEmailHtml(code);

    const email = user[0]?.email;
    if (!email) {
      return NextResponse.json(
        { message: "User email not found" },
        { status: 400 }
      );
    }

    await sendMail(email, "Your Verification Code", htmlTemplate);
    return NextResponse.json({ user: user });
  } catch (error: any) {
    console.log("Internal server error", error);
    return NextResponse.json(
      {
        message: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
