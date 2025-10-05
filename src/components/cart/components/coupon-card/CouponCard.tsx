"use client";

import React, { useState } from "react";

//slices
import { useGetOffersQuery } from "@/lib/slices/offersApiSlice";

//components
import CouponModal from "../coupon-modal/CouponModal";
import { useTranslations } from "next-intl";
import Info from "../info/Info";

interface CouponCardProps {
  setOfferId: (id: string) => void;
  setCouponCode: (name: string) => void;
  couponCode?: string;
  totalOrderAmount?: number;
}
const CouponCard = ({
  setOfferId,
  setCouponCode,
  couponCode,
  totalOrderAmount,
}: CouponCardProps) => {
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const { data: offers } = useGetOffersQuery();
  const t = useTranslations("HomePage.cart");
  const currentDate = new Date();
  const visibleCoupons = offers?.offer
    ?.filter((item) => {
      const endDate = new Date(item.endDate);
      return endDate.getTime() >= currentDate.getTime();
    })
    .slice(0, 2);

  const handleApplyOffer = (id: string) => {
    setOfferId(id);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4">
      {visibleCoupons?.map((offer) => {
        const isMinOrderValid =
          Number(totalOrderAmount?.toFixed(2)) <= Number(offer?.minOrderValue);


        return (
          <div key={offer?.id} className="mb-4">
            {/* Coupon Card */}
            <div className="flex items-center justify-between bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                  {offer?.type === "PERCENTAGE" ? "%" : "₹"}
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-800 capitalize">
                    {offer?.title}
                  </h4>
                  {offer?.couponCode && (
                    <p className="text-xs text-gray-500 mt-1">
                      Code:{" "}
                      <span className="bg-gray-100 px-2 py-0.5 rounded text-gray-700 font-semibold text-xs">
                        {offer?.couponCode}
                      </span>
                    </p>
                  )}
                </div>
              </div>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-1.5 rounded-full disabled:bg-gray-300 
                        disabled:text-gray-500 
                        disabled:cursor-not-allowed 
                        disabled:hover:bg-gray-300"
                onClick={() => handleApplyOffer(offer?.id)}
                disabled={isMinOrderValid}
              >
                {t("apply")}
              </button>
            </div>

            {/* Info Card under each coupon */}
            {isMinOrderValid && (
              <div className="mt-2">
                <Info
                  message={t("offer_valid_message", { minOrderValue: Number(offer?.minOrderValue) })}
                  type="info"
                />
              </div>
            )}
          </div>
        );
      })}

      <div className="text-center mt-4">
        <button
          onClick={() => setIsCouponModalOpen(true)}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-semibold px-4 py-1.5 rounded-full"
        >
          {t("view_all_coupon")} →
        </button>
      </div>
      <CouponModal
        setOfferId={setOfferId}
        isOpen={isCouponModalOpen}
        onClose={() => setIsCouponModalOpen(false)}
        coupons={offers}
        setCouponCode={setCouponCode}
        couponCode={couponCode}
        totalOrderAmount={totalOrderAmount}
      />
    </div>
  );
};

export default CouponCard;
