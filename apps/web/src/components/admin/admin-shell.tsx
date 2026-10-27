"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  TrendingUp,
  MessageSquare,
  Users,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Shield,
  Sparkles,
  ChevronLeft,
  Bell,
  LineChart,
  Layers,
} from "lucide-react";
import { useAdminAuth } from "@/lib/admin-auth-context";

interface AdminShellProps {
  children: React.ReactNode;
}

export function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, isAuthenticated, isAdmin, isEditor, isTrader, logout } =
    useAdminAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  // If loading or not authenticated, handle gracefully
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0D0E10] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#F0AE55] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-[#A0A3AD]">در حال بارگذاری مرکز کنترل...</span>
        </div>
      </div>
    );
  }

  if (!isAuthenticated && pathname !== "/admin/login") {
    if (typeof window !== "undefined") {
      router.push("/admin/login");
    }
    return null;
  }

  // Navigation Items with RBAC visibility
  const navItems = [
    {
      label: "داشبورد جامع",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
      visible: true,
    },
    {
      label: "مدیریت مقالات و اخبار",
      href: "/admin/articles",
      icon: FileText,
      visible: isEditor || isAdmin,
    },
    {
      label: "سیگنال‌ها و تحلیل چارت",
      href: "/admin/signals",
      icon: LineChart,
      visible: isTrader || isAdmin,
    },
    {
      label: "دیدگاه‌ها و نظرات",
      href: "/admin/comments",
      icon: MessageSquare,
      visible: isEditor || isAdmin,
    },
    {
      label: "مدیریت نقش‌ها و کاربران",
      href: "/admin/roles",
      icon: Users,
      visible: isAdmin,
    },
  ];

  const getRoleLabel = (role?: string) => {
    switch (role) {
      case "admin":
        return { text: "مدیر کل سیستم", bg: "bg-[#F0AE55]/15 text-[#F0AE55] border-[#F0AE55]/30" };
      case "trader":
        return { text: "معامله‌گر و تحلیل‌گر", bg: "bg-[#76A98C]/15 text-[#76A98C] border-[#76A98C]/30" };
      case "editor":
        return { text: "سردبیر محتوا", bg: "bg-sky-500/15 text-sky-400 border-sky-500/30" };
      default:
        return { text: "کاربر پنل", bg: "bg-white/10 text-white border-white/20" };
    }
  };

  const roleMeta = getRoleLabel(user?.role);

  return (
    <div className="min-h-screen bg-[#0A0B0D] text-[#F0F0F1] flex flex-col md:flex-row antialiased font-sans">
      {/* Mobile Top Bar */}
      <div className="md:hidden flex items-center justify-between p-4 bg-[#121316] border-b border-white/[0.08] sticky top-0 z-40">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl bg-white/5 text-[#A0A3AD] hover:text-white"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-extrabold text-base text-[#F0AE55] tracking-tight">پنل مدیریت تیا</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] px-2.5 py-1 rounded-full border font-semibold ${roleMeta.bg}`}>
            {roleMeta.text}
          </span>
        </div>
      </div>

      {/* Sidebar */}
      <aside
        className={`fixed md:sticky top-0 bottom-0 right-0 z-50 w-72 bg-[#101114] border-l border-white/[0.08] flex flex-col justify-between transition-transform duration-300 md:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div>
          {/* Logo / Brand Header */}
          <div className="p-6 border-b border-white/[0.08] flex items-center justify-between">
            <Link href="/admin/dashboard" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#F0AE55] to-[#B87A28] flex items-center justify-center text-[#0D0E10] font-black shadow-[0_0_20px_rgba(240,174,85,0.35)]">
                T
              </div>
              <div>
                <h2 className="font-black text-base text-[#F0F0F1] tracking-tight">Theia Control</h2>
                <p className="text-[10px] text-[#A0A3AD]">سامانه فرماندهی و محتوا</p>
              </div>
            </Link>
            <button
              type="button"
              onClick={() => setMobileOpen(false)}
              className="md:hidden p-1.5 rounded-lg text-[#8E929E]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Profile Snippet */}
          <div className="p-4 mx-4 my-4 rounded-2xl bg-[#16171B] border border-white/[0.06] flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#202229] border border-white/10 flex items-center justify-center text-[#F0AE55] font-bold text-sm shrink-0">
              {user?.fullName ? user.fullName[0] : "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-[#F0F0F1] truncate">{user?.fullName || "کاربر سیستم"}</p>
              <p className="text-[10px] text-[#707581] truncate dir-ltr text-right">{user?.email}</p>
              <span className={`inline-block mt-1 text-[9px] px-2 py-0.5 rounded-md border font-semibold ${roleMeta.bg}`}>
                {roleMeta.text}
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 space-y-1 mt-2">
            {navItems
              .filter((item) => item.visible)
              .map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-xl text-xs font-semibold transition-all group ${
                      isActive
                        ? "bg-[#F0AE55]/15 text-[#F0AE55] border border-[#F0AE55]/30 shadow-[0_0_15px_rgba(240,174,85,0.15)]"
                        : "text-[#A0A3AD] hover:bg-white/[0.04] hover:text-[#F0F0F1]"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 transition-colors ${isActive ? "text-[#F0AE55]" : "text-[#707581] group-hover:text-[#F0AE55]"}`} />
                      <span>{item.label}</span>
                    </div>
                    {isActive && <div className="w-1.5 h-1.5 rounded-full bg-[#F0AE55] shadow-[0_0_6px_#F0AE55]" />}
                  </Link>
                );
              })}
          </nav>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-white/[0.08] space-y-2">
          <Link
            href="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs text-[#A0A3AD] hover:bg-white/[0.04] hover:text-[#F0AE55] transition-all"
          >
            <span className="flex items-center gap-2.5">
              <ExternalLink className="w-4 h-4" />
              <span>مشاهده وب‌سایت اصلی</span>
            </span>
            <ChevronLeft className="w-3.5 h-3.5 text-[#555964]" />
          </Link>

          <button
            type="button"
            onClick={logout}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs text-[#C77A82] hover:bg-[#C77A82]/10 transition-all font-semibold"
          >
            <span className="flex items-center gap-2.5">
              <LogOut className="w-4 h-4" />
              <span>خروج از پنل</span>
            </span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-8">
          {children}
        </main>
      </div>
    </div>
  );
}
