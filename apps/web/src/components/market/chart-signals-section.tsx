"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  TrendingUp,
  TrendingDown,
  Clock,
  Sparkles,
  ChevronLeft,
  Eye,
  Maximize2,
  Compass,
  ArrowLeft,
  Activity,
  BarChart3,
} from "lucide-react";
import { webApi } from "@/lib/api";
import { MarketSignal, TrendBias } from "@/types/market-signals";

const SIGNAL_CATEGORIES = [
  { id: "all", label: "همه بازارها" },
  { id: "gold_coin", label: "طلا و مسکوکات" },
  { id: "currency", label: "ارزهای شاخص" },
  { id: "crypto", label: "رمزارزها" },
  { id: "stock", label: "بورس و سهام" },
  { id: "commodity", label: "فلزات و کالاها" },
];

export function ChartSignalsSection({ hideHeader = false }: { hideHeader?: boolean }) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const { data: signals, isLoading } = useQuery<MarketSignal[]>({
    queryKey: ["public-signals", selectedCategory],
    queryFn: () => webApi.getSignals(selectedCategory === "all" ? undefined : selectedCategory),
    refetchInterval: 30000,
  });

  const getTrendBadge = (trend?: TrendBias) => {
    switch (trend) {
      case "BULLISH":
        return {
          label: "صعودی (Bullish)",
          icon: TrendingUp,
          bg: "bg-[#76A98C]/20 text-[#76A98C] border-[#76A98C]/40",
        };
      case "BEARISH":
        return {
          label: "نزولی (Bearish)",
          icon: TrendingDown,
          bg: "bg-[#C77A82]/20 text-[#C77A82] border-[#C77A82]/40",
        };
      default:
        return {
          label: "خنثی / رنج (Neutral)",
          icon: Activity,
          bg: "bg-[#F0AE55]/20 text-[#F0AE55] border-[#F0AE55]/40",
        };
    }
  };

  return (
    <section className="space-y-6 pt-4">
      {/* Section Header */}
      {!hideHeader ? (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1B1D21] border border-white/[0.08] text-xs text-[#76A98C]">
              <LineChart className="w-3.5 h-3.5" />
              <span>تحلیل چارت و شاخص‌های بنیادی معامله‌گران</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#F0F0F1] tracking-tight">
              دیده‌بان چارت و تحلیل ساختاری بازارهای مالی
            </h2>
            <p className="text-xs sm:text-sm text-[#A0A3AD] max-w-2xl leading-relaxed">
              بررسی تخصصی الگوهای نموداری، شاخص‌های کلان اقتصادی و داده‌های فاندامنتال توسط معامله‌گران ارشد تیا
            </p>
          </div>

          {/* Categories Tab Bar */}
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-[#141518] border border-white/[0.08]">
            {SIGNAL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-[#76A98C] text-[#0D0E10] shadow-[0_0_12px_rgba(118,169,140,0.3)]"
                    : "text-[#A0A3AD] hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-white/[0.06]">
          <div className="text-xs font-bold text-[#A0A3AD]">
            <span>فیلتر چارت‌ها بر اساس بازار:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-2xl bg-[#141518] border border-white/[0.08]">
            {SIGNAL_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? "bg-[#76A98C] text-[#0D0E10] shadow-[0_0_12px_rgba(118,169,140,0.3)]"
                    : "text-[#A0A3AD] hover:text-white"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Signals / Analyses Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div
              key={n}
              className="h-80 rounded-3xl bg-[#141518] border border-white/[0.06] animate-pulse"
            />
          ))}
        </div>
      ) : signals && signals.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {signals.map((signal) => {
            const trendBadge = getTrendBadge(signal.trendBias);
            const TrendIcon = trendBadge.icon;

            return (
              <div
                key={signal.id}
                className="group rounded-3xl border border-white/[0.08] bg-gradient-to-b from-[#16171B] to-[#121316] p-6 space-y-5 shadow-[0_15px_35px_rgba(0,0,0,0.4)] hover:border-[#76A98C]/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  {/* Top Bar: Symbol, Trend Bias & Timeframe */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-xl bg-white/10 font-mono font-bold text-xs text-[#F0F0F1] tracking-wider">
                        {signal.symbol}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[11px] font-bold border ${trendBadge.bg}`}
                      >
                        <TrendIcon className="w-3.5 h-3.5" />
                        <span>{trendBadge.label}</span>
                      </span>
                    </div>

                    <span className="text-[10px] px-2 py-0.5 rounded-lg bg-white/5 text-[#8E929E] font-mono">
                      {signal.timeframe}
                    </span>
                  </div>

                  {/* Title linking to full page */}
                  <h3 className="font-extrabold text-sm sm:text-base text-[#F0F0F1] line-clamp-2 leading-snug group-hover:text-[#76A98C] transition-colors">
                    <Link href={`/analysis/${signal.id}`}>
                      {signal.title}
                    </Link>
                  </h3>

                  {/* Chart Snapshot Thumbnail */}
                  {signal.chartImageUrl && (
                    <Link
                      href={`/analysis/${signal.id}`}
                      className="block relative rounded-2xl overflow-hidden border border-white/[0.08] bg-[#0E0F12] h-44 group/img"
                    >
                      <img
                        src={signal.chartImageUrl}
                        alt={signal.title}
                        className="w-full h-full object-cover group-hover/img:scale-105 transition-transform duration-500 opacity-90 group-hover/img:opacity-100"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end justify-between p-3">
                        <span className="text-[10px] font-mono text-white/80 bg-black/60 px-2 py-0.5 rounded-lg">
                          چارت تحلیلی
                        </span>
                        <div className="flex items-center gap-1 text-[11px] text-[#76A98C] font-semibold bg-black/70 px-2.5 py-1 rounded-xl">
                          <Eye className="w-3.5 h-3.5" />
                          <span>مشاهده چارت و شاخص‌ها</span>
                        </div>
                      </div>
                    </Link>
                  )}

                  {/* Summary / Excerpt */}
                  <p className="text-xs text-[#A0A3AD] line-clamp-3 leading-relaxed">
                    {signal.summary || signal.analysisText.replace(/[#*`_]/g, "").slice(0, 160)}
                  </p>
                </div>

                {/* Footer: Trader profile & CTA to complete page */}
                <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#76A98C] to-[#456C56] flex items-center justify-center text-[#0D0E10] font-black text-xs shadow-md">
                      {signal.traderName[0]}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[#F0F0F1] leading-none">
                        {signal.traderName}
                      </p>
                      <p className="text-[10px] text-[#707581] mt-1">{signal.traderRole}</p>
                    </div>
                  </div>

                  <Link
                    href={`/analysis/${signal.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-[#76A98C]/20 text-[#76A98C] text-xs font-bold transition-all"
                  >
                    <span>مطالعه تحلیل کامل</span>
                    <ArrowLeft className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center rounded-3xl bg-[#141518] border border-white/[0.06] space-y-3">
          <LineChart className="w-10 h-10 text-[#707581] mx-auto" />
          <h3 className="font-bold text-sm text-[#F0F0F1]">تحلیلی در این دسته‌بندی موجود نیست</h3>
          <p className="text-xs text-[#8E929E]">
            معامله‌گران ما به زودی چارت‌ها و تحلیل‌های ساختاری جدید را منتشر خواهند کرد.
          </p>
        </div>
      )}
    </section>
  );
}
