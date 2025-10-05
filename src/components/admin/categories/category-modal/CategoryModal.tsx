import React from "react";

//types
import { Category } from "../types";

export default function CategoryModal({
  category,
  open,
  onClose,
}: {
  category: Category | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!open || !category) return null;
  return (
    <div className="fixed inset-0 z-30 flex items-center justify-center bg-black bg-opacity-40">
      <div className="m-3 bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md relative animate-fadeIn">
        <button className="absolute top-4 right-4 text-2xl" onClick={onClose}>
          &times;
        </button>
        <h2 className="text-xl font-bold mb-4">Category Details</h2>
        <div className="mb-2">
          <span className="font-semibold">Name:</span> {category.name}
        </div>
        <div className="mb-4">
          <span className="font-semibold">Product Count:</span>{" "}
          {category.productCount}
        </div>
        <div className="mb-2 font-semibold">Products:</div>
        <ul className="mb-4">
          {category.products.map((p: string, idx: number) => (
            <li key={idx}>{p}</li>
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
