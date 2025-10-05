"use client"
import { useAddUserAddressMutation, useEditUserAddressMutation } from "@/lib/slices/userApiSlice";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { useEffect } from "react";
import toast from "react-hot-toast";

interface Address {
  id: string;
  street: string;
  state: string;
  city: string;
  country: string;
  zipCode: string;
} 
interface AddressEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  setIsAdd:(value:boolean) => void;
  address?:Address;
  isAdd:boolean;
}
const AddressEditModal = ({ isOpen, onClose, address,isAdd,setIsAdd }: AddressEditModalProps) => {
  const [editUserAddress] = useEditUserAddressMutation();
  const [addUserAddress] = useAddUserAddressMutation();
  const t = useTranslations('HomePage.profile');

  const { values, setFieldValue, resetForm } = useFormik({
    initialValues: {
      street: '',
      city: '',
      state: '',
      country: '',
      zip: ''
    },
    onSubmit: () => {
      console.log("submitted");
    },
  });

  const { street, city, state, country, zip } = values;

  const handleAddressSave = async () => {
    const payload = {
      street,
      city,
      state,
      country,
      zipCode: zip
    }
    if (!isAdd) {
      await editUserAddress({ id: address?.id, body: payload }).then(() => {
        toast.success("Address updated successfully");
        resetForm();
        onClose();
      }).catch(() => {
        toast.error("Something went wrong")
      })
    } else {
      await addUserAddress(payload).then(() => {
        toast.success("Address updated successfully");
        resetForm();
        setIsAdd(false);
        onClose();
      }).catch(() => {
        toast.error("Something went wrong")
      })
    }
  };

  const handleAddressCancel = () => {
    resetForm();
    onClose();
  };

  useEffect(() => {
    if (address && !isAdd) {
      setFieldValue("street", address.street);
      setFieldValue("city", address.city);
      setFieldValue("state", address.state);
      setFieldValue("country", address.country);
      setFieldValue("zip", address.zipCode)
    }
  }, [address])

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-xl">
        <h2 className="text-lg font-semibold mb-4">{t('add_new_address')}</h2>

        <div className="flex flex-col gap-3 w-full">
          <input
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            value={street}
            onChange={(e) => setFieldValue("street", e.target.value)}
            placeholder={t('street')}
          />
          <input
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            value={city}
            onChange={(e) => setFieldValue("city", e.target.value)}
            placeholder={t('city')}
          />
          <input
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            value={state}
            onChange={(e) => setFieldValue("state", e.target.value)}
            placeholder={t('state')}
          />
          <input
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            value={country}
            onChange={(e) => setFieldValue("country", e.target.value)}
            placeholder={t('country')}
          />
          <input
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            value={zip}
            onChange={(e) => setFieldValue("zip", e.target.value)}
            placeholder={t('zipCode')}
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <button
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
            onClick={handleAddressCancel}
          >
            {t('cancel')}
          </button>
          <button
            className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white transition"
            onClick={handleAddressSave}
          >
            {t('save')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddressEditModal
