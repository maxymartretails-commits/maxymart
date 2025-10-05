"use client";

import React from "react";
import Image from "next/image";
import { formatDateTime } from "@/lib/utils/utils";

interface OrderItem {
    id: string;
    product: {
        name: string;
        images: string[];
    };
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    createdAt: string;
    items: OrderItem[];
    total: number;
    status: string;
    deliveryAddress: string;
}

interface OrderModalProps {
    order: Order;
    isOpen: boolean;
    onClose: () => void;
}

const OrderDetailModal: React.FC<OrderModalProps> = ({ order, isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
                >
                    ×
                </button>

                {/* Header */}
                <header className="flex items-start justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-3">
                            <span
                                className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm capitalize ${order.status === "delivered"
                                    ? "bg-green-100 text-green-700"
                                    : order.status === "cancelled"
                                        ? "bg-red-100 text-red-700"
                                        : order.status === "shipped"
                                            ? "bg-yellow-100 text-yellow-700"
                                            : "bg-gray-100 text-gray-700"
                                    }`}
                            >
                                <span
                                    className={`w-2 h-2 rounded-full ${order.status === "delivered"
                                        ? "bg-green-600"
                                        : order.status === "cancelled"
                                            ? "bg-red-600"
                                            : order.status === "shipped"
                                                ? "bg-yellow-600"
                                                : "bg-gray-600"
                                        }`}
                                ></span>
                                {order.status}
                            </span>
                        </h1>
                    </div>
                </header>

                {/* Order Details */}
                <section className="border border-gray-100 rounded-xl p-6 mb-6">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                        <div>
                            <p className="text-xs uppercase text-gray-500">Order ID</p>
                            <p className="font-semibold">{order.id}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase text-gray-500">Order placed at</p>
                            <p className="font-medium">{formatDateTime(order?.createdAt)}</p>
                        </div>
                        <div>
                            <p className="text-xs uppercase text-gray-500">Delivery address</p>
                            <p className="font-medium">{order.deliveryAddress}</p>
                        </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-4">
                        <h2 className="text-lg font-semibold">{order.items.length} item{order.items.length > 1 ? "s" : ""} in order</h2>
                        {order.items.map((item) => (
                            <div key={item.id} className="flex items-start gap-4 p-4 border border-gray-100 rounded-xl">
                                <Image
                                    src={item.product.images[0]}
                                    alt={item.product.name}
                                    width={80}
                                    height={80}
                                    className="rounded-lg object-cover border"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="font-semibold truncate">{item.product.name}</p>
                                    <p className="text-sm text-gray-600">Qty: {item.quantity} × ₹{item.price}</p>
                                    <p className="text-sm text-gray-600">Total: ₹{item.quantity * item.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bill Summary */}
                    <div className="mt-6">
                        <h3 className="text-lg font-semibold mb-3">Bill Summary</h3>
                        <div className="overflow-hidden rounded-xl border border-gray-100 mb-4">
                            <table className="w-full text-sm">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="text-left font-medium text-gray-600 px-4 py-3">Description</th>
                                        <th className="text-right font-medium text-gray-600 px-4 py-3">Amount</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-t">
                                        <td className="px-4 py-3">Total</td>
                                        <td className="px-4 py-3 text-right">₹{order.total}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </section>

                {/* Footer Actions */}
                <div className="flex flex-wrap gap-3">
                    <button className="px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 font-medium" onClick={onClose}>
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderDetailModal;
