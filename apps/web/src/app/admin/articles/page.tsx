"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  FileText,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  Eye,
  CheckCircle,
  Clock,
  Filter,
  Sparkles,
  Layers,
  AlertTriangle,
} from "lucide-react";
import { webApi } from "@/lib/api";
import { useAdminAuth } from "@/lib/admin-auth-context";
import { AdminArticleItem } from "@/types/admin";

export default function AdminArticlesPage() {
  const queryClient = useQueryClient();
  const { isEditor, isAdmin } = useAdminAuth();

  const [activeTab, setActiveTab] = useState<"all" | "blog" | "news">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteTarget, setDeleteTarget] = useState<AdminArticleItem | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-articles", activeTab],
    queryFn: () =>
      webApi.getAdminArticles(activeTab === "all" ? undefined : activeTab, 1),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => webApi.deleteArticle(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      setDeleteTarget(null);
    },
  });

  const filteredItems = useMemo(() => {
    if (!data?.items) return [];
    return data.items.filter((item) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.title.toLowerCase().includes(q) ||
        item.summary.toLowerCase().includes(q) ||
        item.slug.toLowerCase().includes(q)
      );
    });
  }, [data?.items, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#F0F0F1] tracking-tight">
            مدیریت وبلاگ و اخبار تحلیلی
          </h1>
          <p className="text-xs text-[#8E929E] mt-1">
            ایجاد و مدیریت مقالات پایگاه دانش، بولتن‌های خبری و تحلیل‌های تخصصی با ویرایشگر پیشرفته
          </p>
        </div>

        <Link
          href="/admin/articles/new"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#F0AE55] to-[#E59F45] text-[#0D0E10] font-black text-xs hover:opacity-95 transition-all shadow-[0_0_20px_rgba(240,174,85,0.25)] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>نگارش مطلب جدید</span>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#141518] border border-white/[0.08] w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "all"
                ? "bg-[#F0AE55] text-[#0D0E10] shadow-[0_0_12px_rgba(240,174,85,0.25)]"
                : "text-[#A0A3AD] hover:text-white"
            }`}
          >
            همه مطالب
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("blog")}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "blog"
                ? "bg-[#F0AE55] text-[#0D0E10] shadow-[0_0_12px_rgba(240,174,85,0.25)]"
                : "text-[#A0A3AD] hover:text-white"
            }`}
          >
            وبلاگ‌ها
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("news")}
            className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === "news"
                ? "bg-[#F0AE55] text-[#0D0E10] shadow-[0_0_12px_rgba(240,174,85,0.25)]"
                : "text-[#A0A3AD] hover:text-white"
            }`}
          >
            اخبار بازار
          </button>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در عنوان یا متن..."
            className="w-full bg-[#141518] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-[#F0F0F1] outline-none focus:border-[#F0AE55] pr-10"
          />
          <Search className="w-4 h-4 text-[#707581] absolute right-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#121316] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-white/[0.06] bg-[#16171B] text-[#A0A3AD] font-semibold">
                <th className="p-4">عنوان مطلب</th>
                <th className="p-4">نوع</th>
                <th className="p-4">نویسنده</th>
                <th className="p-4">دسته‌بندی</th>
                <th className="p-4">وضعیت</th>
                <th className="p-4">بازدید</th>
                <th className="p-4">تاریخ انتشار</th>
                <th className="p-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {isLoading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-[#707581]">
                    در حال دریافت مطالب...
                  </td>
                </tr>
              ) : filteredItems.length > 0 ? (
                filteredItems.map((item) => (
                  <tr key={item.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 max-w-sm">
                      <div className="space-y-1">
                        <span className="font-bold text-[#F0F0F1] block truncate text-xs">
                          {item.title}
                        </span>
                        <span className="text-[10px] text-[#707581] font-mono dir-ltr inline-block truncate max-w-xs">
                          /{item.slug}
                        </span>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                          item.articleType === "news"
                            ? "bg-sky-500/15 text-sky-400 border-sky-500/30"
                            : "bg-[#F0AE55]/15 text-[#F0AE55] border-[#F0AE55]/30"
                        }`}
                      >
                        {item.articleType === "news" ? "خبر" : "وبلاگ"}
                      </span>
                    </td>
                    <td className="p-4 text-[#C7C9D1]">{item.authorName || "تیم تحریریه"}</td>
                    <td className="p-4 text-[#8E929E]">{item.categoryName || "عمومی"}</td>
                    <td className="p-4">
                      {item.isPublished ? (
                        <span className="inline-flex items-center gap-1 text-[#76A98C] text-[11px] font-semibold">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>منتشر شده</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[#F0AE55] text-[11px] font-semibold">
                          <Clock className="w-3.5 h-3.5" />
                          <span>پیش‌نویس</span>
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-[#A0A3AD] font-mono">{item.viewsCount ?? 0}</td>
                    <td className="p-4 text-[#707581] text-[11px]">
                      {item.publishedAt
                        ? new Date(item.publishedAt).toLocaleDateString("fa-IR")
                        : "—"}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Link
                          href={`/insights/${item.slug}`}
                          target="_blank"
                          className="p-1.5 rounded-lg text-[#A0A3AD] hover:text-white hover:bg-white/5 transition-all"
                          title="مشاهده عمومی در سایت"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/articles/${item.id}/edit`}
                          className="p-1.5 rounded-lg text-[#A0A3AD] hover:text-[#F0AE55] hover:bg-white/5 transition-all"
                          title="ویرایش محتوا"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        {isAdmin && (
                          <button
                            type="button"
                            onClick={() => setDeleteTarget(item)}
                            className="p-1.5 rounded-lg text-[#A0A3AD] hover:text-[#C77A82] hover:bg-white/5 transition-all"
                            title="حذف مقاله"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-[#707581]">
                    مطلبی مطابق جستجو یافت نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-[#17181D] border border-white/15 p-6 space-y-4 shadow-2xl text-right">
            <div className="flex items-center gap-3 text-[#C77A82]">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-bold text-base text-[#F0F0F1]">حذف مطلب</h3>
            </div>

            <p className="text-xs text-[#A0A3AD] leading-relaxed">
              آیا از حذف مطلب <strong className="text-[#F0F0F1]">«{deleteTarget.title}»</strong> اطمینان دارید؟ کلیه دیدگاه‌ها و سوابق بازدید این مطلب نیز حذف خواهند شد.
            </p>

            <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2.5 rounded-2xl text-xs text-[#A0A3AD] hover:bg-white/5"
              >
                انصراف
              </button>
              <button
                type="button"
                onClick={() => deleteMutation.mutate(deleteTarget.id)}
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
