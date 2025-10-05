"use client";

import { useFormik } from "formik";
import { useMemo } from "react";
import toast from "react-hot-toast";
import isNil from "lodash.isnil";

//constants
import { rajasthanData, states } from "@/constants/constants";

//slices
import { useAddDeliveryZoneMutation, useUpdateDeliveryZoneMutation } from "@/lib/slices/deliverableZoneApiSlice";

//types
import { Location } from "@/lib/types/location";


const INITIAL_REVIEW_FORM_VALUES = {
  name: "",
  latitude: "",
  longitude: "",
  state: "",
  district: "",
  radiusKm: "",
};
const AddLocationModal = ({
  isOpen,
  onClose,
  details,
}: {
  isOpen: boolean;
  onClose: () => void;
  details?: Location;
}) => {
  const [addDeliveryZone] = useAddDeliveryZoneMutation();
  const [updateDeliveryZone] = useUpdateDeliveryZoneMutation();

  const isEdit = details;

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

  const { name, latitude, longitude, state, district, radiusKm } = values;

  const selectedDistrict = rajasthanData?.filter((data) => data?.district === district)

  const handleAddBrand = async () => {
    const payload = {
      latitude: String(selectedDistrict[0]?.latitude),
      longitude: String(selectedDistrict[0]?.longitude),
      radiusKm: Number(radiusKm),
      state: state,
      district: district,
      zoneName: name
    }

    if (details) {
      await updateDeliveryZone({
        id: details.id,
        body: payload,
      }).unwrap()
        .then(() => {
          toast.success("Category updated successfully");
          resetForm();
          onClose();
        })
        .catch(() => {
          toast.error("Something went wrong");
        });
    } else {
      await addDeliveryZone(payload).unwrap()
        .then(() => {
          toast.success("Delivery Zone added successfully");
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
        <h2 className="text-xl font-semibold mb-4">{`${isEdit ? "Edit Location" : "Add Location"}`}</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setFieldValue("name", e.target.value)}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring}`}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">State</label>
            <select
              name="state"
              value={state}
              onChange={(e) => setFieldValue("state", e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            >
              <option value="">Select Type</option>
              {states.map((state) => (
                <>
                  <option value={state.name}>{state.name}</option>
                </>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">District</label>
            <select
              name="district"
              value={district}
              onChange={(e) => setFieldValue("district", e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            >
              <option value="">Select Type</option>
              {rajasthanData?.map((data) => (
                <option value={data?.district}>{data?.district}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Latitude</label>
            <input
              type="text"
              name="latitude"
              value={selectedDistrict ? selectedDistrict[0]?.latitude : latitude}
              disabled={true}
              onChange={(e) => setFieldValue("latitude", selectedDistrict ? selectedDistrict[0]?.longitude : '')}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring}`}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Longitude</label>
            <input
              type="text"
              name="longitude"
              value={selectedDistrict ? selectedDistrict[0]?.longitude : longitude}
              onChange={(e) => setFieldValue("longitude", selectedDistrict ? selectedDistrict[0]?.longitude : "")}
              disabled={true}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring}`}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Radius In KM</label>
            <input
              type="text"
              name="radius"
              value={radiusKm}
              onChange={(e) => setFieldValue("radiusKm", e.target.value)}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring}`}
            />
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
            {`${isEdit ? "Update" : "Add"}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddLocationModal;
