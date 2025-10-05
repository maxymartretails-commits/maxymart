import React from "react";

//third-party
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

//slices
import { useDeleteDeliveryZoneMutation } from "@/lib/slices/deliverableZoneApiSlice";

//types
import { DeleteLocationModalProps } from "./types";

const DeleteLocationModal: React.FC<DeleteLocationModalProps> = ({
  isOpen,
  onClose,
  details,
}) => {
  const [deleteDeliveryZone] = useDeleteDeliveryZoneMutation();
  const handleDelete = async () => {
    await deleteDeliveryZone({ id: details?.id }).unwrap()
      .then(() => {
        toast.success("Delivery Zone deleted successfully!!!");
        onClose();
      })
      .catch(() => {
        toast.error("Something went wrong!!!");
      });
  };
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 border border-gray-200">
        {/* Icon */}
        <div className="flex justify-center">
          <div className="bg-red-100 p-3 rounded-full">
            <FontAwesomeIcon
              icon={faTriangleExclamation}
              className="h-8 w-8 text-red-600"
            />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-center text-xl font-semibold text-gray-900 mt-4">
          Delete Category
        </h2>

        {/* Description */}
        <p className="text-center text-sm text-gray-500 mt-2">
          Are you sure you want to remove{" "}
          <span className="font-medium text-gray-800">
            {details?.name || ""}
          </span>{" "}
          ? <br /> This action{" "}
          <span className="text-red-500">cannot be undone</span>.
        </p>

        {/* Buttons */}
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-gray-300 hover:bg-gray-100 text-gray-700 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-5 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium shadow-md"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteLocationModal;
