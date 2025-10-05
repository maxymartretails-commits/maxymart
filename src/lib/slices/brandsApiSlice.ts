import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { brands } from '../types/categories';

// Define base query
const baseQuery = fetchBaseQuery({
  baseUrl: '/api/brands',
  credentials: 'include',
});

export const brandsApiSlice = createApi({
  reducerPath: 'branndsApiSlice',
  baseQuery,
  tagTypes: ['Brand'],
  endpoints: (builder) => ({
    getBrands: builder.query<brands[], void>({
      query: () => ({
        url: '/',
        method: "GET"
      }),
      providesTags: ['Brand']
    }),
    addBrand: builder.mutation({
      query: (body) => ({
        url: '/',
        method: "POST",
        body
      }),
      invalidatesTags: ['Brand']
    }),
    editBrand: builder.mutation({
      query: ({ id, body }) => ({
        url: `?id=${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ['Brand']
    }),
    deleteBrand: builder.mutation({
      query: (params) => ({
        url: '/',
        method: "DELETE",
        params
      }),
      invalidatesTags: ['Brand']
    })
  }),
});

export const {
  useGetBrandsQuery,
  useAddBrandMutation,
  useEditBrandMutation,
  useDeleteBrandMutation
} = brandsApiSlice;
