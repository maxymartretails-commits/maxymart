import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { validateRequest } from "../../lib/validateRequest";
import { addToCartSchema } from "./addToCartSchema ";
import { getUserById } from "@/app/services/userService";
import { validateAccess } from "@/lib/roles/validateAccess";
import { deleteCartItemsById } from "@/app/services/cartItemsService";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user.id as string;

    if (!userId) {
      return NextResponse.json(
        { message: "userId is missing" },
        { status: 404 }
      );
    }
    const userData = await getUserById(userId);

    if (!userData) {
      return NextResponse.json({ message: "user not found" }, { status: 404 });
    }

    const body = await request.json();
    const { productId, productVariantId, quantity } = body;

    const validation = await validateRequest(body, addToCartSchema);

    if (!validation.success) {
      return NextResponse.json({ errors: validation.error }, { status: 400 });
    }

    const hasAccess = await validateAccess({
      resource: "cart",
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

    // If no variant passed, use the first one
    let baseProductVariantId = productVariantId;
    if (!baseProductVariantId) {
      const variant = await prisma.productVariant.findFirst({
        where: { productId },
      });
      baseProductVariantId = variant?.id;
      if (!baseProductVariantId) {
        return NextResponse.json(
          { message: "No variant found" },
          { status: 400 }
        );
      }
    }

    // Check if item is already in cart
    const existingCartItem = await prisma.cartItem.findFirst({
      where: {
        userId,
        productId,
        productVariantId: baseProductVariantId,
        deleted: false,
      },
    });

    // If exists → update quantity
    if (existingCartItem) {
      if (Number(quantity) <= 0 && !isNaN(Number(quantity))) {
        await deleteCartItemsById(existingCartItem.id);

        return NextResponse.json({
          message: "Cart item removed successfully",
        });
      }
      await prisma.cartItem.update({
        where: { id: existingCartItem.id },
        data: { quantity },
      });

      return NextResponse.json({
        message: "Cart item updated successfully",
      });
    }

    // If not exists → create new cart item
    await prisma.cartItem.create({
      data: {
        quantity,
        productId,
        productVariantId: baseProductVariantId,
        userId,
      },
    });

    return NextResponse.json({
      message: "Product added to cart successfully",
    });
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
