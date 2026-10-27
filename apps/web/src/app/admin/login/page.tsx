"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, Eye, EyeOff, ShieldCheck, ArrowLeft, AlertCircle } from "lucide-react";
import { useAdminAuth } from "@/lib/admin-auth-context";

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAdminAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/admin/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("لطفاً ایمیل و رمز عبور را وارد کنید.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await login(email, password);
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err?.message || "ورود ناموفق بود. لطفاً اطلاعات حساب را بررسی کنید.");
    } finally {
      setIsLoading(false);
    }
  };

  const fillQuick = (userEmail: string, userPass: string) => {
    setEmail(userEmail);
    setPassword(userPass);
    setError(null);
  };

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Brand Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex w-14 h-14 rounded-3xl bg-gradient-to-br from-[#F0AE55] to-[#B87A28] items-center justify-center text-[#0D0E10] font-black text-2xl shadow-[0_0_35px_rgba(240,174,85,0.4)]">
          T
        </div>
        <h1 className="text-2xl font-black text-[#F0F0F1] tracking-tight">
          ورود به مرکز مدیریت تیا
        </h1>
        <p className="text-xs text-[#8E929E]">
          داشبورد تحریریه، سیگنال‌های تحلیلی و کنترل سطوح دسترسی
        </p>
      </div>

      {/* Login Card */}
      <div className="rounded-3xl border border-white/[0.09] bg-[#121316] p-7 sm:p-9 shadow-2xl space-y-6">
        {error && (
          <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#C77A82]/15 border border-[#C77A82]/30 text-xs text-[#C77A82]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#A0A3AD] block">
              نشانی ایمیل اداری
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@theia-finance.ir"
                dir="ltr"
                required
                className="w-full bg-[#17181D] border border-white/10 rounded-2xl px-4 py-3 text-xs text-[#F0F0F1] outline-none focus:border-[#F0AE55] focus:ring-1 focus:ring-[#F0AE55] transition-all pl-10"
              />
              <Mail className="w-4 h-4 text-[#707581] absolute left-3.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#A0A3AD] block">
              رمز عبور
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                dir="ltr"
                required
                className="w-full bg-[#17181D] border border-white/10 rounded-2xl px-4 py-3 text-xs text-[#F0F0F1] outline-none focus:border-[#F0AE55] focus:ring-1 focus:ring-[#F0AE55] transition-all pl-10 pr-4"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#707581] hover:text-white"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3.5 rounded-2xl bg-gradient-to-r from-[#F0AE55] to-[#E59F45] text-[#0D0E10] font-black text-xs hover:opacity-95 transition-all shadow-[0_0_20px_rgba(240,174,85,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-[#0D0E10] border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>ورود به پنل مدیریت</span>
                <ArrowLeft className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Testing Credentials */}
        <div className="pt-4 border-t border-white/[0.06] space-y-2.5">
          <p className="text-[11px] text-[#707581] text-center">
            حساب‌های نمونه از پیش تنظیم شده:
          </p>
          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <button
              type="button"
              onClick={() => fillQuick("admin@theia-finance.ir", "Theia@Admin2026!")}
              className="p-2 rounded-xl bg-white/5 hover:bg-[#F0AE55]/15 border border-white/5 hover:border-[#F0AE55]/30 text-[#A0A3AD] hover:text-[#F0AE55] text-right transition-all"
            >
              <div className="font-bold">مدیر ارشد (Admin)</div>
              <div className="text-[9px] text-[#555964]">admin@theia-finance.ir</div>
            </button>
            <button
              type="button"
              onClick={() => fillQuick("trader@theia-finance.ir", "Theia@Trader2026!")}
              className="p-2 rounded-xl bg-white/5 hover:bg-[#76A98C]/15 border border-white/5 hover:border-[#76A98C]/30 text-[#A0A3AD] hover:text-[#76A98C] text-right transition-all"
            >
              <div className="font-bold">معامله‌گر (Trader)</div>
              <div className="text-[9px] text-[#555964]">trader@theia-finance.ir</div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
