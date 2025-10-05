import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { lowStockRespone, ProductQueryParams, Products } from "../types/products";

const baseQuery = fetchBaseQuery({
    baseUrl: '/api/products',
    credentials: 'include',
});


export const productsApiSlice = createApi({
    reducerPath: 'productsApiSlice',
    baseQuery,
    tagTypes: ['Product'],
    endpoints: (builder) => ({
        getProducts: builder.query<Products,void>({
            query: () => ({
                url: '',
                method: "GET",
            }),
            providesTags: ['Product']
        }),
        updateProducts: builder.mutation({
            query: ({ productId, variantId, body }) => ({
                url: `?productId=${productId}&variantId=${variantId}`,
                method: "PUT",
                body
            }),
            invalidatesTags: ['Product']
        }),
        getLowStocks: builder.query<lowStockRespone, void>({
            query: () => ({
                url: '/low-stocks',
                method: 'GET'
            })
        }),
        createProducts: builder.mutation({
            query: (body) => ({
                url: '/',
                method: "POST",
                body
            }),
            invalidatesTags: ['Product']
        }),
        deleteProducts:builder.mutation({
            query:(params) => ({
                url:'/',
                method:"DELETE",
                params
            }),
            invalidatesTags:['Product']
        })
    })
})

export const { useGetProductsQuery, useGetLowStocksQuery, useCreateProductsMutation, useUpdateProductsMutation,useDeleteProductsMutation } = productsApiSlice;