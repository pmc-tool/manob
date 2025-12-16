import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "../../baseQuery";
import { setNotifications } from "../../slices/notification.slice";
// export const UserJobsApiService = api.injectEndpoints({
export const NotificationApiService = createApi({
  reducerPath: "notificationApi",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["getMyNotifications"],
  endpoints: (builder) => ({
    saveDevice: builder.mutation<any, any>({
      query: (body) => ({
        url: "/notifications/save-device",
        baseUrl: process.env.API_URL_ACC,
        method: "POST",
        body,
      }),
    }),
    getMyNotifications: builder.query<any, { query: any }>({
      query: ({ query }) => ({
        url: `/notifications/my-notifications?page=${query.page}&limit=${query.limit}`,
        baseUrl: process.env.API_URL_ACC,
        method: "GET",
      }),
      keepUnusedDataFor: 0,
      providesTags: ["getMyNotifications"],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(setNotifications(data?.data));
        } catch (error: any) {
          console.log({
            message: error.message,
          });
        }
      },
    }),
    getMyUnseenMessage: builder.query<any, void>({
      query: () => ({
        url: `/notifications/my-unseen-notifications`,
        baseUrl: process.env.API_URL_ACC,
        method: "GET",
      }),
    }),
    markAsReadAll: builder.mutation<any, void>({
      query: () => ({
        url: `/notifications/mark-as-read`,
        baseUrl: process.env.API_URL_ACC,
        method: "PUT",
        transformResponse: (response: any) => response.data,
      }),
      invalidatesTags: ["getMyNotifications"],
    }),
    markAsReadById: builder.mutation<any, string>({
      query: (id) => ({
        url: `/notifications/mark-as-read/${id}`,
        baseUrl: process.env.API_URL_ACC,
        method: "PUT",
        transformResponse: (response: any) => response.data,
      }),
      invalidatesTags: ["getMyNotifications"],
    }),
  }),
});

export const {
  useSaveDeviceMutation,
  useGetMyNotificationsQuery,
  useLazyGetMyNotificationsQuery,
  useGetMyUnseenMessageQuery,
  useMarkAsReadAllMutation,
  useMarkAsReadByIdMutation,
} = NotificationApiService;
