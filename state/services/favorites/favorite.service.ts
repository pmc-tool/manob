import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import {
  PreviewsMessageHistory,
  setPreviewsMessageHistory,
} from "../../slices/chat.slice";
import { baseQueryWithReAuth } from "../../baseQuery";

import { HomeApiService } from "../home-service/home.service";
import {
  updateProductFavoriteStatus,
  updateServiceFavoriteStatus,
} from "../../../utils/updateProductFavoriteStatus";

export const FavoriteApiService = createApi({
  reducerPath: "FavoriteApi",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["favoriteProducts", "favoriteServices"],
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
    setFavoriteProduct: builder.mutation<any, void>({
      query: (id) => ({
        url: `/products/${id}/like`,
        method: "POST",
        baseUrl: process.env.API_URL_INV,
      }),
      invalidatesTags: ["favoriteProducts"],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          dispatch(
            updateProductFavoriteStatus(
              HomeApiService,
              "getHomeRecommendedProducts",
              id
            )
          );
          dispatch(
            updateProductFavoriteStatus(
              HomeApiService,
              "getHomeExploreProducts",
              id
            )
          );
          dispatch(
            updateProductFavoriteStatus(
              HomeApiService,
              "getHomeWeeklyProducts",
              id
            )
          );
          dispatch(
            updateProductFavoriteStatus(
              HomeApiService,
              "getHomeTrendingProducts",
              id
            )
          );
          dispatch(
            updateProductFavoriteStatus(
              HomeApiService,
              "getHomeFreeProducts",
              id
            )
          );
          dispatch(
            updateProductFavoriteStatus(
              HomeApiService,
              "getHomeRecentlyViewedProducts",
              id
            )
          );
        } catch (error) {
          console.error("Failed to update product favorite status:", error);
        }
      },
    }),

    setFavoriteService: builder.mutation<any, void>({
      query: (id) => ({
        url: `/services-reviews/${id}/like`,
        method: "POST",
        baseUrl: process.env.API_URL_INV,
      }),
      invalidatesTags: ["favoriteServices"],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          dispatch(
            updateServiceFavoriteStatus(
              HomeApiService,
              "getHomeRecommendedServices",
              id
            )
          );
          dispatch(
            updateServiceFavoriteStatus(
              HomeApiService,
              "getHomeTrendingServices",
              id
            )
          );
          dispatch(
            updateServiceFavoriteStatus(
              HomeApiService,
              "getHomeWeeklyServices",
              id
            )
          );
          dispatch(
            updateServiceFavoriteStatus(
              HomeApiService,
              "getHomeRecentlyViewedServices",
              id
            )
          );
          dispatch(
            updateServiceFavoriteStatus(
              HomeApiService,
              "getHomeExploreServices",
              id
            )
          );
        } catch (error) {
          console.error("Failed to update product favorite status:", error);
        }
      },
    }),

    getFavoriteProducts: builder.query<any, { page: number; limit: number }>({
      query: (query) => ({
        url: `/interactions/favorites-products?page=${query.page}&limit=${query.limit}`,
        baseUrl: process.env.API_URL_INV,
      }),
      keepUnusedDataFor: 0,
      providesTags: ["favoriteProducts"],
    }),

    getFavoriteServices: builder.query<any, { page: number; limit: number }>({
      query: (query) => ({
        url: `/interactions/favorites-services?page=${query.page}&limit=${query.limit}`,
        baseUrl: process.env.API_URL_INV,
      }),
      keepUnusedDataFor: 0,
      providesTags: ["favoriteServices"],
    }),
  }),
});

export const {
  useSetFavoriteProductMutation,
  useSetFavoriteServiceMutation,
  useGetFavoriteProductsQuery,
  useGetFavoriteServicesQuery,
  // useLazyGetOneToOneHistoryQuery,
  // useUploadAttachmentFilesMutation,
} = FavoriteApiService;
