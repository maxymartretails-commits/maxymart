"use client";

import React, { useState } from "react";

//components
import StatsCard from "./stats-card/StatsCard";
import SalesChart from "./sales-chart/SalesChart";

//constants
import { mockStats } from "./constants";
import { useAuth } from "@/lib/context/authContext";

//slices
import { useGetLowStocksQuery, useGetProductsQuery } from "@/lib/slices/productsApiSlice";
import { useGetAllOrdersQuery } from "@/lib/slices/orderApiSlice";

//utils
import { timeAgo } from "@/lib/utils/utils";

const Dashboard = () => {
  const [dark, setDark] = useState(false);
  const { user } = useAuth();
  const { data: productsData } = useGetProductsQuery();
  const { data: ordersData } = useGetAllOrdersQuery();
  const { data: lowStockData } = useGetLowStocksQuery();

  const firstName = user?.name
    ? user.name.split(" ")[0].replace(/^./, (c: string) => c.toUpperCase())
    : "";

  return (
    <div className="min-h-screen">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <img
            src={user?.image || 'assets/noProfile.svg'}
            alt="Admin Avatar"
            className="w-16 h-16 rounded-full border-4 border-blue-500 shadow"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {firstName}!
            </h1>
            <p className="text-gray-500">
              Here’s what’s happening in your store today.
            </p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatsCard
          icon={
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 7h18M3 12h18M3 17h18"
              />
            </svg>
          }
          label="Total Products"
          value={productsData?.totalCount || 0}
          gradient="bg-gradient-to-tr from-green-400 to-green-600"
        />
        <StatsCard
          icon={
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 17v-6a2 2 0 012-2h2a2 2 0 012 2v6m-6 0h6"
              />
            </svg>
          }
          label="Total Orders"
          value={ordersData?.totalCount || 0}
          gradient="bg-gradient-to-tr from-blue-400 to-blue-600"
        />
        <StatsCard
          icon={
            <svg
              className="w-10 h-10"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 8v4l3 3"
              />
            </svg>
          }
          label="Low Stock"
          value={lowStockData?.lowStocksProductsCount || 0}
          gradient="bg-gradient-to-tr from-red-400 to-red-600"
        />
      </div>
      <SalesChart
        data={ordersData?.totalSales || []}
        days={mockStats.salesDays}
        dark={dark}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="rrounded-xl shadow-md p-6 overflow-x-auto max-h-[286px]">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Recent Activity
          </h2>
          <ul className="space-y-4">
            {ordersData?.orders.map((order, index) => (
              <li key={order?.id} className="flex items-center space-x-4">
                <span className="inline-block w-3 h-3 rounded-full bg-blue-500"></span>
                <div className="flex-1">
                  <div className="text-gray-800 font-medium">
                    Order <span className="font-mono">{`ORD - ${index}`}</span>{" "}
                    {order.status === "pending"
                      ? "placed"
                      : order.status === "delivered"
                        ? "delivered"
                        : "delivered"}{" "}
                    by {order?.user?.name}
                  </div>
                  <div className="text-xs text-gray-400">
                    {timeAgo(order.createdAt)} • {`₹${order?.total}`}
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${order.status === "pending" ? "bg-yellow-100 text-yellow-800" : order.status === "delivered" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}
                >
                  {order.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-xl shadow-md p-6 overflow-x-auto max-h-[286px]">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">
            Low Stock Products
          </h2>
          <ul className="divide-y divide-gray-200">
            {lowStockData?.lowStocksProducts?.map((product) => (
              <li key={product.name} className="flex items-center py-3">
                <img
                  src={product.images[0] || ''}
                  alt={product.name}
                  className="w-12 h-12 rounded-full mr-4 border-2 border-red-400"
                />
                <div className="flex-1">
                  <div className="text-gray-900 font-semibold">
                    {product.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    Stock:{" "}
                    <span className="text-red-600 font-bold">
                      {product.variants[0]?.stock || 0}
                    </span>
                  </div>
                </div>
                <svg
                  className="w-6 h-6 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 16h-1v-4h-1m1-4h.01"
                  />
                </svg>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
