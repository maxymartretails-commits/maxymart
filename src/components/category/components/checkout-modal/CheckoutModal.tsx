"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

// third-party
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCreditCard,
  faMoneyBillWave,
  faTimes,
  faWallet,
} from "@fortawesome/free-solid-svg-icons";

// hooks
import { useAppSelector } from "@/lib/hooks";

// slices & context
import { useGetAllCartItemsQuery } from "@/lib/slices/cartApiSlice";
import {
  useLazyGetCartPreOrderQuery,
  usePlaceOrdersMutation,
} from "@/lib/slices/orderApiSlice";
import { useAuth } from "@/lib/context/authContext";

// types
import { CheckoutModalProps } from "./types";
import { useTranslations } from "next-intl";
import toast from "react-hot-toast";

type PaymentMethod = "COD" | "UPI" | "Card";

const paymentMethods: PaymentMethod[] = ["COD", "UPI", "Card"];

const iconsMap: Record<PaymentMethod, any> = {
  COD: faMoneyBillWave,
  UPI: faWallet,
  Card: faCreditCard,
};

const colorsMap: Record<PaymentMethod, string> = {
  COD: "text-green-600",
  UPI: "text-purple-600",
  Card: "text-blue-600",
};

const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  offerId,
  couponCode,
}) => {
  const { user } = useAuth();

  // slices
  const { address: userAddress } = useAppSelector(
    (state) => state.userLocation
  );
  const { data: cartItemsData } = useGetAllCartItemsQuery(undefined, {
    skip: !isOpen,
  });
  const t = useTranslations("HomePage.checkout");
  const [getCartPreOrder, { data: preOrderData }] =
    useLazyGetCartPreOrderQuery();

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
    {
      basePrice: 0,
      discountedPrice: 0,
      deliveryFee: 0,
      discount: 0,
      cgst: 0,
      sgst: 0,
      totalPrice: 0,
    }
  );
  const [placeOrders, { isLoading: isPlacing }] = usePlaceOrdersMutation();

  // parse address safely (avoid 'state' naming confusion)
  const [streetParsed, stateName, country] = userAddress?.split(",") || [];

  // accessibility refs
  const modalRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  // lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  // Esc to close
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [isOpen, onClose]);

  // basic focus trap
  useEffect(() => {
    if (!isOpen || !modalRef.current) return;
    const focusable = modalRef.current.querySelectorAll<HTMLElement>(
      'button, [href], input, textarea, select, [tabindex]:not([tabindex="-1"])'
    );
    focusable[0]?.focus();
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    const trap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last?.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first?.focus();
      }
    };

    document.addEventListener("keydown", trap);
    return () => document.removeEventListener("keydown", trap);
  }, [isOpen]);

  const validationSchema = useMemo(
    () =>
      Yup.object({
        fullName: Yup.string().trim().required(t(`name_is_required`)),
        phone: Yup.string()
          .trim()
          .matches(/^[6-9]\d{9}$/, t(`valid_phone`))
          .required(t(`phone_is_required`)),
        address: Yup.string().trim().required(t(`address_is_required`)),
        doorno: Yup.string().trim().required(t(`door_is_required`)),
        area: Yup.string().trim().required(t(`street_is_required`)),
        landmark: Yup.string().trim().nullable(),
        pincode: Yup.string()
          .trim()
          .matches(/^\d{6}$/, t(`valid_pincode`))
          .required(t(`pincode_required`)),
        paymentMethod: Yup.mixed<PaymentMethod>()
          .oneOf(
            paymentMethods as readonly PaymentMethod[],
            t(`select_a_payment_method`)
          )
          .required(t(`payment_required`)),
      }),
    []
  );

  const formik = useFormik({
    initialValues: {
      fullName: "",
      phone: "",
      address: userAddress || "",
      doorno: "",
      area: streetParsed || "",
      landmark: "",
      pincode: "",
      deliveryMethod: "standard",
      paymentMethod: "" as "" | PaymentMethod,
    },
    validationSchema,
    onSubmit: async (vals) => {
      if (!cartItemsData?.result?.length) {
        toast.error(t(`your_cart_empty`));
        return;
      }

      const products = cartItemsData.result.map((item) => ({
        productId: item.productId,
        productVariantId: item.variantId,
        quantity: item.quantity,
      }));

      const deliveryFee = 50;
      const payload = {
        products,
        street: vals.area,
        flatNo: vals.doorno,
        offerId: offerId,
        couponCode: couponCode,
        state: stateName?.trim() || "",
        city: stateName?.trim() || "",
        country: country?.trim() || "India",
        landmark: vals.landmark,
        zipCode: vals.pincode,
        paymentMethod:
          (vals.paymentMethod as PaymentMethod)?.toLowerCase() ?? "cod",
        address: vals.address,
        deliveryFee,
        phone: vals.phone,
        fullName: vals.fullName,
      };

      try {
        let data: any;
        await placeOrders(payload)
          .unwrap()
          .then((res: any) => {
            data = res?.data?.placeOrder?.placeOrder?.order;
          })
          .catch((err) => toast.error(err?.data.message));

        if (!data?.id || !data?.amount) {
          return;
        }

        if ((vals.paymentMethod as PaymentMethod)?.toLowerCase() !== "cod") {
          openRazorpayCheckout(data, vals);
        }
      } catch (err) {
        toast.error(t(`something_went_wrong`));
      }

      resetForm();
      onClose();
    },
  });

  const {
    values: {
      fullName,
      phone,
      address,
      doorno,
      area,
      landmark,
      pincode,
      paymentMethod,
    },
    resetForm,
    errors,
    touched,
    handleChange,
    setFieldValue,
    handleSubmit,
  } = formik;

  const deliveryFee = 50;

  const openRazorpayCheckout = (
    orderData: { id: string; amount: number; currency?: string },
    vals: typeof formik.values
  ) => {
    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
      amount: orderData.amount,
      currency: orderData.currency || "INR",
      name: "Maxymart",
      description: "Order Payment",
      order_id: orderData.id,
      handler: async (response: any) => {
        try {
          const verifyRes = await fetch("/api/payment/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              orderId: orderData.id,
            }),
          });

          if (!verifyRes.ok) throw new Error("Payment verification failed");
          toast.error(t("payment_successful"));
          onClose();
        } catch (err) {
          console.error("Payment verification failed:", err);
          toast.error(t("payment_successful_verification_failed"));
        }
      },
      prefill: {
        name: vals.fullName || "",
        email: user?.email || "",
        contact: vals.phone || "",
      },
      theme: { color: "#dc2626" },
    };

    const razorpay = new (window as any).Razorpay(options);
    razorpay.open();
  };

  useEffect(() => {
    getCartPreOrder({});
  }, []);

  useEffect(() => {
    if (offerId || couponCode) {
      getCartPreOrder({ id: offerId, couponCode: couponCode });
    }
  }, [offerId, couponCode]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="checkout-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        ref={modalRef}
        className="relative mx-auto mt-10 w-[min(95vw,40rem)] max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl ring-1 ring-black/5
                   animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white/80 px-5 py-4 backdrop-blur">
          <h2 id="checkout-title" className="text-xl font-bold">
            {t("checkout")}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="space-y-6 px-5 py-5">
          {/* Customer Details */}
          <section aria-labelledby="customer-details" className="space-y-3">
            <h3 id="customer-details" className="font-semibold">
              {t("customer_details")}
            </h3>

            <div className="grid grid-cols-1 gap-3">
              <div>
                <input
                  name="fullName"
                  type="text"
                  value={fullName}
                  onChange={handleChange}
                  placeholder={t("full_name")}
                  className="w-full rounded-lg border px-3 py-2 
             focus:border-blue-500 focus:outline-none 
             focus:ring-2 focus:ring-blue-200"
                  aria-invalid={!!(touched.fullName && errors.fullName)}
                  aria-describedby={
                    touched.fullName && errors.fullName
                      ? "err-fullName"
                      : undefined
                  }
                />
                {touched.fullName && errors.fullName && (
                  <p id="err-fullName" className="mt-1 text-sm text-red-600">
                    {errors.fullName}
                  </p>
                )}
              </div>

              <div>
                <input
                  name="phone"
                  type="tel"
                  value={phone}
                  onChange={handleChange}
                  placeholder={t("phone")}
                  className="w-full rounded-lg border px-3 py-2 
             focus:border-blue-500 focus:outline-none 
             focus:ring-2 focus:ring-blue-200"
                  aria-invalid={!!(touched.phone && errors.phone)}
                  aria-describedby={
                    touched.phone && errors.phone ? "err-phone" : undefined
                  }
                  onKeyPress={(e) => {
                    if (!/[0-9]/.test(e.key)) {
                      e.preventDefault();
                    }
                  }}
                  maxLength={10}
                />
                {touched.phone && errors.phone && (
                  <p id="err-phone" className="mt-1 text-sm text-red-600">
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>
          </section>

          {/* Address */}
          <section aria-labelledby="address-section" className="space-y-3">
            <h3 id="address-section" className="font-semibold">
              {t("address")}
            </h3>

            <div className="grid grid-cols-1 gap-3">
              <div>
                <input
                  name="address"
                  type="text"
                  value={address}
                  onChange={handleChange}
                  placeholder={t("full_address")}
                  className="w-full rounded-lg border px-3 py-2 
             focus:border-blue-500 focus:outline-none 
             focus:ring-2 focus:ring-blue-200"
                  aria-invalid={!!(touched.address && errors.address)}
                />
                {touched.address && errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <input
                    name="doorno"
                    type="text"
                    value={doorno}
                    onChange={handleChange}
                    placeholder={t("door_flat_no")}
                    className="w-full rounded-lg border px-3 py-2 
             focus:border-blue-500 focus:outline-none 
             focus:ring-2 focus:ring-blue-200"
                    aria-invalid={!!(touched.doorno && errors.doorno)}
                  />
                  {touched.doorno && errors.doorno && (
                    <p className="mt-1 text-sm text-red-600">{errors.doorno}</p>
                  )}
                </div>

                <div>
                  <input
                    name="area"
                    type="text"
                    value={area}
                    onChange={handleChange}
                    placeholder={t("street_area")}
                    className="w-full rounded-lg border px-3 py-2 
             focus:border-blue-500 focus:outline-none 
             focus:ring-2 focus:ring-blue-200"
                    aria-invalid={!!(touched.area && errors.area)}
                  />
                  {touched.area && errors.area && (
                    <p className="mt-1 text-sm text-red-600">{errors.area}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <input
                    name="landmark"
                    type="text"
                    value={landmark}
                    onChange={handleChange}
                    placeholder={t("landmark_optional")}
                    className="w-full rounded-lg border px-3 py-2 
             focus:border-blue-500 focus:outline-none 
             focus:ring-2 focus:ring-blue-200"
                  />
                </div>

                <div>
                  <input
                    name="pincode"
                    type="tel"
                    value={pincode}
                    maxLength={6}
                    onChange={handleChange}
                    placeholder={t("pincode")}
                    className="w-full rounded-lg border px-3 py-2 
             focus:border-blue-500 focus:outline-none 
             focus:ring-2 focus:ring-blue-200"
                    aria-invalid={!!(touched.pincode && errors.pincode)}
                  />
                  {touched.pincode && errors.pincode && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.pincode}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </section>

          {/* Payment */}
          <section aria-labelledby="payment-method" className="space-y-3">
            <h3 id="payment-method" className="font-semibold">
              {t("payment_method")}
            </h3>

            <div className="grid grid-cols-1 gap-2">
              {paymentMethods.map((method) => {
                const selected = paymentMethod === method;
                return (
                  <label
                    key={method}
                    className={`flex items-center gap-3 rounded-xl border p-3 transition
  ${
    selected
      ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
      : "border-gray-200 hover:border-gray-300 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200"
  }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method}
                      checked={selected}
                      onChange={() => setFieldValue("paymentMethod", method)}
                      className="sr-only"
                    />
                    <FontAwesomeIcon
                      icon={iconsMap[method]}
                      className={`${colorsMap[method]} text-xl`}
                    />
                    <span className="select-none">
                      {method === "COD"
                        ? `${t("cash_on_delivery")}`
                        : method === "UPI"
                          ? `${t("upi_wallet")}`
                          : `${t("credit_debit_card")}`}
                    </span>
                  </label>
                );
              })}
            </div>
            {touched.paymentMethod && errors.paymentMethod && (
              <p className="mt-1 text-sm text-red-600">
                {errors.paymentMethod as string}
              </p>
            )}
          </section>

          {/* Order Summary */}
          <section
            aria-labelledby="order-summary"
            className="space-y-3 border-t pt-4"
          >
            <h3 id="order-summary" className="font-semibold">
              {t("order_summary")}
            </h3>

            <div className="space-y-2 text-gray-700">
              {cartItemsData?.result?.map((item) => (
                <div key={item.productId} className="flex justify-between">
                  <span className="truncate">
                    {item.productName} × {item.quantity}
                  </span>

                  <span className="flex gap-[4px] items-center">
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
                  </span>
                </div>
              ))}
              <div className="flex justify-between">
                <span>CGST</span>
                <span>₹{totals?.cgst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>SGST</span>
                <span>₹{totals?.sgst.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("delivery_fee")}</span>
                <span>₹{deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span>{t("total")}</span>
                <span>₹{preOrderData?.finalAmount}</span>
              </div>
            </div>
          </section>

          {/* Footer */}
          <div className="sticky bottom-0 z-10 -mx-5 border-t bg-white/80 px-5 py-4 backdrop-blur">
            <button
              type="submit"
              disabled={isPlacing}
              className="w-full rounded-lg bg-red-600 py-3 font-medium text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
              aria-busy={isPlacing}
            >
              {isPlacing ? `${t("processing")}...` : `${t("proceed_to_pay")}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutModal;
