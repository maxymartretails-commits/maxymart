import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { brands } from '../types/categories';
import { AddOfferResponse, Offer, OfferResponse } from '../types/offers';

// Define base query
const baseQuery = fetchBaseQuery({
  baseUrl: '/api/offers',
  credentials: 'include',
});

export const offersApiSlice = createApi({
  reducerPath: 'offersApiSlice',
  baseQuery,
  tagTypes: ['Offer'],
  endpoints: (builder) => ({
    getOffers: builder.query<OfferResponse, void>({
      query: () => ({
        url: '/all',
        method: "GET"
      }),
      providesTags: ['Offer']
    }),
    addOffers: builder.mutation<AddOfferResponse, Offer>({
      query: (body) => ({
        url: '/',
        method: "POST",
        body
      }),
      invalidatesTags: ['Offer']
    }),
    deleteOffer: builder.mutation({
      query: ({ id }) => ({
        url: `/delete?id=${id}`,
        method: "DELETE"
      }),
      invalidatesTags: ['Offer']
    }),
    updateOffers: builder.mutation({
      query: ({ id, body }) => ({
        url: `/update?id=${id}`,
        method: "PUT",
        body
      }),
      invalidatesTags: ['Offer']
    }),
    activateOffers: builder.mutation({
      query: ({ id, body }) => ({
        url: `/activate?id=${id}`,
        method: "PATCH",
        body
      })
    })
  }),
});

export const {
  useGetOffersQuery,
  useAddOffersMutation,
  useActivateOffersMutation,
  useUpdateOffersMutation,
  useDeleteOfferMutation
} = offersApiSlice;
