import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "../../baseQuery";

export const SupportApiService = createApi({
  reducerPath: "supportApi",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["myCreatedSupport"],
  endpoints: (builder) => ({
    getBlogProblemCate: builder.query<any, void>({
      query: () => ({
        url: `/blog-category/support`,
        baseUrl: `${process.env.API_URL_CORE}`,
      }),
    }),

    getBlogProblemCateBlog: builder.query<any, any>({
      query: (id) => ({
        url: `/blog/${id}/support`,
        baseUrl: `${process.env.API_URL_CORE}`,
      }),
    }),
    getSearchBlog: builder.query<any, any>({
      query: ({ searchType, keyword, page = 1, limit = 10 }) => ({
        url: `/public/blogs?limit=${limit}&page=${page}&term=${keyword}&type=${searchType}&status=PUBLISHED`,
        baseUrl: `${process.env.API_URL_CORE}`,
      }),
      transformResponse: (response: any) => response.data,
    }),
    getDetails: builder.query<any, string>({
      query: (id) => ({
        url: `/support-center/${id}`,
        baseUrl: `${process.env.API_URL_CORE}`,
      }),
      transformResponse: (response: any) => response.data,
    }),
    getSupportReplies: builder.query<any, any>({
      query: (query) => ({
        url: `/support-center/replies/${query.supportId}?page=${query.page}&limit=${query.limit}`,
        baseUrl: `${process.env.API_URL_CORE}`,
      }),
      transformResponse: (response: any) => response.data,
    }),
    updateSupport: builder.mutation<any, string>({
      query: (id) => ({
        url: `/support-center/${id}`,
        baseUrl: `${process.env.API_URL_CORE}`,
        method: "PUT",
      }),
      transformResponse: (response: any) => response.data,
    }),
    deleteSupport: builder.mutation<any, string>({
      query: (id) => ({
        url: `/support-center/${id}`,
        baseUrl: `${process.env.API_URL_CORE}`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetBlogProblemCateQuery,
  useGetBlogProblemCateBlogQuery,
  useGetDetailsQuery,
  useGetSupportRepliesQuery,
  useUpdateSupportMutation,
  useDeleteSupportMutation,
  useGetSearchBlogQuery,
} = SupportApiService;
