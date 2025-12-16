import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "../../baseQuery";

export const SellerRefundApiService = createApi({
  reducerPath: "sellerRefundApi",
  baseQuery: baseQueryWithReAuth, 
  tagTypes: ["getRequest"],
  endpoints: (builder) => ({  
    getRefunds: builder.query<any, any>({
      query: (query) => ({
        url: `/seller-refunds?page=${query.page}&limit=${query.limit}`,
        baseUrl: process.env.API_URL_ACC,
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ["getRequest"],
    }),
    getRefundDetails: builder.query<any, string>({
      query: (id) => ({
        url: `/seller-refunds/${id}`, //TODO seller-refunds
        baseUrl: process.env.API_URL_ACC,
      }),
      transformResponse: (response: any) => response.data,
    }),
    acceptRequest: builder.mutation<any, any>({
      query: (body) => ({
        url: `/seller-refunds/${body.id}/accept`,
        baseUrl: process.env.API_URL_ACC,
        method: "POST", 
        body
      }), 
      invalidatesTags: ["getRequest"],
    }),
    declineRequest: builder.mutation<any, any>({
      query: (body) => ({
        url: `/seller-refunds/${body.id}/decline`,
        baseUrl: process.env.API_URL_ACC,
        method: "POST", 
        body
      }), 
      invalidatesTags: ["getRequest"],
    }),
  }),
});

export const {  
  useGetRefundsQuery, 
  useGetRefundDetailsQuery,
  useAcceptRequestMutation,
  useDeclineRequestMutation,
 } = SellerRefundApiService;
