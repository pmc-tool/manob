import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "../../baseQuery";

export const EventApiService = createApi({
  reducerPath: "EventApi",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["getCampaignableList", "getSingleForumComment"],
  endpoints: (builder) => ({
    getNewEvents: builder.query<any, void>({
      query: () => ({
        url: `/seller/campaigns`,
        baseUrl: process.env.API_URL_INV,
      }),
      transformResponse: (response) => response.data,
    }),

    getCampaignableList: builder.query<any, any>({
      query: ({ id, query }) => ({
        url: `/seller/campaigns/${id}/campaignable?page=${query.page}&limit=${query.limit}`,
        baseUrl: process.env.API_URL_INV,
      }),
      transformResponse: (response) => response.data,
      providesTags: ["getCampaignableList"],
    }),

    addItemsToEvent: builder.mutation<any, any>({
      query: ({ id, body }) => ({
        url: `/seller/campaigns/${id}/products`,
        method: "POST",
        baseUrl: process.env.API_URL_INV,
        body,
      }),
      invalidatesTags: ["getCampaignableList"],
    }),

    addServiceToEvent: builder.mutation<any, any>({
      query: ({ id, body }) => ({
        url: `/seller/campaigns/${id}/services`,
        method: "POST",
        baseUrl: process.env.API_URL_INV,
        body,
      }),
      invalidatesTags: ["getCampaignableList"],
    }),
    deleteItemsToEvent: builder.mutation<any, any>({
      query: ({ id, itemId }) => ({
        url: `/seller/campaigns/${id}/items/${itemId}`,
        method: "DELETE",
        baseUrl: process.env.API_URL_INV,
      }),
      invalidatesTags: ['getCampaignableList']
    }),

    getSingleEvents: builder.query<any, void>({
      query: (id) => ({
        url: `/admin/campaigns/${id}`,
        baseUrl: process.env.API_URL_INV,
      }),
      transformResponse: (response) => response.data,
    }),

    /**
     * Bookmarks api
     */
  }),
});

export const {
  useGetNewEventsQuery,
  useGetSingleEventsQuery,
  useGetCampaignableListQuery,
  useAddItemsToEventMutation,
  useAddServiceToEventMutation,
  useDeleteItemsToEventMutation,
} = EventApiService;
