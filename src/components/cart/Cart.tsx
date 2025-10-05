"use client";

import React, { useCallback, useEffect,useState } from "react";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";

//third-party
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faMinus,
  faTrash,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

//components
import CheckoutModal from "../category/components/checkout-modal/CheckoutModal";
import CouponCard from "./components/coupon-card/CouponCard";

//context
import { useAuth } from "@/lib/context/authContext";

//slices
import {
  useAddToCartMutation,
  useDeleteFromCartMutation,
  useGetAllCartItemsQuery,
} from "@/lib/slices/cartApiSlice";

//types
import { CartProps } from "./types";
import { useLazyGetCartPreOrderQuery } from "@/lib/slices/orderApiSlice";
import { useTranslations } from "next-intl";


const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  //hooks
  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [offerId,setOfferId] = useState<string>();
  const [couponCode,setCouponCode] = useState<string>();
  const { isLoggedIn, user } = useAuth();
  const router = useRouter();

  //slices
  const [addToCart] = useAddToCartMutation();
  const [deleteFromCart] = useDeleteFromCartMutation();
  const { data: cartItemsData } = useGetAllCartItemsQuery();
  const [getCartPreOrder,{ data: preOrderData}] = useLazyGetCartPreOrderQuery();

  const t = useTranslations('HomePage.cart');

  const totals = preOrderData?.cartWithGSTbreakup?.reduce(
    (acc, item) => {
      const discount = item.basePrice - item.discountedPrice;
      return {
        basePrice: acc.basePrice + item.basePrice,
        discount: acc.discount + discount,
        discountedPrice: acc.discountedPrice + item.discountedPrice,
        deliveryFee: item.deliveryFee,
        cgst: acc.cgst + item.cgstRate,
        sgst: acc.sgst + item.sgstRate,
        totalPrice: acc.totalPrice + item.totalPrice,
      };
    },
    { basePrice: 0, discountedPrice: 0, deliveryFee: 0, discount: 0, cgst: 0, sgst: 0, totalPrice: 0 }
  );

  const handleLogin = useCallback(() => {
    params.set("signIn", "true");
    router.push(`?${params.toString()}`);
  }, [params, router]);

  const updateCart = useCallback(
    async (newQuantity: number, productId: string, variantId: string) => {
      if (!user) return;
      try {
        await addToCart({ productId, productVariantId: variantId, quantity: newQuantity }).unwrap().then(() => getCartPreOrder({}));
      } catch {
        toast.error(t('failed_to_update_cart'));
      }
    },
    [addToCart, user]
  );

  const handleIncrementQuantity = useCallback(
    async (
      action: "increment" | "decrement",
      quantity: number,
      productId: string,
      variantId: string
    ) => {
      const newQuantity =
        action === "increment" ? quantity + 1 : quantity - 1;
      await updateCart(newQuantity, productId, variantId);
    },
    [updateCart]
  );

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await deleteFromCart(id);
        toast.success(t('item_removed_success'));
      } catch {
        toast.error(t('failed_to_remove_item'));
      }
    },
    [deleteFromCart]
  );

  const handleCheckout = () => {
    setIsCheckoutOpen(true);
  };

  const deliveryFee = 50;

  useEffect(() => {
    getCartPreOrder({})
  },[])

  useEffect(() => {
    if(offerId || couponCode){
      getCartPreOrder({id:offerId,couponCode:couponCode}).unwrap().then(() => toast.success(t('offer_applied')))
    }
  },[offerId,couponCode])


  if (!isOpen) return null;

  return (
    <div
      className="fixed top-0 right-0 h-full w-full lg:w-[400px] bg-white z-50 overflow-y-auto"
      style={{ transition: "transform 0.3s ease-in-out"}}
    >
      {/* Cart Header */}
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-xl font-semibold">{t('your_cart')}</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>
      </div>

      {isLoggedIn ? (
        <>
          <div className="p-4 space-y-4 overflow-y-auto max-h-[70vh]">
            {cartItemsData?.result?.length === 0 ? (
              <p className="text-gray-500 text-center mt-10">
                {t('your_cart_empty')} 😔
              </p>
            ) : (
              cartItemsData?.result?.map((item) => (
                <div
                  key={item?.productId}
                  className="flex items-center gap-3 border rounded-lg p-3"
                >
                  <Image
                    src={item?.image[0]}
                    alt={item?.productName}
                    width={60}
                    height={60}
                    className="rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="font-medium">{item?.productName}</h3>
                    <div className="flex gap-[4px]">
                      <p className="text-sm text-gray-500">
                        ₹{Math.round(item?.discountPrice)}
                      </p>
                      {item?.discountPrice !== item?.price && (
                        <div className="flex items-center space-x-2">
                          <span className="font-normal line-through text-gray-500 text-sm">
                            ₹{Math.round(item?.price)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (item?.quantity === 1) {
                          handleDelete(item?.id)
                        } else {
                          handleIncrementQuantity(
                            "decrement",
                            item?.quantity,
                            item?.productId,
                            item?.variantId
                          );
                        }
                      }}
                      className="p-1 border rounded hover:bg-gray-100"
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => {
                        handleIncrementQuantity(
                          "increment",
                          item?.quantity,
                          item?.productId,
                          item?.variantId
                        );
                      }}
                      className="p-1 border rounded hover:bg-gray-100"
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      handleDelete(item?.id);
                    }}
                    className="ml-2 text-red-500 hover:text-red-700"
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              ))
            )}
          </div>

          {cartItemsData && cartItemsData?.result?.length > 0 && (
            <CouponCard  setOfferId={setOfferId} setCouponCode={setCouponCode} couponCode={couponCode} totalOrderAmount={preOrderData?.finalAmount}/>
          )}

          {cartItemsData && cartItemsData?.result?.length > 0 && preOrderData && (
            <div className="w-full max-w-md mx-auto bg-white p-5 space-y-3">
              <h2 className="text-lg font-semibold text-gray-800">{t('cart_summary')}</h2>

              {/* Base price */}
              <div className="flex justify-between text-sm text-gray-700">
                <span>{t('items_price')}</span>
                <span>₹{totals?.discountedPrice.toFixed(2)}</span>
              </div>

              {/* Delivery */}
              <div className="flex justify-between text-sm text-gray-700">
                <span>{t('delivery_fee')}</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>

              {/* Taxes */}
              <div className="flex justify-between text-sm text-gray-700">
                <span>{t('cgst')}</span>
                <span>₹{totals?.cgst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-700">
                <span>{t('sgst')}</span>
                <span>₹{totals?.sgst.toFixed(2)}</span>
              </div>

              {/* Final */}
              <div className="border-t pt-3 flex justify-between text-base font-semibold text-gray-900">
                <span>{t('total_payable')} <p className="text-xs text-gray-500">{`(${t(`incl_all_taxes_charges`)})`}</p></span>
                <span>₹{preOrderData?.finalAmount.toFixed(2)}</span>
              </div>

              <button
                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition"
                onClick={() => handleCheckout()}
              >
                {t('proceed_to_checkout')}
              </button>
            </div>
          )}

          <CheckoutModal
            couponCode={couponCode}
            offerId={offerId}
            isOpen={isCheckoutOpen}
            onClose={() => setIsCheckoutOpen(false)}
          />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <div className="mx-auto bg-white rounded-2xl shadow-lg p-8 flex flex-col items-center max-w-xs border">
            <h3 className="text-lg font-semibold mb-4 text-[#181111] text-center">
              {t('please_login_to_access_cart')}
            </h3>
            <button
              className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full font-semibold shadow transition"
              onClick={() => handleLogin()}
            >
              {t('login')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
