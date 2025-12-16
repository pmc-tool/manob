import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { generateDeviceId } from "../../utils/deviceTokenGenerator";

const { deviceId, deviceType } = generateDeviceId();
export const MediaService = createApi({
  reducerPath: "mediaApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.API_URL_INV}`,
    headers: { 
      "x-device-id": deviceId,
      "x-device-type": deviceType,
      "x-device-client": "pmc-web",
    },
  }),
  endpoints: (builder) => ({
    saveMedia: builder.mutation<any, any>({
      query: (body) => ({
        url: "/medias",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useSaveMediaMutation } = MediaService;
