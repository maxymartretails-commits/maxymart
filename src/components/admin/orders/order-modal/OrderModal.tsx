import React from "react";

//types
import { Order } from "../types";

//constants
import { statusColors } from "../constants";

export default function OrderModal({
  order,
  open,
  onClose,
}: {
  order: Order | null;
  open: boolean;
  onClose: () => void;
}) {
  type Status = keyof typeof statusColors;
  if (!open || !order) return null;
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-40">
      <div className="m-3 bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fadeIn">
        <button
          className="absolute top-4 right-4 text-2xl"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">
          Order Details
        </h2>
        <div className="mb-2 ">
          <span className="font-semibold">Order ID:</span> {order.id}
        </div>
        <div className="mb-2 ">
          <span className="font-semibold">Customer:</span> {order.customer}
        </div>
        <div className="mb-2 ">
          <span className="font-semibold">Date:</span> {order.date}
        </div>
        <div className="mb-2 ">
          <span className="font-semibold">Status:</span>{" "}
          <span
            className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[order.status as Status]}`}
          >
            {order.status}
          </span>
        </div>
        <div className="mb-4 ">
          <span className="font-semibold">Total:</span> $
          {order.total.toFixed(2)}
        </div>
        <div className="mb-2 font-semibold">
          Items:
        </div>
        <ul className="mb-4">
          {order.items.map((item, idx) => (
            <li
              key={idx}
              className="flex justify-between "
            >
              <span>
                {item.name} x{item.qty}
              </span>
              <span>${(item.price * item.qty).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-end">
          <button
            className="px-4 py-2 rounded bg-blue-600 text-white font-semibold shadow hover:bg-blue-700 transition"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
