import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "../../baseQuery";
export const ProductOrderApiService = createApi({
  reducerPath: "productOrderApi",
  baseQuery: baseQueryWithReAuth, 
  endpoints: (builder) => ({
    completeOrder: builder.mutation<any, any>({
      query: (body) => ({
        url: "/product-orders",
        baseUrl: process.env.API_URL_ORDER,
        method: "POST",
        body,
      }), 
    }),
   
  }),
});

export const { useCompleteOrderMutation } = ProductOrderApiService;
