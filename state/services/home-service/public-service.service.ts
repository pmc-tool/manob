import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { generateDeviceId } from "../../../utils/deviceTokenGenerator";
function urlString(queryParams: any) {
  let queryString = `page=${queryParams.page}&limit=${queryParams.limit}`;
  queryParams?.category_ids?.length > 0 &&
    queryParams?.category_ids.forEach((id: any) => {
      queryString += `&category_ids[]=${id}`;
    });
  queryParams?.aggs?.length > 0 &&
    queryParams?.aggs.forEach((id: any) => {
      queryString += `&aggregations[]=${id}`;
    });
  queryParams?.slug && (queryString += `&slug=${queryParams.slug}`);
  queryParams?.priceMin && (queryString += `&priceMin=${queryParams.priceMin}`);
  queryParams?.priceMax && (queryString += `&priceMax=${queryParams.priceMax}`);
  return queryString;
}

export const publicServiceApi = createApi({
  reducerPath: "publicServiceApi",
  baseQuery: (args: any, api: any, extraOptions: any) => {
    const customBaseUrl = args?.baseUrl || process.env.API_URL;
    const baseQuery = fetchBaseQuery({
      baseUrl: customBaseUrl,
      prepareHeaders: (headers, { getState }) => {
        const { deviceId, deviceType } = generateDeviceId();
        const token = (getState() as any).auth.accessToken;
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
        headers.set("x-device-id", deviceId);
        headers.set("x-device-type", deviceType);
        headers.set("x-device-client", "pmc-web");

        if (typeof window !== "undefined") {
          headers.set("x-page-url", window.location.href);
        }

        return headers;
      },
    });
    return baseQuery(args, api, extraOptions);
  },
  // baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    getServiceById: builder.query<any, { id: string }>({
      query: ({ id }) => ({
        url: `/public-service/${id}`,
        // baseUrl: "https://api.packmycode.com/inv/v1",
        baseUrl: process.env.API_URL_INV,
      }),
      transformResponse: (response: any) => response.data,
    }),
    getServiceFilterOptions: builder.query<any, void>({
      query: () => ({
        url: `/services/aggr`,
        baseUrl: process.env.API_URL_FEED,
      }),
      transformResponse: (response: any) => response.data,
    }),
    getServices: builder.query<any, { queryParams: any }>({
      query: ({ queryParams }) => ({
        url: `/services?${urlString(queryParams)}`,
        baseUrl: process.env.API_URL_FEED,
      }),
      keepUnusedDataFor: 0,
      transformResponse: (response: any) => response.data,
    }),
    getRecommendedServices: builder.query<any, void>({
      query: () => ({
        url: `/home/recommended-services`,
        baseUrl: process.env.API_URL_FEED,
      }),
      transformResponse: (response: any) => response.data,
    }),
    getPublicServiceByUserId: builder.query<any, string>({
      query: (id) => ({
        url: `/public-service/user/${id}/services`,
        baseUrl: process.env.API_URL_INV,
      }),
      transformResponse: (response: any) => response.data,
    }),
  }),
});

export const {
  useGetServiceByIdQuery,
  useLazyGetServiceByIdQuery,
  useGetServicesQuery,
  useGetServiceFilterOptionsQuery,
  useGetRecommendedServicesQuery,
  useGetPublicServiceByUserIdQuery,
} = publicServiceApi;
