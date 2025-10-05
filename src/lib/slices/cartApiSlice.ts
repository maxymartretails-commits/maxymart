import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { brands, Categories } from '../types/categories';
import { CartItems } from '../types/cart';

// Define base query
const baseQuery = fetchBaseQuery({
  baseUrl: '/api/cart',
  credentials: 'include',
});

export const cartApiSlice = createApi({
  reducerPath: 'cartApiSlice',
  baseQuery,
  tagTypes: ['Cart'],
  endpoints: (builder) => ({
    addToCart: builder.mutation({
      query: (body) => ({
        url: '',
        method: "POST",
        body
      }),
      async onQueryStarted(newItem, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          cartApiSlice.util.updateQueryData("getAllCartItems", undefined, (draft: any) => {
            const existing = draft.result.find((i: any) => i.productId === newItem.productId);
            if (existing) {
              existing.quantity = newItem.quantity;
            } else {
              draft.result.push({ ...newItem, optimistic: true });
            }
          })
        );

        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },

      invalidatesTags: ['Cart']
    }),
    deleteFromCart: builder.mutation({
      query: (id) => ({
        url: `/delete?id=${id}`,
        method: 'DELETE'
      }),
      invalidatesTags: ['Cart']
    }),
    getAllCartItems: builder.query<CartItems, void>({
      query: () => ({
        url: "/all",
        method: "GET"
      }),
      providesTags: ['Cart']
    })
  }),
});

export const {
  useAddToCartMutation,
  useDeleteFromCartMutation,
  useGetAllCartItemsQuery
} = cartApiSlice;
