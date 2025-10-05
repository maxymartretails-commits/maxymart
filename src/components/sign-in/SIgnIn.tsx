"use client";

import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { signIn } from "next-auth/react";

//third-party
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

//types
import { SigninModalProps } from "./types";
import toast from "react-hot-toast";
import { useSentOtpMutation } from "@/lib/slices/categoriesApiSlice";
import { useRouter } from "next/navigation";

const SigninModal: React.FC<SigninModalProps> = ({
  isOpen,
  onClose,
  onSignUp,
  loadingGoogle,
}) => {
  const [otpSent, setOtpSent] = useState(false);
  const [sentOtp] = useSentOtpMutation();

  const validationSchema = Yup.object({
    mobile: Yup.string()
      .matches(/^[0-9]{10}$/, "Enter a valid 10-digit number")
      .required("Mobile number is required"),
    otp: otpSent
      ? Yup.string()
          .length(6, "OTP must be 6 digits")
          .required("OTP is required")
      : Yup.string().notRequired(),
  });

  const { values, setFieldValue, touched, errors, resetForm } = useFormik({
    initialValues: {
      mobile: "",
      otp: "",
    },
    validationSchema,
    onSubmit: async (values) => {},
  });

  const { mobile, otp } = values;

  const handleSignIn = async () => {
    if (!otpSent) {
      // Simulate sending OTP
      const payload = {
        phoneNumber: mobile,
      };
      await sentOtp(payload).then(() => {
        toast.success(`OTP sent to ${values.mobile}`);
        setOtpSent(true);
      });
    } else {
      await signIn("credentials", {
        redirect: false, // avoid auto redirect
        phoneNumber: mobile,
        fullName: "",
        otp: otp,
        mode: "signIn",
        callbackUrl: "/",
      });
      onClose();
      resetForm();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="m-3 w-full max-w-md rounded-2xl bg-white p-6 shadow-lg relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
          aria-label="Close modal"
        >
          <FontAwesomeIcon icon={faTimes} size="lg" />
        </button>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">
          Welcome back
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          Sign in to your account
        </p>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number
            </label>
            <div className="flex">
              <span className="flex items-center px-3 rounded-l-lg border border-gray-300 bg-gray-100 text-gray-700 text-sm">
                +91
              </span>
              <input
                type="text"
                value={values.mobile}
                placeholder="9876543210"
                maxLength={10}
                onChange={(e) => {
                  const onlyNums = e.target.value.replace(/[^0-9]/g, "");
                  if (onlyNums.length <= 10) {
                    setFieldValue("mobile", onlyNums);
                  }
                }}
                className="w-full rounded-r-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none"
              />
            </div>
          </div>

          {/* OTP Field */}
          {otpSent && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                OTP
              </label>
              <input
                type="text"
                value={values.otp}
                placeholder="Enter OTP"
                onChange={(e) => setFieldValue("otp", e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-red-600 focus:ring-2 focus:ring-red-100 outline-none"
              />
              {touched.otp && errors.otp && (
                <p className="text-red-500 text-sm mt-1">{errors.otp}</p>
              )}
            </div>
          )}

          {/* Submit */}
          <button
            onClick={handleSignIn}
            type="button"
            className="w-full rounded-full bg-red-600 px-4 py-2 text-white font-medium hover:bg-red-700 transition"
          >
            {otpSent ? "Verify OTP" : "Send OTP"}
          </button>
        </form>

        {/* OR Divider */}
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="px-3 text-sm text-gray-400">or</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>

        {/* Google Signin Button */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/" })}
          className="w-full flex items-center justify-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 transition"
          type="button"
        >
          {loadingGoogle ? (
            <FontAwesomeIcon icon={faSpinner} spin />
          ) : (
            <>
              <FontAwesomeIcon
                icon={faGoogle}
                size="lg"
                className="text-red-500"
              />
              Continue with Google
            </>
          )}
        </button>

        <p className="text-sm text-center text-gray-500 mt-4">
          Already have an account?{" "}
          <span
            onClick={onSignUp}
            className="text-red-600 cursor-pointer font-medium hover:underline"
          >
            Sign Up
          </span>
        </p>
      </div>
    </div>
  );
};

export default SigninModal;
