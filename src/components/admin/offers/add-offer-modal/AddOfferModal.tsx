"use client";

import { useFormik } from "formik";
import { useMemo } from "react";
import toast from "react-hot-toast";
import isNil from "lodash.isnil";

//slices
import { useAddOffersMutation, useUpdateOffersMutation } from "@/lib/slices/offersApiSlice";

//types
import { DiscountType, Offers } from "@/lib/types/offers";
import { formatDate } from "@/lib/utils/utils";
import { useGetCategoriesQuery } from "@/lib/slices/categoriesApiSlice";
import { useGetBrandsQuery } from "@/lib/slices/brandsApiSlice";
import { useGetSubCategoryQuery } from "@/lib/slices/subCategoryApiSlice";
import { useGetProductsQuery } from "@/lib/slices/productsApiSlice";

const INITIAL_REVIEW_FORM_VALUES = {
  title: "",
  description: "",
  type: "",
  discountValue: 0,
  maxDiscount: 0,
  minOrderValue: 0,
  couponCode: "",
  usageLimit: 0,
  usagePerUser: 0,
  startDate: "",
  endDate: "",
  categoryId: "",
  subCategoryId: "",
  productId: "",
  brandId: "",
  isActive: false
};
const AddOfferModal = ({
  isOpen,
  onClose,
  details,
}: {
  isOpen: boolean;
  onClose: () => void;
  details?: Offers;
}) => {
  //slices
  const [addOffers] = useAddOffersMutation();
  const [updateOffers] = useUpdateOffersMutation();
  const { data: categoryData } = useGetCategoriesQuery();
  const { data: brandsData } = useGetBrandsQuery();
  const { data: subCategoryData } = useGetSubCategoryQuery();
  const { data: productsData } = useGetProductsQuery();

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

  const { title, description, type, discountValue, categoryId, brandId, subCategoryId, productId, maxDiscount, minOrderValue, couponCode, usageLimit, usagePerUser, startDate, endDate, isActive } = values;

  const handleAddBrand = async () => {
    const payload = {
      title: title,
      description: description,
      type: type as DiscountType,
      discountValue: Number(discountValue),
      maxDiscount: Number(maxDiscount),
      minOrderValue: Number(minOrderValue),
      couponCode: couponCode,
      usageLimit: Number(usageLimit),
      usagePerUser: Number(usagePerUser),
      startDate: startDate,
      endDate: endDate,
      isActive: isActive,
      scope:"display",
      ...(categoryId && { categoryId }),
      ...(brandId && { brandId }),
      ...(subCategoryId && { subCategoryId }),
      ...(productId && { productId })
    }

    if (details) {
      await updateOffers({
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
      await addOffers(payload).unwrap()
        .then(() => {
          toast.success("Offer added successfully");
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
        <h2 className="text-xl font-semibold mb-4">{`${isEdit ? "Edit Brand" : "Add Brand"}`}</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block mb-1 font-medium">Offer Title</label>
            <input
              type="text"
              name="title"
              value={title}
              onChange={(e) => setFieldValue("title", e.target.value)}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring}`}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <input
              type="text"
              name="description"
              value={description}
              onChange={(e) => setFieldValue("description", e.target.value)}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring}`}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Select Category</label>
            <select
              name="category"
              value={categoryId}
              onChange={(e) => setFieldValue("categoryId", e.target.value)}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring`}
            >
              <option value="">Category</option>
              {categoryData?.categories.map((category) => (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Select Brand</label>
            <select
              name="brand"
              value={brandId}
              onChange={(e) => setFieldValue("brandId", e.target.value)}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring`}
            >
              <option value="">Brand</option>
              {brandsData?.map((brand, index) => (
                <option value={brand.id} key={`${brand.id} - ${index}`}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Select Sub Category</label>
            <select
              name="subCategory"
              value={subCategoryId}
              onChange={(e) => setFieldValue("subCategoryId", e.target.value)}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring`}
            >
              <option value="">Sub Category</option>
              {subCategoryData?.map((category) => (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Select Product</label>
            <select
              name="product"
              value={productId}
              onChange={(e) => setFieldValue("productId", e.target.value)}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring`}
            >
              <option value="">Product</option>
              {productsData?.data.map((category) => (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Type</label>
            <select
              name="type"
              value={type}
              onChange={(e) => setFieldValue("type", e.target.value)}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring"
            >
              <option value="">Select Type</option>
              <option value="PERCENTAGE">Percentage</option>
              <option value="FLAT">Flat</option>
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Discount Value</label>
            <input
              type="text"
              name="discountValue"
              value={discountValue}
              onChange={(e) => setFieldValue("discountValue", e.target.value)}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring}`}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Max Discount</label>
            <input
              type="text"
              name="maxDiscount"
              value={maxDiscount}
              onChange={(e) => setFieldValue("maxDiscount", e.target.value)}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring}`}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Min Order Value</label>
            <input
              type="text"
              name="minOrderValue"
              value={minOrderValue}
              onChange={(e) => setFieldValue("minOrderValue", e.target.value)}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring}`}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Coupon Code</label>
            <input
              type="text"
              name="couponCode"
              value={couponCode}
              onChange={(e) => setFieldValue("couponCode", e.target.value)}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring}`}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Usage Limit</label>
            <input
              type="text"
              name="usageLimit"
              value={usageLimit}
              onChange={(e) => setFieldValue("usageLimit", e.target.value)}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring}`}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Usage Per User</label>
            <input
              type="text"
              name="usagePerUser"
              value={usagePerUser}
              onChange={(e) => setFieldValue("usagePerUser", e.target.value)}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring}`}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Start Date</label>
            <input
              type="date"
              name="usagePerUser"
              value={startDate ? formatDate(startDate, true) : ""}
              onChange={(e) => setFieldValue("startDate", e.target.value)}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring}`}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">End Date</label>
            <input
              type="date"
              name="endDate"
              value={endDate ? formatDate(endDate, true) : ""}
              onChange={(e) => setFieldValue("endDate", e.target.value)}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring}`}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Is Active</label>
            <input
              type="checkbox"
              name="isActive"
              checked={isActive}
              onChange={(e) => setFieldValue("isActive", e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring focus:ring-blue-500"
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

export default AddOfferModal;
