import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "../../baseQuery";

export const DashboardApiService = createApi({
  reducerPath: "dashboardApi",
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    getDashboardData: builder.query<any, void>({
      query: () => ({
        url: `/sellers/dashboard`,
        baseUrl: process.env.API_URL_ACC,
      }),
      transformResponse: (response: any) => response.data,
    }),
    getDashboardChartData: builder.query<any, any>({
      query: ({month=3, year=2025}) => ({
        url: `/sellers/dashboard/earnings?month=${month}&year=${year}`,
        baseUrl: process.env.API_URL_ACC,
      }),
      transformResponse: (response: any) => response.data,
    }),
  
    getDashboardRegionData: builder.query<any, any>({
      query: ({page}) => ({
        url: `/sellers/dashboard/region-earning-report?limit=10&page=${page}`,
        baseUrl: process.env.API_URL_ACC,
      }),
      transformResponse: (response: any) => response.data,
    }),
  
  }),
});

export const {
  useGetDashboardDataQuery,
  useGetDashboardChartDataQuery,
  useGetDashboardRegionDataQuery,
} = DashboardApiService;
