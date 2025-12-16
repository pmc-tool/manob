import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "../../baseQuery";

export const UserRefundApiService = createApi({
  reducerPath: "userRefundApi",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["getRequest"],
  endpoints: (builder) => ({
    createRequest: builder.mutation({
      query: (data) => ({
        url: `/refunds`,
        baseUrl: process.env.API_URL_ACC,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["getRequest"],
    }),
    submitResolutionOrder: builder.mutation({
      query: (data) => ({
        url: `/support-center/resolution`,
        baseUrl: process.env.API_URL_CORE,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["getRequest"],
    }),
    getResolutionByOrderId: builder.query<any, string>({
      query: (id) => ({
        url: `/support-center/${id}/order`,
        baseUrl: process.env.API_URL_CORE,
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ["getRequest"],
    }),
    getMyRequest: builder.query<any, any>({
      query: (query) => ({
        url: `/refunds?page=${query.page}&limit=${query.limit}`,
        baseUrl: process.env.API_URL_ACC,
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ["getRequest"],
    }),
    getRequestDetails: builder.query<any, string>({
      query: (id) => ({
        url: `/refunds/${id}`,
        baseUrl: process.env.API_URL_ACC,
      }),
      transformResponse: (response: any) => response.data,
    }),
    
    deleteRequest: builder.mutation<any, string>({
      query: (id) => ({
        url: `/refunds/${id}`,
        baseUrl: process.env.API_URL_ACC,
        method: "DELETE",
      }),
      invalidatesTags: ["getRequest"],
    }),
  }),
});

export const {
  useCreateRequestMutation,
  useGetMyRequestQuery,
  useGetRequestDetailsQuery,
  useDeleteRequestMutation,
  useSubmitResolutionOrderMutation,
  useGetResolutionByOrderIdQuery,
} = UserRefundApiService;
