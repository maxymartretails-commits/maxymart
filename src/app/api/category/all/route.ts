import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Always fetch all categories with subcategories
    const categories = await prisma.category.findMany({
      select: { name: true, image: true, id: true },
    });

    return NextResponse.json({
      categories,
    });
  } catch (error: any) {
    console.error("Category API error:", error);
    return NextResponse.json(
      { message: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
