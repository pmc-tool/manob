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
import { generateDeviceId } from "../../../utils/deviceTokenGenerator";

interface FormData {
  full_name: string;
  email: string;
  phone: string;
  message: string;
}
const { deviceId, deviceType } = generateDeviceId();
export const QueriesApiService = createApi({
  reducerPath: "QueriesApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.API_URL_CORE,
    headers: {
      "Content-Type": "application/json",
      "x-device-id": deviceId,
      "x-device-type": deviceType,
      "x-device-client": "pmc-web",
    },
  }),
  endpoints: (builder) => ({
    query: builder.mutation<any, FormData>({
      query: (body) => ({
        url: `queries`,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useQueryMutation } = QueriesApiService;
