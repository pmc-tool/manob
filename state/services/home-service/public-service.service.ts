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
  queryParams?.sellerId && (queryString += `&seller_id=${queryParams.sellerId}`);
  return queryString;
}

export const publicServiceApi = createApi({
  reducerPath: "publicServiceApi",
  baseQuery: (args: any, api: any, extraOptions: any) => {
    const customBaseUrl = args?.baseUrl || process.env.NEXT_PUBLIC_API_URL;
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
  endpoints: (builder) => ({
    // Get single service by ID
    getServiceById: builder.query<any, { id: string }>({
      query: ({ id }) => ({
        url: `/public-service/${id}`,
        baseUrl: process.env.NEXT_PUBLIC_API_URL_INV,
      }),
      transformResponse: (response: any) => response?.data || response,
    }),
    // Get service filter options/aggregations
    getServiceFilterOptions: builder.query<any, void>({
      query: () => ({
        url: `/services/aggr`,
        baseUrl: process.env.NEXT_PUBLIC_API_URL_FEED,
      }),
      transformResponse: (response: any) => response?.data || response,
    }),
    // Get services list with filters
    getServices: builder.query<any, { queryParams: any }>({
      query: ({ queryParams }) => ({
        url: `/services?${urlString(queryParams)}`,
        baseUrl: process.env.NEXT_PUBLIC_API_URL_FEED,
      }),
      keepUnusedDataFor: 0,
      transformResponse: (response: any) => response?.data || response,
    }),
    // Get recommended services
    getRecommendedServices: builder.query<any, void>({
      query: () => ({
        url: `/home/recommended-services`,
        baseUrl: process.env.NEXT_PUBLIC_API_URL_FEED,
      }),
      transformResponse: (response: any) => response?.data || response,
    }),
    // Get trending services
    getTrendingServices: builder.query<any, void>({
      query: () => ({
        url: `/public/home/trending-services`,
        baseUrl: process.env.NEXT_PUBLIC_API_URL_FEED,
      }),
      transformResponse: (response: any) => response?.data || response,
    }),
    // Get weekly services
    getWeeklyServices: builder.query<any, void>({
      query: () => ({
        url: `/public/home/weekly-services`,
        baseUrl: process.env.NEXT_PUBLIC_API_URL_FEED,
      }),
      transformResponse: (response: any) => response?.data || response,
    }),
    // Get related services by service ID
    getRelatedServices: builder.query<any, { id: string }>({
      query: ({ id }) => ({
        url: `/public-service/${id}/related`,
        baseUrl: process.env.NEXT_PUBLIC_API_URL_INV,
      }),
      transformResponse: (response: any) => response?.data || response,
    }),
    // Get services by user ID
    getPublicServiceByUserId: builder.query<any, string>({
      query: (id) => ({
        url: `/public-service/user/${id}/services`,
        baseUrl: process.env.NEXT_PUBLIC_API_URL_INV,
      }),
      transformResponse: (response: any) => response?.data || response,
    }),
    // Get service categories
    getServiceCategories: builder.query<any, void>({
      query: () => ({
        url: `/home/popular-categories?type=SERVICE`,
        baseUrl: process.env.NEXT_PUBLIC_API_URL_FEED,
      }),
      transformResponse: (response: any) => response?.data || response,
    }),
    // Get service parent categories from INV API
    getServiceParentCategories: builder.query<any, void>({
      query: () => ({
        url: `/categories/parent?type=SERVICE`,
        baseUrl: process.env.NEXT_PUBLIC_API_URL_INV,
      }),
      transformResponse: (response: any) => response?.data || response,
    }),
  }),
});

export const {
  useGetServiceByIdQuery,
  useLazyGetServiceByIdQuery,
  useGetServicesQuery,
  useGetServiceFilterOptionsQuery,
  useGetRecommendedServicesQuery,
  useGetTrendingServicesQuery,
  useGetWeeklyServicesQuery,
  useGetRelatedServicesQuery,
  useGetPublicServiceByUserIdQuery,
  useGetServiceCategoriesQuery,
  useGetServiceParentCategoriesQuery,
} = publicServiceApi;
