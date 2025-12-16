import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "../../baseQuery";
export const ServiceOrderApiService = createApi({
  reducerPath: "serviceOrderApi",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ['getOrderList', 'getTimeline'],
  endpoints: (builder) => ({
    makePaymentServiceOrder: builder.mutation<any, any>({
      query: (body) => ({
        url: "/service-orders/pay",
        baseUrl: process.env.API_URL_ORDER,
        method: "POST",
        body,
      }),
    }),
    makePaymentJobOrder: builder.mutation<any, any>({
      query: (body) => ({
        url: "/service-orders/pay",
        baseUrl: process.env.API_URL_ORDER,
        method: "POST",
        body,
      }),
    }),
    placeServiceOrder: builder.mutation<any, any>({
      query: (body) => ({
        url: "/service-orders",
        baseUrl: process.env.API_URL_ORDER,
        method: "POST",
        body,
      }),
    }),
    submitRequirements: builder.mutation<any, any>({
      query: (body) => ({
        url: `/service-orders/${body?.id}/requirements`,
        baseUrl: process.env.API_URL_ORDER,
        method: "POST",
        body,
      }),
      invalidatesTags: ['getOrderList', 'getTimeline'],
    }),
    requirementFileUpload: builder.mutation<any, {id:string; body:any;}>({
      query: ({id, body}) => ({
        url: `/service-orders/${id}/required-attachement`,
        baseUrl: process.env.API_URL_ORDER,
        method: "POST",
        body,
      }),
    }),
    getUserServiceOrders: builder.query<any, string>({
      query: (params) => ({
        url: `/service-orders${params}`,
        baseUrl: process.env.API_URL_ORDER,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ["getOrderList"],
    }),
    getServiceRequirements: builder.query<any, string>({
      query: (id) => ({
        url: `/service-core/${id}/requirements`,
        baseUrl: process.env.API_URL_INV,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data,
    }),
    getBidDetails: builder.query<any, string>({
      query: (id) => ({
        url: `/seller/bids/${id}`,
        baseUrl: process.env.API_URL_JOBS,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data,
    }),
    getJobDetails: builder.query<any, string>({
      query: (id) => ({
        url: `/client/jobs/${id}`,
        baseUrl: process.env.API_URL_JOBS,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data,
    }),
    getServiceOrderTimeline: builder.query<any, string>({
      query: (id) => ({
        url: `/service-orders/${id}/timelines`,
        baseUrl: process.env.API_URL_ORDER,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ['getTimeline']
    }),
    getServiceOrderDetails: builder.query<any, string>({
      query: (id) => ({
        url: `/service-orders/${id}`,
        baseUrl: process.env.API_URL_ORDER,
        method: "GET",
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ['getTimeline',],
    }),
    // service-orders/:id/req-time-extension/:timeExtensionId
    approveTimeExtension: builder.mutation<any, any>({
      query: ({id, extendId, body}) => ({
        url: `/service-orders/${id}/req-time-extension/${extendId}`,
        baseUrl: process.env.API_URL_ORDER,
        method: "PUT", 
        body,
      }), 
      invalidatesTags: ['getTimeline'],
    }),
    needRevision: builder.mutation<any, {id:string, body:any}>({
      query: ({id, body}) => ({
        url: `/service-orders/${id}/revisions`,
        baseUrl: process.env.API_URL_ORDER,
        method: "POST", 
        body,
      }), 
      invalidatesTags: ['getTimeline'],
    }),
    markCompleteOrder: builder.mutation<any, string>({
      query: (id) => ({
        url: `/service-orders/${id}/completed`,
        baseUrl: process.env.API_URL_ORDER,
        method: "POST", 
      }), 
      invalidatesTags: ['getTimeline'],
    }),
  }),
});

export const {
  useMakePaymentServiceOrderMutation,
  useMakePaymentJobOrderMutation, 
  usePlaceServiceOrderMutation,
  useGetUserServiceOrdersQuery,
  useGetServiceRequirementsQuery,
  useLazyGetServiceRequirementsQuery,
  useSubmitRequirementsMutation,
  useRequirementFileUploadMutation,
  useGetServiceOrderDetailsQuery,
  useApproveTimeExtensionMutation,
  useNeedRevisionMutation,
  useMarkCompleteOrderMutation,
  useGetServiceOrderTimelineQuery,
  useGetBidDetailsQuery,
  useGetJobDetailsQuery,
} = ServiceOrderApiService;
