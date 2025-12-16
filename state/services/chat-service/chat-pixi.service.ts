import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  PreviewsMessageHistory,
  setPreviewsMessageHistory,
} from "../../slices/chat.slice";
import { baseQueryWithReAuth } from "../../baseQuery";

export const ChatPixiService = createApi({
  reducerPath: "ChatPixiService",
  baseQuery: baseQueryWithReAuth,
  // baseQuery: fetchBaseQuery({
  //   baseUrl: process.env.NEXT_PUBLIC_API_URL_CHAT,
  //   headers: {
  //     "Content-Type": "application/json",
  //     authorization: `Bearer ${
  //       typeof window !== "undefined" && localStorage.getItem("p_aut")
  //     }`,
  //   },
  // }),
  endpoints: (builder) => ({
    getPixiProductList: builder.mutation<any, any>({
      query: (body) => ({
        url: `/themes/pixi-product-list`,
        baseUrl: process.env.NEXT_PUBLIC_API_URL_FEED,
        method: "POST",
        body: { items: body },
      }),
      transformResponse: (response: any) => response,
    }),
    getPixiServiceList: builder.mutation<any, any>({
      query: (body) => ({
        url: `/services/pixi-service-list`,
        baseUrl: process.env.NEXT_PUBLIC_API_URL_FEED,
        method: "POST",
        body: { items: body },
      }),
      transformResponse: (response: any) => response,
    }),
  }),
});

export const { useGetPixiProductListMutation, useGetPixiServiceListMutation } =
  ChatPixiService;
