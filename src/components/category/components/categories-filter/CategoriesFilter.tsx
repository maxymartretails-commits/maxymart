"use client";

import React, { useMemo, useState } from "react";

//types
import { CatgoriesFilterProps } from "./types";
import { useTranslations } from "next-intl";

//components
import FilterSidebar from "../filter-sidebar/FilterSidebar";

const CategoriesFilter = ({
  categoryId,
  setSubCatId,
  setBrandId,
  categoriesData
}: CatgoriesFilterProps) => {
  const [search, setSearch] = useState("");
  const t = useTranslations('HomePage.category');
  const [drawerOpen, setDrawerOpen] = useState(false); // NEW

  // Find the current category object
  const currentCategory = useMemo(() => {
    return categoriesData?.categories?.find((cat) => cat?.id === categoryId);
  }, [categoriesData, categoryId]);

  // Filtered subcategories and brands
  const filteredSubcategories = useMemo(() =>
    currentCategory?.subCategories?.filter((sub) =>
      sub.name.toLowerCase().includes(search.toLowerCase())
    ), [currentCategory, search]);

  // Filter brands by name
  const filteredBrands = useMemo(() =>
    (currentCategory?.subCategories?.flatMap(sub => sub.brands) ?? []).filter((brand) =>
      brand.name.toLowerCase().includes(search.toLowerCase())
    ), [currentCategory, search]);

  if (!currentCategory) return null;

  return (
    <aside>
      {/* Mobile: Filter Button */}
      <button
        className="fixed bottom-6 right-6 z-40 bg-[#e82630] text-white px-6 py-3 rounded-full shadow-lg font-bold text-lg lg:hidden"
        onClick={() => setDrawerOpen(true)}
      >
        {t('filter')}
      </button>
      {/* Mobile: Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Overlay */}
          <div
            className="fixed inset-0 bg-black bg-opacity-40"
            onClick={() => setDrawerOpen(false)}
            aria-label="true"
          ></div>
          {/* Drawer - now full width and from left */}
          <div className="absolute top-0 left-0 h-full w-full bg-white shadow-2xl flex flex-col animate-slideInLeft relative">
            <button
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close filter"
            >
              <svg
                width="24"
                height="24"
                fill="none"
                stroke="#181111"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 6l12 12M6 18L18 6" />
              </svg>
            </button>
            <FilterSidebar
              search={search}
              setSearch={setSearch}
              filteredSubcategories={filteredSubcategories}
              filteredBrands={filteredBrands}
              setSubCatId={setSubCatId}
              setBrandId={setBrandId}
              currentCategoryImage={currentCategory?.image}
              t={t}
            />
          </div>
        </div>
      )}
      {/* Desktop: Sidebar */}
      <div className="sticky top-16 hidden shrink-0 lg:block h-full w-80 xl:w-96 ltr:pr-8 rtl:pl-8 xl:ltr:pr-16 xl:rtl:pl-16 overflow-y-auto max-h-[90vh]">
        <FilterSidebar
          search={search}
          setSearch={setSearch}
          filteredSubcategories={filteredSubcategories}
          filteredBrands={filteredBrands}
          setSubCatId={setSubCatId}
          setBrandId={setBrandId}
          currentCategoryImage={currentCategory?.image}
          t={t}
        />
      </div>
    </aside>
  );
};

export default CategoriesFilter;
