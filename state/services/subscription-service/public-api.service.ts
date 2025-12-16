import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { generateDeviceId } from "../../../utils/deviceTokenGenerator";

const { deviceId, deviceType } = generateDeviceId();
export const publicSubscriptionApi = createApi({
  reducerPath: "publicSubscriptionApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.API_URL_ACC,
    headers: { 
      "x-device-id": deviceId,
      "x-device-type": deviceType,
      "x-device-client": "pmc-web",
    },
  }),
  endpoints: (builder) => ({
    getAllSubscription: builder.query<any, void>({
      query: () => `/subscriptions`,
      transformResponse: (response: any) => response.data,
    }),
    getOneSubscription: builder.query<any, string>({
      query: (id) => `/subscriptions/${id}`,
      transformResponse: (response: any) => response.data,
    }),
  }),
});

export const { useGetAllSubscriptionQuery, useGetOneSubscriptionQuery } =
  publicSubscriptionApi;
