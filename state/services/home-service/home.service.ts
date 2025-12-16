import { Category } from "@emoji-mart/data";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { generateDeviceId } from "../../../utils/deviceTokenGenerator";
function urlString(queryParams: any) {
  let queryString = `page=${queryParams.page}&limit=${queryParams.limit}`;

  queryParams?.countries?.length > 0 &&
    queryParams?.countries.forEach((id: any) => {
      queryString += `&countries[]=${id}`;
    });
  queryParams?.cities?.length > 0 &&
    queryParams?.cities.forEach((id: any) => {
      queryString += `&cities[]=${id}`;
    });
  queryParams?.languages?.length > 0 &&
    queryParams?.languages.forEach((id: any) => {
      queryString += `&languages[]=${id}`;
    });
  queryParams?.skills?.length > 0 &&
    queryParams?.skills.forEach((id: any) => {
      queryString += `&skills[]=${id}`;
    });
  // queryParams?.priceMin && (queryString += `&priceMin=${queryParams.priceMin}`);
  // queryParams?.priceMax && (queryString += `&priceMax=${queryParams.priceMax}`);
  console.log("queryString", queryString);

  return queryString;
}
const { deviceId, deviceType } = generateDeviceId();
export const HomeApiService = createApi({
  reducerPath: "homeApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/",
    headers: {
      Authorization: `Bearer ${typeof window != "undefined" ? localStorage.getItem("p_aut") : ""
        }`,
      "x-device-id": deviceId,
      "x-device-type": deviceType,
      "x-app-client": "pmc-web",
    },
  }),
  endpoints: (builder) => ({
    getHome: builder.query<any, void>({
      query: () => "/",
    }),
    getHomeCategories: builder.query<any, void>({
      query: () => `${process.env.API_URL_FEED}/home/popular-categories`,
      transformResponse: (response: any) => response.data,
    }),
    getServiceCategories: builder.query<any, void>({
      query: () =>
        `${process.env.API_URL_FEED}/home/popular-categories?type=SERVICE`,
      transformResponse: (response: any) => response.data,
    }),
    getHomeAllCategory: builder.query<any, void>({
      query: () => `${process.env.API_URL_INV}/categories/parent`,
      transformResponse: (response: any) => response.data,
    }),
    getSubCategoryById: builder.query<any, number>({
      query: (id) => `${process.env.API_URL_INV}/categories/${id}`,
      transformResponse: (response: { data: Category }, meta, arg) =>
        response.data,
    }),
    getTokenForUserLogin: builder.query<any, number>({
      query: (body) => ({
        url: `${process.env.API_URL_ACC}/auth/user-login-token`,
        method: "POST",
        body,
      }),
      transformResponse: (response: any) => response.data,
    }),
    getUserToken: builder.mutation<any, any>({
      query: (body) => ({
        url: `${process.env.API_URL_ACC}/auth/user-login-token`,
        method: "POST",
        body,
      }),
    }),
    getHomeRecommendedServices: builder.query<any, void>({
      query: () => ({
        url: `${process.env.API_URL_FEED}/home/recommended-services`,
      }),
      transformResponse: (response: any) => response.data,
    }),
    getHomeFreeProducts: builder.query<any, void>({
      query: () => ({
        url: `${process.env.API_URL_FEED}/public/home/free-products`,
      }),
      transformResponse: (response: any) => response.data,
    }),
    getHomeTrendingProducts: builder.query<any, void>({
      query: () => ({
        url: `${process.env.API_URL_FEED}/public/home/trending-products`,
      }),
      transformResponse: (response: any) => response.data,
    }),
    getHomeWeeklyProducts: builder.query<any, void>({
      query: () => ({
        url: `${process.env.API_URL_FEED}/public/home/weekly-products`,
      }),
      transformResponse: (response: any) => response.data,
    }),
    getHomeTrendingServices: builder.query<any, void>({
      query: () => ({
        url: `${process.env.API_URL_FEED}/public/home/trending-services`,
      }),
      transformResponse: (response: any) => response.data,
    }),
    getHomeWeeklyServices: builder.query<any, void>({
      query: () => ({
        url: `${process.env.API_URL_FEED}/public/home/weekly-services`,
      }),
      transformResponse: (response: any) => response.data,
    }),
    getHomeTopRatedSellers: builder.query<any, void>({
      query: () => ({
        url: `${process.env.API_URL_FEED}/public/home/top-rated-sellers`,
      }),
      transformResponse: (response: any) => response.data,
    }),
    getHomeRecommendedProducts: builder.query<any, void>({
      query: () => ({
        url: `${process.env.API_URL_FEED}/home/recommended-products`,
      }),
      transformResponse: (response: any) => response.data,
    }),
    getHomeExploreProducts: builder.query<any, void>({
      query: () => ({ url: `${process.env.API_URL_FEED}/home/home-products` }),
      transformResponse: (response: any) => response.data,
    }),
    getHomeRecentlyViewedServices: builder.query<any, void>({
      query: () => ({
        url: `${process.env.API_URL_FEED}/home/recently-viewed-services`,
      }),
      transformResponse: (response: any) => response.data,
    }),
    getHomeRecentlyViewedProducts: builder.query<any, void>({
      query: () => ({
        url: `${process.env.API_URL_FEED}/home/recently-viewed-products`,
      }),
      transformResponse: (response: any) => response.data,
    }),
    getHomeExploreServices: builder.query<any, void>({
      query: () => ({ url: `${process.env.API_URL_FEED}/home/home-services` }),
      transformResponse: (response: any) => response.data,
    }),
    submitEmailForNewsletter: builder.mutation<any, any>({
      query: (body) => ({
        url: `${process.env.API_URL_CORE}/newsletter/subscribe`,
        method: "POST",
        body,
      }),
    }),
    getFreelancerList: builder.query<
      any,
      {
        queryParams: any;
      }
    >({
      query: ({ queryParams }) => ({
        url: `${process.env.API_URL_FEED}/public/freelancers?${urlString(
          queryParams
        )}`,
      }),
      transformResponse: (response: any) => response.data,
    }),
  }),
});

export const {
  useGetHomeQuery,
  useGetHomeCategoriesQuery,
  useGetServiceCategoriesQuery,
  useGetHomeAllCategoryQuery,
  useLazyGetSubCategoryByIdQuery,
  useLazyGetTokenForUserLoginQuery,
  useGetUserTokenMutation,
  useGetHomeRecommendedServicesQuery,
  useGetHomeFreeProductsQuery,
  useGetHomeTrendingProductsQuery,
  useGetHomeWeeklyProductsQuery,
  useGetHomeTrendingServicesQuery,
  useGetHomeWeeklyServicesQuery,
  useGetHomeTopRatedSellersQuery,
  useGetHomeRecommendedProductsQuery,
  useGetHomeExploreProductsQuery,
  useGetHomeRecentlyViewedServicesQuery,
  useGetHomeRecentlyViewedProductsQuery,
  useGetHomeExploreServicesQuery,
  useGetFreelancerListQuery,
  useSubmitEmailForNewsletterMutation,
} = HomeApiService;
