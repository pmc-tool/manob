import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "../../baseQuery";
import { publicJobServiceApi } from "../home-service/public-job.service";
// export const UserJobsApiService = api.injectEndpoints({
export const UserJobsApiService = createApi({
  reducerPath: "userJobsApi",
  baseQuery: baseQueryWithReAuth,
  // tagTypes: ["getMyJobs"],
  endpoints: (builder) => ({
    bidPlace: builder.mutation<any, any>({
      query: (body) => ({
        url: "/seller/bids",
        baseUrl: process.env.API_URL_JOBS,
        method: "POST",
        body,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.statusCode === 201 || data?.statusCode === 200) {
            // Invalidate the cache for getMyJobs query
            dispatch(
              publicJobServiceApi.endpoints.getAllJob.initiate({
                queryParams: { page: 1, limit: 10 },
              })
            );
          }
        } catch (error) {
          // Handle error if needed
        }
      },
    }),
    getMyJobs: builder.query<any, { body: any; query: any }>({
      query: ({ body, query }) => ({
        url: `/job/my-jobs?page=${query.page}&limit=${query.limit}`,
        baseUrl: process.env.API_URL_JOBS,
        method: "POST",
        body,
      }),
    }),
    getMyBids: builder.query<any, string>({
      query: (url) => ({
        url: `/seller/bids${url}`,
        baseUrl: process.env.API_URL_JOBS,
        method: "GET",
      }),
    }),
    deleteJobById: builder.mutation<any, string>({
      query: (id) => ({
        url: `/job/${id}`,
        baseUrl: process.env.API_URL_JOBS,
        method: "DELETE",
        transformResponse: (response: any) => response.data,
      }),
    }),
  }),
});

export const {
  useBidPlaceMutation,
  useGetMyJobsQuery,
  useDeleteJobByIdMutation,
  useGetMyBidsQuery,
} = UserJobsApiService;
