import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "../../baseQuery";

export const SellerProfileApiService = createApi({
  reducerPath: "SellerProfileApi",
  // baseQuery: fetchBaseQuery({
  //   baseUrl: process.env.API_URL_ACC,
  //   headers: {
  //     "Content-Type": "application/json",
  //     authorization: `Bearer ${
  //       typeof window !== "undefined" && localStorage.getItem("p_aut")
  //     }`,
  //   },
  // }),
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    getUserProfile: builder.query<any, void>({
      query: () => ({
        url: "/auth/profile",
        baseUrl: process.env.API_URL_ACC,
        transformResponse: (response: any) => ({
          id: response.data.id,
          email: response.data.email,
          avatar: response.data.avatar,
          full_name: response.data.full_name,
          join_as: response.data.join_as,
          username: response.data.user_name,
        }),
      }),
      // getUser: builder.query<any, void>({
      //   query: () => ({
      //     url: "/auth/profile",
      //     baseUrl: process.env.API_URL_ACC,
      //     method: "GET",
      //     transformResponse: (response: any) => ({
      //       id: response.data.id,
      //       email: response.data.email,
      //       avatar: response.data.avatar,
      //       full_name: response.data.full_name,
      //       join_as: response.data.join_as,
      //       username: response.data.user_name,
      //     }),
      //   }),
    }),
    // getHomeCategory: builder.query<any, any>({
    //     query: () => "/"
    // })
  }),
});

export const { useGetUserProfileQuery } = SellerProfileApiService;
