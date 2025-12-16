import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "../../baseQuery";

export const FinanceApiService = createApi({
  reducerPath: "financeApi",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["refreshWallet", "getMethods", "getWithdrawReq"],
  endpoints: (builder) => ({
    saveMethod: builder.mutation<any, any>({
      query: (body) => ({
        url: `/payout-method`,
        baseUrl: process.env.API_URL_ACC,
        method: "POST",
        body,
      }),
      invalidatesTags: ["getMethods"],
    }),
    getWalletInfo: builder.query<any, void>({
      query: () => ({
        url: `/wallet`,
        baseUrl: process.env.API_URL_ACC,
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ["refreshWallet"],
    }),
    getFinanceInfo: builder.query<any, void>({
      query: () => ({
        url: `/finances`,
        baseUrl: process.env.API_URL_ACC,
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ["refreshWallet"],
    }),
   
    withdrawRequest: builder.mutation<any, any>({
      query: (body) => ({
        url: `/user-withdraw-requests`,
        baseUrl: process.env.API_URL_ACC,
        method: "POST",
        body,
      }),
      invalidatesTags: ["getWithdrawReq", "refreshWallet"],
    }),
    getMyMethods: builder.query<any, void>({
      query: () => ({
        url: `/payout-method`,
        baseUrl: process.env.API_URL_ACC,
      }),
      providesTags: ["getMethods"],
    }),
    getMyWithdrawReq: builder.query<any, void>({
      query: () => ({
        url: `/user-withdraw-requests`,
        baseUrl: process.env.API_URL_ACC,
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ["getWithdrawReq"],
    }),
    getMyTransactions: builder.query<any, string>({
      query: (params) => ({
        url: `/transactions${params}` ,
        baseUrl: process.env.API_URL_ACC,
      }),
      keepUnusedDataFor: 0,
      transformResponse: (response: any) => response.data,
      providesTags: ["getWithdrawReq", "refreshWallet"],
    }),
    // delete method
    deleteMethod: builder.mutation<any, any>({
      query: (id) => ({
        url: `/payout-method/${id}`,
        baseUrl: process.env.API_URL_ACC,
        method: "DELETE",
      }),
      invalidatesTags: ["getMethods"],
    }),
    // update method
    updateMethod: builder.mutation<any, any>({
      query: (body) => ({
        url: `/payout-method/${body?.id}`,
        baseUrl: process.env.API_URL_ACC,
        method: "PUT",
        body: body,
      }),
      invalidatesTags: ["getMethods"],
    }),
  }),
});

export const {
  useGetWalletInfoQuery,
  useSaveMethodMutation,
  useGetMyMethodsQuery,
  useDeleteMethodMutation,
  useUpdateMethodMutation,
  useWithdrawRequestMutation,
  useGetMyWithdrawReqQuery,
  useGetMyTransactionsQuery,
  useGetFinanceInfoQuery,
} = FinanceApiService;
