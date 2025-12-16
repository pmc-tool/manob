import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReAuth } from "../../baseQuery";

export const SellerProductApiService = createApi({
  reducerPath: "sellerProductApi",
  baseQuery: baseQueryWithReAuth, 
  tagTypes: ["getProductToEdit", "getMyProducts"],
  endpoints: (builder) => ({
    saveProductFirstStep: builder.mutation<any, any>({
      query: (body) => ({
        url: "/products/step-one",
        baseUrl: process.env.API_URL_INV,
        method: "POST",
        body,
      }),
    }),
    updateProductFirstStep: builder.mutation<any, any>({
      query: ({ body, id }) => ({
        url: `/products/step-one/${id}`,
        baseUrl: process.env.API_URL_INV,
        method: "POST",
        body,
      }),
      invalidatesTags: ["getProductToEdit"],
    }),
    saveProductSecondStep: builder.mutation<any, any>({
      query: (body) => ({
        url: `/products/step-two/${body.productId}`,
        baseUrl: process.env.API_URL_INV,
        method: "POST",
        body,
      }),
      invalidatesTags: ["getProductToEdit"],
    }),
    saveProductThirdStep: builder.mutation<any, any>({
      query: (body) => ({
        url: `/products/step-three/${body.productId}`,
        baseUrl: process.env.API_URL_INV,
        method: "POST",
        body,
      }),
      invalidatesTags: ["getProductToEdit"],
    }),
    submitProductFourthStep: builder.mutation<any, any>({
      query: (body) => ({
        url: `/products/final/${body.productId}`,
        baseUrl: process.env.API_URL_INV,
        method: "POST",
        body,
      }),
      invalidatesTags: ["getProductToEdit"],
    }), 
    saveProductFiles: builder.mutation<any, any>({
      query: (body) => ({
        url: `/medias`,
        baseUrl: process.env.API_URL_INV,
        method: "POST",
        body,
      }),
    }),
    getMyProducts: builder.query<
      any,
      { page: Number; status: string; sortLabel: string }
    >({
      query: ({ page, status, sortLabel }) => ({
        url: `/products/my-products?page=${page}&status=${status}&sortBy=${
          sortLabel || "price_asc"
        }`, //'price_asc', 'price_desc', 'date_asc', 'date_desc'
        baseUrl: process.env.API_URL_INV,  
      }),
      transformResponse: (response: any) => response?.data,
      providesTags: ["getMyProducts"],
    }),
    getProductById: builder.query<any, string>({
      query: (id) => ({
        url: `/products/${id}`,
        baseUrl: process.env.API_URL_INV, 
      }),
      transformResponse: (response: any) => response.data,
    }),
    getProductToEdit: builder.query<any, { id: string; step: number }>({
      query: ({ id, step }) => ({
        url: `/products/${id}/edit?step=${step}`,
        baseUrl: process.env.API_URL_INV, 
      }),
      transformResponse: (response: any) => response.data,
      providesTags: ["getProductToEdit"],
    }),
    getProductAttrTypes: builder.query<any, { category_id: Number }>({
      query: ({ category_id }) => ({
        url: `/categories/${category_id}/attributes`,
        // url: `/info/product-attr-types?category_id=${category_id}`,
        baseUrl: process.env.API_URL_INV, 
      }),
      transformResponse: (response: any) => response.data,
    }),
    getCategoryById: builder.query<any, string>({
      query: (id) => ({
        url: `/categories/${id}`,
        baseUrl: process.env.API_URL_INV, 
      }),
      transformResponse: (response: any) => ({
        title: response.data.title,
        buyer_fee: response.data.buyer_fee,
        extended_buyer_fee: response.data.extended_buyer_fee,
      }), 
    }),
    deleteProduct: builder.mutation<any, string>({
      query: (id) => ({
        url: `/products/my-products/${id}`,
        baseUrl: process.env.API_URL_INV,
        method: "DELETE",
      }),
      invalidatesTags: ["getMyProducts"],
    }),
  }),
});

export const {
  useSaveProductFirstStepMutation,
  useUpdateProductFirstStepMutation,
  useSaveProductSecondStepMutation,
  useSaveProductThirdStepMutation,
  useSubmitProductFourthStepMutation,
  useSaveProductFilesMutation,
  useGetMyProductsQuery,
  useGetProductAttrTypesQuery,
  useLazyGetProductAttrTypesQuery,
  useLazyGetProductByIdQuery,
  useGetProductByIdQuery,
  useGetCategoryByIdQuery,
  useLazyGetCategoryByIdQuery,
  useGetProductToEditQuery,
  useDeleteProductMutation,
} = SellerProductApiService;
