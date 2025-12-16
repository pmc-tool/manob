import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "../../baseQuery";

export const TaxInfoApiService = createApi({
  reducerPath: "taxInfoServiceApi",
  baseQuery: baseQueryWithReAuth,
  endpoints: (builder) => ({
    saveUsCitizenTaxInfo: builder.mutation<any, any>({
      query: (body) => ({
        url: "/user-tax-info",
        baseUrl: process.env.API_URL_ACC,
        method: "POST",
        body,
      }),
    }),
    saveNonUsIndividualTaxInfo: builder.mutation<any, any>({
      query: (body) => ({
        url: "/user-tax-info/non-us-individual",
        baseUrl: process.env.API_URL_ACC,
        method: "POST",
        body,
      }),
    }),
    saveNonUsCorporationTaxInfo: builder.mutation<any, any>({
      query: (body) => ({
        url: "/user-tax-info/non-us-corporation",
        baseUrl: process.env.API_URL_ACC,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useSaveUsCitizenTaxInfoMutation,
  useSaveNonUsIndividualTaxInfoMutation,
  useSaveNonUsCorporationTaxInfoMutation,
} = TaxInfoApiService;
