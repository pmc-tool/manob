'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Match pmc-web-client pattern: "SELLER" or "BUYER"
type UserMode = 'SELLER' | 'BUYER';

// Cookie utility functions
function setCookie(name: string, value: string, days: number) {
  if (typeof document === 'undefined') return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

interface UserModeContextType {
  userMode: UserMode;
  toggleUserMode: () => void;
  setUserMode: (mode: UserMode) => void;
  isSeller: boolean;
  isBuyer: boolean;
}

const UserModeContext = createContext<UserModeContextType | undefined>(undefined);

// Public routes that don't trigger mode change
const PUBLIC_ROUTES = [
  '/job-list',
  '/job-details',
  '/product-details',
  '/service-details',
  '/chat',
  '/help',
  '/faqs',
  '/blog',
  '/support',
  '/profile',
  '/marketplace',
  '/pricing',
  '/about',
  '/contact',
  '/auth',
];

export function UserModeProvider({ children }: { children: React.ReactNode }) {
  const [userMode, setUserModeState] = useState<UserMode>('BUYER');
  const [isInitialized, setIsInitialized] = useState(false);
  const pathname = usePathname();

  // Load user mode from localStorage on mount (using r_ty key like pmc-web-client)
  useEffect(() => {
    const savedMode = localStorage.getItem('r_ty') as UserMode | null;
    if (savedMode && (savedMode === 'BUYER' || savedMode === 'SELLER')) {
      setUserModeState(savedMode);
    }
    setIsInitialized(true);
  }, []);

  // Auto-detect mode based on URL path (like pmc-web-client StoreProvider)
  useEffect(() => {
    if (!isInitialized || !pathname) return;

    // Check if it's a public route - don't change mode
    const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route));
    if (isPublicRoute) return;

    // Auto-set mode based on URL path
    if (pathname.startsWith('/seller')) {
      if (userMode !== 'SELLER') {
        setUserModeState('SELLER');
        localStorage.setItem('r_ty', 'SELLER');
        setCookie('r_ty', 'SELLER', 30);
      }
    } else if (pathname.startsWith('/user')) {
      if (userMode !== 'BUYER') {
        setUserModeState('BUYER');
        localStorage.setItem('r_ty', 'BUYER');
        setCookie('r_ty', 'BUYER', 30);
      }
    }
  }, [pathname, isInitialized, userMode]);

  const toggleUserMode = useCallback(() => {
    const newMode = userMode === 'BUYER' ? 'SELLER' : 'BUYER';
    setUserModeState(newMode);
    localStorage.setItem('r_ty', newMode);
    setCookie('r_ty', newMode, 30);
  }, [userMode]);

  const setUserMode = useCallback((mode: UserMode) => {
    setUserModeState(mode);
    localStorage.setItem('r_ty', mode);
    setCookie('r_ty', mode, 30);
  }, []);

  return (
    <UserModeContext.Provider
      value={{
        userMode,
        toggleUserMode,
        setUserMode,
        isSeller: userMode === 'SELLER',
        isBuyer: userMode === 'BUYER',
      }}
    >
      {children}
    </UserModeContext.Provider>
  );
}

export function useUserMode() {
  const context = useContext(UserModeContext);
  if (context === undefined) {
    throw new Error('useUserMode must be used within a UserModeProvider');
  }
  return context;
}
