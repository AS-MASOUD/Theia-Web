"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { webApi } from "./api";
import { AdminUser } from "@/types/admin";

interface AdminAuthContextType {
  user: AdminUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isEditor: boolean;
  isTrader: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const refreshUser = useCallback(async () => {
    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("theia_admin_token") : null;
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }
      const profile = await webApi.adminGetMe();
      setUser(profile);
    } catch {
      if (typeof window !== "undefined") {
        localStorage.removeItem("theia_admin_token");
        localStorage.removeItem("theia_admin_user");
      }
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = async (email: string, passwordPlain: string) => {
    const res = await webApi.adminLogin(email, passwordPlain);
    setUser(res.user);
  };

  const logout = async () => {
    await webApi.adminLogout();
    setUser(null);
    router.push("/admin/login");
  };

  const role = user?.role;
  const isAdmin = role === "admin";
  const isEditor = role === "admin" || role === "editor";
  const isTrader = role === "admin" || role === "trader";

  return (
    <AdminAuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isAdmin,
        isEditor,
        isTrader,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) {
    throw new Error("useAdminAuth must be used within an AdminAuthProvider");
  }
  return ctx;
}
