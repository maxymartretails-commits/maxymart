import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { brands } from '../types/categories';
import { LocationResponse } from '../types/user';

// Define base query
const baseQuery = fetchBaseQuery({
    baseUrl: '/api/deliveryZone',
    credentials: 'include',
});

export const userLocationApiSlice = createApi({
    reducerPath: 'userLocationApiSlice',
    baseQuery,
    tagTypes: ['Location'],
    endpoints: (builder) => ({
        addUserLocation: builder.mutation({
            query: (body) => ({
                url: '/addUserLocation',
                method: "POST",
                body
            }),
            invalidatesTags: ['Location']
        }),
        getUserLocation: builder.query<LocationResponse, { latitude: number, longitude: number }>({
            query: (params) => ({
                url: '/checkLocation',
                method: "GET",
                params
            }),
            providesTags: ['Location']
        })
    }),
});

export const {
    useAddUserLocationMutation,
    useGetUserLocationQuery,
    useLazyGetUserLocationQuery
} = userLocationApiSlice;
