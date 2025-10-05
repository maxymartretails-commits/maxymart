"use client";

import { useFormik } from "formik";
import { useMemo } from "react";
import toast from "react-hot-toast";
import isNil from "lodash.isnil";

//types
import { Order } from "@/lib/types/order";

//slices
import { useUpdateOrderStatusMutation } from "@/lib/slices/orderApiSlice";

const INITIAL_REVIEW_FORM_VALUES = {
  status: "",
  paymentStatus: "",
};
const EditOfferModal = ({
  isOpen,
  onClose,
  details,
}: {
  isOpen: boolean;
  onClose: () => void;
  details?: Order;
}) => {
  const [updateOrderStatus] = useUpdateOrderStatusMutation();

  const initialFormValues = useMemo(
    () => (!isNil(details) ? { ...details } : INITIAL_REVIEW_FORM_VALUES),
    [details]
  );

  const { values, setFieldValue, resetForm } = useFormik({
    initialValues: initialFormValues,
    onSubmit: () => {
      console.log("submitted");
    },
  });

  const { status, paymentStatus } = values;

  const handleAddBrand = async () => {
    const payload = {
      status: status,
      paymentStatus: paymentStatus,
    };

    if (details) {
      await updateOrderStatus({
        id: details.id,
        body: payload,
      }).unwrap()
        .then(() => {
          toast.success("Order updated successfully");
          resetForm();
          onClose();
        })
        .catch(() => {
          toast.error("Something went wrong");
        });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full p-6 shadow-lg relative">
        <h2 className="text-xl font-semibold mb-4">Update Order Status</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block mb-1 font-medium">Payment Status</label>
            <select
              name="paymentStatus"
              value={paymentStatus}
              disabled={details?.payments[0]?.method !== 'COD'}
              onChange={(e) => setFieldValue("paymentStatus", e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            >
              <option value="">Select Status</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="paid">Paid</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Order Status</label>
            <select
              name="status"
              value={status}
              onChange={(e) => setFieldValue("status", e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            >
              <option value="">Select Status</option>
              <option value="pending">Pending</option>
              <option value="delivered">delivered</option>
              <option value="placed">Placed</option>
              <option value="canceled">Canceled</option>
            </select>
          </div>
        </form>
        <div className="flex justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white transition"
            onClick={() => handleAddBrand()}
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditOfferModal;
