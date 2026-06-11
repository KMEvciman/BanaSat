"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import { authApi, usersApi } from "@/lib/api/services";
import { tokenStore } from "@/lib/api/client";
import type { User } from "@/lib/api/types";

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string, province?: string, district?: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Açılışta token varsa oturumu geri yükle.
  useEffect(() => {
    const token = tokenStore.getAccess();
    if (!token) {
      setLoading(false);
      return;
    }
    authApi
      .me()
      .then((u) => setUser(u))
      .catch(() => {
        tokenStore.clear();
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const result = await authApi.login({ email, password });
    tokenStore.set(result.tokens.accessToken, result.tokens.refreshToken);
    setUser(result.user);
  }, []);

  const register = useCallback(
    async (name: string, email: string, password: string, phone?: string, province?: string, district?: string) => {
      const result = await authApi.register({ name, email, password, phone, province, district });
      tokenStore.set(result.tokens.accessToken, result.tokens.refreshToken);
      setUser(result.user);
    },
    [],
  );

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch {
      // Sunucu hatası olsa bile yerel oturumu kapat.
    }
    tokenStore.clear();
    setUser(null);
  }, []);

  // Profil güncellemesinden dönen kullanıcıyı state'e yansıtmak için.
  const updateProfile = useCallback((data: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : prev));
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const u = await usersApi.updateProfile({});
      setUser(u);
    } catch {
      // yoksay
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!user,
        user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
