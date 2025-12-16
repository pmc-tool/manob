import { Category } from "@emoji-mart/data";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { generateDeviceId } from "../../../utils/deviceTokenGenerator";

const { deviceId, deviceType } = generateDeviceId();
export const SellerCategoryApiService = createApi({
  reducerPath: "sellerCategoryApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.API_URL_INV,
    headers: {
      "Content-Type": "application/json",
      "x-device-id": deviceId,
      "x-device-type": deviceType,
      "x-device-client": "pmc-web",
    },
  }),
  endpoints: (builder) => ({
    getAllCategory: builder.query<any, void>({
      query: () => "/categories/parent",
      transformResponse: (response: any) => response.data,
    }),
    getParentCategory: builder.query<any, void>({
      query: () => "/categories/parent?type=PRODUCT",
      transformResponse: (response: any) => response.data,
    }),
    getJobCategory: builder.query<any, void>({
      query: () => "/categories/parent?type=SERVICE",
      transformResponse: (response: any) => response.data,
    }),
    getServiceCategories: builder.query<any, void>({
      query: () => "/categories/parent?type=SERVICE",
      transformResponse: (response: any) => response.data,
    }),
    getSubCategories: builder.query<any, number>({
      query: (id) => "/categories/" + id,
      transformResponse: (response: { data: Category }, meta, arg) =>
        response.data,
    }),
    getServiceMeta: builder.query<any, string>({
      query: (id) => `/categories/${id}`,
      transformResponse: (response: { data: Category }, meta, arg) =>
        response.data,
    }),
  }),
});

export const {
  useGetAllCategoryQuery,
  useGetParentCategoryQuery,
  useGetServiceCategoriesQuery,
  useLazyGetSubCategoriesQuery,
  useLazyGetServiceMetaQuery,
  useGetJobCategoryQuery,
} = SellerCategoryApiService;
