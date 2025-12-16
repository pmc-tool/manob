import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { baseQueryWithReAuth } from "../baseQuery";

export const ProductWithTokenService = createApi({
  reducerPath: "ProductWithTokenAPi",
  baseQuery: baseQueryWithReAuth,

  endpoints: (builder) => ({
    getPublicWithTokenProduct: builder.query<any, { id: string }>({
      query: ({ id }) => ({
        url: `/public/products/${id}`,
        baseUrl: process.env.API_URL_INV,
      }),
      transformResponse: (response: any) => response.data,
    }),
  }),
});

export const { useGetPublicWithTokenProductQuery } = ProductWithTokenService;
