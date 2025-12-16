import { Category } from "@emoji-mart/data";
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

export const publicProductService = createApi({
  reducerPath: "publicProductsApi",
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
        headers.set("x-app-client", "pmc-web");
        return headers;
      },
    });
    return baseQuery(args, api, extraOptions);
  },
  endpoints: (builder) => ({
    getPublicProduct: builder.query<any, { id: string }>({
      query: ({ id }) => ({
        url: `/public/products/${id}`,
        baseUrl: process.env.API_URL_INV,
      }),
      transformResponse: (response: any) => response.data,
    }),
    getRelatedProduct: builder.query<any, { id: string }>({
      query: ({ id }) => ({
        url: `/public/app/products/${id}/related`,
        baseUrl: process.env.API_URL_INV,
      }),
      transformResponse: (response: any) => response.data,
    }),
    getFilterOptions: builder.query<any, void>({
      query: () => ({
        url: `/themes/aggr`,
        baseUrl: process.env.API_URL_FEED,
      }),
      transformResponse: (response: any) => response.data,
    }),
    getProducts: builder.query<
      any,
      {
        queryParams: any;
      }
    >({
      query: ({ queryParams }) => ({
        url: `/themes?${urlString(queryParams)}`,
        // url: `/themes?page=${page}&limit=${limit}&category_ids=${category_ids}`,
        // url: `/themes?page=${page}&limit=${limit}&category_id=${category_id}&priceMin=${priceMin}&priceMax=${priceMax}`,
        baseUrl: process.env.API_URL_FEED,
      }),
      keepUnusedDataFor: 0,
      transformResponse: (response: any) => response.data,
    }),
    getSearchResult: builder.query<
      any,
      {
        queryParams: any;
      }
    >({
      query: ({ queryParams }) => ({
        url: `/global-search?type=${queryParams?.type}&query=${
          queryParams?.keyword
        }&${urlString(queryParams)}`,
        baseUrl: process.env.API_URL_FEED,
      }),
      keepUnusedDataFor: 0,
      transformResponse: (response: any) => response.data,
    }),
    getPublicProductByUserId: builder.query<any, string>({
      query: (id) => ({
        url: `/public/user/${id}/products`,
        baseUrl: process.env.API_URL_INV,
      }),
      transformResponse: (response: any) => response.data,
    }),
  }),
});

export const {
  useGetPublicProductQuery,
  useGetProductsQuery,
  useGetFilterOptionsQuery,
  useGetRelatedProductQuery,
  useGetPublicProductByUserIdQuery,
  useGetSearchResultQuery,
} = publicProductService;
