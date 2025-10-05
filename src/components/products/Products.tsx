'use client'
import React, { Suspense } from 'react';

//components
import CategoriesCard from '../category/components/categories-card/CategoriesCard'
import Loading from '../common/Loading';
import ProductCard from '../category/components/product-card/ProductCard';
import { useGetProductsQuery } from '@/lib/slices/productsApiSlice';
import { useSearchParams } from 'next/navigation';

const Products = () => {
  const searchParams = useSearchParams();
  const productName = decodeURIComponent(searchParams.get('productName') || "").replace(/\+/g, " ");
  const {data:products,isFetching:isProductsFetching} = useGetProductsQuery();
  const filteredProducts = productName ? products?.data.filter((product) => product.name === productName) :  products?.data;
  return (
    <div className="w-full lg:ltr:-ml-4 lg:rtl:-mr-2 xl:ltr:-ml-8 xl:rtl:-mr-8 lg:-mt-1 p-12" style={{height:"calc(100vh - 162px)",overflow:"auto"}}>
      {isProductsFetching ? (
        <Loading size={60} thickness={5} color="#dc2626" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 gap-3 md:gap-4 2xl:gap-5">
          {filteredProducts?.slice(0,50).map((product, index) => (
            <ProductCard
              key={index}
              id={product.id}
              title={product.name}
              variantId={product.variantId}
              subtitle={"tetsing"}
              description={product.description}
              price={Number(product?.price)}
              quantityText={"1 pack (200g)"}
              image={product?.images[0]}
              stock={product?.stock}
              category={"manidh"}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default Products
