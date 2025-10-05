import Image from "next/image";
import { FilterSidebarProps } from "./types";
import { useState } from "react";

export default function FilterSidebar({
    search,
    setSearch,
    filteredSubcategories = [],
    filteredBrands = [],
    setSubCatId,
    setBrandId,
    currentCategoryImage,
    t,
}: FilterSidebarProps) {
    const [activeSubCat, setActiveSubCat] = useState<string | null>(null);
    const [activeBrand, setActiveBrand] = useState<string | null>(null);

    return (
        <section
            className="h-full w-full px-4 lg:w-80 xl:w-96 ltr:pr-8 rtl:pl-8 xl:ltr:pr-16 xl:rtl:pl-16 overflow-y-auto bg-white"
            style={{ height: "calc(100vh - 100px)" }}
        >
            {/*Search Bar*/}
            <div className="mb-4 mt-[7px] px-2">
                <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder={t("placeholder")}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
                />
            </div>

            {/*Subcategories*/}
            <div className="flex flex-col gap-2">
                {filteredSubcategories.length > 0 ? (
                    filteredSubcategories.map((sub, index) => (
                        <div
                            key={`${sub.id}-${index}`}
                            className={`flex items-center gap-4 p-2 rounded-lg cursor-pointer 
                              ${activeSubCat === sub.id ? "bg-red-100" : "hover:bg-gray-100"}`}
                            onClick={() => {
                                setSubCatId && setSubCatId(sub.id);
                                setActiveSubCat(sub.id);
                            }}
                        >
                            <Image
                                src={currentCategoryImage || "/placeholder.png"}
                                alt={sub.name}
                                width={40}
                                height={40}
                                className="w-10 h-10 object-cover rounded-full border"
                            />
                            <span className="font-medium text-gray-800 flex-1">
                                {sub.name}
                            </span>
                            <span className="text-xs bg-gray-200 rounded px-2 py-0.5 text-gray-600">
                                {sub.subCategoryProductStock ?? 0}
                            </span>
                        </div>
                    ))
                ) : (
                    <span className="text-gray-400 text-center">
                        {t("categories_not_found")}
                    </span>
                )}
            </div>

            {/*Brands*/}
            {filteredBrands.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-lg font-semibold mb-3">{t("brands")}</h3>
                    <div className="flex flex-col gap-2">
                        {filteredBrands.map((brand, index) => (
                            <div
                                key={`${brand.id}-${index}`}
                                onClick={() => {
                                    setBrandId && setBrandId(brand.id);
                                    setActiveBrand(brand.id);
                                }}
                                className={`px-4 py-2 rounded flex items-center justify-between cursor-pointer font-medium
                                  ${activeBrand === brand.id ? "bg-red-100 text-red-800" : "bg-gray-100 text-gray-800 hover:bg-gray-200"}`}
                            >
                                <span>{brand.name}</span>
                                <span className="text-xs bg-gray-200 rounded px-2 py-0.5 text-gray-600">
                                    {brand.individualBrandStock ?? 0}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
}
