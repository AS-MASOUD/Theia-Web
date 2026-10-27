"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  ArrowRight,
  Share2,
  Sparkles,
  Maximize2,
  ShieldCheck,
  Layers,
  Activity,
  Gauge,
  BarChart3,
  Flame,
  ArrowLeft,
  ChevronLeft,
  X,
  Compass,
} from "lucide-react";
import { webApi } from "@/lib/api";
import { MarketSignal, TrendBias } from "@/types/market-signals";
import { ArticleComments } from "@/components/insights/article-comments";
import { normalizeDigitsToEnglish } from "@/lib/utils";

export default function ChartAnalysisDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = parseInt(params.id as string, 10);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const { data: analysis, isLoading, error } = useQuery<MarketSignal | null>({
    queryKey: ["chart-analysis-detail", id],
    queryFn: () => webApi.getSignalById(id),
    enabled: !!id && !isNaN(id),
  });

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-16 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-[#76A98C] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs text-[#A0A3AD]">در حال بارگذاری تحلیل جامع چارت...</span>
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="min-h-screen py-20 max-w-xl mx-auto px-4 text-center space-y-5">
        <div className="w-16 h-16 rounded-3xl bg-[#141518] border border-white/10 flex items-center justify-center mx-auto text-[#C77A82]">
          <LineChart className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-black text-[#F0F0F1]">تحلیل چارت مورد نظر یافت نشد</h1>
        <p className="text-xs text-[#A0A3AD] leading-relaxed">
          ممکن است این تحلیل توسط معامله‌گر به‌روزرسانی یا موقتاً از حالت انتشار خارج شده باشد.
        </p>
        <Link
          href="/analysis"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#76A98C] text-[#0D0E10] font-bold text-xs hover:bg-[#8EC0A3] transition-all"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت به دیده‌بان تحلیل و سیگنال‌ها</span>
        </Link>
      </div>
    );
  }

  // Parse structured fundamental data and indexes if present
  let fundamentalObj: Record<string, string> = {};
  try {
    if (analysis.fundamentalData) {
      fundamentalObj = JSON.parse(analysis.fundamentalData);
    }
  } catch {
    // If it's a plain string
  }

  let indexesObj: Record<string, string> = {};
  try {
    if (analysis.indexesSummary) {
      indexesObj = JSON.parse(analysis.indexesSummary);
    }
  } catch {
    // plain string
  }

  let keyLevelsObj: Record<string, string> = {};
  try {
    if (analysis.keyLevels) {
      keyLevelsObj = JSON.parse(analysis.keyLevels);
    }
  } catch {
    // plain string
  }

  const getTrendBadge = (trend?: TrendBias) => {
    switch (trend) {
      case "BULLISH":
        return {
          label: "چشم‌انداز صعودی (Bullish)",
          icon: TrendingUp,
          bg: "bg-[#76A98C]/20 text-[#76A98C] border-[#76A98C]/40",
        };
      case "BEARISH":
        return {
          label: "چشم‌انداز نزولی (Bearish)",
          icon: TrendingDown,
          bg: "bg-[#C77A82]/20 text-[#C77A82] border-[#C77A82]/40",
        };
      default:
        return {
          label: "چشم‌انداز خنثی / بدون روند (Neutral)",
          icon: Activity,
          bg: "bg-[#F0AE55]/20 text-[#F0AE55] border-[#F0AE55]/40",
        };
    }
  };

  const trendBadge = getTrendBadge(analysis.trendBias);
  const TrendIcon = trendBadge.icon;

  return (
    <article className="min-h-screen py-10 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-[#707581]">
          <Link href="/" className="hover:text-[#F0AE55] transition-colors">
            صفحه اصلی
          </Link>
          <span>/</span>
          <Link href="/analysis" className="hover:text-[#76A98C] transition-colors">
            تحلیل و سیگنال‌ها
          </Link>
          <span>/</span>
          <span className="text-[#A0A3AD] truncate max-w-[200px] sm:max-w-xs font-mono">
            {analysis.symbol}
          </span>
        </div>

        {/* Page Header */}
        <header className="space-y-6 border-b border-white/[0.08] pb-8">
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="px-3 py-1 rounded-xl bg-white/10 text-white font-mono font-bold">
              {analysis.symbol}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold border ${trendBadge.bg}`}
            >
              <TrendIcon className="w-3.5 h-3.5" />
              <span>{trendBadge.label}</span>
            </span>
            <span className="px-2.5 py-1 rounded-full bg-[#1B1D21] text-[#A0A3AD] border border-white/5 font-mono text-[11px]">
              تایم‌فریم: {analysis.timeframe}
            </span>
            <span className="flex items-center gap-1.5 text-[#A0A3AD]">
              <Calendar className="w-3.5 h-3.5 text-[#76A98C]" />
              <span>{new Date(analysis.createdAt).toLocaleDateString("fa-IR")}</span>
            </span>
            <span className="text-white/10">•</span>
            <span className="flex items-center gap-1.5 text-[#A0A3AD]">
              <Clock className="w-3.5 h-3.5 text-[#76A98C]" />
              <span>{analysis.readingTime || "۴ دقیقه"} زمان مطالعه</span>
            </span>
          </div>

          {/* Title */}
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-[#F0F0F1] leading-tight tracking-tight">
            {analysis.title}
          </h1>

          {/* Executive Summary */}
          {analysis.summary && (
            <p className="text-base sm:text-lg text-[#A0A3AD] leading-relaxed font-normal">
              {analysis.summary}
            </p>
          )}

          {/* Analyst Signature & Share Bar */}
          <div className="flex items-center justify-between pt-4">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#76A98C] to-[#4B735D] flex items-center justify-center text-[#0D0E10] font-black text-sm shadow-[0_0_15px_rgba(118,169,140,0.3)]">
                {analysis.traderName[0]}
              </div>
              <div>
                <p className="text-sm font-bold text-[#F0F0F1]">{analysis.traderName}</p>
                <p className="text-xs text-[#76A98C]">{analysis.traderRole}</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-[#A0A3AD] hover:text-white transition-all"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{copied ? "لینک کپی شد ✓" : "اشتراک‌گذاری"}</span>
              </button>
              <Link
                href="/analysis"
                className="hidden sm:inline-flex items-center gap-1 text-xs text-[#707581] hover:text-[#76A98C] transition-colors pr-2"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>بازگشت به دیده‌بان تحلیل‌ها</span>
              </Link>
            </div>
          </div>
        </header>

        {/* --- MAIN FOCUS: PROMINENT CHART SNAPSHOT --- */}
        {analysis.chartImageUrl && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-[#A0A3AD]">
              <span className="font-bold flex items-center gap-2 text-[#76A98C]">
                <BarChart3 className="w-4 h-4" />
                <span>نمای اختصاصی چارت تکنیکال ({analysis.symbol})</span>
              </span>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(true)}
                className="flex items-center gap-1 text-[#8E929E] hover:text-[#76A98C] transition-colors"
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span>بزرگ‌نمایی با کیفیت اصلی</span>
              </button>
            </div>

            <div
              onClick={() => setIsLightboxOpen(true)}
              className="relative rounded-3xl overflow-hidden border border-white/[0.1] bg-[#0E0F12] shadow-2xl cursor-pointer group"
            >
              <img
                src={analysis.chartImageUrl}
                alt={analysis.title}
                className="w-full max-h-[520px] object-cover group-hover:scale-[1.01] transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-4">
                <span className="text-xs font-mono text-white/90 bg-black/60 px-3 py-1 rounded-xl">
                  {analysis.symbol} • تایم‌فریم {analysis.timeframe}
                </span>
                <span className="text-xs font-bold text-[#76A98C] bg-black/70 px-3 py-1 rounded-xl flex items-center gap-1">
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>کلیک جهت مشاهده کامل چارت</span>
                </span>
              </div>
            </div>
          </div>
        )}

        {/* --- FUNDAMENTAL DATA & MARKET INDEXES SECTION --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Fundamental / Macro Factors Card */}
          <div className="rounded-3xl bg-[#141519] border border-white/[0.08] p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-[#76A98C] font-bold text-sm border-b border-white/[0.06] pb-3">
              <Compass className="w-4 h-4 text-[#76A98C]" />
              <span>مؤلفه‌ها و داده‌های بنیادین (Fundamental Data)</span>
            </div>

            {Object.keys(fundamentalObj).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(fundamentalObj).map(([key, value]) => {
                  const labelMap: Record<string, string> = {
                    dxyIndex: "شاخص دلار (DXY):",
                    us10yYield: "بازده اوراق قرضه آمریکا (US10Y):",
                    fedPolicy: "سیاست پولی فدرال رزرو:",
                    inflationRate: "نرخ تورم سالانه:",
                    centralBanksBuying: "تقاضای بانک‌های مرکزی:",
                    nimaRate: "نرخ دلار نیما:",
                    dirhamArbitrage: "برابری حواله درهم:",
                    goldCoinBubble: "درصد حباب سکه:",
                    bourseGoldFundsFlow: "جریان پول صندوق‌های طلا:",
                    etfNetInflows: "ورودی خالص ETFها:",
                    exchangeReserves: "موجودی در صرافی‌ها:",
                    hashrate: "هش‌ریت شبکه:",
                    stablecoinSupply: "نقدینگی استیبل‌کوین‌ها:",
                    marketIntervention: "عرضه و مداخله بازارساز:",
                    oilExportsIncome: "وصول درآمدهای ارزی:",
                    broadMoneyGrowth: "نرخ رشد نقدینگی:",
                    cpiInflation: "تورم مصرف‌کننده (CPI):",
                  };
                  const label = labelMap[key] || key;
                  return (
                    <div key={key} className="flex items-start justify-between gap-3 text-xs">
                      <span className="text-[#8E929E] shrink-0">{label}</span>
                      <span className="text-[#F0F0F1] font-semibold text-left font-mono">{normalizeDigitsToEnglish(value)}</span>
                    </div>
                  );
                })}
              </div>
            ) : analysis.fundamentalData ? (
              <p className="text-xs text-[#D1D3D9] leading-relaxed whitespace-pre-line">
                {analysis.fundamentalData}
              </p>
            ) : (
              <p className="text-xs text-[#707581]">داده‌های بنیادین به زودی تکمیل خواهد شد.</p>
            )}
          </div>

          {/* Market Indexes & Sentiment Card */}
          <div className="rounded-3xl bg-[#141519] border border-white/[0.08] p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-[#F0AE55] font-bold text-sm border-b border-white/[0.06] pb-3">
              <Gauge className="w-4 h-4 text-[#F0AE55]" />
              <span>شاخص‌های سنجش بازار و تکنیکال (Market Indexes)</span>
            </div>

            {Object.keys(indexesObj).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(indexesObj).map(([key, value]) => {
                  const labelMap: Record<string, string> = {
                    fearGreedIndex: "شاخص ترس و طمع:",
                    vixVolatility: "شاخص نوسانات (VIX):",
                    rsiDaily: "شاخص قدرت نسبی (RSI روزانه):",
                    rsiWeekly: "شاخص RSI هفتگی:",
                    tradingVolume: "حجم معاملات و نقدینگی:",
                    bubbleRatio: "نسبت حباب قیمتی:",
                    marketBreadth: "عرض و گستره بازار:",
                    btcDominance: "دامیننس بیت‌کوین:",
                    mvrvZScore: "شاخص ارزش‌گذاری MVRV:",
                    nvtRatio: "نسبت NVT ارزش شبکه:",
                    volatilityBand: "دامنه نوسان روزانه:",
                    fxSpread: "اسپرد اسکناس و حواله:",
                    sentimentScore: "نمره احساسات بازار:",
                  };
                  const label = labelMap[key] || key;
                  return (
                    <div key={key} className="flex items-start justify-between gap-3 text-xs">
                      <span className="text-[#8E929E] shrink-0">{label}</span>
                      <span className="text-[#F0F0F1] font-semibold text-left font-mono">{normalizeDigitsToEnglish(value)}</span>
                    </div>
                  );
                })}
              </div>
            ) : analysis.indexesSummary ? (
              <p className="text-xs text-[#D1D3D9] leading-relaxed whitespace-pre-line">
                {analysis.indexesSummary}
              </p>
            ) : (
              <p className="text-xs text-[#707581]">شاخص‌های تکنیکال در دسترس نیست.</p>
            )}
          </div>
        </div>

        {/* Key Technical Levels (if present) */}
        {Object.keys(keyLevelsObj).length > 0 && (
          <div className="rounded-2xl bg-gradient-to-r from-[#17181D] to-[#121316] border border-[#76A98C]/25 p-5 space-y-3 shadow-lg">
            <div className="flex items-center gap-2 text-[#76A98C] font-bold text-xs">
              <Activity className="w-4 h-4 text-[#76A98C]" />
              <span>سطوح کلیدی و محدوده‌های مورد توجه تکنیکال</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-center">
              {Object.entries(keyLevelsObj).map(([key, value]) => {
                const labelMap: Record<string, string> = {
                  majorSupport: "حمایت اصلی",
                  secondarySupport: "حمایت دوم",
                  majorResistance: "مقاومت کلیدی",
                  targetZone: "ناحیه هدف ساختاری",
                  resistanceZone: "محدوده مقاومت",
                  targetChannel: "کانال هدف",
                  keyBreakoutLevel: "سطح شکست معتبر",
                  allTimeHighResistance: "مقاومت سقف تاریخی",
                  supportFloor: "کف قیمتی رنج",
                  upperRangeLimit: "سقف ناحیه رنج",
                };
                return (
                  <div key={key} className="p-2.5 rounded-xl bg-black/40 border border-white/5 space-y-1">
                    <span className="text-[10px] text-[#8E929E] block">{labelMap[key] || key}</span>
                    <span className="font-mono font-bold text-xs text-[#F0F0F1] block">{normalizeDigitsToEnglish(value)}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* --- IN-DEPTH EDITORIAL ANALYSIS (BLOG BODY) --- */}
        <div className="space-y-6 text-[#D1D3D9] text-sm sm:text-base leading-loose font-normal border-t border-white/[0.08] pt-8">
          <div className="flex items-center gap-2 text-sm font-bold text-[#F0F0F1]">
            <Sparkles className="w-4 h-4 text-[#76A98C]" />
            <span>شرح و تفسیر تکنیکال معامله‌گر</span>
          </div>

          <div className="space-y-4 whitespace-pre-line leading-relaxed text-justify text-[#D1D3D9]">
            {analysis.analysisText}
          </div>
        </div>

        {/* Extensible Callout Section (Platform Integration) */}
        <div className="rounded-3xl bg-[#151619] border border-white/[0.08] p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2.5 text-[#76A98C] text-sm font-bold">
            <Sparkles className="w-4 h-4" />
            <span>مدیریت دارایی‌ها متناسب با روندهای تحلیلی در سامانه تیا</span>
          </div>
          <p className="text-xs sm:text-sm text-[#A0A3AD] leading-relaxed">
            شما می‌توانید در ترازنامه ثروت تیا، تخصیص سبد سرمایه‌گذاری خود میان طلا، ارز، سهام و رمزارزها را به صورت پویا رصد کرده و اثر سناریوهای صعودی یا اصلاحی را روی دارایی‌های واقعی خود محاسبه نمایید.
          </p>
          <div className="pt-2">
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#76A98C] hover:bg-[#8EC0A3] text-[#0D0E10] text-xs font-bold transition-all shadow-[0_0_18px_rgba(118,169,140,0.25)]"
            >
              <span>آزمایش رایگان این ابزار در تیا</span>
              <ArrowLeft className="w-4 h-4 stroke-[2.2]" />
            </Link>
          </div>
        </div>

        {/* --- INTERACTIVE USER COMMENTS ON THIS CHART ANALYSIS --- */}
        <ArticleComments articleSlug={`analysis-${analysis.id}`} />
      </div>

      {/* Lightbox / Fullscreen Chart Snapshot Modal */}
      {isLightboxOpen && analysis.chartImageUrl && (
        <div
          onClick={() => setIsLightboxOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 p-4 backdrop-blur-md cursor-zoom-out"
        >
          <button
            type="button"
            onClick={() => setIsLightboxOpen(false)}
            className="absolute top-6 left-6 p-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white transition-all z-10"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={analysis.chartImageUrl}
            alt={analysis.title}
            className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
          />
        </div>
      )}
    </article>
  );
}
