import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { brands, Categories } from '../types/categories';

// Define base query
const baseQuery = fetchBaseQuery({
  baseUrl: '/api/user',
  credentials: 'include',
});

export const recommendedProductsApiSlice = createApi({
  reducerPath: 'recommendedProductsApiSlice',
  baseQuery,
  endpoints: (builder) => ({
    getRecommendedProducts: builder.query<brands[], void>({
      query: () => ({
        url: '/recommended-products',
        method: "GET"
      })
    })
  }),
});

export const {
  useGetRecommendedProductsQuery
} = recommendedProductsApiSlice;
