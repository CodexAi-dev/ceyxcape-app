'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, LoginCredentials, RegisterData, AuthContextType } from '@/types';
import { authService } from '@/services/auth';
import { useToastContext } from '@/context/ToastContext';
import api from '@/config/api';
import { STORAGE_KEYS } from '@/config/constants';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { success, error: toastError, info } = useToastContext();

  // ── Hydrate auth state from localStorage on mount, then revalidate ──
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const token = authService.getToken();
    const cached = authService.getCurrentUser();

    // Token presence is the source of truth. If we have a token, we're
    // authenticated — even if the cached user object is missing or stale.
    if (token) {
      setIsAuthenticated(true);
      if (cached) setUser(cached);
    }
    setIsLoading(false);

    // Background revalidation — confirms token is still valid AND fills in
    // a fresh user object (in case cache was missing or had old shape).
    if (token) {
      api.get('/auth/me')
        .then(r => {
          const fresh = r.data;
          if (fresh && fresh.id) {
            localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(fresh));
            setUser(fresh);
            setIsAuthenticated(true);
          }
        })
        .catch(err => {
          if (err?.response?.status === 401) {
            authService.logout();
            setUser(null);
            setIsAuthenticated(false);
          }
          // Other errors (network, 500) — keep cached session
        });
    }
  }, []);

  // ── Cross-tab sync — if localStorage changes elsewhere, sync this tab ──
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEYS.AUTH_TOKEN || e.key === STORAGE_KEYS.USER) {
        const cached = authService.getCurrentUser();
        const token = authService.getToken();
        if (cached && token) {
          setUser(cached);
          setIsAuthenticated(true);
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      setIsAuthenticated(true);
      const name = response.user?.first_name || response.user?.email?.split('@')[0] || 'back';
      success(`Welcome back, ${name}!`, 'Signed in');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    setIsLoading(true);
    try {
      const response = await authService.register(data);
      setUser(response.user);
      setIsAuthenticated(true);
      const name = response.user?.first_name || 'traveller';
      success(`Welcome to CeyXcape, ${name}! Your account is ready.`, 'Account created');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
    info('You have been signed out.', 'Goodbye');
  };

  const updateProfile = async (data: Partial<User>) => {
    setIsLoading(true);
    try {
      const updatedUser = await authService.updateProfile(data);
      setUser(updatedUser);
      success('Your profile has been updated.', 'Profile saved');
    } finally {
      setIsLoading(false);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
