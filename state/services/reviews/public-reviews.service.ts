import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { generateDeviceId } from "../../../utils/deviceTokenGenerator";

const { deviceId, deviceType } = generateDeviceId();
export const PublicReviewsApiService = createApi({
  reducerPath: "PublicReviewApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/",
    headers: {
      "x-device-id": deviceId,
      "x-device-type": deviceType,
      "x-device-client": "pmc-web",
    },
  }),
  endpoints: (builder) => ({
    getReviews: builder.query<any, any>({
      query: (query) =>
        `${process.env.API_URL_INV}/products/${query?.id}/reviews?page=${query?.page}&limit=${query?.limit}&order=${query?.order}`,
      transformResponse: (response: any) => response.data,
    }),
    getServiceReviews: builder.query<any, any>({
      query: (query) =>
        `${process.env.API_URL_INV}/services-reviews/${query?.id}/reviews?page=${query?.page}&limit=${query?.limit}&order=${query?.order}`,
      // query: (query) => `${process.env.API_URL_INV}/products/${query?.id}/reviews?page=${query?.page}&limit=${query?.limit}&order=${query?.order}`,
      transformResponse: (response: any) => response.data,
    }),
    getComments: builder.query<any, any>({
      query: (query) =>
        `${process.env.API_URL_INV}/products/${query?.id}/comments?page=${query?.page}&limit=${query?.limit}&order=${query?.order}`,
      transformResponse: (response: any) => response.data,
    }),
    getPublicUserReviews: builder.query<any, any>({
      query: (query) => ({
        url: `${process.env.API_URL_ACC}/public/user/${query?.id}/reviews?page=${query?.page}&limit=${query?.limit}&order=${query?.order}`,
      }),
      transformResponse: (response: any) => response.data,
    }),
  }),
});

export const {
  useGetReviewsQuery,
  useLazyGetReviewsQuery,
  useGetServiceReviewsQuery,
  useLazyGetServiceReviewsQuery,
  useGetCommentsQuery,
  useLazyGetCommentsQuery,
  useGetPublicUserReviewsQuery,
} = PublicReviewsApiService;
