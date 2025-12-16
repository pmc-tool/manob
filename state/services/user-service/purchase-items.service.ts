import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "../../baseQuery";
export const PurchaseItemsApiService = createApi({
  reducerPath: "purchaseItemsApi",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["getPurchaseProducts"],
  endpoints: (builder) => ({
    getPurchaseProducts: builder.query<any, { page: number; limit: string }>({
      query: (query) => ({
        url: `/purchase-list/products?page=${query.page || 1}&limit=${query.limit || "10"
          }`,
        baseUrl: process.env.API_URL_INV,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
      transformResponse: (response: any) => response.data,
    }),
    getSupportExpiration: builder.query<any, string>({
      query: (productId) => ({
        url: `/purchase-list/products/${productId}`,
        baseUrl: process.env.API_URL_INV,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
      transformResponse: (response: any) => response.data,
    }),
    getPurchaseProductById: builder.query<any, string>({
      query: (id) => ({
        url: `/purchase-list/products?id=${id}`,
        baseUrl: process.env.API_URL_INV,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
      transformResponse: (response: any) => response?.data[0],
    }),
    getPurchaseProductsMinimal: builder.query<any, void>({
      query: () => ({
        url: "/purchase-list/products/minimal",
        baseUrl: process.env.API_URL_INV,
        method: "GET",
      }),

      transformResponse: (response: any) => response.data,
    }),
    getOrderHistory: builder.query<any, void>({
      query: () => ({
        url: "/order-history/buyer/products/minimal",
        baseUrl: process.env.API_URL_ORDER,
        method: "GET",
      }),

      transformResponse: (response: any) => response.data,
    }),
    getDownload: builder.query<any, string>({
      query: (id) => ({
        url: `/purchase-list/products/${id}/download`,
        baseUrl: process.env.API_URL_INV,
        method: "GET",
      }),

      // transformResponse: (response: any) => response.data,
    }),
  }),
});

export const {
  useGetPurchaseProductsQuery,
  useGetPurchaseProductsMinimalQuery,
  useGetOrderHistoryQuery,
  useGetPurchaseProductByIdQuery,
  useLazyGetSupportExpirationQuery,
  useLazyGetDownloadQuery,
} = PurchaseItemsApiService;
