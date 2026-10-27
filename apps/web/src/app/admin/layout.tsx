"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { AdminAuthProvider } from "@/lib/admin-auth-context";
import { AdminShell } from "@/components/admin/admin-shell";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  return (
    <AdminAuthProvider>
      {isLoginPage ? (
        <div className="min-h-screen bg-[#0A0B0D] text-[#F0F0F1] flex items-center justify-center p-4 antialiased">
          {children}
        </div>
      ) : (
        <AdminShell>{children}</AdminShell>
      )}
    </AdminAuthProvider>
  );
}
