import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "../../baseQuery";

export const userSupportApiService = createApi({
  reducerPath: "userSupportApi",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["myCreatedSupport", "getReplies", "sellerSupport"],
  endpoints: (builder) => ({
    submitSupport: builder.mutation<any, any>({
      query: (body) => ({
        url: `/support-center`,
        baseUrl: `${process.env.API_URL_CORE}`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["myCreatedSupport"],
    }),
    getMySupports: builder.query<any, any>({
      query: (query) => ({
        url: `/support-center?page=${query.page}&limit=${query.limit}&type=${query.type}&status=${query.status}&support_center=${query.support_center}`,
        baseUrl: `${process.env.API_URL_CORE}`,
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ["myCreatedSupport"],
    }), 
    getSellerSupports: builder.query<any, any>({
      query: (query) => ({
        url: `/support-center/seller?page=${query.page}&limit=${query.limit}&type=${query.type}&status=${query.status}&support_center=PRODUCT`,
        baseUrl: `${process.env.API_URL_CORE}`,
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ["sellerSupport"],
    }), 
    getDetails: builder.query<any, string>({
      query: (id) => ({
        url: `/support-center/${id}`,
        baseUrl: `${process.env.API_URL_CORE}`,
      }),
      transformResponse: (response: any) => response.data,
    }),
    getDetailsForSeller: builder.query<any, string>({
      query: (id) => ({
        url: `/support-center/${id}/seller`,
        baseUrl: `${process.env.API_URL_CORE}`,
      }),
      transformResponse: (response: any) => response.data, 
    }),

    getSupportReplies: builder.query<any, any>({
      query: (query) => ({
        url: `/support-center/replies/${query.supportId}?page=${
          query.page ?? 1
        }&limit=${query.limit ?? 10}`,
        baseUrl: `${process.env.API_URL_CORE}`,
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ["getReplies"],
    }),

    replyTo: builder.mutation<any, any>({
      query: ({ id, body }) => ({
        url: `/support-center/add-reply/${id}`,
        baseUrl: `${process.env.API_URL_CORE}`,
        method: "POST",
        body: body,
      }),
      invalidatesTags: ["getReplies", "sellerSupport"],
    }),

    updateSupport: builder.mutation<any, string>({
      query: (id) => ({
        url: `/support-center/${id}`,
        baseUrl: `${process.env.API_URL_CORE}`,
        method: "PUT",
      }),
      transformResponse: (response: any) => response.data,
    }),
    deleteSupport: builder.mutation<any, string>({
      query: (id) => ({
        url: `/support-center/${id}`,
        baseUrl: `${process.env.API_URL_CORE}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useSubmitSupportMutation,
  useGetMySupportsQuery,
  useGetSellerSupportsQuery,
  useGetDetailsQuery,
  useGetDetailsForSellerQuery,
  useGetSupportRepliesQuery,
  useReplyToMutation,
  useUpdateSupportMutation,
  useDeleteSupportMutation, 
} = userSupportApiService;
