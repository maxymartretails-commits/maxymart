import { deleteCartItemsById } from "@/app/services/cartItemsService";
import { authOptions } from "@/lib/authOptions";
import { validateAccess } from "@/lib/roles/validateAccess";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id") as string;
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id as string;

    if (!userId) {
      return NextResponse.json(
        { message: "userId is missing" },
        { status: 404 }
      );
    }

    const hasAccess = await validateAccess({
      resource: "cart",
      action: "delete",
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

    await deleteCartItemsById(id);

    return NextResponse.json({
      message: "product deleted from cart successfully",
    });
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
