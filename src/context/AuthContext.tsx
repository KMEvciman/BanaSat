"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

interface AuthContextType {
  isLoggedIn: boolean;
  user: { name: string; email: string } | null;
  login: (email: string, password: string) => void;
  register: (name: string, email: string, password: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const login = useCallback((_email: string, _password: string) => {
    // TODO: Backend entegrasyonu yapıldığında gerçek API çağrısı ile değiştirilecek
    setUser({ name: "Kullanıcı Adı", email: _email });
    setIsLoggedIn(true);
  }, []);

  const register = useCallback((_name: string, _email: string, _password: string) => {
    // TODO: Backend entegrasyonu yapıldığında gerçek API çağrısı ile değiştirilecek
    setUser({ name: _name, email: _email });
    setIsLoggedIn(true);
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setIsLoggedIn(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, register, logout }}>
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
