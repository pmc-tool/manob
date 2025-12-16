import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  PreviewsMessageHistory,
  setPreviewsMessageHistory,
} from "../../slices/chat.slice";
import { baseQueryWithReAuth } from "../../baseQuery";

export const ChatUserApiService = createApi({
  reducerPath: "ChatUserApi",
  baseQuery: baseQueryWithReAuth,
  // baseQuery: fetchBaseQuery({
  //   baseUrl: process.env.NEXT_PUBLIC_API_URL_CHAT,
  //   headers: {
  //     "Content-Type": "application/json",
  //     authorization: `Bearer ${
  //       typeof window !== "undefined" && localStorage.getItem("p_aut")
  //     }`,
  //   },
  // }),
  endpoints: (builder) => ({
    getChatUsersList: builder.query<any, void>({
      query: () => ({
        url: "/chat-history",
        baseUrl: process.env.NEXT_PUBLIC_API_URL_CHAT,
      }),
      transformResponse: (response: any) => ({
        users: response.data.chat_hostory.map((user: any) => {
          console.log(user);

          return {
            room_id: user.room_id,
            sender_id: user.sender_id,
            receiver_id: user.receiver_id,
            sender_name: user.sender_name,
            receiver_name: user.receiver_name,
            sender_avatar: user.sender_avatar,
            receiver_avatar: user.receiver_avatar,
            sended_at: user.sended_at,
            last_message: user.last_message,
            last_message_status: user.last_message_status,
          };
        }),
      }),
    }),
    getOneToOneHistory: builder.query<any, string>({
      query: (id) => ({
        url: `/chat-history/${id}`,
        baseUrl: process.env.API_URL_CHAT,
      }),
    }),

    getOneToOneChatHistory: builder.query<any, { id: string; page: number }>({
      query: (query) => ({
        url: `/messages/${query.id}?page=${query.page}`,
        baseUrl: process.env.API_URL_CHAT,
      }),
      keepUnusedDataFor: 0,
    }),

    getRecentChatHistory: builder.query<any, void>({
      query: () => ({
        url: `/chat-history/recent-messages`,
        baseUrl: process.env.NEXT_PUBLIC_API_URL_CHAT,
      }),
      transformResponse: (response: any) => response.data,
    }),

    uploadAttachmentFiles: builder.mutation<any, any>({
      query: (body) => ({
        url: `/upload`,
        baseUrl: process.env.NEXT_PUBLIC_API_URL_CHAT,
        method: "POST",
        body,
      }),
    }),

    createCustomOffer: builder.mutation<any, any>({
      query: (body) => ({
        url: `/seller/bids/custom-offer`,
        baseUrl: process.env.NEXT_PUBLIC_API_URL_JOBS,
        method: "POST",
        body,
      }),
      transformResponse: (response: any) => response,
    }),

    getMediaChatList: builder.query<any, void>({
      query: (id) => ({
        url: `/chat-history/${id}/medias`,
        baseUrl: process.env.NEXT_PUBLIC_API_URL_CHAT,
      }),
    }),

    // getHomeCategory: builder.query<any, any>({
    //     query: () => "/"
    // })
  }),
});

export const {
  useGetChatUsersListQuery,
  useGetRecentChatHistoryQuery,
  useGetMediaChatListQuery,
  useGetOneToOneHistoryQuery,
  useLazyGetOneToOneHistoryQuery,
  useLazyGetOneToOneChatHistoryQuery,
  useUploadAttachmentFilesMutation,
  useCreateCustomOfferMutation,
} = ChatUserApiService;
