import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { generateDeviceId } from "../../../utils/deviceTokenGenerator";

function urlString(queryParams: any) {
  let queryString = `page=${queryParams.page}&limit=${queryParams.limit}`;

  queryParams?.category_ids?.length > 0 &&
    queryParams?.category_ids.forEach((id: any) => {
      queryString += `&category_id=${id}`;
    });
  queryParams?.skills?.length > 0 &&
    queryParams?.skills.forEach((id: any) => {
      queryString += `&skills[]=${id}`;
    });
  queryParams?.client_locations?.length > 0 &&
    queryParams?.client_locations.forEach((id: any) => {
      queryString += `&client_locations[]=${id}`;
    });
  queryParams?.experience_level &&
    (queryString += `&experience_level=${queryParams.experience_level}`);
  queryParams?.job_type && (queryString += `&job_type=${queryParams.job_type}`);

  queryParams?.category_slug &&
    (queryString += `&category_slug=${queryParams.category_slug}`);
  queryParams?.priceMin &&
    (queryString += `&min_price=${queryParams.priceMin}`);
  queryParams?.priceMax &&
    (queryString += `&max_price=${queryParams.priceMax}`);

  queryParams?.min_bid_count &&
    (queryString += `&min_bid_count=${queryParams?.min_bid_count}`);
  queryParams?.max_bid_count &&
    (queryString += `&max_bid_count=${queryParams?.max_bid_count}`);
  return queryString;
} 
export const publicJobServiceApi = createApi({
  reducerPath: "publicJobServiceApi",
  baseQuery: (args: any, api: any, extraOptions: any) => {
    const customBaseUrl = args?.url || process.env.API_URL;
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

        return headers;
      },
    });
    return baseQuery(args, api, extraOptions);
  },
  endpoints: (builder) => ({
    getAllJob: builder.query<any, { queryParams: any }>({
      query: ({ queryParams }) => ({
        url: `${process.env.API_URL_JOBS}/public/jobs?${urlString(
          queryParams
        )}`,
      }),
      keepUnusedDataFor: 0,
      transformResponse: (response: any) => response.data,
    }),
    getJobById: builder.query<any, string>({
      query: (id) => `${process.env.API_URL_JOBS}/public/jobs/${id}`,
      transformResponse: (response: any) => response.data,
    }),
    getBuyerDetails: builder.query<any, string | any>({
      query: (id) => `${process.env.API_URL_ACC}/profile/${id}?userType=BUYER`,
      transformResponse: (response: any) => response.data,
    }),
  }),
});

export const {
  useGetAllJobQuery,
  useGetJobByIdQuery,
  useGetBuyerDetailsQuery,
  useLazyGetBuyerDetailsQuery,
} = publicJobServiceApi;
