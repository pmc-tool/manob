import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  PreviewsMessageHistory,
  setPreviewsMessageHistory,
} from "../../slices/chat.slice";
import { baseQueryWithReAuth } from "../../baseQuery";

export const ChatCustomOrderApi = createApi({
  reducerPath: "ChatCustomOrderApi",
  baseQuery: baseQueryWithReAuth,

  endpoints: (builder) => ({
    // getRecentChatHistory: builder.query<any, void>({
    //   query: () => ({
    //     url: `/chat-history/recent-messages`,
    //     baseUrl: process.env.NEXT_PUBLIC_API_URL_CHAT,
    //   }),
    //   transformResponse: (response: any) => response.data,
    // }),

    withdrawCustomOffer: builder.mutation<any, any>({
      query: (id) => ({
        url: `/seller/bids/custom-offer/${id}`,
        baseUrl: process.env.NEXT_PUBLIC_API_URL_JOBS,
        method: "DELETE",
      }),
    }),

    updateCustomOffer: builder.mutation<any, any>({
      query: (body) => ({
        url: `/custom-offer-update`,
        baseUrl: process.env.NEXT_PUBLIC_API_URL_CHAT,
        method: "PUT",
        body,
      }),
    }),

    // getHomeCategory: builder.query<any, any>({
    //     query: () => "/"
    // })
  }),
});

export const { useWithdrawCustomOfferMutation, useUpdateCustomOfferMutation } =
  ChatCustomOrderApi;
