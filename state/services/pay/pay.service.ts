import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "../../baseQuery";
import { SetForumList } from "../../slices/forum.slice";

export const PayApiService = createApi({
  reducerPath: "PayApi",
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    getPayIntent: builder.mutation<any, any>({
      query: (body) => ({
        url: `/pay/intent`,
        method: "POST",
        baseUrl: process.env.API_URL_ACC,
        body,
      }),
    }),

    getPayIntentVerify: builder.query<any, any>({
      query: (id) => ({
        url: `/pay/${id}/verify`,
        method: "GET",
        baseUrl: process.env.API_URL_ACC,
      }),
    }),

    /**
     * Bookmarks api
     */
  }),
});

export const { useGetPayIntentMutation, useLazyGetPayIntentVerifyQuery } =
  PayApiService;
