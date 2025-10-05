"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

//third-party
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";

//hooks & utils
import { useLatLngByPincode } from "@/lib/hooks/useLatLngByPincode";
import { useAppDispatch } from "@/lib/hooks";
import { getDistanceFromLatLonInKm } from "@/lib/utils/utils";

//slices
import { useGetDeliveryZoneQuery } from "@/lib/slices/deliverableZoneApiSlice";
import { setLocationData } from "@/lib/slices/userLocationSlice";

export default function NotDeliverablePage() {
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [pinCode, setPinCode] = useState("");
  const { data: deliveryData } = useGetDeliveryZoneQuery();
  const { latLng, loading } = useLatLngByPincode(pinCode);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const isDeliverableZone = deliveryData?.filter((location) => location.district === "Sikar");
  const distance = isDeliverableZone && getDistanceFromLatLonInKm(Number(isDeliverableZone[0]?.latitude), Number(isDeliverableZone[0]?.longitude), Number(latLng?.lat), Number(latLng?.lng));
  const adminDistance = isDeliverableZone && isDeliverableZone[0]?.radiusKm;

  const handleCheckDeliverable = () => {
    if (Number(distance) <= Number(adminDistance)) {
      dispatch(
        setLocationData({
          address: latLng?.addr,
          pincode: String(pinCode),
          latitude: Number(latLng?.lat),
          longitude: Number(latLng?.lng),
          addressByPincode: true
        })
      );
      router.push('/');
    } else {
      toast.error("Sorry we don't deliver to this location")
    }
  };

  return (
    <main
      className="flex flex-col items-center justify-center bg-gray-50 text-center px-6"
      style={{ height: "calc(100vh - 166px)" }}
    >
      <div className="bg-white p-10 rounded-2xl shadow-lg max-w-md w-full">
        <FontAwesomeIcon
          icon={faMapMarkerAlt}
          className="mx-auto mb-6 text-red-500"
          size="4x"
        />
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Sorry, we do not deliver to your location yet.
        </h1>
        <p className="text-gray-600 mb-6">
          We’re constantly expanding our services. Please check back soon or
          try delivering to another location.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="inline-block bg-red-600 text-white px-6 py-3 rounded-xl shadow hover:bg-red-700 transition"
          >
            Go Back Home
          </Link>

          <button
            onClick={() => setShowAddressForm(!showAddressForm)}
            className="inline-block border border-red-400 text-gray-700 px-6 py-3 rounded-xl shadow-sm hover:bg-gray-100 transition"
          >
            Deliver to Another Location
          </button>
        </div>

        {/* Show address input if clicked */}
        {showAddressForm && (
          <div className="mt-6">
            <input
              type="text"
              placeholder="Enter Pin Code"
              className="border px-4 py-2 rounded-lg w-full mb-3"
              value={pinCode}
              onChange={(e) => setPinCode(e.target.value)}
            />
            <button
              onClick={handleCheckDeliverable}
              disabled={loading === true ? true : false}
              className="w-full bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition"
            >
              Check Availability
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
