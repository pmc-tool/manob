import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "../../baseQuery";

export const SellerServiceApiService = createApi({
  reducerPath: "sellerServiceApi",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["getServicesToEdit", "getMyServices"],
  endpoints: (builder) => ({
    saveServiceFirstStep: builder.mutation<any, any>({
      query: (body) => ({
        url: "/service-core",
        baseUrl: process.env.API_URL_INV,
        method: "POST",
        body,
      }),
      invalidatesTags: ["getMyServices"],
    }),
    editServiceFirstStep: builder.mutation<any, any>({
      query: (body) => ({
        url: `/service-core/${body?.id}`,
        baseUrl: process.env.API_URL_INV,
        method: "POST",
        body,
      }),
      invalidatesTags: ["getServicesToEdit", "getMyServices"],
    }),
    saveServiceSecondStep: builder.mutation<any, any>({
      query: (body) => ({
        url: `/service-core/${body.id}/step_two`,
        baseUrl: process.env.API_URL_INV,
        method: "POST",
        body,
      }),
      invalidatesTags: ["getServicesToEdit", "getMyServices"],
    }),
    saveServiceThirdStep: builder.mutation<any, any>({
      query: (body) => ({
        url: `/service-core/${body.id}/step_three`,
        baseUrl: process.env.API_URL_INV,
        method: "POST",
        body,
      }),
      invalidatesTags: ["getServicesToEdit", "getMyServices"],
    }),
    submitFinalStep: builder.mutation<any, any>({
      query: (body) => ({
        url: `/service-core/${body.id}/step_four`,
        baseUrl: process.env.API_URL_INV,
        method: "POST",
        body,
      }),
      invalidatesTags: ["getServicesToEdit", "getMyServices"],
    }),
    getServices: builder.query<
      any,
      { page?: Number; status?: string; limit?: string; sortLabel?: string }
    >({
      query: ({ page, status, limit, sortLabel }) => ({
        url: `/service-core/my-services?page=${page}&limit=${limit}&status=${status}&sortBy=${
          sortLabel || "price_asc"
        }`, //'price_asc', 'price_desc', 'date_asc', 'date_desc'
        baseUrl: process.env.API_URL_INV,
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ["getMyServices"],
    }),

    getMyServicesMinimal: builder.query<any, string>({
      query: (query) => ({
        url: `/service-core/my-services/minimal?query=${query}`, //'price_asc', 'price_desc', 'date_asc', 'date_desc'
        baseUrl: process.env.API_URL_INV,
      }),
      transformResponse: (response: any) => response.data,
    }),
    getServiceById: builder.query<any, string>({
      query: (id) => ({
        url: `/service-core/${id}`,
        baseUrl: process.env.API_URL_INV,
      }),
      transformResponse: (response: any) => response.data,
    }),
    getServiceForEdit: builder.query<any, { id: string; step: number }>({
      query: ({ id, step }) => ({
        url: `/service-core/${id}/edit?step=${step}`,
        baseUrl: process.env.API_URL_INV,
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ["getServicesToEdit"],
    }),
    // delete mutation
    deleteService: builder.mutation<any, string>({
      query: (id) => ({
        url: `/service-core/my-services/${id}`,
        baseUrl: process.env.API_URL_INV,
        method: "DELETE",
      }),
      invalidatesTags: ["getMyServices"],
    }),
  }),
});

export const {
  useSaveServiceFirstStepMutation,
  useEditServiceFirstStepMutation,
  useSaveServiceSecondStepMutation,
  useSaveServiceThirdStepMutation,
  useSubmitFinalStepMutation,
  useGetServicesQuery,
  useGetServiceForEditQuery,
  useLazyGetServicesQuery,
  useLazyGetServiceByIdQuery,
  useGetMyServicesMinimalQuery,
  useDeleteServiceMutation,
} = SellerServiceApiService;
