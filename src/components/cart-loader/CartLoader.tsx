"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/context/authContext";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useAddToCartMutation, useGetAllCartItemsQuery } from "@/lib/slices/cartApiSlice";
import { setCart } from "@/lib/slices/cartSlice";
import { clearLocalCart, loadCartFromLocal, saveCartToLocal } from "@/lib/utils/localCart";
import { mergeCarts } from "@/lib/utils/mergeCart";

export default function CartLoader() {
  const cartItems = useAppSelector((state) => state.cart.items);
  const dispatch = useAppDispatch();
  const { user } = useAuth();

  const [mergeOnce, setMergeOnce] = useState(false);
  const [isMerging, setIsMerging] = useState(false);

  const { data: cartData } = useGetAllCartItemsQuery(undefined, {
    skip: !user, // only fetch user cart if logged in
  });

  const [addToCart] = useAddToCartMutation();

  const handleMergeCart = async () => {
    setIsMerging(true);

    const guestCart = loadCartFromLocal();
    if (!guestCart.length) {
      setIsMerging(false);
      return;
    }

    const userCart = cartData?.result.map((item) => ({
      id: item?.productId,
      name: item?.productName,
      image: item?.image[0],
      quantity: item?.quantity,
      price: item?.price,
      productVariantId: item?.variantId,
    })) || [];

    const mergedCart = mergeCarts(userCart, guestCart);
    console.log(mergedCart,"mergeCart")

    // Add merged items to server
    await Promise.all(
      mergedCart?.map((item) =>
        addToCart({
          productId: item.id,
          productVariantId: item.productVariantId,
          quantity: item.quantity,
        }).unwrap()
      )
    );

  };

  // Load guest cart on initial render
  useEffect(() => {
    const guestCart = loadCartFromLocal();
    if (guestCart.length > 0) {
      dispatch(setCart(guestCart));
    }
  }, [dispatch]);

  // Save cart to localStorage unless merging
  useEffect(() => {
    if (!isMerging) {
      saveCartToLocal(cartItems);
    }
  }, [cartItems, isMerging]);

  // Merge carts after login (only once)
  useEffect(() => {
    if (user && cartData && !mergeOnce) {
      handleMergeCart();
      clearLocalCart();
      setIsMerging(true);
      setMergeOnce(true);
    }
  }, [user, cartData, mergeOnce,]);

  return null;
}
