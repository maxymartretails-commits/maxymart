import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Location } from '../types/location';

// Define base query
const baseQuery = fetchBaseQuery({
  baseUrl: '/api/deliveryZone',
  credentials: 'include',
});

export const deliverableZoneApiSlice = createApi({
  reducerPath: 'deliverableZoneApiSlice',
  baseQuery,
  tagTypes: ['Location'],
  endpoints: (builder) => ({
    getDeliveryZone: builder.query<Location[], void>({
      query: () => ({
        url: '',
        method: "GET"
      }),
      providesTags: ['Location']
    }),
    addDeliveryZone: builder.mutation({
      query: (body) => ({
        url: '/add',
        method: "POST",
        body
      }),
      invalidatesTags: ['Location']
    }),
    updateDeliveryZone: builder.mutation({
      query: ({ id, body }) => ({
        url: `/update?id=${id}`,
        method: "PUT",
        body
      }),
      invalidatesTags: ['Location']
    }),
    deleteDeliveryZone: builder.mutation({
      query: ({ id }) => ({
        url: `?id=${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ['Location']
    })
  }),
});

export const {
  useGetDeliveryZoneQuery,
  useAddDeliveryZoneMutation,
  useUpdateDeliveryZoneMutation,
  useDeleteDeliveryZoneMutation
} = deliverableZoneApiSlice;
