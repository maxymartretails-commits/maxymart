import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { brands } from '../types/categories';
import { Address, User } from '../types/user';

// Define base query
const baseQuery = fetchBaseQuery({
  baseUrl: '/api/user',
  credentials: 'include',
});

export const userApiSlice = createApi({
  reducerPath: 'userApiSlice',
  baseQuery,
  tagTypes: ['User','Address'],
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => ({
        url: '/',
        method: "GET"
      }),
    }),
    getUserAddress: builder.query<Address[], void>({
      query: () => ({
        url: '/address',
        method: "GET"
      }),
      providesTags:['Address']
    }),
    editUserAddress:builder.mutation({
      query:({id,body}) => ({
        url:`/address?id=${id}`,
        method:"PUT",
        body
      }),
      invalidatesTags:['Address']
    }),
    addUserAddress:builder.mutation({
      query:(body) => ({
        url:'/address',
        method:"POST",
        body
      }),
      invalidatesTags:['Address']
    }),
    getUserById: builder.query({
      query: (params) => ({
        url: '',
        params,
        method: "GET"
      }),
      providesTags: ['User']
    }),
    updateUser: builder.mutation({
      query: (body) => ({
        url: '/',
        method: "PUT",
        body
      }),
      invalidatesTags: ['User']
    })
  }),
});

export const {
  useGetUsersQuery,
  useGetUserAddressQuery,
  useGetUserByIdQuery,
  useLazyGetUserByIdQuery,
  useUpdateUserMutation,
  useAddUserAddressMutation,
  useEditUserAddressMutation
} = userApiSlice;
