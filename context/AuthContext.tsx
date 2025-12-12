// CONTRACT: Auth context with PMC storage pattern
// MIGRATION: Centralized auth state management for migrated pages

'use client';

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from '@/lib/api/client';

// DEV: Storage key for dummy user (remove in production)
const DEV_USER_KEY = 'pmc_dev_user';
import type { User, AuthSession } from '@/lib/api/types';

/**
 * Auth context state
 */
export interface AuthContextState {
  /** Current user if authenticated */
  user: User | null;
  /** Whether authentication state is being loaded */
  isLoading: boolean;
  /** Whether user is authenticated */
  isAuthenticated: boolean;
  /** Login with auth session */
  login: (session: AuthSession) => void;
  /** Logout and clear tokens */
  logout: () => void;
  /** Update user profile */
  updateUser: (user: Partial<User>) => void;
  /** Refresh user data from API */
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextState | null>(null);

/**
 * Auth provider props
 */
export interface AuthProviderProps {
  children: ReactNode;
}

/**
 * Auth Provider Component
 * CONTRACT: Uses identical storage pattern as PMC
 */
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Initialize auth state from stored tokens
   * CONTRACT: Matches PMC initialization behavior
   */
  useEffect(() => {
    const initAuth = async () => {
      const accessToken = getAccessToken();
      const refreshToken = getRefreshToken();

      if (!accessToken || !refreshToken) {
        setIsLoading(false);
        return;
      }

      // DEV: Check for dummy tokens first
      if (accessToken.startsWith('dummy-')) {
        if (typeof window !== 'undefined') {
          const storedUser = localStorage.getItem(DEV_USER_KEY);
          if (storedUser) {
            try {
              setUser(JSON.parse(storedUser));
              setIsLoading(false);
              return;
            } catch {
              // Invalid stored user, clear and continue
            }
          }
        }
        // Dummy token but no stored user - clear and show login
        console.warn('[Auth] Dummy token without stored user, clearing');
        clearTokens();
        localStorage.removeItem(DEV_USER_KEY);
        setIsLoading(false);
        return;
      }

      // Skip API call if no API base URL configured (dev mode)
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      if (!apiBaseUrl) {
        console.warn('[Auth] No API_BASE_URL configured, clearing stale tokens');
        clearTokens();
        setIsLoading(false);
        return;
      }

      try {
        // Fetch current user profile with timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(
          `${apiBaseUrl}/auth/me`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            signal: controller.signal,
          }
        );

        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          // Token invalid, clear and let user re-authenticate
          clearTokens();
        }
      } catch {
        // Network error, keep tokens but don't set user
        // User will need to retry or re-authenticate
        console.warn('[Auth] Failed to initialize auth state');
        clearTokens();
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Login with auth session
   * CONTRACT: Stores tokens using PMC pattern
   */
  const login = useCallback((session: AuthSession) => {
    setTokens(session.accessToken, session.refreshToken);
    setUser(session.user);
    // DEV: Store user for dummy auth persistence
    if (typeof window !== 'undefined' && session.accessToken.startsWith('dummy-')) {
      localStorage.setItem(DEV_USER_KEY, JSON.stringify(session.user));
    }
  }, []);

  /**
   * Logout and clear tokens
   * CONTRACT: Clears storage using PMC pattern
   */
  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
    // DEV: Clear stored dev user
    if (typeof window !== 'undefined') {
      localStorage.removeItem(DEV_USER_KEY);
      window.location.href = '/dev-login';
    }
  }, []);

  /**
   * Update user profile locally
   */
  const updateUser = useCallback((updates: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updates } : null));
  }, []);

  /**
   * Refresh user data from API
   */
  const refreshUser = useCallback(async () => {
    const accessToken = getAccessToken();
    if (!accessToken) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL || ''}/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch {
      console.warn('[Auth] Failed to refresh user');
    }
  }, []);

  const value: AuthContextState = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    updateUser,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Hook to access auth context
 * @throws Error if used outside AuthProvider
 */
export function useAuth(): AuthContextState {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

/**
 * Hook to require authentication
 * Redirects to dev-login if not authenticated (DEV mode)
 */
export function useRequireAuth(redirectUrl = '/dev-login'): AuthContextState {
  const auth = useAuth();

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      // Store intended destination for redirect after login
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        if (currentPath !== redirectUrl) {
          sessionStorage.setItem('auth_redirect', currentPath);
        }
        window.location.href = redirectUrl;
      }
    }
  }, [auth.isLoading, auth.isAuthenticated, redirectUrl]);

  return auth;
}

/**
 * Hook to get redirect URL after login
 */
export function useAuthRedirect(): string | null {
  if (typeof window === 'undefined') return null;
  const redirect = sessionStorage.getItem('auth_redirect');
  if (redirect) {
    sessionStorage.removeItem('auth_redirect');
  }
  return redirect;
}

export default AuthContext;
