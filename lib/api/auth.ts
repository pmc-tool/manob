// CONTRACT: Auth API endpoints match PMC exactly
// MIGRATION: Centralized auth API module

import { api } from './client';
import type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  OTPVerifyRequest,
  OTPVerifyResponse,
  OTPResendRequest,
  OTPResendResponse,
  PasswordRecoveryRequest,
  PasswordRecoveryResponse,
  PasswordResetRequest,
  PasswordResetResponse,
  RefreshTokenRequest,
  RefreshTokenResponse,
  User,
  SuccessResponse,
} from './types';

/**
 * Auth API module
 * CONTRACT: All endpoints and request/response shapes match PMC API
 */
export const authApi = {
  /**
   * Login with email and password
   * CONTRACT: POST /auth/login
   */
  login: (data: LoginRequest) =>
    api.post<LoginResponse>('/auth/login', data, { skipAuth: true }),

  /**
   * Register new user
   * CONTRACT: POST /auth/signup
   */
  signup: (data: SignupRequest) =>
    api.post<SignupResponse>('/auth/signup', data, { skipAuth: true }),

  /**
   * Verify OTP code
   * CONTRACT: POST /auth/otp/verify
   */
  verifyOTP: (data: OTPVerifyRequest) =>
    api.post<OTPVerifyResponse>('/auth/otp/verify', data, { skipAuth: true }),

  /**
   * Resend OTP code
   * CONTRACT: POST /auth/otp/resend
   */
  resendOTP: (data: OTPResendRequest) =>
    api.post<OTPResendResponse>('/auth/otp/resend', data, { skipAuth: true }),

  /**
   * Request password recovery email
   * CONTRACT: POST /auth/password/recovery
   */
  requestPasswordRecovery: (data: PasswordRecoveryRequest) =>
    api.post<PasswordRecoveryResponse>('/auth/password/recovery', data, {
      skipAuth: true,
    }),

  /**
   * Reset password with token
   * CONTRACT: POST /auth/password/reset
   */
  resetPassword: (data: PasswordResetRequest) =>
    api.post<PasswordResetResponse>('/auth/password/reset', data, {
      skipAuth: true,
    }),

  /**
   * Refresh access token
   * CONTRACT: POST /auth/refresh
   */
  refreshToken: (data: RefreshTokenRequest) =>
    api.post<RefreshTokenResponse>('/auth/refresh', data, { skipAuth: true }),

  /**
   * Get current user profile
   * CONTRACT: GET /auth/me
   */
  getCurrentUser: () => api.get<{ user: User }>('/auth/me'),

  /**
   * Logout - invalidate tokens
   * CONTRACT: POST /auth/logout
   */
  logout: () => api.post<SuccessResponse>('/auth/logout', {}),

  /**
   * Change password (authenticated)
   * CONTRACT: POST /auth/password/change
   */
  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    api.post<SuccessResponse>('/auth/password/change', data),

  /**
   * Update email (requires verification)
   * CONTRACT: POST /auth/email/change
   */
  changeEmail: (data: { newEmail: string; password: string }) =>
    api.post<{ message: string; requiresVerification: boolean }>(
      '/auth/email/change',
      data
    ),

  /**
   * Verify email change with OTP
   * CONTRACT: POST /auth/email/verify
   */
  verifyEmailChange: (data: { code: string }) =>
    api.post<SuccessResponse>('/auth/email/verify', data),

  /**
   * Delete account
   * CONTRACT: DELETE /auth/account
   */
  deleteAccount: (data: { password: string; reason?: string }) =>
    api.post<SuccessResponse>('/auth/account/delete', data),
};

// Re-export types for convenience
export type {
  LoginRequest,
  LoginResponse,
  SignupRequest,
  SignupResponse,
  OTPVerifyRequest,
  OTPVerifyResponse,
  PasswordRecoveryRequest,
  PasswordRecoveryResponse,
  PasswordResetRequest,
  PasswordResetResponse,
};

export default authApi;
