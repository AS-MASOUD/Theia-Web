"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  LineChart,
  ArrowRight,
  Save,
  Sparkles,
  Upload,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Activity,
  Compass,
  Gauge,
  BarChart3,
  Layers,
  Image as ImageIcon,
  Clock,
  Eye,
  Check,
  X,
  FileText,
  ShieldAlert,
} from "lucide-react";
import { webApi } from "@/lib/api";
import { useAdminAuth } from "@/lib/admin-auth-context";
import { CreateSignalInput, MarketCategory, TrendBias } from "@/types/market-signals";

const POPULAR_SYMBOLS = [
  { symbol: "XAUUSD", name: "انس جهانی طلا", cat: "gold_coin" },
  { symbol: "EMAMI_COIN", name: "سکه امامی", cat: "gold_coin" },
  { symbol: "IR_GOLD_18K", name: "طلای ۱۸ عیار", cat: "gold_coin" },
  { symbol: "IR_MITHQAL", name: "مثقال طلا", cat: "gold_coin" },
  { symbol: "USD", name: "دلار آمریکا (آزاد)", cat: "currency" },
  { symbol: "EUR", name: "یورو", cat: "currency" },
  { symbol: "AED", name: "درهم امارات", cat: "currency" },
  { symbol: "BTC", name: "بیت‌کوین (BTC/USDT)", cat: "crypto" },
  { symbol: "ETH", name: "اتریوم (ETH/USDT)", cat: "crypto" },
  { symbol: "SOL", name: "سولانا (SOL/USDT)", cat: "crypto" },
  { symbol: "BRENT", name: "نفت برنت", cat: "commodity" },
  { symbol: "CU", name: "مس جهانی", cat: "commodity" },
  { symbol: "CUSTOM", name: "نماد سفارشی دیگر...", cat: "custom" },
];

