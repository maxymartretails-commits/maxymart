"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";

//constants
import Loading from "@/components/common/Loading";

//types
import { CategoriesCardProps } from "./types";

//slices
import { useLazyGetProductsByCategoryQuery } from "@/lib/slices/categoriesApiSlice";
import ProductCard from "../product-card/ProductCard";

//dynamic component
// const ProductCard = dynamic(() => import("../product-card/ProductCard"), { ssr: false });

const CategoriesCard = ({
  products: initialProducts,
  isProductsFetching,
}: CategoriesCardProps) => {

  //states & hooks
  const [products, setProducts] = useState(initialProducts || []);
  const [page, setPage] = useState(1);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const searchParams = useSearchParams();

  const categoryId = searchParams.get("categoryId");

  //slices
  const [getProductsByCategory] =
    useLazyGetProductsByCategoryQuery();

  const fetchMoreProducts = useCallback(async () => {
    if (!hasMore || isFetchingMore) return;

    try {
      setIsFetchingMore(true);

      const result = await getProductsByCategory({
        page: page + 1,
        limit: 15,
        categoryId
      }).unwrap();

      setProducts((prev) => [...prev, ...(result.products || [])]);
      setPage((prev) => prev + 1);
      setHasMore(result?.hasMore);
    } catch (error) {
      console.error("Failed to fetch more products:", error);
    } finally {
      setIsFetchingMore(false);
    }
  }, [page, hasMore, isFetchingMore, getProductsByCategory]);

  useEffect(() => {
    if (!observerRef.current || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingMore) {
          fetchMoreProducts();
        }
      },
      { threshold: 1.0 }
    );

    observer.observe(observerRef.current);

    return () => observer.disconnect();
  }, [fetchMoreProducts, isFetchingMore, hasMore]);


  return (
    <section className="w-full lg:ltr:-ml-4 lg:rtl:-mr-2 xl:ltr:-ml-8 xl:rtl:-mr-8 lg:-mt-1">
      {isProductsFetching ? (
        <Loading size={60} thickness={5} color="#dc2626" />
      ) : (
        products && products?.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-3 md:gap-4 2xl:gap-5">
            {products?.map((product, index) => (
              <ProductCard
                key={index}
                id={product?.id}
                title={product?.name}
                variantId={product?.variants[0]?.id}
                variants={product?.variants}
                subtitle={"tetsing"}
                description={product?.description}
                price={Number(product?.variants[0]?.price)}
                discountedPrice={Number(product?.variants[0]?.discountedPrice)}
                quantityText={"1 pack (200g)"}
                image={product?.images[0]}
                stock={product?.variants[0]?.stock}
                category={"manidh"}
              />
            ))}
            <div ref={observerRef} className="col-span-full flex justify-center py-4">
              {isFetchingMore && <Loading size={40} thickness={4} color="#dc2626" />}
            </div>
          </div>
        ) : (
          <div className="text-center py-10 px-5 text-gray-600 font-sans">
            <p className="text-lg font-medium m-0">
              No Data Found
            </p>
          </div>
        )
      )}
    </section>
  );
};

export default CategoriesCard;
