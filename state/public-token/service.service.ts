import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { baseQueryWithReAuth } from "../baseQuery";

export const ServiceWithTokenService = createApi({
  reducerPath: "ServiceWithTokenAPi",
  baseQuery: baseQueryWithReAuth,

  endpoints: (builder) => ({
    getPublicWithTokenService: builder.query<any, { id: string }>({
      query: ({ id }) => ({
        url: `/public-service/${id}`,
        baseUrl: process.env.API_URL_INV,
      }),
      transformResponse: (response: any) => response.data,
    }),
  }),
});

export const { useGetPublicWithTokenServiceQuery } = ServiceWithTokenService;
