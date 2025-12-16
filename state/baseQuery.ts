import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { LogOut, SetAccessToken } from "./slices/auth.slice";
import { RootState } from "./store";
import toast from "react-hot-toast";
import { generateDeviceId } from "../utils/deviceTokenGenerator";
import { deleteCookie } from "../utils/session";

const mutex = {
  locked: false,
  acquire: () => {
    return new Promise((resolve) => {
      const checkLock = () => {
        if (!mutex.locked) {
          mutex.locked = true;
          resolve(() => {
            mutex.locked = false;
          });
        } else {
          setTimeout(checkLock, 100); // Retry every 100ms
        }
      };
      checkLock();
    });
  },
  isLocked: () => mutex.locked,
  waitForUnlock: () =>
    new Promise((resolve) => {
      const checkLock = () => {
        if (!mutex.locked) {
          resolve(() => {});
        } else {
          setTimeout(checkLock, 100);
        }
      };
      checkLock();
    }),
};

// Dynamic base query handling
const dynamicBaseQuery = async (args: any, api: any, extraOptions: any) => {
  const customBaseUrl = args?.baseUrl || process.env.API_URL;

  const baseQuery = fetchBaseQuery({
    baseUrl: customBaseUrl,
    prepareHeaders: (headers, { getState }) => {
      const { deviceId, deviceType } = generateDeviceId(); 
      const token =
        typeof window !== "undefined" && localStorage.getItem("p_aut");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      } 

      headers.set("x-device-id", deviceId);
      headers.set("x-device-type", deviceType);
      headers.set("x-app-client", "pmc-web");
      
      if (typeof window !== "undefined") {
        headers.set("x-page-url", window.location.href);
      }

      return headers;
    },
  });

  return baseQuery(args, api, extraOptions);
};

// Base query with re-auth handling (including token refresh)
export const baseQueryWithReAuth = async (
  args: any,
  api: any,
  extraOptions: any
) => {
  // First attempt the base query 
  let result: any = await dynamicBaseQuery(args, api, extraOptions); 
  // If we get a 401 error, try to refresh the token
  if (result?.data?.statusCode === 401 || result?.error?.status === 401) {
    if (!mutex.isLocked()) {
      const release: any = await mutex.acquire(); // Lock while refreshing the token

      try {
        const refreshToken = (api.getState() as RootState).auth?.accessToken;
        const p_aut =
          typeof window !== "undefined"
            ? window.localStorage.getItem("p_aut")
            : null;
        // console.log("here = 33", refreshToken);
        // console.log("p_aut", p_aut);
        const refreshResult = await fetch(
          `${process.env.API_URL_ACC}/auth/token`,
          {
            headers: {
              Authorization: `Bearer ${refreshToken}`,
            },
          }
        );
        // console.log("here = 33", refreshToken);
        const data = await refreshResult.json();
        // console.log("here = 33", data);
        if (data?.data) {
          const token = data?.data?.access_token;
          // console.log("here = 44", token);
          api.dispatch(SetAccessToken(token));
          // localStorage.setItem("p_aut", token);
          // Retry the original query with the new token
          result = await dynamicBaseQuery(args, api, extraOptions);
        } else { 
          api.dispatch(LogOut()); // Ensure you have a logout action
          localStorage.removeItem("p_aut");
          localStorage.removeItem("r_ty");
          deleteCookie("p_aut");
          deleteCookie("r_ty");
          window.location.href = "/";
        }
      } finally {
        release(); // Release the mutex
      }
    } else {
      // Wait for the mutex to be released before retrying the query
      await mutex.waitForUnlock();
      result = await dynamicBaseQuery(args, api, extraOptions);
    }
  } else if (
    result?.data?.statusCode === 403 ||
    result?.error?.status === 403
  ) {
    api.dispatch(LogOut()); // Ensure you have a logout action
    localStorage.removeItem("p_aut");
    localStorage.removeItem("r_ty");
    deleteCookie("p_aut");
    deleteCookie("r_ty");
    window.location.href = "/";
  } 
  return result;
};
