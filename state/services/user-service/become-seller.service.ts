import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "../../baseQuery";
export const UserBecomeSellerService = createApi({
  reducerPath: "userBecomeSeller",
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    firstStep: builder.mutation<any, any>({
      query: (body) => ({
        url: "/user-seller-req",
        baseUrl: process.env.API_URL_ACC,
        method: "POST",
        body,
      }),
    }),
    secondStep: builder.mutation<any, any>({
      query: ({ id, body }) => ({
        url: `/user-seller-req/${id}/categories`,
        baseUrl: process.env.API_URL_ACC,
        method: "POST",
        body,
      }),
    }),
    updateToSeller: builder.mutation<any, any>({
      query: () => ({
        url: `/user-seller-req/seller-update`,
        baseUrl: process.env.API_URL_ACC,
        method: "PATCH",
      }),
    }),
    //
    getSkills: builder.query<any, void>({
      query: () => ({
        url: "/skills/all?page=1&limit=100",
        baseUrl: process.env.API_URL_INV,
      }),
      transformResponse: (response: any) => response?.data?.skills,
    }),
  }),
});

export const {
  useFirstStepMutation,
  useSecondStepMutation,
  useGetSkillsQuery,
  useUpdateToSellerMutation,
} = UserBecomeSellerService;
