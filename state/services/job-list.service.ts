import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const JobListApiService = createApi({
    reducerPath: "JobListApi",
    baseQuery: fetchBaseQuery({ baseUrl: "https://api.packmycode.com/inv/v1/demo" }),
    endpoints: (builder) => ({
        getUserJobList: builder.query<any, { filter: string; page: number; }>({
            query: ({ filter, page }) => `/jobs?type=${filter}&page=${page}`,  // filter by status and page number
        }),
        getJobList: builder.query<any, { filter: string; page: number; search?: string }>({
            query: ({ filter, page, search }) => `/jobs?type=${filter}&page=${page}&search=${search || ''}`,  // Search applied to job list only
        }),
    }),
});

export const { useGetUserJobListQuery, useGetJobListQuery } = JobListApiService;
