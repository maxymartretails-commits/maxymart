import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { validateAccess } from "@/lib/roles/validateAccess";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    console.log("session", session);
    const userId = session?.user?.id as string;

    if (!userId) {
      return NextResponse.json(
        { message: "userId is missing" },
        { status: 404 }
      );
    }

    const hasAccess = await validateAccess({
      resource: "cart",
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

    const userCartItems = await prisma.cartItem.findMany({
      where: {
        userId: userId,
        deleted: false,
      },
      include: { productVariant: true, product: true },
    });

    const formattedRes = userCartItems.map((cart) => ({
      id: cart.id,
      productName: cart.product.name,
      price: cart.productVariant?.price,
      unit: cart.productVariant?.unit,
      unitSize: cart.productVariant?.unitSize,
      quantity: cart.quantity,
      image: cart.product.images,
      productId: cart.productId,
      variantId: cart.productVariantId,
      discountPrice:Number(cart?.productVariant?.discountedPrice) * cart.quantity
    }));

    return NextResponse.json({ result: formattedRes });
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
