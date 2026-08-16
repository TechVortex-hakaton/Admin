import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { authService } from '@/services/auth.service';
import { TOKEN_KEY } from '@/services/api';
import type { User } from '@/types';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<User>;
  loginWithToken: (token: string) => Promise<User>;
  register: (fullName: string, email: string, password: string) => Promise<{ user: User; token: string }>;
  updateProfile: (payload: {
    fullName?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
  }) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) {
      setIsLoading(false);
      return;
    }
    authService
      .me()
      .then(setUser)
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      })
      .finally(() => setIsLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { user: loggedInUser, token } = await authService.login(email, password);
    localStorage.setItem(TOKEN_KEY, token);
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const loginWithToken = useCallback(async (token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    try {
      const me = await authService.me();
      setUser(me);
      return me;
    } catch (error) {
      localStorage.removeItem(TOKEN_KEY);
      throw error;
    }
  }, []);

  const register = useCallback(async (fullName: string, email: string, password: string) => {
    const result = await authService.register(fullName, email, password);
    return { user: result.user, token: result.token };
  }, []);

  const updateProfile = useCallback(
    async (payload: { fullName?: string; email?: string; currentPassword?: string; newPassword?: string }) => {
      const updated = await authService.updateMe(payload);
      setUser(updated);
      return updated;
    },
    [],
  );

  const logout = useCallback(() => {
    authService.logout().catch(() => undefined);
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      loginWithToken,
      register,
      updateProfile,
      logout,
    }),
    [user, isLoading, login, loginWithToken, register, updateProfile, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
