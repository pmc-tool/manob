import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "../../baseQuery";

export const BlogInteractionApi = createApi({
  reducerPath: "BlogInteractionApi",
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

    // createForum: builder.mutation<any, any>({
    //   query: (body) => ({
    //     url: `/forum`,
    //     method: "POST",
    //     baseUrl: process.env.API_URL_CORE,
    //     body,
    //   }),
    //   invalidatesTags: ["getAllForum"],
    // }),
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

  // useGetAllForumPublicQuery,
  // useLazyGetAllForumPublicQuery,
  // useCreateForumMutation,
  // useGetMySingleForumQuery,

  // useUpdateUserNotificationTokenMutation,
} = BlogInteractionApi;
