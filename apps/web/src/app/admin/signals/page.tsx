"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  LineChart,
  Plus,
  TrendingUp,
  TrendingDown,
  Edit2,
  Trash2,
  AlertTriangle,
  X,
  Sparkles,
  ExternalLink,
  ShieldAlert,
  Layers,
  Image as ImageIcon,
  Compass,
  Gauge,
  Activity,
  BarChart3,
  Search,
} from "lucide-react";
import { webApi } from "@/lib/api";
import { useAdminAuth } from "@/lib/admin-auth-context";
import { MarketSignal, MarketCategory, TrendBias } from "@/types/market-signals";

export default function AdminSignalsPage() {
  const queryClient = useQueryClient();
  const { isTrader, isAdmin } = useAdminAuth();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedSignal, setSelectedSignal] = useState<MarketSignal | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const { data: signalsList, isLoading } = useQuery({
    queryKey: ["admin-signals"],
    queryFn: () => webApi.getAdminSignals(1),
    enabled: isTrader || isAdmin,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => webApi.deleteSignal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-signals"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      queryClient.invalidateQueries({ queryKey: ["chart-signals"] });
      setShowDeleteModal(false);
      setSelectedSignal(null);
    },
    onError: (err: any) => {
      setActionError(err?.message || "خطا در حذف تحلیل");
    },
  });

  const filteredSignals = useMemo(() => {
    if (!signalsList) return [];
    return signalsList.filter((sig) => {
      if (selectedCategory !== "all" && sig.marketCategory !== selectedCategory) {
        return false;
      }
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        sig.title.toLowerCase().includes(q) ||
        sig.symbol.toLowerCase().includes(q) ||
        (sig.summary && sig.summary.toLowerCase().includes(q)) ||
        (sig.traderName && sig.traderName.toLowerCase().includes(q))
      );
    });
  }, [signalsList, selectedCategory, searchQuery]);

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
      <div className="p-8 rounded-3xl bg-[#141518] border border-white/10 text-center space-y-4 max-w-lg mx-auto">
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
            نگارش و مدیریت مقالات تحلیلی متمرکز بر نمودار قیمت، شاخص‌های کلان فاندامنتال و سنجش ریسک
          </p>
        </div>

        <Link
          href="/admin/signals/new"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#76A98C] to-[#5B8D71] text-[#0D0E10] font-black text-xs hover:opacity-95 transition-all shadow-[0_0_20px_rgba(118,169,140,0.25)] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>نگارش تحلیل و چارت جدید</span>
        </Link>
      </div>

      {actionError && (
        <div className="p-4 rounded-2xl bg-[#C77A82]/15 border border-[#C77A82]/30 text-xs text-[#C77A82] flex items-center justify-between">
          <span>{actionError}</span>
          <button type="button" onClick={() => setActionError(null)} className="text-[#C77A82] hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#141518] border border-white/[0.08] w-full sm:w-auto overflow-x-auto">
          <button
            type="button"
            onClick={() => setSelectedCategory("all")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedCategory === "all"
                ? "bg-[#76A98C] text-[#0D0E10] shadow-[0_0_12px_rgba(118,169,140,0.25)]"
                : "text-[#A0A3AD] hover:text-white"
            }`}
          >
            همه بازارها
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory("gold_coin")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedCategory === "gold_coin"
                ? "bg-[#76A98C] text-[#0D0E10] shadow-[0_0_12px_rgba(118,169,140,0.25)]"
                : "text-[#A0A3AD] hover:text-white"
            }`}
          >
            طلا و سکه
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory("currency")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedCategory === "currency"
                ? "bg-[#76A98C] text-[#0D0E10] shadow-[0_0_12px_rgba(118,169,140,0.25)]"
                : "text-[#A0A3AD] hover:text-white"
            }`}
          >
            ارزها
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory("crypto")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedCategory === "crypto"
                ? "bg-[#76A98C] text-[#0D0E10] shadow-[0_0_12px_rgba(118,169,140,0.25)]"
                : "text-[#A0A3AD] hover:text-white"
            }`}
          >
            رمزارزها
          </button>
          <button
            type="button"
            onClick={() => setSelectedCategory("commodity")}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
              selectedCategory === "commodity"
                ? "bg-[#76A98C] text-[#0D0E10] shadow-[0_0_12px_rgba(118,169,140,0.25)]"
                : "text-[#A0A3AD] hover:text-white"
            }`}
          >
            کالا و انرژی
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#707581] absolute right-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو بر اساس نماد، عنوان یا تحلیل‌گر..."
            className="w-full bg-[#141518] border border-white/[0.08] rounded-2xl pr-9 pl-4 py-2 text-xs text-[#F0F0F1] outline-none focus:border-[#76A98C]"
          />
        </div>
      </div>

      {/* Analyses Table */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#121316] overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
          <h3 className="font-bold text-sm text-[#F0F0F1] flex items-center gap-2">
            <LineChart className="w-4 h-4 text-[#76A98C]" />
            <span>فهرست تحلیل‌های چارت منتشرشده</span>
          </h3>
          <span className="text-xs text-[#707581]">
            تعداد کل: {filteredSignals.length} از {signalsList?.length ?? 0}
          </span>
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
              ) : filteredSignals && filteredSignals.length > 0 ? (
                filteredSignals.map((sig) => {
                  const trendBadge = getTrendBadge(sig.trendBias);
                  return (
                    <tr key={sig.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4 max-w-sm">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-md bg-white/10 text-white font-mono font-bold text-[10px]">
                              {sig.symbol}
                            </span>
                            <Link
                              href={`/admin/signals/${sig.id}/edit`}
                              className="font-bold text-[#F0F0F1] truncate block text-xs hover:text-[#76A98C] transition-colors"
                            >
                              {sig.title}
                            </Link>
                          </div>
                          {sig.summary && (
                            <p className="text-[11px] text-[#707581] line-clamp-1 pr-1">
                              {sig.summary}
                            </p>
                          )}
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
                        <div className="flex items-center justify-center gap-1.5">
                          <Link
                            href={`/analysis/${sig.id}`}
                            target="_blank"
                            className="p-1.5 rounded-lg text-[#A0A3AD] hover:text-white hover:bg-white/5 transition-all"
                            title="مشاهده صفحه کامل تحلیل"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/signals/${sig.id}/edit`}
                            className="p-1.5 rounded-lg text-[#A0A3AD] hover:text-[#76A98C] hover:bg-white/5 transition-all"
                            title="ویرایش تحلیل"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
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
                    تحلیلی در این بخش یافت نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Delete Confirmation Modal */}
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
