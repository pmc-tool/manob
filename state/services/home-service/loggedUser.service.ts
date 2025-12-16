import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "../../baseQuery";

export const LoggedUserApiService = createApi({
  reducerPath: "LoggedUserApi",
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    getHomePurchasedProducts: builder.query<any, void>({
      query: () => ({
        url: `/app-home/purchased-products`,
        baseUrl: process.env.API_URL_FEED,
      }),
      transformResponse: (response: any) => response.data,
    }),
  }),
});

export const { useGetHomePurchasedProductsQuery } = LoggedUserApiService;
