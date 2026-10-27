"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  LineChart,
  Plus,
  TrendingUp,
  TrendingDown,
  Edit2,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  X,
  Sparkles,
  Clock,
  ExternalLink,
  ShieldAlert,
  Upload,
  Layers,
  Image as ImageIcon,
  Compass,
  Gauge,
  Activity,
  BarChart3,
} from "lucide-react";
import { webApi } from "@/lib/api";
import { useAdminAuth } from "@/lib/admin-auth-context";
import { MarketSignal, CreateSignalInput, MarketCategory, TrendBias } from "@/types/market-signals";

const POPULAR_SYMBOLS = [
  { symbol: "XAUUSD", name: "انس جهانی طلا", cat: "gold_coin" },
  { symbol: "EMAMI_COIN", name: "سکه امامی", cat: "gold_coin" },
  { symbol: "USD", name: "دلار آمریکا (آزاد)", cat: "currency" },
  { symbol: "EUR", name: "یورو", cat: "currency" },
  { symbol: "BTC", name: "بیت‌کوین (BTC/USDT)", cat: "crypto" },
  { symbol: "ETH", name: "اتریوم (ETH/USDT)", cat: "crypto" },
  { symbol: "CU", name: "مس جهانی", cat: "commodity" },
];

export default function AdminSignalsPage() {
  const queryClient = useQueryClient();
  const { user, isTrader, isAdmin } = useAdminAuth();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSignal, setSelectedSignal] = useState<MarketSignal | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [symbol, setSymbol] = useState("XAUUSD");
  const [marketCategory, setMarketCategory] = useState<MarketCategory>("gold_coin");
  const [trendBias, setTrendBias] = useState<TrendBias>("BULLISH");
  const [timeframe, setTimeframe] = useState("1D");
  const [summary, setSummary] = useState("");
  const [chartImageUrl, setChartImageUrl] = useState("");
  const [fundamentalData, setFundamentalData] = useState("");
  const [indexesSummary, setIndexesSummary] = useState("");
  const [keyLevels, setKeyLevels] = useState("");
  const [analysisText, setAnalysisText] = useState("");
  const [readingTime, setReadingTime] = useState("۴ دقیقه");
  const [isUploading, setIsUploading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const { data: signalsList, isLoading } = useQuery({
    queryKey: ["admin-signals"],
    queryFn: () => webApi.getAdminSignals(1),
    enabled: isTrader || isAdmin,
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateSignalInput) => webApi.createSignal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-signals"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      setShowCreateModal(false);
      resetForm();
    },
    onError: (err: any) => {
      setFormError(err?.message || "خطا در ثبت تحلیل چارت");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CreateSignalInput> }) =>
      webApi.updateSignal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-signals"] });
      setShowEditModal(false);
      resetForm();
    },
    onError: (err: any) => {
      setFormError(err?.message || "خطا در به‌روزرسانی تحلیل");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => webApi.deleteSignal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-signals"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      setShowDeleteModal(false);
      setSelectedSignal(null);
    },
    onError: (err: any) => {
      setFormError(err?.message || "خطا در حذف تحلیل");
    },
  });

  const resetForm = () => {
    setTitle("");
    setSymbol("XAUUSD");
    setMarketCategory("gold_coin");
    setTrendBias("BULLISH");
    setTimeframe("1D");
    setSummary("");
    setChartImageUrl("");
    setFundamentalData("");
    setIndexesSummary("");
    setKeyLevels("");
    setAnalysisText("");
    setReadingTime("۴ دقیقه");
    setFormError(null);
    setSelectedSignal(null);
  };

  const openEdit = (sig: MarketSignal) => {
    setSelectedSignal(sig);
    setTitle(sig.title);
    setSymbol(sig.symbol);
    setMarketCategory(sig.marketCategory);
    setTrendBias(sig.trendBias || "BULLISH");
    setTimeframe(sig.timeframe);
    setSummary(sig.summary || "");
    setChartImageUrl(sig.chartImageUrl || "");
    setFundamentalData(sig.fundamentalData || "");
    setIndexesSummary(sig.indexesSummary || "");
    setKeyLevels(sig.keyLevels || "");
    setAnalysisText(sig.analysisText);
    setReadingTime(sig.readingTime || "۴ دقیقه");
    setFormError(null);
    setShowEditModal(true);
  };

  const handleChartUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
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
    }
  };

  const getTrendBadge = (trend?: TrendBias) => {
    switch (trend) {
      case "BULLISH":
        return { label: "صعودی (Bullish)", bg: "bg-[#76A98C]/15 text-[#76A98C] border-[#76A98C]/30" };
      case "BEARISH":
        return { label: "نزولی (Bearish)", bg: "bg-[#C77A82]/15 text-[#C77A82] border-[#C77A82]/30" };
      default:
        return { label: "خنثی / رنج (Neutral)", bg: "bg-[#F0AE55]/15 text-[#F0AE55] border-[#F0AE55]/30" };
    }
  };

  if (!isTrader && !isAdmin) {
    return (
      <div className="p-8 rounded-3xl bg-[#141518] border border-white/10 text-center space-y-4">
        <ShieldAlert className="w-12 h-12 text-[#C77A82] mx-auto" />
        <h2 className="text-lg font-bold text-[#F0F0F1]">عدم دسترسی</h2>
        <p className="text-xs text-[#A0A3AD]">
          تنها معامله‌گران تأییدشده (Trader) و مدیران ارشد مجاز به ارسال و مدیریت تحلیل‌های چارت هستند.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#F0F0F1] tracking-tight">
            مرکز تحلیل چارت و شاخص‌های بازارهای مالی
          </h1>
          <p className="text-xs text-[#8E929E] mt-1">
            نگارش مقالات تحلیلی متمرکز بر نمودار قیمت، شاخص‌های کلان فاندامنتال و سنجش ریسک
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#76A98C] to-[#5B8D71] text-[#0D0E10] font-black text-xs hover:opacity-95 transition-all shadow-[0_0_20px_rgba(118,169,140,0.25)] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>ثبت تحلیل و چارت جدید</span>
        </button>
      </div>

      {/* Analyses Table */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#121316] overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
          <h3 className="font-bold text-sm text-[#F0F0F1] flex items-center gap-2">
            <LineChart className="w-4 h-4 text-[#76A98C]" />
            <span>فهرست تحلیل‌های چارت منتشرشده</span>
          </h3>
          <span className="text-xs text-[#707581]">تعداد کل: {signalsList?.length ?? 0}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-white/[0.06] bg-[#16171B] text-[#A0A3AD] font-semibold">
                <th className="p-4">نماد و عنوان تحلیل</th>
                <th className="p-4">چشم‌انداز روند</th>
                <th className="p-4">تایم‌فریم</th>
                <th className="p-4">چارت پیوست</th>
                <th className="p-4">معامله‌گر / تحلیل‌گر</th>
                <th className="p-4">تاریخ انتشار</th>
                <th className="p-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#707581]">
                    در حال دریافت تحلیل‌ها...
                  </td>
                </tr>
              ) : signalsList && signalsList.length > 0 ? (
                signalsList.map((sig) => {
                  const trendBadge = getTrendBadge(sig.trendBias);
                  return (
                    <tr key={sig.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 max-w-sm">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-white/10 text-white font-mono font-bold text-[10px]">
                              {sig.symbol}
                            </span>
                            <span className="font-bold text-[#F0F0F1] truncate block text-xs">
                              {sig.title}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${trendBadge.bg}`}
                        >
                          {trendBadge.label}
                        </span>
                      </td>
                      <td className="p-4 font-mono text-[#C7C9D1]">{sig.timeframe}</td>
                      <td className="p-4">
                        {sig.chartImageUrl ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-[#76A98C]">
                            <ImageIcon className="w-3.5 h-3.5" />
                            <span>دارد</span>
                          </span>
                        ) : (
                          <span className="text-[#707581]">—</span>
                        )}
                      </td>
                      <td className="p-4 text-[#8E929E]">{sig.traderName}</td>
                      <td className="p-4 text-[#707581] text-[11px]">
                        {new Date(sig.createdAt).toLocaleDateString("fa-IR")}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Link
                            href={`/analysis/${sig.id}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-[#A0A3AD] hover:text-white hover:bg-white/5 transition-all"
                            title="مشاهده صفحه کامل تحلیل"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => openEdit(sig)}
                            className="p-1.5 rounded-lg text-[#A0A3AD] hover:text-[#76A98C] hover:bg-white/5 transition-all"
                            title="ویرایش تحلیل"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedSignal(sig);
                              setShowDeleteModal(true);
                            }}
                            className="p-1.5 rounded-lg text-[#A0A3AD] hover:text-[#C77A82] hover:bg-white/5 transition-all"
                            title="حذف تحلیل"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#707581]">
                    تحلیلی یافت نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Analysis Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl my-8 rounded-3xl bg-[#17181D] border border-white/15 p-7 space-y-5 shadow-2xl text-right">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-base font-bold text-[#F0F0F1] flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#76A98C]" />
                <span>نگارش تحلیل چارت و مؤلفه‌های بنیادی</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-[#8E929E] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-2xl bg-[#C77A82]/15 border border-[#C77A82]/30 text-xs text-[#C77A82]">
                {formError}
              </div>
            )}

            <div className="space-y-4 text-xs">
              {/* Title */}
              <div className="space-y-1">
                <label className="font-semibold text-[#A0A3AD]">عنوان کامل مقاله و تحلیل چارت:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: تحلیل ساختاری چارت انس جهانی طلا - بررسی واگرایی در تایم‌فریم روزانه و نرخ بهره"
                  className="w-full bg-[#101114] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-[#F0F0F1] outline-none focus:border-[#76A98C]"
                />
              </div>

              {/* Symbol, Trend Bias & Timeframe */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#A0A3AD]">نماد ابزار (Symbol):</label>
                  <select
                    value={symbol}
                    onChange={(e) => {
                      setSymbol(e.target.value);
                      const pop = POPULAR_SYMBOLS.find((s) => s.symbol === e.target.value);
                      if (pop) setMarketCategory(pop.cat as MarketCategory);
                    }}
                    className="w-full bg-[#101114] border border-white/10 rounded-2xl px-3 py-2 text-xs text-[#F0F0F1] outline-none focus:border-[#76A98C]"
                  >
                    {POPULAR_SYMBOLS.map((s) => (
                      <option key={s.symbol} value={s.symbol}>
                        {s.name} ({s.symbol})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#A0A3AD]">چشم‌انداز روند (Trend Bias):</label>
                  <div className="grid grid-cols-3 gap-1">
                    <button
                      type="button"
                      onClick={() => setTrendBias("BULLISH")}
                      className={`py-2 rounded-xl font-bold transition-all ${
                        trendBias === "BULLISH"
                          ? "bg-[#76A98C] text-[#0D0E10]"
                          : "bg-[#101114] text-[#A0A3AD]"
                      }`}
                    >
                      صعودی
                    </button>
                    <button
                      type="button"
                      onClick={() => setTrendBias("BEARISH")}
                      className={`py-2 rounded-xl font-bold transition-all ${
                        trendBias === "BEARISH"
                          ? "bg-[#C77A82] text-[#0D0E10]"
                          : "bg-[#101114] text-[#A0A3AD]"
                      }`}
                    >
                      نزولی
                    </button>
                    <button
                      type="button"
                      onClick={() => setTrendBias("NEUTRAL")}
                      className={`py-2 rounded-xl font-bold transition-all ${
                        trendBias === "NEUTRAL"
                          ? "bg-[#F0AE55] text-[#0D0E10]"
                          : "bg-[#101114] text-[#A0A3AD]"
                      }`}
                    >
                      خنثی/رنج
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#A0A3AD]">تایم‌فریم چارت:</label>
                  <select
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="w-full bg-[#101114] border border-white/10 rounded-2xl px-3 py-2 text-xs text-[#F0F0F1] outline-none focus:border-[#76A98C]"
                  >
                    <option value="1H">۱ ساعته (1H)</option>
                    <option value="4H">۴ ساعته (4H)</option>
                    <option value="1D">روزانه (1D)</option>
                    <option value="1W">هفتگی (1W)</option>
                  </select>
                </div>
              </div>

              {/* Chart Image Upload */}
              <div className="space-y-1">
                <label className="font-semibold text-[#A0A3AD]">
                  تصویر و اسنپ‌شات چارت (Chart Snapshot Image):
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={chartImageUrl}
                    onChange={(e) => setChartImageUrl(e.target.value)}
                    placeholder="آدرس تصویر چارت یا انتخاب از حافظه..."
                    dir="ltr"
                    className="flex-1 bg-[#101114] border border-white/10 rounded-2xl px-3 py-2 text-xs text-[#F0F0F1] outline-none focus:border-[#76A98C]"
                  />
                  <label className="px-4 py-2 rounded-2xl bg-white/10 hover:bg-white/15 text-xs text-[#F0F0F1] font-bold cursor-pointer transition-all flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-[#76A98C]" />
                    <span>{isUploading ? "در حال آپلود..." : "آپلود چارت"}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleChartUpload}
                      disabled={isUploading}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Summary */}
              <div className="space-y-1">
                <label className="font-semibold text-[#A0A3AD]">خلاصه اجرایی تحلیل (در کارت‌ها نمایش داده می‌شود):</label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={2}
                  placeholder="چکیده ۲ الی ۳ خطی از مهم‌ترین اتفاق چارت و چشم‌انداز..."
                  className="w-full bg-[#101114] border border-white/10 rounded-2xl p-3 text-xs text-[#F0F0F1] outline-none focus:border-[#76A98C]"
                />
              </div>

              {/* Fundamental Data & Indexes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#A0A3AD] flex items-center gap-1">
                    <Compass className="w-3.5 h-3.5 text-[#76A98C]" />
                    <span>داده‌های فاندامنتال و کلان اقتصادی:</span>
                  </label>
                  <textarea
                    value={fundamentalData}
                    onChange={(e) => setFundamentalData(e.target.value)}
                    rows={3}
                    placeholder="مثال: نرخ تورم، سیاست فدرال رزرو، حجم معاملات، عرضه دلار نیما و ..."
                    className="w-full bg-[#101114] border border-white/10 rounded-2xl p-3 text-xs text-[#F0F0F1] outline-none focus:border-[#76A98C]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-[#A0A3AD] flex items-center gap-1">
                    <Gauge className="w-3.5 h-3.5 text-[#F0AE55]" />
                    <span>شاخص‌های بازار و احساسات (Indexes):</span>
                  </label>
                  <textarea
                    value={indexesSummary}
                    onChange={(e) => setIndexesSummary(e.target.value)}
                    rows={3}
                    placeholder="مثال: شاخص ترس و طمع، دامیننس، RSI، شاخص نوسانات VIX و ..."
                    className="w-full bg-[#101114] border border-white/10 rounded-2xl p-3 text-xs text-[#F0F0F1] outline-none focus:border-[#76A98C]"
                  />
                </div>
              </div>

              {/* In-depth Analysis Body */}
              <div className="space-y-1">
                <label className="font-semibold text-[#A0A3AD]">
                  متن تفصیلی تحلیل چارت (مانند مقاله وبلاگ با پاراگراف‌ها و توضیحات کامل):
                </label>
                <textarea
                  value={analysisText}
                  onChange={(e) => setAnalysisText(e.target.value)}
                  rows={6}
                  placeholder="شرح و بسط کامل الگوهای هارمونیک یا کلاسیک، خطوط روند، سطوح عرضه و تقاضا، رفتار نقدینگی و سناریوهای پیش‌رو..."
                  className="w-full bg-[#101114] border border-white/10 rounded-2xl p-4 text-xs text-[#F0F0F1] outline-none focus:border-[#76A98C] leading-relaxed"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2.5 rounded-2xl text-xs text-[#A0A3AD] hover:bg-white/5"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={() =>
                  createMutation.mutate({
                    title,
                    symbol,
                    marketCategory,
                    trendBias,
                    timeframe,
                    summary,
                    chartImageUrl: chartImageUrl || undefined,
                    fundamentalData: fundamentalData || undefined,
                    indexesSummary: indexesSummary || undefined,
                    keyLevels: keyLevels || undefined,
                    analysisText,
                    readingTime,
                    traderName: user?.fullName || "معامله‌گر تیا",
                  })
                }
                disabled={createMutation.isPending || !title || !analysisText}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#76A98C] to-[#5B8D71] text-[#0D0E10] text-xs font-black disabled:opacity-50 hover:opacity-95 transition-all shadow-[0_0_15px_rgba(118,169,140,0.25)]"
              >
                {createMutation.isPending ? "در حال ثبت..." : "انتشار تحلیل چارت"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Analysis Modal */}
      {showEditModal && selectedSignal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl my-8 rounded-3xl bg-[#17181D] border border-white/15 p-7 space-y-5 shadow-2xl text-right">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-base font-bold text-[#F0F0F1] flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-[#76A98C]" />
                <span>ویرایش تحلیل چارت: {selectedSignal.symbol}</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="p-1 rounded-lg text-[#8E929E] hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-2xl bg-[#C77A82]/15 border border-[#C77A82]/30 text-xs text-[#C77A82]">
                {formError}
              </div>
            )}

            <div className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="font-semibold text-[#A0A3AD]">عنوان:</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-[#101114] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-[#F0F0F1]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-[#A0A3AD]">چشم‌انداز روند:</label>
                  <select
                    value={trendBias}
                    onChange={(e) => setTrendBias(e.target.value as TrendBias)}
                    className="w-full bg-[#101114] border border-white/10 rounded-2xl px-3 py-2 text-xs text-[#F0F0F1]"
                  >
                    <option value="BULLISH">صعودی (Bullish)</option>
                    <option value="BEARISH">نزولی (Bearish)</option>
                    <option value="NEUTRAL">خنثی / رنج (Neutral)</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="font-semibold text-[#A0A3AD]">تایم‌فریم:</label>
                  <input
                    type="text"
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="w-full bg-[#101114] border border-white/10 rounded-2xl px-3 py-2 text-xs text-[#F0F0F1]"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#A0A3AD]">تصویر چارت (URL):</label>
                <input
                  type="text"
                  value={chartImageUrl}
                  onChange={(e) => setChartImageUrl(e.target.value)}
                  dir="ltr"
                  className="w-full bg-[#101114] border border-white/10 rounded-2xl px-3 py-2 text-xs text-[#F0F0F1]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#A0A3AD]">خلاصه:</label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  rows={2}
                  className="w-full bg-[#101114] border border-white/10 rounded-2xl p-3 text-xs text-[#F0F0F1]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-[#A0A3AD]">متن تفصیلی تحلیل:</label>
                <textarea
                  value={analysisText}
                  onChange={(e) => setAnalysisText(e.target.value)}
                  rows={6}
                  className="w-full bg-[#101114] border border-white/10 rounded-2xl p-3 text-xs text-[#F0F0F1]"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2.5 rounded-2xl text-xs text-[#A0A3AD] hover:bg-white/5"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={() =>
                  updateMutation.mutate({
                    id: selectedSignal.id,
                    data: {
                      title,
                      trendBias,
                      timeframe,
                      summary,
                      chartImageUrl: chartImageUrl || undefined,
                      fundamentalData: fundamentalData || undefined,
                      indexesSummary: indexesSummary || undefined,
                      keyLevels: keyLevels || undefined,
                      analysisText,
                    },
                  })
                }
                disabled={updateMutation.isPending}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#76A98C] to-[#5B8D71] text-[#0D0E10] text-xs font-black disabled:opacity-50 hover:opacity-95 transition-all shadow-[0_0_15px_rgba(118,169,140,0.25)]"
              >
                {updateMutation.isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {showDeleteModal && selectedSignal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-[#17181D] border border-white/15 p-6 space-y-4 shadow-2xl text-right">
            <div className="flex items-center gap-3 text-[#C77A82]">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-bold text-base text-[#F0F0F1]">حذف تحلیل چارت</h3>
            </div>

            <p className="text-xs text-[#A0A3AD] leading-relaxed">
              آیا از حذف تحلیل <strong className="text-[#F0F0F1]">«{selectedSignal.title}»</strong> اطمینان دارید؟
            </p>

            <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2.5 rounded-2xl text-xs text-[#A0A3AD] hover:bg-white/5"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={() => deleteMutation.mutate(selectedSignal.id)}
                disabled={deleteMutation.isPending}
                className="px-6 py-2.5 rounded-2xl bg-[#C77A82] text-[#0D0E10] text-xs font-bold disabled:opacity-50 hover:opacity-95 transition-all"
              >
                {deleteMutation.isPending ? "در حال حذف..." : "بله، حذف شود"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
