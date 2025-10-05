"use client";

import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";

//hooks
import { useRouter, useSearchParams } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

//slices
import { decrementQuantity, incrementQuantity, removeItem } from "@/lib/slices/cartSlice";
import {
  useAddToCartMutation,
  useGetAllCartItemsQuery,
} from "@/lib/slices/cartApiSlice";

//context
import { useAuth } from "@/lib/context/authContext";

//types
import { ProductModalProps } from "./types";
import { useTranslations } from "next-intl";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  product,
  relatedProducts = [],
  onRelatedProductClick,
}) => {
  //hooks
  const [quantity, setQuantity] = useState(0);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const { user } = useAuth();
  const t = useTranslations('HomePage.cart');

  //slices
  const [addToCart] = useAddToCartMutation();
  const { data: cartItemsData } = useGetAllCartItemsQuery();

  const isProductInCart = cartItemsData?.result?.filter(
    (item) => item.productId === product.id
  );
  const cartItem = useAppSelector(state => state.cart.items);
  const cartItemQuantity = cartItem?.find((item) => item?.id === product?.id);
  const productQuantityCount = cartItemsData?.result?.filter(
    (item) => item?.productId === product?.id
  );

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (productQuantityCount && productQuantityCount?.length > 0) {
      setQuantity(productQuantityCount?.[0]?.quantity);
    }

  }, [productQuantityCount, cartItemQuantity]);

  useEffect(() => {
    if (isOpen) {
      if (cartItemQuantity) {
        setQuantity(cartItemQuantity.quantity);
      } else {
        setQuantity(0);
      }
    }
  }, [isOpen, cartItemQuantity]);

  useEffect(() => {
    if (isProductInCart && isProductInCart?.length > 0) {
      setQuantity(isProductInCart[0]?.quantity);
    }
  }, []);

  const handleCartClick = async () => {
    if (quantity === 0) {
      const newQuantity = quantity + 1;
      const payload = {
        productId: product.id,
        productVariantId: product.variantId,
        quantity: newQuantity,
      };

      if (user) {
        await addToCart(payload).unwrap()
          .then(() => toast.success("Product added successfully to cart"))
          .catch(() => toast.error("Failed to add product to cart"));
        setQuantity(newQuantity);
      } else {
        dispatch(
          incrementQuantity({
            id: product.id,
            name: product.title,
            image: product.image,
            price: product.price,
            productVariantId: product.variantId,
            quantity: newQuantity,
          })
        );
        setQuantity(newQuantity);
      }
    } else {
      params.set("open", "true");
      router.push(`?${params.toString()}`);
      onClose();
    }
  };

  const handleOnClose = () => {
    onClose();
    setQuantity(0);
  };

  const updateCart = async (newQuantity: number) => {
    const payload = {
      productId: product.id,
      productVariantId: product.variantId,
      quantity: newQuantity,
    };

    if (user) {
      try {
        await addToCart(payload).unwrap().then(() => setQuantity(newQuantity));
      } catch (error) {
        toast.error("Failed to update cart");
      }
    } else {
      if (newQuantity > quantity) {
        dispatch(
          incrementQuantity({
            id: product.id,
            name: product.title,
            image: product.image,
            price: product.price,
            productVariantId: product.variantId,
            quantity: newQuantity,
          })
        );
      } else {
        if (newQuantity === 0) {
          dispatch(removeItem({ id: product?.id }))
        }
        dispatch(
          decrementQuantity({
            id: product.id,
          })
        );
      }
      setQuantity(newQuantity);
    }
  };

  const handleIncrementQuantity = async (action: "increment" | "decrement") => {
    const newQuantity =
      action === "increment" ? quantity + 1 : quantity !== 1 ? quantity - 1 : 0;
    if (newQuantity < 0) return;
    await updateCart(newQuantity);
  };

  if (!isOpen) return null;

  return (
    <div
      aria-modal="true"
      role="dialog"
      aria-labelledby="product-modal-title"
      aria-describedby="product-modal-description"
      tabIndex={-1}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl m-3 p-6 max-w-xl w-full shadow-lg overflow-y-auto max-h-[90vh] relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 id="product-modal-title" className="text-xl font-semibold">
            {product.title}
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        {/* Image with overlay if out of stock */}
        <div className="flex justify-center mb-4 relative">
          <Image
            src={product.image}
            alt={product.title}
            width={250}
            height={250}
            className="rounded object-contain"
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded">
              <span className="text-red-600 font-bold text-lg">
                Out of Stock
              </span>
            </div>
          )}
        </div>

        {/* Details */}
        <p id="product-modal-description" className="mb-2 text-gray-700">
          {product.description}<br />
        </p>
        <p className="text-xs text-[#586274] mb-2">Net Qty: {product?.variants && <span>{`1 pack (${product?.variants[0]?.unitSize} ${product?.variants[0]?.unit})`}</span>}</p>

        <p className="font-bold text-lg mb-1">
          {product.price.toLocaleString("en-IN", {
            style: "currency",
            currency: "INR",
          })}
        </p>

        {/* Quantity selector */}
        {quantity !== 0 && (
          <div className="flex items-center mb-4" aria-label="Select quantity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleIncrementQuantity("decrement");
              }}
              className="px-3 py-1 border rounded-l bg-gray-100 hover:bg-gray-200"
              disabled={product.stock === 0}
              aria-label="Decrease quantity"
            >
              -
            </button>
            <span className="px-4 py-1 border-t border-b" aria-live="polite">
              {quantity}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleIncrementQuantity("increment");
              }}
              className="px-3 py-1 border rounded-r bg-gray-100 hover:bg-gray-200"
              disabled={quantity === product.stock || product.stock === 0}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        )}

        {/* Add to Cart button */}
        <button
          onClick={() => handleCartClick()}
          className={`w-full py-2 rounded text-white transition ${product.stock === 0
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-red-600 hover:bg-red-700"
            }`}
          disabled={product.stock === 0}
          aria-disabled={product.stock === 0}
        >
          {product.stock === 0
            ? `${t('out_of_stock')}`
            : quantity === 0
              ? `${t('add_to_cart')}`
              : `${t('go_to_cart')}`}
        </button>

        {/* Related Products */}
        {/* {relatedProducts.length > 0 && (
          <section className="mt-6" aria-labelledby="related-products-heading">
            <h4 id="related-products-heading" className="font-semibold mb-2">
              Related Products
            </h4>
            <div className="flex gap-4 overflow-x-auto" role="list">
              {relatedProducts.map((relProd) => (
                <div
                  key={relProd.title}
                  className="min-w-[120px] cursor-pointer"
                  role="listitem"
                  tabIndex={0}
                  onClick={() => onRelatedProductClick?.(relProd)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") onRelatedProductClick?.(relProd);
                  }}
                  aria-label={`View details for ${relProd.title}`}
                >
                  <Image
                    src={relProd.image}
                    alt={relProd.title}
                    width={120}
                    height={120}
                    className="rounded"
                  />
                  <p className="text-sm font-medium mt-1 truncate">
                    {relProd.title}
                  </p>
                  <p className="text-sm text-gray-600">
                    {relProd.price.toLocaleString("en-IN", {
                      style: "currency",
                      currency: "INR",
                    })}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )} */}
      </div>
    </div>
  );
};

export default ProductModal;
