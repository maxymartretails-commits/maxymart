"use client";

import React, { useState } from "react";

//third-party
import {
  faTimes,
  faChevronDown,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

//types
import { OfferResponse } from "@/lib/types/offers";
import { useTranslations } from "next-intl";
import Info from "../info/Info";

const CouponModal = ({
  isOpen,
  onClose,
  coupons,
  setOfferId,
  setCouponCode,
  couponCode,
  totalOrderAmount,
}: {
  isOpen: boolean;
  onClose: () => void;
  setOfferId: (id: string) => void;
  setCouponCode: (name: string) => void;
  coupons?: OfferResponse;
  couponCode?: string;
  totalOrderAmount?: number;
}) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const t = useTranslations("HomePage");

  const handleApplyOffer = (id: string) => {
    setOfferId(id);
  };

  const handleDisabledApply = (endDate: string | Date) => {
    const currentDate = new Date();
    const expiryDate = new Date(endDate);
    return expiryDate.getTime() < currentDate.getTime();
  };

  const sortedCoupons = coupons?.offer?.slice().sort((a, b) => {
    const aExpired = handleDisabledApply(a.endDate);
    const bExpired = handleDisabledApply(b.endDate);

    if (aExpired === bExpired) return 0;
    return aExpired ? 1 : -1;
  });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-50 h-[900px] rounded-3xl p-5 shadow-xl animate-slide-up">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-lg font-bold text-gray-800">
            {t("cart.apply_coupon")}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        {/* Coupon Input */}
        <div className="flex items-center bg-gray-100 rounded-full px-3 py-2 mb-4">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            placeholder="Enter Coupon Code"
            className="flex-1 bg-transparent outline-none text-sm px-2"
          />
          <button className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-4 py-1.5 rounded-full shadow">
            {t("cart.apply")}
          </button>
        </div>

        {/* <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-700 text-xs px-3 py-2 rounded-lg mb-5">
                    <FontAwesomeIcon
                        icon={faExclamationTriangle}
                        className="text-yellow-600"
                    />
                    Items in your cart may not be eligible for coupons
                </div> */}
        {/* Coupon List */}
        <div className="space-y-4 overflow-y-auto h-[700px]">
          {sortedCoupons?.map((coupon) => {
            const isMinOrderValid =
              Number(totalOrderAmount?.toFixed(2)) <=
              Number(coupon?.minOrderValue);
            return (
              <div key={coupon?.id} className="mb-4">
                <div
                  key={coupon?.id}
                  className={`flex border rounded-2xl shadow-md overflow-hidden transition relative
                ${
                  handleDisabledApply(coupon?.endDate)
                    ? "bg-gray-100 text-gray-400 opacity-80 cursor-not-allowed"
                    : "bg-white hover:shadow-lg"
                }`}
                >
                  {/* Left Discount Banner */}
                  <div className="bg-gradient-to-b from-emerald-400 to-teal-600 text-white font-bold text-xs flex items-center justify-center px-2 w-14 rotate-180 [writing-mode:vertical-rl]">
                    {coupon.type === "PERCENTAGE"
                      ? `${coupon?.discountValue}%`
                      : `₹${coupon?.discountValue}`}
                  </div>

                  {/* Right Content */}
                  <div className="flex-1 p-4 flex flex-col">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold uppercase text-sm text-gray-800">
                          {coupon?.title}
                        </h3>
                        <p className="text-sm mt-1">{coupon?.description}</p>
                        {/* + MORE Button */}
                        <button
                          onClick={() =>
                            setExpandedId(
                              expandedId === coupon?.id ? null : coupon?.id
                            )
                          }
                          disabled={handleDisabledApply(coupon?.endDate)}
                          className="flex items-center gap-1 text-xs font-semibold text-blue-600 mt-1 hover:underline 
                            disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:no-underline"
                        >
                          {expandedId === coupon?.id
                            ? `${t("cart.hide_terms")}`
                            : `+${t("cart.more")}`}
                          <FontAwesomeIcon
                            icon={faChevronDown}
                            className={`w-3 h-3 transition-transform ${expandedId === coupon?.id ? "rotate-180" : ""}`}
                          />
                        </button>
                      </div>

                      {/* Apply Button */}
                      <button
                        className="ml-3 
                        bg-blue-50 text-blue-600 
                        hover:bg-blue-100 
                        text-xs font-bold 
                        px-3 py-1.5 rounded-full 
                        disabled:bg-gray-300 
                        disabled:text-gray-500 
                        disabled:cursor-not-allowed 
                        disabled:hover:bg-gray-300"
                        disabled={
                          handleDisabledApply(coupon.endDate) || isMinOrderValid
                        }
                        onClick={() => handleApplyOffer(coupon.id)}
                      >
                        {t("cart.apply")}
                      </button>
                    </div>
                    {expandedId === coupon.id && (
                      <ul className="list-disc pl-5 text-xs text-gray-600 mt-3 space-y-1">
                        {" "}
                        <li>{t("cart.coupon_valid_once")}</li>{" "}
                        <li>
                          {t("cart.min_order_value")} ₹
                          {coupon?.minOrderValue || 0} {t("cart.its_important")}
                        </li>{" "}
                        <li>{t("cart.tax_delivery_not_discounted")}</li>{" "}
                        <li>{t("cart.cannot_combine_offers")}</li>{" "}
                        <li>{t("cart.company_offer_withdraw")}</li>{" "}
                      </ul>
                    )}
                  </div>
                </div>
                {isMinOrderValid && (
                  <div className="mt-2">
                    <Info
                      message={t("cart.offer_valid_message", {
                        minOrderValue: Number(coupon?.minOrderValue),
                      })}
                      type="info"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CouponModal;
