"use client"

import { useUpdateUserMutation } from "@/lib/slices/userApiSlice";
import { useFormik } from "formik";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: any
}
const ProfileEditModal = ({ isOpen, onClose, user }: ProfileEditModalProps
) => {
  const [updateUser] = useUpdateUserMutation();
  const t = useTranslations('HomePage.profile');
  const { values, setFieldValue, resetForm } = useFormik({
    initialValues: {
      name: '',
      email: '',
      phone: ''
    },
    onSubmit: () => {
      console.log("submitted");
    },
  });

  const { name, email, phone } = values;

  const handleProfileSave = async () => {
    await updateUser({
      name: name,
      email: email,
      phoneNumber: phone
    }).then(() => {
      toast.success("Profile updated successfully");
      onClose();
    }).catch(() => {
      toast.error("Something went wrong")
    })
  };

  useEffect(() => {
    if (user) {
      setFieldValue("name", user?.name);
      setFieldValue("email", user?.email);
      setFieldValue("phone", user?.phoneNumber)
    }
  }, [user])

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 animate-fadeIn">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">{t('edit_profile')}</h2>
          <button
            className="text-gray-500 hover:text-gray-700"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <div className="flex flex-col gap-4">
          <input
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            value={name}
            onChange={(e) => setFieldValue("name", e.target.value)}
            placeholder={t('full_name')}
          />
          <input
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            value={email}
            onChange={(e) => setFieldValue("email", e.target.value)}
            placeholder={t('email')}
          />
          <input
            className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400 focus:outline-none"
            value={phone}
            onChange={(e) => setFieldValue("phone", e.target.value)}
            placeholder={t('phone')}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition"
            onClick={onClose}
          >
            {t('cancel')}
          </button>
          <button
            className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white transition"
            onClick={handleProfileSave}
          >
            {t('save')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileEditModal
