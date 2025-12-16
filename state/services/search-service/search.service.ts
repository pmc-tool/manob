import { Category } from "@emoji-mart/data";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { generateDeviceId } from "../../../utils/deviceTokenGenerator";

const { deviceId, deviceType } = generateDeviceId();
export const SearchApiService = createApi({
  reducerPath: "SearchApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.API_URL_FEED,
    headers: {
      "x-device-id": deviceId,
      "x-device-type": deviceType,
      "x-device-client": "pmc-web",
    },
  }),
  endpoints: (builder) => ({
    getSearchSuggestions: builder.query<any, string>({
      query: (term: string) => `/search-suggestions?query=${term}`,
    }),
  }),
});

export const {
  useGetSearchSuggestionsQuery,
  useLazyGetSearchSuggestionsQuery,
} = SearchApiService;
