import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "../../baseQuery";

export const ReviewsApiService = createApi({
  reducerPath: "ReviewApi",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["getReviews", "getUserReviews"],
  endpoints: (builder) => ({
    createReview: builder.mutation<any, any>({
      query: (body) => ({
        url: `/products/${body.id}/reviews`,
        baseUrl: process.env.API_URL_INV,
        method: "POST",
        body,
      }),
      invalidatesTags: ['getReviews'],
    }),
    createServiceReview: builder.mutation<any, any>({
      query: (body) => ({
        url: `/services-reviews/${body.id}/reviews`,
        baseUrl: process.env.API_URL_INV,
        method: "POST",
        body,
      }),
      invalidatesTags: ['getReviews'],
    }),
    createUserReview: builder.mutation<any, any>({
      query: (body) => ({
        url: `/user-reviews`,
        baseUrl: process.env.API_URL_ACC,
        method: "POST",
        body,
      }),
      invalidatesTags: ['getUserReviews'],
    }),
    createReply: builder.mutation<any, any>({
      query: (body) => ({
        url: `products/${body?.id}/reviews/${body?.reviewId}/reply`,
        baseUrl: process.env.API_URL_INV,
        method: "POST",
        body,
      }),
      invalidatesTags: ['getReviews'],
    }),
    createServiceReply: builder.mutation<any, any>({
      query: (body) => ({
        url: `services-reviews/${body?.id}/reviews/${body?.reviewId}/reply`, //services-reviews/:id/reviews/:reviewId/reply
        baseUrl: process.env.API_URL_INV,
        method: "POST",
        body,
      }),
      invalidatesTags: ['getReviews'],
    }),
    createUserReviewReply: builder.mutation<any, any>({
      query: (body) => ({
        url: `user-reviews/${body?.reviewId}/reply`, //services-reviews/:id/reviews/:reviewId/reply
        baseUrl: process.env.API_URL_ACC,
        method: "POST",
        body,
      }),
      invalidatesTags: ['getUserReviews'],
    }),
    submitProductComment: builder.mutation<any, any>({
      query: (body) => ({
        url: `products/${body?.id}/comments`, //services-reviews/:id/reviews/:reviewId/reply
        baseUrl: process.env.API_URL_INV,
        method: "POST",
        body,
      }),
      invalidatesTags: ['getReviews'],
    }),
    getUserReviews: builder.query<any, any>({
      query: (query) => ({
        url: `/user/${query?.id}/reviews?page=${query?.page}&limit=${query?.limit}&order=${query?.order}`,
        baseUrl: process.env.API_URL_ACC,
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ['getUserReviews']
    }),
    getOrderWiseReview: builder.query<any, any>({
      query: ({userId, orderId}) => ({
        url: `/user/${userId}/reviews?ref_id=${orderId}`,
        baseUrl: process.env.API_URL_ACC,
      }),
      transformResponse: (response: any) => response?.data?.items[0] || "",
      providesTags: ['getUserReviews']
    }),
  }),
});

export const { 
  useCreateReviewMutation, 
  useCreateReplyMutation,
  useCreateServiceReviewMutation,
  useCreateServiceReplyMutation, 
  useSubmitProductCommentMutation,
  useCreateUserReviewMutation,
  useGetUserReviewsQuery,
  useGetOrderWiseReviewQuery,
  useCreateUserReviewReplyMutation,
} = ReviewsApiService;
