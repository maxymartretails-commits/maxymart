import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { brands, SubCategory } from '../types/categories';

// Define base query
const baseQuery = fetchBaseQuery({
  baseUrl: '/api/sub-category',
  credentials: 'include',
});

export const subCategoryApiSlice = createApi({
  reducerPath: 'subCategoryApiSlice',
  baseQuery,
  tagTypes: ['Sub Category'],
  endpoints: (builder) => ({
    getSubCategory: builder.query<SubCategory[], void>({
      query: () => ({
        url: '/',
        method: "GET"
      }),
      providesTags: ['Sub Category']
    }),
    addSubCategory:builder.mutation({
      query:(body) => ({
        url:'/',
        method:"POST",
        body
      }),
      invalidatesTags:['Sub Category']
    }),
    editSubCategory:builder.mutation({
      query:({id,body}) => ({
        url:`?id=${id}`,
        method:"PUT",
        body
      }),
      invalidatesTags:['Sub Category']
    }),
    deleteSubCategory:builder.mutation({
      query:({id}) => ({
        url:`?id=${id}`,
        method:"DELETE",
      }),
      invalidatesTags:['Sub Category']
    })
  }),
});

export const {
  useGetSubCategoryQuery,
  useAddSubCategoryMutation,
  useEditSubCategoryMutation,
  useDeleteSubCategoryMutation
} = subCategoryApiSlice;
