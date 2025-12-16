import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "../baseQuery";
import toast from "react-hot-toast";
import {
  UpdateUserInfoStatus,
  UpdateUserPushNotificationStatus,
} from "../slices/auth.slice";

export const UserApiService = createApi({
  reducerPath: "UserApi",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["getProfile", "getUserExperience", "getUserEducation"],
  endpoints: (builder) => ({
    getUserProfile: builder.query<any, void>({
      query: () => ({
        url: "/profile",
        baseUrl: process.env.API_URL_ACC,
        transformResponse: (response: any) => response.data,
      }),
      providesTags: ["getProfile"],
    }),

    getUserSubscription: builder.query<any, void>({
      query: () => ({
        url: "/user-subs",
        baseUrl: process.env.API_URL_ACC,
        transformResponse: (response: any) => response.data,
      }),
    }),

    getUserRecentSubscription: builder.query<any, void>({
      query: () => ({
        url: "/subscription-orders/recent-purchases",
        baseUrl: process.env.API_URL_ORDER,
        transformResponse: (response: any) => response.data,
      }),
    }),

    updateProfile: builder.mutation({
      query: (data) => ({
        url: `profile`,
        baseUrl: process.env.API_URL_ACC,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["getProfile"],
    }),
    skillCreate: builder.mutation({
      query: (data) => ({
        url: `user-skills`,
        baseUrl: process.env.API_URL_ACC,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["getProfile"],
    }),
    getSkills: builder.query<any, void>({
      query: () => ({
        url: "user-skills",
        baseUrl: process.env.API_URL_ACC,
        transformResponse: (response: any) => response.data,
      }),
    }),
    searchSkills: builder.query<any, string>({
      query: (keyword) => ({
        url: `skills?name=${keyword}`,
        baseUrl: process.env.API_URL_INV,
      }),
      transformResponse: (response: any) => response.data,
    }),
    addLanguage: builder.mutation({
      query: (data) => ({
        url: `user-languages`,
        baseUrl: process.env.API_URL_ACC,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["getProfile"],
    }),
    getUserExperience: builder.query<any, void>({
      query: () => ({
        url: "user-experience",
        baseUrl: process.env.API_URL_ACC,
        transformResponse: (response: any) => response.data,
      }),
      providesTags: ["getUserExperience"],
    }),
    addExperience: builder.mutation({
      query: (data) => ({
        url: `user-experience`,
        baseUrl: process.env.API_URL_ACC,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["getUserExperience"],
    }),
    experienceDelete: builder.mutation({
      query: (id) => ({
        url: `user-experience/${id}`,
        baseUrl: process.env.API_URL_ACC,
        method: "DELETE",
      }),
      invalidatesTags: ["getUserExperience"],
    }),
    experienceEdit: builder.mutation({
      query: (data) => ({
        url: `user-experience/${data.id}`,
        baseUrl: process.env.API_URL_ACC,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["getUserExperience"],
    }),

    getUserLanguages: builder.query<any, void>({
      query: () => ({
        url: "user-languages",
        baseUrl: process.env.API_URL_ACC,
        transformResponse: (response: any) => response.data,
      }),
    }),
    getAllLanguages: builder.query<any, void>({
      query: () => ({
        url: "languages",
        baseUrl: process.env.API_URL_ACC,
        transformResponse: (response: any) => response.data,
      }),
    }),
    getAllNativeLanguages: builder.query<any, void>({
      query: () => ({
        url: "languages/native",
        baseUrl: process.env.API_URL_ACC,
        transformResponse: (response: any) => response.data,
      }),
    }),
    skillDelete: builder.mutation({
      query: ({ id }) => ({
        url: `user-skills/${id}`,
        method: "DELETE",
      }),
    }),
    getUserEducation: builder.query<any, void>({
      query: () => ({
        url: "user-education",
        baseUrl: process.env.API_URL_ACC,
        transformResponse: (response: any) => response.data,
      }),
      providesTags: ["getUserEducation"],
    }),
    addEducation: builder.mutation({
      query: (data) => ({
        url: `user-education`,
        baseUrl: process.env.API_URL_ACC,
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["getUserEducation"],
    }),
    deleteEducation: builder.mutation({
      query: (id) => ({
        url: `user-education/${id}`,
        baseUrl: process.env.API_URL_ACC,
        method: "DELETE",
      }),
      invalidatesTags: ["getUserEducation"],
    }),
    educationEdit: builder.mutation({
      query: (data) => ({
        url: `user-education/${data.id}`,
        baseUrl: process.env.API_URL_ACC,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["getUserEducation"],
    }),
    changePassword: builder.mutation({
      query: (data) => ({
        url: `auth/update-password`,
        baseUrl: process.env.API_URL_ACC,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["getUserEducation"],
    }),
    uploadImg: builder.mutation({
      query: (file) => {
        const formData = new FormData();
        formData.append("avatar", file);
        return {
          url: "/profile/update-avatar",
          baseUrl: process.env.API_URL_ACC,
          method: "PUT",
          body: formData,
        };
      },
      invalidatesTags: ["getProfile"],
    }),
    updateUserOnlineStatus: builder.mutation<any, string>({
      query: (body) => ({
        url: `/user/online-status`,
        method: "PUT",
        body: { online_status: body },
        baseUrl: process.env.API_URL_ACC,
      }),
      invalidatesTags: ["getProfile"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.status === true) {
            dispatch(
              UpdateUserInfoStatus({ user_status: data?.data?.user_status })
            );
            toast.success("Online status updated");
          }
          // dispatch(setPreviewsMessageHistory(data?.data));
        } catch (error: any) {
          console.log({
            message: error.message,
          });
        }
      },
    }),

    updateUserNotification: builder.mutation<any, void>({
      query: () => ({
        url: `/user/toggle-push`,
        method: "PUT",
        baseUrl: process.env.API_URL_ACC,
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data?.status === true) {
            dispatch(
              UpdateUserPushNotificationStatus({
                is_push_active: data?.data?.is_push_active,
              })
            );
            toast.success(
              `Notification ${
                data?.data?.is_push_active ? "turn On" : "turn Off"
              }`
            );
          }
          // dispatch(setPreviewsMessageHistory(data?.data));
        } catch (error: any) {
          console.log({
            message: error.message,
          });
        }
      },
    }),

    updateUserNotificationToken: builder.mutation<any, any>({
      query: (body) => ({
        url: `/device-token`,
        method: "POST",
        body,
        baseUrl: process.env.API_URL_ACC,
      }),
    }),
    getConnect: builder.query<any, void>({
      query: () => ({
        url: `/client/job-connects/my-connects`,
        method: "GET",
        baseUrl: process.env.API_URL_ACC,
      }),
      keepUnusedDataFor: 0,
      transformResponse: (response: any) => response.data,
    }),
    getRecentPurchaseConnect: builder.query<any, any>({
      query: (params) => ({
        url: `/subscription-orders/recent-purchases?page=${params.page}&limit=${params.limit}`,
        method: "GET",
        baseUrl: process.env.API_URL_ORDER,
      }),
      keepUnusedDataFor: 0,
      transformResponse: (response: any) => response.data,
    }),
    logOut: builder.mutation({
      query: () => ({
        url: `/auth/logout`,
        method: "POST",
        baseUrl: process.env.API_URL_ACC,
      }),
    }),
    updateReferralCode: builder.mutation({
      query: () => ({
        url: `/referral-code`,
        method: "POST",
        baseUrl: process.env.API_URL_ACC,
      }),
    }),
    shareReferralCode: builder.mutation({
      query: (body: { email: string; url: string })  => ({
        url: `/referral-code/share`,
        method: "POST",
        baseUrl: process.env.API_URL_ACC,
        body
      }),
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useLazyGetUserSubscriptionQuery,
  useGetUserSubscriptionQuery,
  useGetUserRecentSubscriptionQuery,
  useLazyGetUserProfileQuery,
  useUpdateProfileMutation,
  useSkillCreateMutation,
  useGetSkillsQuery,
  useSkillDeleteMutation,
  useAddLanguageMutation,
  useGetUserLanguagesQuery,
  useGetAllLanguagesQuery,
  useGetAllNativeLanguagesQuery,
  useGetUserExperienceQuery,
  useAddExperienceMutation,
  useExperienceDeleteMutation,
  useExperienceEditMutation,
  useGetUserEducationQuery,
  useAddEducationMutation,
  useDeleteEducationMutation,
  useEducationEditMutation,
  useUploadImgMutation,
  useChangePasswordMutation,
  useSearchSkillsQuery,
  useUpdateUserOnlineStatusMutation,
  useUpdateUserNotificationMutation,
  useUpdateUserNotificationTokenMutation,
  useGetConnectQuery,
  useGetRecentPurchaseConnectQuery,
  useLogOutMutation,
  useUpdateReferralCodeMutation,
  useShareReferralCodeMutation
} = UserApiService;
