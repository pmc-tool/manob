import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { deleteCookie, setCookie } from "../../utils/session";

interface AuthState {
  isAuthenticated: boolean;
  userType: string | null;
  error: string | null;
  r_email: string | null;
  r_ty: string | null;
  accessToken: string | null;
  userInfo: object | null;
  userExperience: [] | null;
  userEducation: [] | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  userType: typeof window !== "undefined" ? localStorage.getItem("r_ty") : null,
  error: null,
  r_email: typeof window !== "undefined" ? sessionStorage.getItem("r_em")! : "",
  r_ty: typeof window !== "undefined" ? sessionStorage.getItem("r_ty")! : "",
  accessToken:
    typeof window !== "undefined" ? localStorage.getItem("p_aut")! : null,
  userInfo: {},
  userExperience: [],
  userEducation: [],
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    SetRegistererType(state, action: PayloadAction<string | null>) {
      typeof window !== "undefined"
        ? sessionStorage.setItem("r_ty", action.payload ?? "")
        : "";
      state.userType = action.payload;
    },
    SetRecoveryEmail(state, action: PayloadAction<any | null>) {
      state.r_email = action.payload.r_email;
      state.r_ty = action.payload.r_ty;
      if (action.payload) {
        typeof window !== "undefined"
          ? sessionStorage.setItem("r_em", state.r_email!)
          : "";
      }
    },
    SetAccessToken(state, action: PayloadAction<string | null>) {
      state.accessToken = action.payload;
      state.isAuthenticated = true;
      if (action.payload) {
        typeof window !== "undefined" && localStorage.setItem("p_aut", action.payload);
        setCookie("r_ty", "BUYER", 30);
        setCookie("p_aut", action.payload, 30);
      }
    },
    SetUserInfo(state, action: PayloadAction<any | null>) {
      state.userInfo = action?.payload?.data;
    },
    SetUserExperience(state, action: PayloadAction<any | null>) {
      state.userExperience = action?.payload?.data;
    },
    SetUserEducation(state, action: PayloadAction<any | null>) {
      state.userEducation = action?.payload?.data;
    },
    ResetRegisterState(state) {
      state.r_email = "";
      if (typeof window !== "undefined") {
        sessionStorage.removeItem("r_em");
      }
    },
    LogOut(state) { 
      state.accessToken = "";
      state.userInfo = {};
      state.userExperience = [];
      state.userEducation = [];
      state.isAuthenticated = false;
      if (typeof window !== "undefined") {
        localStorage.removeItem("p_aut");
        localStorage.removeItem("r_ty");
      }
      deleteCookie("p_aut");
      deleteCookie("r_ty");
      window.location.href = "/";
    },
    UpdateUserInfoStatus(state, action: PayloadAction<any | null>) {
      state.userInfo = {
        ...state.userInfo,
        user_status: action?.payload?.user_status,
      };
    },

    UpdateUserPushNotificationStatus(state, action: PayloadAction<any | null>) {
      state.userInfo = {
        ...state.userInfo,
        is_push_active: action?.payload?.is_push_active,
      };
    },
  },
});

export const {
  SetRegistererType,
  SetRecoveryEmail,
  SetAccessToken,
  SetUserInfo,
  SetUserExperience,
  SetUserEducation,
  ResetRegisterState,
  LogOut,
  UpdateUserInfoStatus,
  UpdateUserPushNotificationStatus,
} = authSlice.actions;

export default authSlice.reducer;
