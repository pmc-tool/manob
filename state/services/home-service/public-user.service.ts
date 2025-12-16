import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { generateDeviceId } from "../../../utils/deviceTokenGenerator";

const { deviceId, deviceType } = generateDeviceId();
export const userProfileApi = createApi({
  reducerPath: "userProfileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.API_URL_ACC,
    headers: {
      "x-device-id": deviceId,
      "x-device-type": deviceType,
      "x-device-client": "pmc-web",
    },
  }),
  endpoints: (builder) => ({
    getFreelancerProfile: builder.query<any, string>({
      query: (id) => `/profile/${id}`,
      transformResponse: (response: any) => {
        if (response.status === false) {
          return null;
        }
        return response.data;
      },
    }),
    getUserExperience: builder.query<any, string>({
      query: (id) => ({
        url: `user-experience/${id}/user`,
        transformResponse: (response: any) => response.data,
      }),
    }),
    getUserEducation: builder.query<any, string>({
      query: (id) => ({
        url: `user-education/${id}/user`,
        transformResponse: (response: any) => response.data,
      }),
    }),

    getUserPublicProfile: builder.query<any, any>({
      query: ({ id, type }) => `/profile/${id}?userType=${type}`,
      transformResponse: (response: any) => response.data,
    }),
  }),
});

export const {
  useGetFreelancerProfileQuery,
  useGetUserExperienceQuery,
  useGetUserEducationQuery,
  useGetUserPublicProfileQuery,
  useLazyGetUserPublicProfileQuery,
} = userProfileApi;
