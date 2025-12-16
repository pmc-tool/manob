import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "../../baseQuery";
import { SetForumList } from "../../slices/forum.slice";

export const ServiceApiService = createApi({
  reducerPath: "serviceApi",
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    servicePayment: builder.mutation<any, any>({
      query: (body) => ({
        url: `/service-orders/pay`,
        method: "POST",
        baseUrl: process.env.API_URL_ORDER,
        body,
      }),
    }),

    /**
     * Bookmarks api
     */
  }),
});

export const { useServicePaymentMutation } = ServiceApiService;
