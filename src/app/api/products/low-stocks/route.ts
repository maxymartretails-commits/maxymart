import { authOptions } from "@/lib/authOptions";
import { validateAccess } from "@/lib/roles/validateAccess";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id as string;

    const hasAccess = await validateAccess({
      resource: "stock",
      action: "view",
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

    const lowStocksProducts = await prisma.product.findMany({
      where: {
        variants: {
          some: {
            stock: { lt: 60 },
          },
        },
      },
      include: {
        variants: {
          where: {
            stock: {
              lt: 60,
            },
          },
          select: {
            id: true,
            stock: true,
            productId: true,
          },
        },
      },
    });

    const lowStocksProductsCount = await prisma.productVariant.count({
      where: {
        stock: {
          lt: 30,
        },
      },
    });

    return NextResponse.json({
      lowStocksProducts: lowStocksProducts,
      lowStocksProductsCount: lowStocksProductsCount,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        message: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
