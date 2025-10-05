"use client";

import React, { useEffect,useState } from "react";
import toast from "react-hot-toast";
import dynamic from "next/dynamic";
import Image from "next/image";

//third-party
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faMinus } from "@fortawesome/free-solid-svg-icons";

//components
const ProductModal = dynamic(() => import("@/components/product-modal/ProductModal"), {
  ssr: false, // only render on client
});

//slices
import {
  useAddToCartMutation,
  useGetAllCartItemsQuery,
} from "@/lib/slices/cartApiSlice";
import { decrementQuantity, incrementQuantity, removeItem } from "@/lib/slices/cartSlice";

//context & hooks
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { useAuth } from "@/lib/context/authContext";

//types
import { ProductCardProps } from "./types";
import { useLocale, useTranslations } from "next-intl";


const ProductCard: React.FC<ProductCardProps> = ({
  id,
  title,
  description,
  price,
  stock,
  variantId,
  variants,
  category,
  discountedPrice,
  quantityText = "1 pack (200g)",
  image,
}) => {
  //hooks
  const [quantity, setQuantity] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { user } = useAuth();
  const locale = useLocale();

  const t = useTranslations('HomePage.category');

  //slices
  const [addToCart] = useAddToCartMutation();
  const { data: cartItems } = useGetAllCartItemsQuery();

  const isProductInCart = cartItems?.result?.filter(item => item.productId === id)

  const cartItem = useAppSelector((state) => state.cart.items);
  const cartItemQuantity = cartItem?.find(item => item.id === id);

  const product = {
    id: id,
    title: title,
    description: description,
    price: price,
    variantId: variantId,
    variants: variants,
    stock: stock,
    category: category,
    tags: ["category"],
    image: image,
  };

  const updateCart = async (newQuantity: number) => {
    const payload = {
      productId: id,
      productVariantId: variantId,
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
            id,
            name: title,
            image,
            price,
            productVariantId: variantId,
            quantity: newQuantity,
          })
        );
      } else {
        if (newQuantity === 0) {
          dispatch(removeItem({ id }))
        }
        dispatch(
          decrementQuantity({
            id,
          })
        );
      }
    }
    setQuantity(newQuantity);
  };

  const handleAddButton = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    const newQuantity = quantity + 1;
    await updateCart(newQuantity);
    toast.success("Product added successfully to cart");
  };

  const handleQuantity = async (action: "increment" | "decrement") => {
    const newQty = action === "increment" ? quantity + 1 : quantity !== 1 ? quantity - 1 : 0;
    if (newQty < 0) return;
    await updateCart(newQty);
  };

  useEffect(() => {
    if (isProductInCart && isProductInCart?.length > 0) {
      setQuantity(isProductInCart[0]?.quantity)
    };
  }, [isProductInCart]);


  useEffect(() => {
    if (cartItemQuantity) {
      setQuantity(cartItemQuantity?.quantity);
    }
  }, [cartItemQuantity])


  return (
    <>
      <article
        className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow hover:shadow-lg transition-transform duration-300 ease-in-out cursor-pointer hover:-translate-y-1"
        onClick={() => setIsModalOpen(true)}
      >
        {/* Product Image */}
        <div className="relative flex justify-center w-[150px] h-[150px] mx-auto">
          <Image
            src={image}
            alt={title}
            width={150}
            height={150}
            className="p-4"
            priority
          />
        </div>

        {/* Product Info */}
        <div className="p-4">
          {/* Price and Quantity Controls */}
          <div className="flex gap-1 items-center font-bold mb-2">
            <p className="text-lg font-semibold">
              ₹{Math.round(Number(discountedPrice))}
            </p>
            {discountedPrice !== price && (
              <div className="flex items-center space-x-2">
                <span className="font-normal line-through text-gray-500 text-lg">
                  ₹{Math.round(price)}
                </span>
                <span className="text-xs font-medium text-green-600">
                  {locale === 'hi' ? `₹${Math.round(price - Number(discountedPrice))} ${t('save')}` : `${t('save')} ₹${Math.round(price - Number(discountedPrice))}`}
                </span>
              </div>
            )}
            <div>
              {quantity === 0 ? (
                <button
                  onClick={(e) => handleAddButton(e)}
                  className="bg-red-600 text-white rounded-full px-3 py-1 text-sm font-semibold shadow hover:bg-red-700"
                >
                  {t('add')}
                </button>
              ) : (
                <div className="flex items-center bg-red-600 text-white rounded-full px-3 py-1 gap-2 text-sm font-semibold">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuantity("decrement");
                    }}
                    className="hover:text-gray-200"
                  >
                    <FontAwesomeIcon icon={faMinus} />
                  </button>
                  <span>{quantity}</span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuantity("increment");
                    }}
                    className="hover:text-gray-200"
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </div>
              )}
            </div>
          </div>
          {variants && <p className="text-xs text-[#586274]">{`1 pack (${variants[0]?.unitSize} ${variants[0]?.unit})`}</p>}
          {/* Title & Subtitle */}
          <h2 className="text-base font-semibold text-gray-900 mb-1">
            {title}
          </h2>
        </div>
      </article>

      {/* Product Modal */}
      <ProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
      />
    </>
  );
};

export default ProductCard;
