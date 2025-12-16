import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"; 
import { baseQueryWithReAuth } from "../../baseQuery";
// export const UserJobsApiService = api.injectEndpoints({
  export const UserJobsApiService = createApi({
  reducerPath: "userJobsApi",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["getMyJobs", "getBiddings"],
  endpoints: (builder) => ({
    createJob: builder.mutation<any, any>({
      query: (body) => ({
        url: "/client/jobs",
        baseUrl: process.env.API_URL_JOBS,
        method: "POST",
        body,
      }),
      invalidatesTags: ["getMyJobs"],
    }),
    getAllJob: builder.query<any, any>({
      query: (body) => ({
        url: "/job/list",
        baseUrl: process.env.API_URL_JOBS,
        method: "POST",
        body,
      }), 
    }), 
    getMyJobs: builder.query<any, {query:any}>({
      query: ({query}) => ({
        url: `/client/jobs?page=${query.page}&limit=${query.limit}&type=${query.type}&status=${query.status}`,
        baseUrl: process.env.API_URL_JOBS, 
      }), 
      providesTags: ["getMyJobs", "getBiddings"],
      transformResponse: (response:any) => response.data,
    }),  
    getJobById: builder.query<any, string>({
      query: (id) => ({
        url: `/client/jobs/${id}`,
        baseUrl: process.env.API_URL_JOBS, 
      }),
      providesTags:  ["getBiddings"], 
      transformResponse: (response: any) => response.data,
    }),  
    getBiddingByJobId: builder.query<any, any>({
      query: ({ id, page, limit }) => ({ 
        url: `/client/jobs/${id}/bids?page=${page}&limit=${limit}`, 
        baseUrl: process.env.API_URL_JOBS, 
      }),
      providesTags:  ["getBiddings"], 
      transformResponse: (response: any) => response.data, 
    }), 
    
    updateJobPrice: builder.mutation<any, { id: string, body: any }>({
      query: ({ id, body }) => ({
        url: `/client/jobs/${id}/actions`,
        baseUrl: process.env.API_URL_JOBS,
        method: "POST",
        body,
      }), 
       invalidatesTags: ["getBiddings"],
    }),
    
    stopJob: builder.mutation<any, any>({
      query: (id) => ({
        url: `/client/jobs/${id}/stop`,
        method: "POST",
        baseUrl: process.env.API_URL_JOBS, 
      }),
      invalidatesTags: ["getBiddings"],
    }),  
    getMyBids: builder.query<any, {filter: string; page: number;  }>({
      query: ({filter, page}) => ({
        url: `/bid/my-bids?page=${page}`,
        baseUrl: process.env.API_URL_JOBS,
        transformResponse: (response: any) => response.data,
      }),
    }),  
    deleteJobById: builder.mutation<any, string>({
      query: (id) => ({
        url: `/client/jobs/${id}`,
        baseUrl: process.env.API_URL_JOBS,
        method: "DELETE",
        transformResponse: (response: any) => response.data,
      }),
      invalidatesTags: ["getMyJobs"],
    }), 
  }),
});

export const {
  useCreateJobMutation,
  useGetMyJobsQuery,
  useGetJobByIdQuery,
  useLazyGetJobByIdQuery,
  useDeleteJobByIdMutation,
  useGetBiddingByJobIdQuery,
  useUpdateJobPriceMutation,
  useStopJobMutation,
  useGetMyBidsQuery,
} = UserJobsApiService;
