import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "../baseQuery";

export const ShareService = createApi({
  reducerPath: "ShareAPi",
  baseQuery: baseQueryWithReAuth,

  endpoints: (builder) => ({
    getShareRedirectUrl: builder.query<any, any>({
      query: ({ shareUrl, rty, rid, cb }) => ({
        url: `share?u=${shareUrl}&rty=${rty}&rid=${rid}&cb=${cb}`,
        baseUrl: process.env.API_URL_INV,
        // baseUrl: "https://api.packmycode.com/inv/v1",
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled; // Wait for response

          if (data?.data?.url) {
            window.open(data.data.url, "_blank"); // Redirect immediately
          }
        } catch (error) {
          console.error("Redirect failed:", error);
        }
      },
    }),
  }),
});

export const { useLazyGetShareRedirectUrlQuery } = ShareService;
