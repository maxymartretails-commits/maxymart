"use client"
import React from "react";
import { useRouter } from "@/i18n/navigation";

//types
import { CategoriesSectionProps } from "@/lib/types/categories";
import { useTranslations } from "next-intl";

const CategoriesSection = ({ data }: CategoriesSectionProps) => {
  //state & hooks
  const router = useRouter();
  const t = useTranslations('HomePage.category_section');

  return (
    <section className="flex flex-1 py-5">
      <div className="layout-content-container flex flex-col flex-1">
        <h2 className="text-[#181111] tracking-light text-[28px] font-bold leading-tight px-4 text-left pb-3 pt-5">
          {t('category_heading')}
        </h2>

        <div className="grid grid-cols-[repeat(auto-fit,minmax(167px,1fr))] gap-3 p-4 cursor-pointer">
          {data && data?.categories?.length > 0 ? (
            data?.categories?.map((category, index) => (
              <div
                key={index}
                className="flex flex-col relative gap-3 shadow-md rounded-xl"
                onClick={() =>
                  router.push(
                    `category/${category?.name?.toLowerCase()}?categoryId=${category?.id}`
                  )
                }
              >
                {/* Discount Badge */}
                {category?.offers && category?.offers?.length > 0 && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs font-semibold px-2 py-1 rounded-lg shadow">
                    {category?.offers[0]?.discountedValue}% {t('off')}
                  </span>
                )}

                <div
                  className="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-xl"
                  style={{ backgroundImage: `url(${category?.image})` }}
                ></div>

                <div className="bg-white p-4 absolute bottom-0 w-full h-[70px] rounded-b-[12px]">
                  <p className="text-[#181111] text-lg font-semibold leading-normal">
                    {category?.name}
                  </p>
                </div>
              </div>

            ))

          ) : (
            <div className="text-center py-10 px-5 text-gray-600 font-sans">
              <p className="text-lg font-medium m-0">
                No Data Found
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
