import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { CartWithGSTResponse, Orders, RazorpayOrderResponse, recentOrders } from "../types/order";

const baseQuery = fetchBaseQuery({
    baseUrl: "/api/order",
    credentials: "include"
})

export const orderApiSlice = createApi({
    reducerPath: 'orderApiSlice',
    baseQuery,
    tagTypes: ['Order'],
    endpoints: (builder) => ({
        placeOrders: builder.mutation<RazorpayOrderResponse, any>({
            query: (body) => ({
                url: '/',
                method: "POST",
                body
            })
        }),
        getAllOrders: builder.query<Orders, void>({
            query: () => ({
                url: '/',
                method: "GET",
            }),
            providesTags: ['Order']
        }),
        getRecentOrders: builder.query<recentOrders[], void>({
            query: () => ({
                url: '/recent',
                method: "GET"
            })
        }),
        updateOrderStatus: builder.mutation({
            query: ({ id, body }) => ({
                url: `?id=${id}`,
                method: "PATCH",
                body
            }),
            invalidatesTags: ['Order']
        }),
        reorderOrder: builder.mutation({
            query: (body) => ({
                url: '/reorder',
                method: "POST",
                body
            })
        }),
        getCartPreOrder: builder.query<CartWithGSTResponse, {id?:string,couponCode?:string}>({
            query: (params) => ({
                url:`/preorder`,
                method: "GET",
                params
            })
        })
    })
})

export const { usePlaceOrdersMutation,useLazyGetRecentOrdersQuery, useGetAllOrdersQuery, useGetRecentOrdersQuery, useReorderOrderMutation, useUpdateOrderStatusMutation, useGetCartPreOrderQuery,useLazyGetCartPreOrderQuery } = orderApiSlice