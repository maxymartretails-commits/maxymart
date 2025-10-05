"use client";

import React from "react";

//components
import Category from "./components/category/Category";
import Recommended from "./components/recommended/Recommended";
import DeliverySteps from "./components/delivery-steps/DeliverySteps";
import SectionCard from "./components/section-card/SectionCard";
import FeatureProducts from "./components/feature-products/FeatureProducts";

//constants
import { useGetCategoriesQuery } from "@/lib/slices/categoriesApiSlice";
import { useGetProductsQuery } from "@/lib/slices/productsApiSlice";
import Loading from "../common/Loading";
import { useTranslations } from "next-intl";

const HomePage = () => {
  //slices
  const { data: categoriesData, isLoading: isCatgoriesLoading } = useGetCategoriesQuery();
  const { data: products, isLoading: isProductsLoading } = useGetProductsQuery();
  const t = useTranslations('HomePage');

  //products
  const beautyCategoryId = categoriesData?.categories.find(
    (category) => category.name === "Cosmetics & Personal Care"
  )?.id;
  const groceryCategoryId = categoriesData?.categories.find(
    (category) => category.name === "Groceries"
  )?.id;
  const dryFruitsCategoryId = categoriesData?.categories.find(
    (category) => category.name === "Dry Fruits & Nuts"
  )?.id;
  const stationaryCategoryId = categoriesData?.categories.find(
    (category) => category.name === "Stationery Items"
  )?.id;
  const beautyCategoryProducts = products?.data
    .filter((product) => product.categoryId === beautyCategoryId)
    .slice(0, 10);
  const dryFruitsCategoryProducts = products?.data
    .filter((product) => product.categoryId === dryFruitsCategoryId)
    .slice(0, 10);
  const groceryCategoryProducts = products?.data
    .filter((product) => product.categoryId === groceryCategoryId)
    .slice(0, 10);
  const stationaryCategoryProducts = products?.data
    .filter((product) => product.categoryId === stationaryCategoryId)
    .slice(0, 10);

  const getMiddleTwo = (arr: any[]) => {
    if (!arr || arr.length < 2) return arr || [];
    const mid = Math.floor(arr.length / 2);
    return arr.slice(mid - 1, mid + 1);
  };

  const popularItems = [
    ...getMiddleTwo(beautyCategoryProducts || []),
    ...getMiddleTwo(dryFruitsCategoryProducts || []),
    ...getMiddleTwo(groceryCategoryProducts || []),
    ...getMiddleTwo(stationaryCategoryProducts || []),
  ];

  const isLoading = isCatgoriesLoading || isProductsLoading

  return (
    <section className="mt-4">
      {isLoading ? (
        <Loading size={60} thickness={5} color="#dc2626" />
      ) : (
        <div>
          <Category data={categoriesData} />
          <FeatureProducts />
          <Recommended items={popularItems || []} />
          <DeliverySteps />
          <SectionCard
            title={t('self_care.heading')}
            category={"Cosmetics & Personal Care"}
            items={beautyCategoryProducts || []}
          />
          <SectionCard
            title={t('daily_fresh.heading')}
            category={"Groceries"}
            items={dryFruitsCategoryProducts || []}
          />
          <SectionCard
            title={t('healthy_snacking.heading')}
            category={"Dry Fruits & Nuts"}
            items={groceryCategoryProducts || []}
          />
          <div className="pb-[90px]">
          <SectionCard
            title={t('back_to_school.heading')}
            category={"Stationery Items"}
            items={stationaryCategoryProducts || []}
          />
          </div>
        </div>
      )}
    </section>
  );
};

export default HomePage;
