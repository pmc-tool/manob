import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "../../baseQuery";
import { SetForumList } from "../../slices/forum.slice";

export const ForumApiService = createApi({
  reducerPath: "ForumApi",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["getAllForum", "getSingleForumComment", "getSingleForumLike"],
  endpoints: (builder) => ({
    getAllForumPublic: builder.query<
      any,
      {
        page: number;
        limit: number;
        sort_by?: string;
        term?: string;
        filter?: string;
      }
    >({
      query: ({ page, limit, sort_by, term, filter }) => {
        // Build query parameters dynamically
        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        if (sort_by) params.append("sort_by", sort_by);
        if (term) params.append("term", term);
        if (filter) params.append("filter", filter);

        return {
          url: `/public/forum?${params.toString()}`,
          baseUrl: process.env.API_URL_CORE,
        };
      },

      // async onQueryStarted(arg, { dispatch, queryFulfilled }) {
      //   const { data } = await queryFulfilled;
      //   console.log('data?.data', data?.item);
      //   if (data?.status === true) {
      //     dispatch(SetForumList(data?.item));
      //   }
      // },
      transformResponse: (response) => response.data,
      providesTags: ["getAllForum"],
    }),

    getSingleForumCommentPublic: builder.query<
      any,
      { id: string; sort_by: string }
    >({
      query: (query: any) => ({
        url: `/public/forum/${query?.id}/comments?sort_by=${query?.sort_by}`,
        baseUrl: process.env.API_URL_CORE,
      }),
      providesTags: ["getSingleForumComment"],
      transformResponse: (response) => response.data,
    }),

    createForum: builder.mutation<any, any>({
      query: (body) => ({
        url: `/forum`,
        method: "POST",
        baseUrl: process.env.API_URL_CORE,
        body,
      }),
      invalidatesTags: ["getAllForum"],
    }),

    updateForum: builder.mutation<any, any>({
      query: ({ id, body }) => ({
        url: `/forum/${id}`,
        method: "PATCH",
        baseUrl: process.env.API_URL_CORE,
        body,
      }),
      invalidatesTags: ["getAllForum"],
    }),
    updateSolved: builder.mutation<any, string>({
      query: (id) => ({
        url: `/forum/${id}/solved`,
        method: "PATCH",
        baseUrl: process.env.API_URL_CORE,
      }),
      invalidatesTags: ["getAllForum", "getSingleForumComment"],
    }),
    pinRequest: builder.mutation<any, any>({
      query: ({ id, body }) => ({
        url: `/forum/${id}/pin-request`,
        method: "PATCH",
        baseUrl: process.env.API_URL_CORE,
        body: body,
      }),
      invalidatesTags: ["getAllForum", "getSingleForumComment"],
    }),
    /**
     * Bookmarks api
     */

    updateForumInteraction: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/forum/${id}/interaction`,
        method: "PATCH",
        baseUrl: process.env.API_URL_CORE,
        body,
      }),
      invalidatesTags: ["getAllForum", "getSingleForumComment"],
    }),

    viewCount: builder.mutation<any, string>({
      query: (id) => ({
        url: `/public/forum/${id}/view`,
        method: "PATCH",
        baseUrl: process.env.API_URL_CORE,
      }), 
      // invalidatesTags: ["getAllForum", "getSingleForumComment"],
    }),

    createForumComment: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/forum/${id}/comment`,
        method: "POST",
        baseUrl: process.env.API_URL_CORE,
        body,
      }),
      invalidatesTags: ["getSingleForumComment"],
    }),

    getMyForum: builder.query<any, { page: number; limit: number }>({
      query: (query) => ({
        url: `/forum?page=${query.page}&limit=${query.limit}`,
        baseUrl: process.env.API_URL_CORE,
      }),
      transformResponse: (response) => response.data,
    }),

    getMyBookmarkedForum: builder.query<any, { page: number; limit: number }>({
      query: (query) => ({
        url: `/forum-bookmark?page=${query.page}&limit=${query.limit}`,
        baseUrl: process.env.API_URL_CORE,
      }),
      transformResponse: (response) => response.data,
    }),

    getMySingleForum: builder.query<any, any>({
      query: (id) => ({
        url: `/forum/${id}`,
        baseUrl: process.env.API_URL_CORE,
      }),
      transformResponse: (response) => response.data,
      keepUnusedDataFor: 0,
    }),

    getSingleForum: builder.query<any, any>({
      query: (id) => ({
        url: `/public/forum/${id}`,
        baseUrl: process.env.API_URL_CORE,
      }),
      transformResponse: (response) => response.data,
      providesTags: ["getSingleForumLike", "getSingleForumComment"],
      keepUnusedDataFor: 0,
    }),

    topContributors: builder.query<any, void>({
      query: () => ({
        url: `/public/top-forum-contributors`,
        baseUrl: process.env.API_URL_CORE,
      }),
      transformResponse: (response) => response.data,
    }),

    topForums: builder.query<any, void>({
      query: () => ({
        url: `/public/top-forums`,
        baseUrl: process.env.API_URL_CORE,
      }),
      transformResponse: (response) => response.data,
    }),
  }),
});

export const {
  useGetAllForumPublicQuery,
  useGetSingleForumCommentPublicQuery,
  useLazyGetSingleForumCommentPublicQuery,
  useLazyGetAllForumPublicQuery,
  useUpdateForumInteractionMutation,
  useCreateForumMutation,
  useUpdateForumMutation,
  useCreateForumCommentMutation,
  useLazyGetMyForumQuery,
  useLazyGetMyBookmarkedForumQuery,
  useGetMySingleForumQuery,
  useGetSingleForumQuery,
  useTopContributorsQuery,
  useTopForumsQuery,
  useUpdateSolvedMutation,
  usePinRequestMutation,
  useViewCountMutation,
} = ForumApiService;
