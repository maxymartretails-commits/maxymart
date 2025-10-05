"use client";

import { useFormik } from "formik";
import { useMemo } from "react";
import toast from "react-hot-toast";
import isNil from "lodash.isnil";
import { brands, SubCategory } from "@/lib/types/categories";
import {
  useAddBrandMutation,
  useEditBrandMutation,
} from "@/lib/slices/brandsApiSlice";
import { useGetCategoriesQuery } from "@/lib/slices/categoriesApiSlice";
import {
  useAddSubCategoryMutation,
  useEditSubCategoryMutation,
} from "@/lib/slices/subCategoryApiSlice";

const INITIAL_REVIEW_FORM_VALUES = {
  name: "",
  image: "",
  categoryId: "",
};
const AddEditSubCategoryModal = ({
  isOpen,
  onClose,
  details,
}: {
  isOpen: boolean;
  onClose: () => void;
  details?: SubCategory;
}) => {
  const { data: categoryData } = useGetCategoriesQuery();
  const [addSubCategory] = useAddSubCategoryMutation();
  const [editSubCategory] = useEditSubCategoryMutation();

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

  const { name, image, categoryId } = values;

  const handleSubCategory = async () => {
    const payload = {
      name: name,
      image: image?.name,
      categoryId: categoryId,
    };

    if (details) {
      await editSubCategory({
        id: details.id,
        body: payload,
      })
        .then(() => {
          toast.success("SubCategory updated successfully");
          resetForm();
          onClose();
        })
        .catch(() => {
          toast.error("Something went wrong");
        });
    } else {
      await addSubCategory(payload)
        .then(() => {
          toast.success("SubCategory added successfully");
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
            <label className="block mb-1 font-medium">SubCategory Name</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setFieldValue("name", e.target.value)}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring}`}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Category</label>
            <select
              name="category"
              value={categoryId}
              onChange={(e) => setFieldValue("categoryId", e.target.value)}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring`}
            >
              <option value="">Select Category</option>
              {categoryData?.categories.map((category) => (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block mb-1 font-medium">Image URL</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.currentTarget.files?.[0];
                if (file) {
                  setFieldValue("image", file); // Store the File object
                }
              }}
              name="image"
              placeholder="Optional - URL of product image"
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring border-gray-300"
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
            onClick={() => handleSubCategory()}
          >
            {`${isEdit ? "Update" : "Add"}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEditSubCategoryModal;