export default function EditSignalAnalysisPage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const { user, isTrader, isAdmin } = useAdminAuth();
  const signalId = parseInt(params.id as string, 10);

  // Form State
  const [title, setTitle] = useState("");
  const [selectedSymbolOption, setSelectedSymbolOption] = useState("XAUUSD");
  const [customSymbol, setCustomSymbol] = useState("");
  const [marketCategory, setMarketCategory] = useState<MarketCategory>("gold_coin");
  const [trendBias, setTrendBias] = useState<TrendBias>("BULLISH");
  const [timeframe, setTimeframe] = useState("1D");
  const [readingTime, setReadingTime] = useState("۴ دقیقه");
  const [summary, setSummary] = useState("");
  const [chartImageUrl, setChartImageUrl] = useState("");
  const [fundamentalData, setFundamentalData] = useState("");
  const [indexesSummary, setIndexesSummary] = useState("");
  const [keyLevels, setKeyLevels] = useState("");
  const [analysisText, setAnalysisText] = useState("");
  const [traderName, setTraderName] = useState("");
  const [traderRole, setTraderRole] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"write" | "preview">("write");

  // Fetch Signal Detail
  const { data: signal, isLoading, error: fetchError } = useQuery({
    queryKey: ["admin-signal-detail", signalId],
    queryFn: async () => {
      try {
        return await webApi.getAdminSignalById(signalId);
      } catch {
        const fallback = await webApi.getSignalById(signalId);
        if (!fallback) throw new Error("تحلیل یافت نشد");
        return fallback;
      }
    },
    enabled: !!signalId && !isNaN(signalId),
  });

  useEffect(() => {
    if (signal) {
      setTitle(signal.title || "");
      const matched = POPULAR_SYMBOLS.find((s) => s.symbol === signal.symbol);
      if (matched && matched.cat !== "custom") {
        setSelectedSymbolOption(signal.symbol);
        setCustomSymbol("");
      } else {
        setSelectedSymbolOption("CUSTOM");
        setCustomSymbol(signal.symbol || "");
      }
      setMarketCategory(signal.marketCategory || "gold_coin");
      setTrendBias(signal.trendBias || "BULLISH");
      setTimeframe(signal.timeframe || "1D");
      setReadingTime(signal.readingTime || "۴ دقیقه");
      setSummary(signal.summary || "");
      setChartImageUrl(signal.chartImageUrl || "");
      setFundamentalData(signal.fundamentalData || "");
      setIndexesSummary(signal.indexesSummary || "");
      setKeyLevels(signal.keyLevels || "");
      setAnalysisText(signal.analysisText || "");
      setTraderName(signal.traderName || user?.fullName || "تیم تحلیل تیا");
      setTraderRole(signal.traderRole || "تحلیل‌گر ارشد بازارهای مالی");
      setIsPublished(signal.isPublished ?? true);
    }
  }, [signal, user?.fullName]);

  const effectiveSymbol =
    selectedSymbolOption === "CUSTOM"
      ? customSymbol.trim().toUpperCase() || "CUSTOM"
      : selectedSymbolOption;

  const updateMutation = useMutation({
    mutationFn: (data: Partial<CreateSignalInput>) =>
      webApi.updateSignal(signalId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-signals"] });
      queryClient.invalidateQueries({ queryKey: ["admin-signal-detail", signalId] });
      queryClient.invalidateQueries({ queryKey: ["chart-signals"] });
      router.push("/admin/signals");
    },
    onError: (err: any) => {
      setError(err?.message || "خطا در به‌روزرسانی تحلیل چارت.");
    },
  });

  const handleSymbolChange = (val: string) => {
    setSelectedSymbolOption(val);
    const pop = POPULAR_SYMBOLS.find((s) => s.symbol === val);
    if (pop && pop.cat !== "custom") {
      setMarketCategory(pop.cat as MarketCategory);
    }
  };

  const handleChartUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      setError(null);
      const reader = new FileReader();
      reader.onload = async () => {
        const dataUrl = reader.result as string;
        try {
          const res = await webApi.uploadImage(dataUrl, file.name);
          setChartImageUrl(res.url);
        } catch {
          setChartImageUrl(dataUrl);
        } finally {
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    } catch {
      setIsUploading(false);
      setError("خطا در بارگذاری تصویر چارت");
    }
  };

  const handleApplyFundamentalTemplate = () => {
    const template = {
      dxyIndex: "104.20",
      fedPolicy: "نرخ بهره بدون تغییر (۵.۲۵٪)",
      inflationRate: "۳.۲٪ سالانه",
      us10yYield: "۴.۲۴٪",
      nimaRate: "۶۲,۵۰۰ تومان",
      dirhamArbitrage: "۱۹,۴۰۰ تومان",
      goldCoinBubble: "۲۲.۵٪ حباب",
    };
    setFundamentalData(JSON.stringify(template, null, 2));
  };

  const handleApplyIndexesTemplate = () => {
    const template = {
      fearGreedIndex: "68 (طمع)",
      vixVolatility: "14.2",
      rsiDaily: "63.5",
      tradingVolume: "بالاتر از میانگین ماهانه",
      sentimentScore: "۷۵ از ۱۰۰",
    };
    setIndexesSummary(JSON.stringify(template, null, 2));
  };

  const handleApplyKeyLevelsTemplate = () => {
    const template = {
      majorSupport: "$2,680",
      secondarySupport: "$2,640",
      majorResistance: "$2,745",
      targetZone: "$2,800",
    };
    setKeyLevels(JSON.stringify(template, null, 2));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("عنوان کامل تحلیل الزامی است.");
      return;
    }
    if (!effectiveSymbol) {
      setError("مشخص کردن نماد ابزار معاملاتی الزامی است.");
      return;
    }
    if (!analysisText.trim()) {
      setError("متن تفصیلی تحلیل چارت الزامی است.");
      return;
    }

    updateMutation.mutate({
      title: title.trim(),
      symbol: effectiveSymbol,
      marketCategory,
      trendBias,
      timeframe: timeframe.trim() || "1D",
      readingTime: readingTime.trim() || "۴ دقیقه",
      summary: summary.trim() || undefined,
      chartImageUrl: chartImageUrl.trim() || undefined,
      fundamentalData: fundamentalData.trim() || undefined,
      indexesSummary: indexesSummary.trim() || undefined,
      keyLevels: keyLevels.trim() || undefined,
      analysisText: analysisText.trim(),
      traderName: traderName.trim() || user?.fullName || "تیم تحلیل تیا",
      traderRole: traderRole.trim() || "تحلیل‌گر ارشد بازارهای مالی",
      isPublished,
    });
  };

  if (!isTrader && !isAdmin) {
    return (
      <div className="p-8 rounded-3xl bg-[#141518] border border-white/10 text-center space-y-4 max-w-xl mx-auto">
        <ShieldAlert className="w-12 h-12 text-[#C77A82] mx-auto" />
        <h2 className="text-lg font-bold text-[#F0F0F1]">عدم دسترسی به بخش ویرایش تحلیل</h2>
        <p className="text-xs text-[#A0A3AD] leading-relaxed">
          تنها معامله‌گران تأییدشده (Trader) و مدیران سیستم مجاز به ویرایش تحلیل‌های چارت هستند.
        </p>
        <Link
          href="/admin/signals"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-white/10 text-white text-xs hover:bg-white/15"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت به فهرست تحلیل‌ها</span>
        </Link>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-2 border-[#76A98C] border-t-transparent rounded-full animate-spin" />
        <span className="text-xs text-[#A0A3AD]">در حال بارگذاری اطلاعات کامل تحلیل...</span>
      </div>
    );
  }

  if (fetchError || !signal) {
    return (
      <div className="py-20 text-center space-y-4 max-w-md mx-auto">
        <AlertCircle className="w-12 h-12 text-[#C77A82] mx-auto" />
        <h2 className="text-lg font-bold text-[#F0F0F1]">تحلیل مورد نظر یافت نشد</h2>
        <p className="text-xs text-[#A0A3AD]">ممکن است شناسه وارد شده صحیح نباشد یا قبلاً حذف شده باشد.</p>
        <Link
          href="/admin/signals"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#76A98C] text-[#0D0E10] text-xs font-bold"
        >
          <ArrowRight className="w-4 h-4" />
          <span>بازگشت به لیست تحلیل‌ها</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/signals"
            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#A0A3AD] hover:text-white transition-all shrink-0"
            title="بازگشت به فهرست تحلیل‌ها"
          >
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="p-1.5 rounded-lg bg-[#76A98C]/15 text-[#76A98C]">
                <BarChart3 className="w-4 h-4" />
              </span>
              <h1 className="text-2xl font-black text-[#F0F0F1] tracking-tight">
                ویرایش تحلیل چارت: {signal.symbol}
              </h1>
            </div>
            <p className="text-xs text-[#8E929E] mt-1">
              به‌روزرسانی مقادیر تکنیکال، سناریوهای حرکتی، داده‌های بنیادین و اسنپ‌شات چارت
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 self-end sm:self-auto">
          <Link
            href={`/analysis/${signal.id}`}
            target="_blank"
            className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-xs text-[#F0AE55] hover:text-white transition-all font-semibold flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>مشاهده صفحه عمومی</span>
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={updateMutation.isPending}
            className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#76A98C] to-[#5B8D71] text-[#0D0E10] font-black text-xs hover:opacity-95 transition-all shadow-[0_0_20px_rgba(118,169,140,0.25)] disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{updateMutation.isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#C77A82]/15 border border-[#C77A82]/30 text-xs text-[#C77A82]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Card 1: Core Instrument & Trend Specifications */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#121316] p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
            <h3 className="font-bold text-sm text-[#F0F0F1] flex items-center gap-2">
              <Compass className="w-4 h-4 text-[#76A98C]" />
              <span>مشخصات نماد و جهت‌گیری بازار</span>
            </h3>
            <span className="text-[11px] text-[#707581]">مرحله ۱ از ۴</span>
          </div>

          <div className="space-y-4">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A0A3AD]">
                عنوان کامل تحلیل چارت: <span className="text-[#C77A82]">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: تحلیل ساختاری چارت انس طلا (XAUUSD) - تثبیت بالاتر از مقاومت ۲۷۰۰ و سیگنال واگرایی مثبت"
                className="w-full bg-[#17181D] border border-white/10 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-[#F0F0F1] outline-none focus:border-[#76A98C] transition-all"
              />
            </div>

            {/* Symbol & Category Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#A0A3AD]">انتخاب نماد:</label>
                <select
                  value={selectedSymbolOption}
                  onChange={(e) => handleSymbolChange(e.target.value)}
                  className="w-full bg-[#17181D] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-[#F0F0F1] outline-none focus:border-[#76A98C]"
                >
                  {POPULAR_SYMBOLS.map((s) => (
                    <option key={s.symbol} value={s.symbol}>
                      {s.name} ({s.symbol})
                    </option>
                  ))}
                </select>
              </div>

              {selectedSymbolOption === "CUSTOM" && (
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-[#A0A3AD]">نماد سفارشی (انگلیسی):</label>
                  <input
                    type="text"
                    value={customSymbol}
                    onChange={(e) => setCustomSymbol(e.target.value)}
                    placeholder="مثال: NASDAQ یا TON"
                    dir="ltr"
                    className="w-full bg-[#17181D] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-[#F0F0F1] font-mono outline-none focus:border-[#76A98C]"
                  />
                </div>
              )}

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#A0A3AD]">دسته‌بندی بازار:</label>
                <select
                  value={marketCategory}
                  onChange={(e) => setMarketCategory(e.target.value as MarketCategory)}
                  className="w-full bg-[#17181D] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-[#F0F0F1] outline-none focus:border-[#76A98C]"
                >
                  <option value="gold_coin">طلا و مسکوکات</option>
                  <option value="currency">ارزهای بین‌المللی و منطقه‌ای</option>
                  <option value="crypto">ارز دیجیتال (رمزارزها)</option>
                  <option value="commodity">کالاهای اساسی و انرژی</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#A0A3AD]">تایم‌فریم تحلیل چارت:</label>
                <select
                  value={timeframe}
                  onChange={(e) => setTimeframe(e.target.value)}
                  className="w-full bg-[#17181D] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-[#F0F0F1] outline-none focus:border-[#76A98C]"
                >
                  <option value="15M">۱۵ دقیقه (15M)</option>
                  <option value="1H">۱ ساعته (1H)</option>
                  <option value="4H">۴ ساعته (4H)</option>
                  <option value="1D">روزانه (1D)</option>
                  <option value="1W">هفتگی (1W)</option>
                  <option value="1M">ماهانه (1M)</option>
                </select>
              </div>
            </div>

            {/* Trend Bias Selector */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-semibold text-[#A0A3AD] block">
                چشم‌انداز و جهت روند قیمتی (Trend Bias):
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() => setTrendBias("BULLISH")}
                  className={`py-3 px-4 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
                    trendBias === "BULLISH"
                      ? "bg-[#76A98C] text-[#0D0E10] border-[#76A98C] shadow-[0_0_20px_rgba(118,169,140,0.35)]"
                      : "bg-[#17181D] text-[#A0A3AD] border-white/5 hover:border-white/20"
                  }`}
                >
                  <TrendingUp className="w-4 h-4" />
                  <span>صعودی (Bullish)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTrendBias("BEARISH")}
                  className={`py-3 px-4 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
                    trendBias === "BEARISH"
                      ? "bg-[#C77A82] text-[#0D0E10] border-[#C77A82] shadow-[0_0_20px_rgba(199,122,130,0.35)]"
                      : "bg-[#17181D] text-[#A0A3AD] border-white/5 hover:border-white/20"
                  }`}
                >
                  <TrendingDown className="w-4 h-4" />
                  <span>نزولی (Bearish)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTrendBias("NEUTRAL")}
                  className={`py-3 px-4 rounded-2xl text-xs font-bold transition-all flex items-center justify-center gap-2 border ${
                    trendBias === "NEUTRAL"
                      ? "bg-[#F0AE55] text-[#0D0E10] border-[#F0AE55] shadow-[0_0_20px_rgba(240,174,85,0.35)]"
                      : "bg-[#17181D] text-[#A0A3AD] border-white/5 hover:border-white/20"
                  }`}
                >
                  <Activity className="w-4 h-4" />
                  <span>خنثی / بدون روند (Neutral)</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Chart Snapshot & Visual Media */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#121316] p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
            <h3 className="font-bold text-sm text-[#F0F0F1] flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-[#76A98C]" />
              <span>تصویر و اسنپ‌شات چارت تکنیکال</span>
            </h3>
            <span className="text-[11px] text-[#707581]">مرحله ۲ از ۴</span>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="url"
                value={chartImageUrl}
                onChange={(e) => setChartImageUrl(e.target.value)}
                placeholder="آدرس اینترنتی تصویر چارت (URL) یا از دکمه آپلود استفاده کنید..."
                dir="ltr"
                className="flex-1 bg-[#17181D] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-[#F0F0F1] outline-none focus:border-[#76A98C]"
              />

              <label className="px-5 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-xs text-[#F0F0F1] font-bold cursor-pointer transition-all flex items-center justify-center gap-2 shrink-0 border border-white/10">
                <Upload className="w-4 h-4 text-[#76A98C]" />
                <span>{isUploading ? "در حال آپلود چارت..." : "بارگذاری تصویر جدید"}</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleChartUpload}
                  disabled={isUploading}
                  className="hidden"
                />
              </label>

              {chartImageUrl && (
                <button
                  type="button"
                  onClick={() => setChartImageUrl("")}
                  className="p-2.5 rounded-2xl bg-[#C77A82]/15 text-[#C77A82] hover:bg-[#C77A82]/25 transition-all text-xs flex items-center justify-center shrink-0"
                  title="حذف تصویر"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Live Chart Preview Box */}
            {chartImageUrl ? (
              <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#0E0F12] max-h-72 relative group">
                <img
                  src={chartImageUrl}
                  alt="پیش‌نمایش چارت"
                  className="w-full h-full object-cover max-h-72"
                />
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-xl bg-black/80 backdrop-blur-sm text-[11px] font-mono text-white/90 border border-white/10 flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-[#76A98C]" />
                  <span>چارت فعال ({effectiveSymbol})</span>
                </div>
              </div>
            ) : (
              <div className="p-8 rounded-2xl border border-dashed border-white/10 bg-[#17181D]/50 text-center space-y-2">
                <ImageIcon className="w-8 h-8 text-[#707581] mx-auto" />
                <p className="text-xs text-[#A0A3AD]">
                  تصویر چارت برای درک بهتر تحلیلگران در صفحه عمومی و کارت‌ها با رزولوشن بالا نمایش داده خواهد شد.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Card 3: Executive Summary & Fundamental/Technical Indicators */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#121316] p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
            <h3 className="font-bold text-sm text-[#F0F0F1] flex items-center gap-2">
              <Gauge className="w-4 h-4 text-[#F0AE55]" />
              <span>چکیده اجرایی، داده‌های کلان و شاخص‌های سنجش</span>
            </h3>
            <span className="text-[11px] text-[#707581]">مرحله ۳ از ۴</span>
          </div>

          <div className="space-y-5">
            {/* Executive Summary */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A0A3AD]">
                خلاصه اجرایی و نکات کلیدی (نمایش در کارت‌های دیده‌بان و سرتیتر تحلیل):
              </label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={2}
                placeholder="چکیده ۲ الی ۳ خطی از وضعیت تکنیکال، ناحیه ورود بهینه یا هشدار ریسک..."
                className="w-full bg-[#17181D] border border-white/10 rounded-2xl p-3.5 text-xs text-[#F0F0F1] outline-none focus:border-[#76A98C] leading-relaxed"
              />
            </div>

            {/* Fundamental & Indexes Split */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Fundamental Data */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#A0A3AD] flex items-center gap-1.5">
                    <Compass className="w-3.5 h-3.5 text-[#76A98C]" />
                    <span>مؤلفه‌های فاندامنتال و کلان اقتصادی:</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleApplyFundamentalTemplate}
                    className="text-[10px] text-[#76A98C] hover:underline"
                  >
                    درج قالب پیشنهادی
                  </button>
                </div>
                <textarea
                  value={fundamentalData}
                  onChange={(e) => setFundamentalData(e.target.value)}
                  rows={4}
                  placeholder={`می‌توانید به صورت متن ساده یا ساختار JSON وارد کنید:\n{\n  "dxyIndex": "104.2",\n  "fedPolicy": "انقباضی",\n  "inflationRate": "۳.۱٪"\n}`}
                  dir="ltr"
                  className="w-full bg-[#17181D] border border-white/10 rounded-2xl p-3 text-xs text-[#F0F0F1] font-mono outline-none focus:border-[#76A98C] leading-relaxed"
                />
              </div>

              {/* Market Indexes */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-[#A0A3AD] flex items-center gap-1.5">
                    <Gauge className="w-3.5 h-3.5 text-[#F0AE55]" />
                    <span>شاخص‌های سنجش بازار و تکنیکال (Indexes):</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleApplyIndexesTemplate}
                    className="text-[10px] text-[#F0AE55] hover:underline"
                  >
                    درج قالب پیشنهادی
                  </button>
                </div>
                <textarea
                  value={indexesSummary}
                  onChange={(e) => setIndexesSummary(e.target.value)}
                  rows={4}
                  placeholder={`می‌توانید به صورت متن یا ساختار JSON وارد کنید:\n{\n  "fearGreedIndex": "68 (طمع)",\n  "vixVolatility": "14.2",\n  "rsiDaily": "63.5"\n}`}
                  dir="ltr"
                  className="w-full bg-[#17181D] border border-white/10 rounded-2xl p-3 text-xs text-[#F0F0F1] font-mono outline-none focus:border-[#F0AE55] leading-relaxed"
                />
              </div>
            </div>

            {/* Key Technical Levels */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#A0A3AD] flex items-center gap-1.5">
                  <Activity className="w-3.5 h-3.5 text-[#76A98C]" />
                  <span>سطوح کلیدی حمایت و مقاومت (Key Levels):</span>
                </label>
                <button
                  type="button"
                  onClick={handleApplyKeyLevelsTemplate}
                  className="text-[10px] text-[#76A98C] hover:underline"
                >
                  درج قالب پیشنهادی
                </button>
              </div>
              <textarea
                value={keyLevels}
                onChange={(e) => setKeyLevels(e.target.value)}
                rows={3}
                placeholder={`{\n  "majorSupport": "$2,680",\n  "majorResistance": "$2,745",\n  "targetZone": "$2,800"\n}`}
                dir="ltr"
                className="w-full bg-[#17181D] border border-white/10 rounded-2xl p-3 text-xs text-[#F0F0F1] font-mono outline-none focus:border-[#76A98C]"
              />
            </div>
          </div>
        </div>

        {/* Card 4: In-depth Editorial Analysis Body */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#121316] p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
            <h3 className="font-bold text-sm text-[#F0F0F1] flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#76A98C]" />
              <span>متن تفصیلی و تفسیر تحلیلی معامله‌گر</span>
            </h3>

            {/* Write / Preview Tab */}
            <div className="flex items-center gap-1 p-1 bg-[#1A1B20] rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab("write")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "write"
                    ? "bg-[#76A98C] text-[#0D0E10]"
                    : "text-[#A0A3AD] hover:text-white"
                }`}
              >
                نگارش
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("preview")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeTab === "preview"
                    ? "bg-[#76A98C] text-[#0D0E10]"
                    : "text-[#A0A3AD] hover:text-white"
                }`}
              >
                پیش‌نمایش
              </button>
            </div>
          </div>

          {activeTab === "write" ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-[#707581]">
                <span>
                  شرح و بسط کامل الگوها، کانال‌های قیمتی، نواحی اوردربلاک و رفتارهای حجمی:
                </span>
                <span className="font-mono text-[11px] text-[#A0A3AD]">
                  {analysisText.length} کاراکتر
                </span>
              </div>
              <textarea
                value={analysisText}
                onChange={(e) => setAnalysisText(e.target.value)}
                rows={12}
                placeholder="تحلیل خود را مانند یک مقاله تخصصی وبلاگ بنویسید. می‌توانید پاراگراف‌بندی کرده و نکات کلیدی، سناریوهای صعودی، سناریوهای ابطال تحلیل و مدیریت سرمایه را به تفصیل بیان کنید..."
                className="w-full bg-[#17181D] border border-white/10 rounded-2xl p-4 text-xs sm:text-sm text-[#F0F0F1] outline-none focus:border-[#76A98C] leading-relaxed resize-y"
              />
            </div>
          ) : (
            <div className="rounded-2xl bg-[#17181D] border border-white/10 p-6 min-h-[250px] space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#76A98C]">
                <Sparkles className="w-4 h-4" />
                <span>پیش‌نمایش خروجی نهایی متن تحلیل:</span>
              </div>
              {analysisText ? (
                <div className="text-xs sm:text-sm text-[#D1D3D9] leading-loose whitespace-pre-line text-justify">
                  {analysisText}
                </div>
              ) : (
                <p className="text-xs text-[#707581] italic">
                  متنی جهت پیش‌نمایش وارد نشده است.
                </p>
              )}
            </div>
          )}
        </div>

        {/* Card 5: Author, Publishing & Metadata Settings */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#121316] p-6 sm:p-8 space-y-6 shadow-xl">
          <h3 className="font-bold text-sm text-[#F0F0F1] border-b border-white/[0.06] pb-4">
            مشخصات تحلیل‌گر و وضعیت انتشار
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A0A3AD]">نام تحلیل‌گر:</label>
              <input
                type="text"
                value={traderName}
                onChange={(e) => setTraderName(e.target.value)}
                placeholder="تیم تحلیل تیا"
                className="w-full bg-[#17181D] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-[#F0F0F1] outline-none focus:border-[#76A98C]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A0A3AD]">سمت و تخصص:</label>
              <input
                type="text"
                value={traderRole}
                onChange={(e) => setTraderRole(e.target.value)}
                placeholder="تحلیل‌گر ارشد بازارهای مالی"
                className="w-full bg-[#17181D] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-[#F0F0F1] outline-none focus:border-[#76A98C]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A0A3AD]">زمان تخمینی مطالعه:</label>
              <input
                type="text"
                value={readingTime}
                onChange={(e) => setReadingTime(e.target.value)}
                placeholder="۴ دقیقه"
                className="w-full bg-[#17181D] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-[#F0F0F1] outline-none focus:border-[#76A98C]"
              />
            </div>
          </div>

          <label className="flex items-center gap-3 p-4 rounded-2xl bg-[#17181D] border border-white/10 cursor-pointer text-xs text-[#F0F0F1]">
            <input
              type="checkbox"
              checked={isPublished}
              onChange={(e) => setIsPublished(e.target.checked)}
              className="rounded accent-[#76A98C] w-4 h-4"
            />
            <span>تحلیل چارت در وضعیت انتشار عمومی قرار داشته باشد (Published)</span>
          </label>
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center justify-between pt-4">
          <Link
            href="/admin/signals"
            className="px-5 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-xs text-[#A0A3AD] hover:text-white transition-all font-semibold"
          >
            بازگشت به فهرست تحلیل‌ها
          </Link>

          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-[#76A98C] to-[#5B8D71] text-[#0D0E10] font-black text-xs hover:opacity-95 transition-all shadow-[0_0_20px_rgba(118,169,140,0.25)] disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{updateMutation.isPending ? "در حال ذخیره تغییرات..." : "ذخیره تغییرات تحلیل"}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
