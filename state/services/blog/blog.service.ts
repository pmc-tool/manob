import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "../../baseQuery";

export const BlogApiService = createApi({
  reducerPath: "BlogApi",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["getAllBlogs", "getSingleForumComment"],
  endpoints: (builder) => ({
    popularBlogsCategories: builder.query<any, void>({
      query: () => ({
        url: `/blog-category/popular`,
        baseUrl: process.env.API_URL_CORE,
      }),
      transformResponse: (response) => response.data,
    }),

    getAllBlogs: builder.query<any, { page: number; limit: number; term: string; tag: string | '' }>({
      query: (query) => ({
        // url: `/public/blogs?page=${query.page}&limit=${query.limit}&type=GENERAL&term=${query.term}&status=PUBLISHED`,
        url: `/public/blogs?limit=${query.limit}&page=${query.page}&term=${query.term}&tag=${query.tag}&type=GENERAL&status=PUBLISHED`,
        baseUrl: process.env.API_URL_CORE,
      }),
      transformResponse: (response) => response.data,
      providesTags: ["getAllBlogs"],
    }),

    getAllBlogsByCategories: builder.query<any, any>({
      query: ({ id, query }) => ({
        url: `/blog-category/${id}/blogs?page=${query.page}&limit=${query.limit}`,
        baseUrl: process.env.API_URL_CORE,
      }),
      transformResponse: (response) => response.data,
      providesTags: ["getAllBlogs"],
    }),

    getAllBlogsByCategoriesMinimal: builder.query<any, any>({
      query: (id) => ({
        url: `/blog-category/${id}/blogs/minimal`,
        baseUrl: process.env.API_URL_CORE,
      }),
      transformResponse: (response) => response.data,
      providesTags: ["getAllBlogs"],
    }),

    getSingleBlog: builder.query<any, any>({
      query: (id) => ({
        url: `/public/blogs/${id}`,
        baseUrl: process.env.API_URL_CORE,
      }),
      transformResponse: (response) => response.data,
    }),
    getRelatedBlog: builder.query<any, any>({
      query: (id) => ({
        url: `/public/blogs/${id}/related`,
        baseUrl: process.env.API_URL_CORE,
      }),
      transformResponse: (response) => response.data,
    }),
    getBlogPopularTags: builder.query<any, void>({
      query: () => ({
        url: `/public/blogs/popular-tags`,
        baseUrl: process.env.API_URL_CORE,
      }),
      transformResponse: (response) => response.data,
    }),

    getPopularBlogs: builder.query<any, void>({
      query: () => ({
        url: `/public/blogs/popular`,
        baseUrl: process.env.API_URL_CORE,
      }),
      transformResponse: (response) => response.data,
    }),

    like: builder.mutation<any, any>({
      query: ({ id, body }) => ({
        url: `/blog/${id}/like`,
        method: "POST",
        baseUrl: process.env.API_URL_CORE,
        body,
      }),
    }),
    /**
     * Bookmarks api
     */

    // getMySingleForum: builder.query<any, any>({
    //   query: (id) => ({
    //     url: `/forum/${id}`,
    //     baseUrl: process.env.API_URL_CORE,
    //   }),
    //   transformResponse: (response) => response.data,
    // }),

    // updateUserNotification: builder.mutation<any, void>({
    //   query: () => ({
    //     url: `/user/toggle-push`,
    //     method: "PUT",
    //     baseUrl: process.env.API_URL_ACC,
    //   }),
    //   async onQueryStarted(arg, { dispatch, queryFulfilled }) {
    //     try {
    //       const { data } = await queryFulfilled;
    //       if (data?.status === true) {
    //         dispatch(
    //           UpdateUserPushNotificationStatus({
    //             is_push_active: data?.data?.is_push_active,
    //           })
    //         );
    //         toast.success(
    //           `Notification ${
    //             data?.data?.is_push_active ? "turn On" : "turn Off"
    //           }`
    //         );
    //       }
    //       // dispatch(setPreviewsMessageHistory(data?.data));
    //     } catch (error: any) {
    //       console.log({
    //         message: error.message,
    //       });
    //     }
    //   },
    // }),
  }),
});

export const {
  usePopularBlogsCategoriesQuery,
  useGetAllBlogsQuery,
  useGetAllBlogsByCategoriesQuery,
  useGetAllBlogsByCategoriesMinimalQuery,
  useGetSingleBlogQuery,
  useGetPopularBlogsQuery, 
  useLikeMutation,
  useGetBlogPopularTagsQuery,
  useGetRelatedBlogQuery, 
} = BlogApiService;
