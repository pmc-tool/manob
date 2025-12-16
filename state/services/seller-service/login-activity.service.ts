import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "../../baseQuery";

export const SellerLoginActivityService = createApi({
  reducerPath: "SellerLoginActivityApi",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["getLoginDevices"], // Define your query types here
  endpoints: (builder) => ({
    getLoginDevices: builder.query<any, void>({
      query: () => ({
        url: `/user-sessions`,
        baseUrl: process.env.API_URL_ACC,
      }),
      providesTags: ["getLoginDevices"], // Specify the tag to provide when the query is successful.
      transformResponse: (response: any) => response.data,
    }),
    // write a mutation callback
    deleteLoginDevices: builder.mutation<any, any>({
      query: (id) => ({
        url: `/user-sessions/${id}`,
        baseUrl: process.env.API_URL_ACC,
        method: "DELETE",
      }),
      invalidatesTags: ["getLoginDevices"], // Specify the tag to invalidate when the mutation is successful.
    }),
    deleteLoginAllDevice: builder.mutation<any, void>({
      query: () => ({
        url: `/user-sessions`,
        baseUrl: process.env.API_URL_ACC,
        method: "DELETE",
      }),
      invalidatesTags: ["getLoginDevices"], // Specify the tag to invalidate when the mutation is successful.
    }),
  }),
});

export const {
  useGetLoginDevicesQuery,
  useDeleteLoginDevicesMutation,
  useDeleteLoginAllDeviceMutation,
} = SellerLoginActivityService;
