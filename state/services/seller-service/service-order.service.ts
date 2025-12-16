import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "../../baseQuery";
export const SellerServiceOrderApiService = createApi({
  reducerPath: "sellerServiceOrderApi",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["getTimeline"],
  endpoints: (builder) => ({
    getSellerServiceOrders: builder.query<any, string>({
      query: (params) => ({
        url: `/seller/service-orders${params}`,
        baseUrl: process.env.API_URL_ORDER,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ["getTimeline"],
    }),
    getServiceRequirements: builder.query<any, string>({
      query: (id) => ({
        url: `/service-core/${id}/requirements`,
        baseUrl: process.env.API_URL_INV,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data,
    }),
    getSellerServiceOrderDetails: builder.query<any, string>({
      query: (id) => ({
        url: `/seller/service-orders/${id}`,
        baseUrl: process.env.API_URL_ORDER,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ["getTimeline"],
    }),
    getSellerServiceOrderTimeline: builder.query<any, string>({
      query: (id) => ({
        url: `/seller/service-orders/${id}/timelines`,
        baseUrl: process.env.API_URL_ORDER,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ["getTimeline"],
    }),
    startOrderApproveRequirements: builder.mutation<any, string>({
      query: (id) => ({
        url: `/seller/service-orders/${id}/start-service`,
        baseUrl: process.env.API_URL_ORDER,
        method: "POST",
      }),
      invalidatesTags: ["getTimeline"],
    }),
    sellerSubmitDelivery: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/seller/service-orders/${id}/delivery`,
        baseUrl: process.env.API_URL_ORDER,
        method: "POST",
        body,
      }),
      invalidatesTags: ["getTimeline"],
    }),
    sellerSubmitTimeExtend: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/seller/service-orders/${id}/req-time-extension`,
        baseUrl: process.env.API_URL_ORDER,
        method: "POST",
        body,
      }),
      invalidatesTags: ["getTimeline"],
    }),
    sellerRemindRequirements: builder.mutation<any, string>({
      query: (id) => ({
        url: `/seller/service-orders/${id}/remind-requirements`,
        baseUrl: process.env.API_URL_ORDER,
        method: "POST",
      }),
      invalidatesTags: ["getTimeline"],
    }),
    getOrderHistory: builder.query<any, string>({
      query: (params) => ({
        url: `/sell-history${params}`,
        baseUrl: process.env.API_URL_ORDER,
        method: "GET",
      }),
    }),

    getBuyerSingleServiceOrder: builder.query<any, string>({
      query: (id) => ({
        url: `/service-orders/${id}`,
        baseUrl: process.env.API_URL_ORDER,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetSellerServiceOrdersQuery,
  useGetSellerServiceOrderDetailsQuery,
  useStartOrderApproveRequirementsMutation,
  useSellerSubmitDeliveryMutation,
  useSellerSubmitTimeExtendMutation,
  useGetServiceRequirementsQuery,
  useGetSellerServiceOrderTimelineQuery,
  useGetBuyerSingleServiceOrderQuery,
  useLazyGetBuyerSingleServiceOrderQuery,
  useSellerRemindRequirementsMutation,
  useGetOrderHistoryQuery,
} = SellerServiceOrderApiService;
