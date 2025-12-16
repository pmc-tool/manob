import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { generateDeviceId } from "../../../utils/deviceTokenGenerator";
const { deviceId, deviceType } = generateDeviceId();
export const blogApiService = createApi({
  reducerPath: "blogApi",
  baseQuery: fetchBaseQuery({
    baseUrl: "/",
    headers: {
      "x-device-id": deviceId,
      "x-device-type": deviceType,
      "x-app-client": "pmc-web",
    },
  }),
  endpoints: (builder) => ({
    getSupportCategories: builder.query<any, void>({
      query: () => ({
        url: `${process.env.API_URL_CORE}/blog-category/support`,
      }),
      transformResponse: (response: any) => response.data,
    }),
  }),
});

export const { useGetSupportCategoriesQuery } = blogApiService;
