"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface User {
  name: string;
  email: string;
  phone: string;
  avatar: string | null;
  bio: string;
  location: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string) => void;
  register: (name: string, email: string, password: string) => void;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultUser: User = {
  name: "Kullanıcı Adı",
  email: "user@banasat.com",
  phone: "0532 123 45 67",
  avatar: null,
  bio: "",
  location: "İstanbul, Türkiye",
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((_email: string, _password: string) => {
    setUser({ ...defaultUser, email: _email || defaultUser.email });
    setIsLoggedIn(true);
  }, []);

  const register = useCallback((_name: string, _email: string, _password: string) => {
    setUser({ ...defaultUser, name: _name || defaultUser.name, email: _email || defaultUser.email });
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  const updateProfile = useCallback((data: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, register, logout, updateProfile }}>
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
