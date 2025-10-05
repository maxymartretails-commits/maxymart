"use client";

import React, {useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";

//slices
import {
  useGetCategoriesQuery,
  useLazyGetProductsByCategoryQuery,
} from "@/lib/slices/categoriesApiSlice";

//components
import Loading from "../common/Loading";
import CategoriesCard from "./components/categories-card/CategoriesCard";

//dynamic components
const CategoriesFilter = dynamic(() => import("./components/categories-filter/CategoriesFilter"), { ssr: false });
// const CategoriesCard = dynamic(() => import("./components/categories-card/CategoriesCard"), { ssr: false });

const Categories = () => {
  //state & hooks
  const searchParams = useSearchParams();
  const [subCatId, setSubCatId] = useState<string>();
  const [brandId, setBrandId] = useState<string>();

  //params
  const categoryId = searchParams.get("categoryId");
  const params = useParams();
  const category = params?.category as string;

  //slices
  const [getProductsByCategory, { data: products, isLoading: isProductsLoading, isFetching: isProductsFetching }] =
    useLazyGetProductsByCategoryQuery();
  const { data: categoriesData, isLoading: isCategoryLoading } = useGetCategoriesQuery();

  useEffect(() => {
    getProductsByCategory({
      categoryId,
      subCategoryId: subCatId,
      brandId,
    });
  }, [subCatId, categoryId, brandId]);

  const isLoading = isCategoryLoading || isProductsLoading;

  return (
    <main className="mx-auto max-w-[1920px] px-4 md:px-6 lg:px-8 2xl:px-10" style={{ height: "100vh" }}>
      <h1 className="text-3xl font-bold text-center p-6 capitalize">{decodeURIComponent(category)}</h1>
      <div className="flex gap-[2rem] pb-16 lg:pb-20" aria-label="Product Categories">
        {isLoading ? (
          <Loading size={60} thickness={5} color="#dc2626" />
        ) : (
          
          <>
            <CategoriesFilter
              categoryId={categoryId}
              subCatId={subCatId}
              setBrandId={setBrandId}
              setSubCatId={setSubCatId}
              categoriesData={categoriesData}
            />
            <CategoriesCard products={products?.products || []} isProductsFetching={isProductsFetching} />
          </>
        )}
      </div>
    </main>
  );
};

export default Categories;
