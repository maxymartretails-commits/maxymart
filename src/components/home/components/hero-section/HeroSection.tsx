"use client";
import { useRouter } from "@/i18n/navigation";

import { useState, useEffect } from "react";
import Image from "next/image";


//hooks
import { useAppSelector } from "@/lib/hooks";

//types
import { Product } from "@/lib/types/products";

//slices
import { useGetProductsQuery } from "@/lib/slices/productsApiSlice";
import { useLocale, useTranslations } from "next-intl";
import { useGetCategoriesQuery } from "@/lib/slices/categoriesApiSlice";

const HeroBanner = () => {
  //states & hooks
  const { data: categoriesData, isLoading: isCatgoriesLoading } = useGetCategoriesQuery();
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const router = useRouter();
  const t = useTranslations('HomePage.hero-section');
  const locale = useLocale();


  //user-location
  const userLocation = useAppSelector((state) => state.userLocation);

  //slices
  const { data: products } = useGetProductsQuery();
  const groceryCategoryId = categoriesData?.categories.find(
    (category) => category.name === "Groceries"
  )?.id;

  //utils
  const { address: userAddress } = userLocation;
  const [streetParsed, stateName, country] = userAddress?.split(",") || [];

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {

    if (e.key === "Enter" && searchTerm.trim() !== "") {
      const product = products?.data?.filter((product) => product.name === searchTerm)
      console.log(product,"prod")
      router.push(`category/${product && product[0]?.category?.name.toLowerCase()}?categoryId=${groceryCategoryId}`);
    }
  };

  const handleSuggestionClick = (name: string) => {
    setSearchTerm(name);
    setSuggestions([]);
    const product = products?.data?.filter((product) => product.name === name)
    console.log(product,"prod")
      router.push(`category/${product && product[0]?.category?.name?.toLowerCase()}?categoryId=${groceryCategoryId}`);
  };

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSuggestions([]);
    } else {
      const filtered = products?.data.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setSuggestions(filtered ? filtered.slice(0, 5) : []);
    }
  }, [searchTerm, products]);


  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-teal-700 via-cyan-600 to-blue-800 text-white pt-10 lg:pt:20 md:pt-24 pb-28 px-4 sm:px-6 md:px-12">
      <div className="max-w-7xl mx-auto flex flex-col-reverse md:flex-row items-center gap-12 sm:gap-14 md:gap-16">

        {/* Left Content */}
        <div className="flex-1 max-w-xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight drop-shadow-lg">
            {t("maxymart_delivers")}{" "}
            <span className="text-lime-400">{t("fresh_groceries")}</span>{" "}
            & {t("essentials")} <br />
            {t("to")}{" "}
            {locale === 'en' && (
              <span
                className={`font-extrabold transition-opacity`}
              >
                {stateName || "--"}
              </span>
            )}

          </h1>

          <p className="mt-4 sm:mt-6 text-base sm:text-lg font-medium text-lime-200 max-w-md drop-shadow-sm">
            {t('description')}
          </p>

          {/* Search Input */}
          <div className="mt-5 sm:mt-6 relative">
            <input
              type="text"
              placeholder={t('input_placeholder')}
              className="w-full px-5 py-3 text-teal-900 rounded-full bg-white placeholder:text-gray-500 shadow-lg focus:outline-none focus:ring-2 focus:ring-lime-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyPress}
              aria-label="Search for products"
            />
            {suggestions.length > 0 && (
              <ul className="absolute left-0 right-0 mt-1 bg-white shadow-lg rounded-md z-50 max-h-40 overflow-auto">
                {suggestions.map((product) => (
                  <li
                    key={product.id}
                    className="text-black px-4 py-2 hover:bg-lime-100 cursor-pointer"
                    onClick={() => handleSuggestionClick(product.name)}
                  >
                    {product.name}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6">
            <button
              onClick={() => router.push(`category/Groceries?categoryId=${groceryCategoryId}`)}
              aria-label="Shop Now"
              className="bg-lime-400 text-teal-900 font-bold rounded-full px-8 py-3 shadow-lg transform transition hover:scale-105 hover:shadow-xl"
            >
              🛒 {t('shop_now')}
            </button>
          </div>
        </div>

        {/* Right Image */}
        <div className="flex-1 max-w-lg w-full">
          <div className="relative w-full aspect-[4/3] md:h-[420px] drop-shadow-2xl rounded-3xl overflow-hidden shadow-lime-400 shadow-lg animate-float">
            <Image
              src="/assets/images/hero-banner.jpg"
              alt="MaxyMart fresh groceries delivery - fruits, vegetables, and essentials"
              fill
              style={{ objectFit: "cover" }}
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="rounded-3xl"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroBanner;

