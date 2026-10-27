"use client";

import React from "react";
import Link from "next/link";
import { LineChart, ArrowLeft } from "lucide-react";
import { ChartSignalsSection } from "@/components/market/chart-signals-section";

export default function AnalysisHubPage() {
  return (
    <div className="min-h-screen py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1B1D21] border border-white/[0.08] text-xs text-[#76A98C]">
              <LineChart className="w-3.5 h-3.5" />
              <span>پایگاه تحلیل‌های تکنیکال، چارت‌ها و داده‌های ساختاری</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-[#F0F0F1] tracking-tight">
              تحلیل و سیگنال‌های تخصصی بازارهای مالی
            </h1>
            <p className="text-xs md:text-sm text-[#A0A3AD] leading-relaxed">
              رصد عمیق الگوهای قیمتی، سطوح کلیدی عرضه و تقاضا، شاخص‌های بنیادی کلان و ایده‌های معاملاتی معامله‌گران ارشد شبکه تیا در بازارهای طلا، ارز، سهام و رمزارز.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/markets"
              className="px-4 py-2 rounded-xl bg-[#151619] hover:bg-[#1B1D21] border border-white/[0.08] text-[#F0AE55] text-xs font-semibold transition-all flex items-center gap-1.5"
            >
              <span>دیده‌بان نرخ‌های زنده</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* The Complete Signals & Analysis Section */}
        <ChartSignalsSection hideHeader={true} />

        {/* Trader Contribution CTA */}
        <div className="rounded-[22px] bg-gradient-to-r from-[#14161A] via-[#191D22] to-[#14161A] border border-white/[0.08] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-right">
            <h3 className="text-lg font-bold text-[#F0F0F1]">
              شما هم یک تحلیل‌گر یا معامله‌گر حرفه‌ای هستید؟
            </h3>
            <p className="text-xs text-[#A0A3AD]">
              با ثبت‌نام در سامانه و ارتقای حساب خود به عنوان تحلیل‌گر تاییدشده (Trader)، دیدگاه‌ها و چارت‌های تکنیکال خود را برای هزاران کاربر پلتفرم به اشتراک بگذارید.
            </p>
          </div>

          <Link
            href="/register"
            className="px-6 py-3 rounded-[13px] bg-[#76A98C] hover:bg-[#8EC0A3] text-[#0D0E10] text-xs font-bold transition-all shadow-[0_0_20px_rgba(118,169,140,0.25)] shrink-0"
          >
            پیوستن به معامله‌گران تیا
          </Link>
        </div>
      </div>
    </div>
  );
}
