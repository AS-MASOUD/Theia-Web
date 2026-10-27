"use client";

import React from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  FileText,
  LineChart,
  MessageSquare,
  ArrowLeft,
  Layers,
} from "lucide-react";
import { webApi } from "@/lib/api";

export default function AdminDashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: () => webApi.adminGetStats(),
    refetchInterval: 30000,
  });

  const { data: recentSignals } = useQuery({
    queryKey: ["admin-recent-signals"],
    queryFn: () => webApi.getAdminSignals(1),
  });

  const { data: recentArticles } = useQuery({
    queryKey: ["admin-recent-articles"],
    queryFn: () => webApi.getAdminArticles(undefined, 1),
  });

  const { data: recentComments } = useQuery({
    queryKey: ["admin-recent-comments"],
    queryFn: () => webApi.getAdminComments(1),
  });

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="rounded-2xl bg-[#141518] border border-white/[0.06] p-5 space-y-3">
          <div className="flex items-center justify-between text-[#F0AE55]">
            <span className="text-xs text-[#8E929E]">مجموع وبلاگ‌ها</span>
            <FileText className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#F0F0F1] font-mono">
            {statsLoading ? "..." : (stats?.totalBlogs ?? 0).toLocaleString("en-US")}
          </div>
          <div className="text-[11px] text-[#707581]">تحلیل‌های عمیق اقتصادی</div>
        </div>

        <div className="rounded-2xl bg-[#141518] border border-white/[0.06] p-5 space-y-3">
          <div className="flex items-center justify-between text-sky-400">
            <span className="text-xs text-[#8E929E]">اخبار روز بازار</span>
            <Layers className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#F0F0F1] font-mono">
            {statsLoading ? "..." : (stats?.totalNews ?? 0).toLocaleString("en-US")}
          </div>
          <div className="text-[11px] text-[#707581]">رویدادها و نرخ‌های روز</div>
        </div>

        <div className="rounded-2xl bg-[#141518] border border-white/[0.06] p-5 space-y-3">
          <div className="flex items-center justify-between text-[#76A98C]">
            <span className="text-xs text-[#8E929E]">سیگنال‌های معاملاتی</span>
            <LineChart className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#F0F0F1] font-mono">
            {statsLoading ? "..." : (stats?.totalSignals ?? 0).toLocaleString("en-US")}
          </div>
          <div className="text-[11px] text-[#707581]">تحلیل‌های چارت فعال</div>
        </div>

        <div className="rounded-2xl bg-[#141518] border border-white/[0.06] p-5 space-y-3">
          <div className="flex items-center justify-between text-amber-400">
            <span className="text-xs text-[#8E929E]">دیدگاه‌های کاربران</span>
            <MessageSquare className="w-5 h-5" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-[#F0F0F1] font-mono">
            {statsLoading ? "..." : (stats?.totalComments ?? 0).toLocaleString("en-US")}
          </div>
          <div className="text-[11px] text-[#707581]">نظرات ثبت‌شده ذیل مقالات</div>
        </div>
      </div>

      {/* Main Grid: Recent Signals & Recent Articles */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Daily Signals Table */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#121316] p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <LineChart className="w-5 h-5 text-[#76A98C]" />
              <h3 className="font-bold text-sm text-[#F0F0F1]">آخرین سیگنال‌های معامله‌گران</h3>
            </div>
            <Link
              href="/admin/signals"
              className="text-xs text-[#76A98C] hover:underline flex items-center gap-1 font-semibold"
            >
              <span>مشاهده همه</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {recentSignals && recentSignals.length > 0 ? (
              recentSignals.slice(0, 4).map((sig) => (
                <div key={sig.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#F0F0F1] truncate">
                        {sig.title}
                      </span>
                      <span
                        className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                          sig.signalType === "BUY"
                            ? "bg-[#76A98C]/15 text-[#76A98C]"
                            : sig.signalType === "SELL"
                            ? "bg-[#C77A82]/15 text-[#C77A82]"
                            : "bg-[#F0AE55]/15 text-[#F0AE55]"
                        }`}
                      >
                        {sig.signalType}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-[10px] text-[#707581]">
                      <span>نماد: {sig.symbol}</span>
                      <span>•</span>
                      <span>ورود: {sig.entryPrice}</span>
                      <span>•</span>
                      <span>تارگت: {sig.targetPrice}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-[#8E929E] block">{sig.traderName}</span>
                    <span className="text-[9px] text-[#555964]">
                      {new Date(sig.createdAt).toLocaleDateString("fa-IR")}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#707581] py-6 text-center">
                سیگنالی تاکنون ثبت نشده است.
              </p>
            )}
          </div>
        </div>

        {/* Recent Articles */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#121316] p-6 space-y-4 shadow-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-[#F0AE55]" />
              <h3 className="font-bold text-sm text-[#F0F0F1]">تازه‌ترین مقالات و اخبار</h3>
            </div>
            <Link
              href="/admin/articles"
              className="text-xs text-[#F0AE55] hover:underline flex items-center gap-1 font-semibold"
            >
              <span>مشاهده همه</span>
              <ArrowLeft className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="divide-y divide-white/[0.04]">
            {recentArticles?.items && recentArticles.items.length > 0 ? (
              recentArticles.items.slice(0, 4).map((art) => (
                <div key={art.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-xs text-[#F0F0F1] truncate">
                        {art.title}
                      </span>
                      <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-[#A0A3AD]">
                        {art.articleType === "news" ? "خبر" : "وبلاگ"}
                      </span>
                    </div>
                    <div className="text-[10px] text-[#707581]">
                      نویسنده: {art.authorName || "تحریریه"}
                    </div>
                  </div>
                  <Link
                    href={`/admin/articles/${art.id}/edit`}
                    className="text-xs text-[#A0A3AD] hover:text-[#F0AE55] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 shrink-0 font-medium"
                  >
                    ویرایش
                  </Link>
                </div>
              ))
            ) : (
              <p className="text-xs text-[#707581] py-6 text-center">
                مطلبی یافت نشد.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
