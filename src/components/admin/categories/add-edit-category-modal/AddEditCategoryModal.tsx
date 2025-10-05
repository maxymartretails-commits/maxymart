"use client";

import {
  useAddCategoriesMutation,
  useUpdateCategoryMutation,
} from "@/lib/slices/categoriesApiSlice";
import { useFormik } from "formik";
import { useMemo } from "react";
import toast from "react-hot-toast";
import isNil from "lodash.isnil";
import { Categories } from "@/lib/types/categories";

const INITIAL_REVIEW_FORM_VALUES = {
  description: "",
  name: "",
  image: "",
};
const AddEditCategoryModal = ({
  isOpen,
  onClose,
  details,
}: {
  isOpen: boolean;
  onClose: () => void;
  details?: Categories;
}) => {
  const [addCategories] = useAddCategoriesMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  const isEdit = details;

  const initialFormValues = useMemo(
    () => (!isNil(details) ? { ...details } : INITIAL_REVIEW_FORM_VALUES),
    [details]
  );

  const { values, setFieldValue,resetForm } = useFormik({
    initialValues: initialFormValues,
    onSubmit: () => {
      console.log("submitted");
    },
  });

  const { name, description, image } = values;

  const handleAddCategory = async () => {
    const payload = {
      name: name,
      description: description,
      image: image?.name,
    };

    if (details) {
      await updateCategory({
        id: details.id,
        body: payload,
      })
        .then(() => {
          toast.success("Category updated successfully");
          resetForm();
          onClose();
        })
        .catch(() => {
          toast.error("Something went wrong");
        });
    } else {
      await addCategories(payload)
        .then(() => {
          toast.success("Category added successfully");
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
        <h2 className="text-xl font-semibold mb-4">{`${isEdit ? "Edit Category" : "Add Category"}`}</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block mb-1 font-medium">Category Name</label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setFieldValue("name", e.target.value)}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring}`}
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Description</label>
            <input
              type="text"
              name="name"
              value={description}
              onChange={(e) => setFieldValue("description", e.target.value)}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring`}
            />
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
            onClick={() => handleAddCategory()}
          >
            {`${isEdit ? "Update" : "Add"}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddEditCategoryModal;
