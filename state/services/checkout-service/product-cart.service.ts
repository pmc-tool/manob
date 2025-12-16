import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "../../baseQuery";
export const ProductCartApiService = createApi({
  reducerPath: "productCart",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["getCart"],
  endpoints: (builder) => ({
    saveCart: builder.mutation<any, void>({
      query: (body) => ({
        url: "/cart",
        baseUrl: process.env.API_URL_INV,
        method: "POST",
        body,
      }),
      invalidatesTags: ["getCart"],
    }),
    saveCartSingleItem: builder.mutation<any, void>({
      query: (body) => ({
        url: "/cart/single",
        baseUrl: process.env.API_URL_INV,
        method: "POST",
        body,
      }),
      invalidatesTags: ["getCart"],
    }),
    incrementCart: builder.mutation<any, any>({
      query: (id) => ({
        url: `/cart/increment/${id}`,
        baseUrl: process.env.API_URL_INV,
        method: "PUT",
      }),
      invalidatesTags: ["getCart"],
    }),
    decrementCart: builder.mutation<any, any>({
      query: (id) => ({
        url: `/cart/decrement/${id}`,
        baseUrl: process.env.API_URL_INV,
        method: "PUT",
      }),
      invalidatesTags: ["getCart"],
    }),
    toggleCheckCart: builder.mutation<any, any>({
      query: (id) => ({
        url: `/cart/toggle-check/${id}`, 
        baseUrl: process.env.API_URL_INV,
        method: "PUT",
      }),
      invalidatesTags: ["getCart"],
    }),
    licChangeItem: builder.mutation<any, any>({
      query: (id) => ({
        url: `/cart/change-lic-type/${id}`,
        baseUrl: process.env.API_URL_INV,
        method: "PUT",
      }),
      invalidatesTags: ["getCart"],
    }),
    itemDelete: builder.mutation<any, any>({
      query: (id) => ({
        url: `/cart/cart-items/${id}`,
        baseUrl: process.env.API_URL_INV,
        method: "DELETE",
      }),
      invalidatesTags: ["getCart"],
    }),
    deleteCart: builder.mutation<any, void>({
      query: () => ({
        url: `/cart`,
        baseUrl: process.env.API_URL_INV,
        method: "DELETE",
      }),
      invalidatesTags: ["getCart"],
    }),
    getCart: builder.query<any, void>({
      query: () =>({ url: "/cart", baseUrl: process.env.API_URL_INV,
        transformResponse: (response: any) => response.data,
      }),
      keepUnusedDataFor: 0,
      providesTags: ["getCart"],
    }),
  }),
});

export const { useSaveCartMutation, useLazyGetCartQuery, useGetCartQuery } = ProductCartApiService;
