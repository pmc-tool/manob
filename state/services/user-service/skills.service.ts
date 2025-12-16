import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "../../baseQuery";

export const UserSkillsApiService = createApi({
  reducerPath: "userSkillsApi",
  baseQuery: baseQueryWithReAuth, 
  endpoints: (builder) => ({
    getSearchSkills: builder.query<any, string>({
      query: (name) => ({
        url: `/skills?name=${name}`,
        baseUrl: process.env.API_URL_INV,
      }),
      transformResponse: (response: any) => response.data,
    }),
  }),
});

export const { useLazyGetSearchSkillsQuery } = UserSkillsApiService;
