"use client";

//third-party
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import {
  faTimes,
  faDownload,
  faPrint,
} from "@fortawesome/free-solid-svg-icons";

//types
import { OrderDetailsModalProps } from "./types";


export default function OrderDetailsModal({
  isOpen,
  order,
  onClose,
}: OrderDetailsModalProps) {
  const handleDownloadPDF = async () => {
    const input = document.getElementById("print-section");
    if (input) {
      const canvas = await html2canvas(input);
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      const paddingX = 10; // left/right padding
      const paddingY = 20; // top padding

      const contentWidth = pdfWidth - paddingX * 2; // width after padding
      const contentHeight = (canvas.height * contentWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", paddingX, paddingY, contentWidth, contentHeight);

      pdf.save("order-details.pdf");
    }
  };
  if (!isOpen) return null;

  return (
    <>
      <div id="print-section">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-bold">Order #{order?.id}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <FontAwesomeIcon icon={faTimes} size="lg" />
          </button>
        </div>

        {/* Customer Info */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-700">Customer Info</h3>
          <p>
            <span className="font-medium">Name:</span> {order?.user?.name}
          </p>
          <p>
            <span className="font-medium">Email:</span> {order?.user?.email}
          </p>
          <p>
            <span className="font-medium">Address:</span> {order?.address?.street},{order?.address?.city},{order?.address?.state},{order?.address?.country}
          </p>
          <p>
            <span className="font-medium">Pin Code:</span>{order?.address?.zipCode}
          </p>
          <p>
            <span className="font-medium">Phone:</span> {order?.user?.phoneNumber}
          </p>
        </div>

        {/* Order Details */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-700">Order Details</h3>
          <p>
            <span className="font-medium">Date:</span> {order?.createdAt}
          </p>
          <p>
            <span className="font-medium">Payment:</span> {order?.payments[0]?.method || ""}
          </p>
          <p>
            <span className="font-medium">Status:</span> {order?.status}
          </p>
        </div>

        {/* Products Table */}
        <div className="mb-4">
          <h3 className="font-semibold text-gray-700 mb-2">Products</h3>
          <table className="w-full border border-gray-200 rounded-lg">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Product</th>
                <th className="p-2 border">Quantity</th>
                <th className="p-2 border">Price (₹)</th>
                <th className="p-2 border">GST</th>
                <th className="p-2 border">Delivery Fee</th>
                <th className="p-2 border">Subtotal (₹)</th>
              </tr>
            </thead>
            <tbody>
              {order?.items?.map((item, idx) => (
                <tr key={idx} className="text-sm">
                  <td className="p-2 border">{item?.product?.name}</td>
                  <td className="p-2 border text-center">{item?.quantity}</td>
                  <td className="p-2 border text-right">{item?.price}</td>
                  <td className="p-2 border text-right">{order?.gstTotal}</td>
                  <td className="p-2 border text-right">{order?.deliveryFee}</td>
                  <td className="p-2 border text-right">
                    {item?.quantity * item?.price}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center border-t pt-3 pb-3">
          <span className="font-semibold text-lg">Total:</span>
          <span className="font-bold text-xl text-green-600">
            ₹{order?.total}
          </span>
        </div>

        {/* Actions */}
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button className="flex items-center gap-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200" onClick={() => window.print()}>
          <FontAwesomeIcon icon={faPrint} /> Print
        </button>
        <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700" onClick={() => handleDownloadPDF()}>
          <FontAwesomeIcon icon={faDownload} /> Download Invoice
        </button>
      </div>
    </>
  );
}
