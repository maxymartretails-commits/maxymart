"use client";

import { useGetCategoriesQuery } from "@/lib/slices/categoriesApiSlice";
import {
  useCreateProductsMutation,
  useUpdateProductsMutation,
} from "@/lib/slices/productsApiSlice";
import { Product } from "@/lib/types/products";
import { useFormik } from "formik";
import { useMemo } from "react";
import toast from "react-hot-toast";
import isNil from "lodash.isnil";

const INITIAL_REVIEW_FORM_VALUES = {
  name: "",
  description: "",
  categoryId: "",
  brandId: "",
  subCategoryId: "",
  price: "",
  stock: "",
  images: "",
  unit: "",
  unitSize: "",
};
const AddProductModal = ({
  isOpen,
  onClose,
  details,
}: {
  isOpen: boolean;
  onClose: () => void;
  details?: Product;
}) => {
  const { data: categoryData } = useGetCategoriesQuery();
  const [createProducts] = useCreateProductsMutation();
  const [updateProducts] = useUpdateProductsMutation();

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

  const {
    name,
    description,
    categoryId,
    brandId,
    subCategoryId,
    images,
    price,
    stock,
    unit,
    unitSize,
  } = values;

  const currentCategory = categoryData?.categories?.find(
    (cat) => cat?.id === categoryId
  );

  const brands =
    currentCategory?.subCategories?.flatMap((sub) => sub.brands) ?? [];

  const handleAddProduct = async () => {
    const payload = {
      name: name,
      description: description,
      categoryId: categoryId,
      images: Array(images?.name),
      brandId: brandId,
      subCategoryId: subCategoryId,
      price: Number(price),
      stock: Number(stock),
      unit: unit,
      unitSize: Number(unitSize),
    };

    if (details) {
      await updateProducts({
        productId: details.id,
        variantId: details.variantId,
        body: payload,
      })
        .then(() => {
          toast.success("Product updated successfully");
          resetForm();
          onClose();
        })
        .catch(() => {
          toast.error("Something went wrong");
        });
    } else {
      await createProducts(payload)
        .then(() => {
          toast.success("Product added successfully");
          resetForm();
          onClose();
        })
        .catch(() => {
          toast.error("Something went wrong");
        });
    }
  };

  console.log(images, "imagees");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-3xl w-full p-6 shadow-lg relative">
        <h2 className="text-xl font-semibold mb-4">{`${isEdit ? "Edit Product" : "Add Product"}`}</h2>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block mb-1 font-medium">Product Name</label>
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
            <label className="block mb-1 font-medium">Brand</label>
            <select
              name="category"
              value={brandId}
              onChange={(e) => setFieldValue("brandId", e.target.value)}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring`}
            >
              <option value="">Select Brand</option>
              {brands.map((brand, index) => (
                <option value={brand.id} key={`${brand.id} - ${index}`}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Sub Category</label>
            <select
              name="category"
              value={subCategoryId}
              onChange={(e) => setFieldValue("subCategoryId", e.target.value)}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring`}
            >
              <option value="">Select Sub Category</option>
              {currentCategory?.subCategories?.map((category) => (
                <option value={category.id} key={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 font-medium">Unit</label>
            <input
              type="text"
              name="name"
              value={unit}
              onChange={(e) => setFieldValue("unit", e.target.value)}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring}`}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Unit Size</label>
            <input
              type="text"
              name="name"
              value={unitSize}
              onChange={(e) => setFieldValue("unitSize", e.target.value)}
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring}`}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Price (₹)</label>
            <input
              type="number"
              name="price"
              value={price}
              onChange={(e) => setFieldValue("price", e.target.value)}
              min={0}
              step="0.01"
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring`}
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Stock</label>
            <input
              type="number"
              name="stock"
              value={stock}
              onChange={(e) => setFieldValue("stock", e.target.value)}
              min={0}
              step="1"
              className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring `}
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
                  setFieldValue("images", file); // Store the File object
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
            onClick={() => handleAddProduct()}
          >
            {`${isEdit ? "Update" : "Add"}`}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddProductModal;
