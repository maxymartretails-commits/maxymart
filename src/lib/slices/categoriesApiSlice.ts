import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Categories, CategoryProduct, GetProductsParams } from '../types/categories';

// Define base query
const baseQuery = fetchBaseQuery({
  baseUrl: '/api',
  credentials: 'include',
});

export const categoriesApiSlice = createApi({
  reducerPath: 'categoriesApiSlice',
  baseQuery,
  tagTypes:['Category'],
  endpoints: (builder) => ({
    getCategories: builder.query<{ categories: Categories[] }, void>({
      query: () => ({
        url: '/category',
        method: "GET",
      }),
      providesTags:['Category']
    }),
    addCategories:builder.mutation({
      query:(body) => ({
        url:'/category',
        method:"POST",
        body
      }),
      invalidatesTags:['Category']
    }),
    updateCategory:builder.mutation({
      query:({ id,body }) => ({
        url:`/category?id=${id}`,
        method:"PUT",
        body,
      }),
      invalidatesTags:['Category']
    }),
    deleteCategory:builder.mutation({
      query:(params) => ({
        url:'/category',
        method:"DELETE",
        params
      }),
      invalidatesTags:['Category']
    }),
    getProductsByCategory: builder.query<CategoryProduct, GetProductsParams>({
      query: (params) => ({
        url: `category/products`,
        method: "GET",
        params
      })
    }),
    sentOtp:builder.mutation({
      query:(body) => ({
        url:'/otp',
        method:"POST",
        body
      })
    })
  }),
});

export const {
  useGetCategoriesQuery,
  useGetProductsByCategoryQuery,
  useAddCategoriesMutation,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
  useLazyGetProductsByCategoryQuery,
  useSentOtpMutation
} = categoriesApiSlice;
