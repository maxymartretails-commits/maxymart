"use client";

import { useGetRecentOrdersQuery, useReorderOrderMutation } from "@/lib/slices/orderApiSlice";
import { formatDate } from "@/lib/utils/utils";
import Image from "next/image";
import { useState } from "react";
import OrderDetailModal from "./components/order-details-modal/OrderDetailModal";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/lib/hooks";
import { cartApiSlice } from "@/lib/slices/cartApiSlice";
import { useTranslations } from "next-intl";


export default function OrderHistory() {
  const { data: recentOrders } = useGetRecentOrdersQuery();
  const [reorderOrder] = useReorderOrderMutation();
  const [isOrderDetails, setIsOrderDetails] = useState(false);
  const dispatch = useAppDispatch();
  const t = useTranslations('HomePage.profile');

  const handleReorderClick = async (id: string) => {
    await reorderOrder({ orderId: id }).then(() => {
      toast.success("Order added to cart successfully");
      dispatch(cartApiSlice.util.invalidateTags(["Cart"]));
    }).catch(() => {
      toast.error("SOmething went wrong")
    })
  }

  return (
    <div className="pb-6">
      <h2 className="text-xl font-semibold mb-4">{t('orders')}</h2>
      <div className="space-y-6 bg-white rounded-2xl shadow p-6 overflow-auto" style={{ height: "calc(100vh - 444px)" }}>
        {recentOrders?.map((order) => {
          const firstItem = order?.items[0];
          const remainingCount = order?.items?.length - 1;

          return (
            <div
              key={order.id}
              className="border rounded-xl shadow-sm p-4 bg-white"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                <div>
                  <p className="text-gray-600 text-sm">{t('order_id')}: {order?.id}</p>
                  <p className="text-gray-500 text-sm">{formatDate(order?.createdAt)}</p>
                </div>
                <div className="mt-2 md:mt-0 flex items-center gap-4">
                  <span
                    className={`text-sm font-medium px-3 py-1 rounded-full capitalize ${order?.status === "delivered"
                      ? "bg-green-100 text-green-700"
                      : order?.status === "shipped"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                      }`}
                  >
                    {order?.status}
                  </span>
                  <p className="text-lg font-semibold">₹{order?.total}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-3">
                  <div className="flex items-center gap-4">
                    <Image
                      src={firstItem?.product?.images[0]}
                      alt={firstItem?.product?.name}
                      width={60}
                      height={60}
                      className="rounded-lg"
                    />
                    <div>
                      <p className="font-medium">{firstItem?.product?.name}</p>
                      <p className="text-gray-500 text-sm">
                        {t('quantity')}: {firstItem?.quantity} × ₹{firstItem?.price}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold">
                    ₹{firstItem?.quantity * firstItem?.price}
                  </p>
                </div>

                {remainingCount > 0 && (
                  <p className="text-sm text-gray-500 font-medium">
                    +{remainingCount} more item{remainingCount > 1 ? "s" : ""}
                  </p>
                )}
              </div>

              <div className="flex justify-end gap-3 mt-4">
                <button className="px-4 py-2 bg-lime-500 text-white rounded-lg hover:bg-lime-600" onClick={() => handleReorderClick(order.id)}>
                  {t('reorder')}
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100" onClick={() => setIsOrderDetails(true)}>
                  {t('view_details')}
                </button>
              </div>
              <OrderDetailModal onClose={() => setIsOrderDetails(false)} isOpen={isOrderDetails} order={{ id: order.id, createdAt: order.createdAt, deliveryAddress: "1-6-212/65/107/66, Gangaputra colony, Sanjeevipuram", status: order.status, total: order.total, items: order.items }} />
            </div>
          );
        })}
      </div>
    </div>

  );
}
