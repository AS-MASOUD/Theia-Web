"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  FileText,
  ArrowRight,
  Save,
  Sparkles,
  AlertCircle,
  Eye,
  Check,
} from "lucide-react";
import { webApi } from "@/lib/api";
import { RichTextEditor } from "@/components/admin/rich-text-editor";

export default function EditArticlePage() {
  const router = useRouter();
  const params = useParams();
  const queryClient = useQueryClient();
  const articleId = parseInt(params.id as string, 10);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [articleType, setArticleType] = useState<"blog" | "news">("blog");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [readingTime, setReadingTime] = useState("۵ دقیقه");
  const [authorName, setAuthorName] = useState("");
  const [authorRole, setAuthorRole] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: article, isLoading } = useQuery({
    queryKey: ["admin-article-detail", articleId],
    queryFn: () => webApi.getAdminArticleById(articleId),
    enabled: !!articleId,
  });

  const { data: categories } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => webApi.getCategories(),
  });

  useEffect(() => {
    if (article) {
      setTitle(article.title || "");
      setSlug(article.slug || "");
      setArticleType(article.articleType || "blog");
      setSummary(article.summary || "");
      setContent(article.content || "");
      setCategoryId(article.categoryId || undefined);
      setReadingTime(article.readingTime || "۵ دقیقه");
      setAuthorName(article.authorName || "");
      setAuthorRole(article.authorRole || "");
      setCoverImage(article.coverImage || "");
      setIsPublished(article.isPublished ?? true);
    }
  }, [article]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => webApi.updateArticle(articleId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      queryClient.invalidateQueries({ queryKey: ["admin-article-detail", articleId] });
      router.push("/admin/articles");
    },
    onError: (err: any) => {
      setError(err?.message || "خطا در به‌روزرسانی مطلب.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !summary.trim() || !content.trim()) {
      setError("عنوان، خلاصه و متن محتوا الزامی هستند.");
      return;
    }

    updateMutation.mutate({
      title: title.trim(),
      articleType,
      summary: summary.trim(),
      content: content.trim(),
      categoryId: categoryId || undefined,
      readingTime: readingTime.trim(),
      authorName: authorName.trim(),
      authorRole: authorRole.trim(),
      coverImage: coverImage.trim() || undefined,
      isPublished,
    });
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center text-[#A0A3AD]">
        <div className="w-8 h-8 border-2 border-[#F0AE55] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <span>در حال فراخوانی مشخصات مقاله...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/articles"
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#A0A3AD] hover:text-white transition-all"
          >
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-[#F0F0F1] tracking-tight">
              ویرایش مطلب: {article?.title}
            </h1>
            <p className="text-xs text-[#8E929E]">
              به‌روزرسانی محتوا، قالب‌بندی و تنظیمات انتشار
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={updateMutation.isPending}
          className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#F0AE55] to-[#E59F45] text-[#0D0E10] font-black text-xs hover:opacity-95 transition-all shadow-[0_0_20px_rgba(240,174,85,0.25)] disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{updateMutation.isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}</span>
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-[#C77A82]/15 border border-[#C77A82]/30 text-xs text-[#C77A82]">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Metadata Card */}
        <div className="rounded-3xl border border-white/[0.08] bg-[#121316] p-6 sm:p-8 space-y-6 shadow-xl">
          <div className="flex items-center justify-between border-b border-white/[0.06] pb-4">
            <h3 className="font-bold text-sm text-[#F0F0F1]">مشخصات مطلب</h3>
            {/* Article Type Picker */}
            <div className="flex items-center gap-1 p-1 bg-[#1A1B20] rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setArticleType("blog")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  articleType === "blog"
                    ? "bg-[#F0AE55] text-[#0D0E10]"
                    : "text-[#A0A3AD] hover:text-white"
                }`}
              >
                وبلاگ / مقاله
              </button>
              <button
                type="button"
                onClick={() => setArticleType("news")}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  articleType === "news"
                    ? "bg-[#F0AE55] text-[#0D0E10]"
                    : "text-[#A0A3AD] hover:text-white"
                }`}
              >
                خبر بازار
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Title */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A0A3AD]">عنوان کامل مطلب:</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-[#17181D] border border-white/10 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-[#F0F0F1] outline-none focus:border-[#F0AE55]"
              />
            </div>

            {/* Slug (Read only on edit) */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A0A3AD]">
                نامک یکتا (Slug):
              </label>
              <input
                type="text"
                value={slug}
                disabled
                dir="ltr"
                className="w-full bg-[#141518] border border-white/5 rounded-2xl px-4 py-2.5 text-xs text-[#707581] font-mono cursor-not-allowed"
              />
            </div>

            {/* Summary */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A0A3AD]">
                خلاصه و چکیده اجرایی:
              </label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={3}
                className="w-full bg-[#17181D] border border-white/10 rounded-2xl px-4 py-3 text-xs text-[#F0F0F1] outline-none focus:border-[#F0AE55] leading-relaxed"
              />
            </div>

            {/* Grid settings */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#A0A3AD]">دسته‌بندی:</label>
                <select
                  value={categoryId ?? ""}
                  onChange={(e) =>
                    setCategoryId(e.target.value ? parseInt(e.target.value, 10) : undefined)
                  }
                  className="w-full bg-[#17181D] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-[#F0F0F1] outline-none focus:border-[#F0AE55]"
                >
                  <option value="">دسته‌بندی عمومی</option>
                  {categories?.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#A0A3AD]">زمان مطالعه:</label>
                <input
                  type="text"
                  value={readingTime}
                  onChange={(e) => setReadingTime(e.target.value)}
                  className="w-full bg-[#17181D] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-[#F0F0F1] outline-none focus:border-[#F0AE55]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#A0A3AD]">نام نویسنده:</label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full bg-[#17181D] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-[#F0F0F1] outline-none focus:border-[#F0AE55]"
                />
              </div>
            </div>

            {/* Cover Image URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A0A3AD]">
                تصویر شاخص (Cover Image URL):
              </label>
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                dir="ltr"
                className="w-full bg-[#17181D] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-[#F0F0F1] outline-none focus:border-[#F0AE55]"
              />
            </div>

            {/* Published Toggle */}
            <label className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#17181D] border border-white/10 cursor-pointer text-xs text-[#F0F0F1]">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="rounded accent-[#F0AE55] w-4 h-4"
              />
              <span>وضعیت انتشار: مقاله در سایت برای عموم قابل مشاهده باشد (Published)</span>
            </label>
          </div>
        </div>

        {/* High-Reach Rich Text Editor Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-[#F0F0F1] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#F0AE55]" />
              <span>محتوای تفصیلی با ویرایشگر پیشرفته (جداول، تصاویر و قالب‌بندی)</span>
            </h3>
            <span className="text-[11px] text-[#8E929E]">امکان استفاده از جداول و تصاویر پیشرفته</span>
          </div>

          <RichTextEditor
            value={content}
            onChange={(html) => setContent(html)}
            placeholder="محتوای تفصیلی مقاله را ویرایش کنید..."
            minHeight="450px"
          />
        </div>
      </form>
    </div>
  );
}
