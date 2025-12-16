import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "../../baseQuery";
export const CheckoutApiService = createApi({
  reducerPath: "checkoutApi",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["getBillingAddress"],
  endpoints: (builder) => ({
    saveBillingAddress: builder.mutation<any, void>({
      query: (body) => ({
        url: "/user/billing-address",
        baseUrl: process.env.API_URL_ACC,
        method: "POST",
        body,
      }),
      invalidatesTags: ["getBillingAddress"],
    }),
    completeSubscription: builder.mutation<any, void>({
      query: (body) => ({
        url: "/subscription-orders",
        baseUrl: process.env.API_URL_ORDER,
        method: "POST",
        body,
      }),
    }),
    getBillingAddress: builder.query<any, void>({
      query: () => ({
        url: `/user/billing-address`,
        baseUrl: process.env.API_URL_ACC,
        transformResponse: (response: any) => response.data,
      }),
      providesTags: ["getBillingAddress"],
    }),
    getWalletInfo: builder.query<any, void>({
      query: () => ({
        url: `/wallet`,
        baseUrl: process.env.API_URL_ACC,
        transformResponse: (response: any) => response.data,
      }),
      providesTags: ["getBillingAddress"],
    }),
    getAvailableConnect: builder.query<any, void>({
      query: () => ({
        url: `/client/job-connects`,
        baseUrl: process.env.API_URL_ACC,
        transformResponse: (response: any) => response.data,
      }),
      keepUnusedDataFor: 0,
      transformResponse: (response: any) => response.data,
    }),
  }),
});

export const {
  useSaveBillingAddressMutation,
  useGetBillingAddressQuery,
  useLazyGetBillingAddressQuery,
  useGetWalletInfoQuery,
  useCompleteSubscriptionMutation,
  useGetAvailableConnectQuery,
} = CheckoutApiService;
