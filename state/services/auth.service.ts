import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { generateDeviceId } from "../../utils/deviceTokenGenerator";

export const AuthApiService = createApi({
  reducerPath: "AuthApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.API_URL_ACC}`,
    prepareHeaders: (headers) => {
      const { deviceId, deviceType } = generateDeviceId();
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("r_tok");
        if (token) {
          headers.set("Authorization", `Bearer ${token}`);
        }
      }
      headers.set("x-device-id", deviceId);
      headers.set("x-device-type", deviceType);
      headers.set("x-app-client", "pmc-web");
      return headers;
    },
  }),
  endpoints: (builder) => ({
    register: builder.mutation<any, any>({
      query: (body) => ({
        url: "/auth",
        method: "POST",
        body,
      }),
    }),

    verifyOtp: builder.mutation<any, any>({
      query: (body) => ({
        url: "/auth/verify-otp",
        method: "POST",
        body,
      }),
    }),
    login: builder.mutation<any, any>({
      query: (body) => ({
        url: "/auth/login",
        method: "POST",
        body,
      }),
    }),
    forgotPass: builder.mutation<any, any>({
      query: (body) => ({
        url: "/auth/forget-password",
        method: "POST",
        body,
      }),
    }),
    setNewPassword: builder.mutation<any, any>({
      query: (body) => ({
        url: "/auth/confirm-password",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useRegisterMutation,
  useVerifyOtpMutation,
  useLoginMutation,
  useForgotPassMutation,
  useSetNewPasswordMutation,
} = AuthApiService;
