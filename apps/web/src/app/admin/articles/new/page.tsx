"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  FileText,
  ArrowRight,
  Save,
  Sparkles,
  Upload,
  AlertCircle,
  Eye,
  Check,
} from "lucide-react";
import { webApi } from "@/lib/api";
import { RichTextEditor } from "@/components/admin/rich-text-editor";

export default function NewArticlePage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [articleType, setArticleType] = useState<"blog" | "news">("blog");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [readingTime, setReadingTime] = useState("۵ دقیقه");
  const [authorName, setAuthorName] = useState("تیم تحلیل تیا");
  const [authorRole, setAuthorRole] = useState("تحلیل‌گر ارشد");
  const [coverImage, setCoverImage] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { data: categories } = useQuery({
    queryKey: ["admin-categories"],
    queryFn: () => webApi.getCategories(),
  });

  const createMutation = useMutation({
    mutationFn: (data: any) => webApi.createArticle(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-articles"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      router.push("/admin/articles");
    },
    onError: (err: any) => {
      setError(err?.message || "خطا در ذخیره مطلب جدید.");
    },
  });

  const generateSlugFromTitle = () => {
    const s = title
      .trim()
      .toLowerCase()
      .replace(/[\s\-_]+/g, "-")
      .replace(/[^\u0600-\u06FFa-z0-9\-]/g, "");
    setSlug(s || `article-${Date.now()}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim() || !summary.trim() || !content.trim()) {
      setError("عنوان، نامک (slug)، خلاصه و متن محتوا الزامی هستند.");
      return;
    }

    createMutation.mutate({
      title: title.trim(),
      slug: slug.trim(),
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
              نگارش مطلب جدید
            </h1>
            <p className="text-xs text-[#8E929E]">
              انتشار مقاله تحلیلی یا خبر فوری بازار با ویرایشگر چندرسانه‌ای
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={createMutation.isPending}
          className="flex items-center gap-2 px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#F0AE55] to-[#E59F45] text-[#0D0E10] font-black text-xs hover:opacity-95 transition-all shadow-[0_0_20px_rgba(240,174,85,0.25)] disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{createMutation.isPending ? "در حال ذخیره..." : "ذخیره و انتشار"}</span>
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
            <h3 className="font-bold text-sm text-[#F0F0F1]">مشخصات اصلی مطلب</h3>
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
                onBlur={() => {
                  if (!slug && title) generateSlugFromTitle();
                }}
                placeholder="مثال: استراتژی‌های بهینه‌سازی سبد دارایی در شرایط تورمی"
                className="w-full bg-[#17181D] border border-white/10 rounded-2xl px-4 py-3 text-xs sm:text-sm font-bold text-[#F0F0F1] outline-none focus:border-[#F0AE55]"
              />
            </div>

            {/* Slug */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#A0A3AD]">
                  نامک در آدرس اینترنتی (Slug):
                </label>
                <button
                  type="button"
                  onClick={generateSlugFromTitle}
                  className="text-[11px] text-[#F0AE55] hover:underline"
                >
                  تولید خودکار از عنوان
                </button>
              </div>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="managing-assets-in-inflation"
                dir="ltr"
                className="w-full bg-[#17181D] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-[#F0F0F1] font-mono outline-none focus:border-[#F0AE55]"
              />
            </div>

            {/* Summary */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A0A3AD]">
                خلاصه و چکیده اجرایی (نمایش در کارت‌ها):
              </label>
              <textarea
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                rows={3}
                placeholder="چکیده ۲ الی ۳ خطی از مهم‌ترین پیام این مطلب برای مخاطب..."
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
                <label className="text-xs font-semibold text-[#A0A3AD]">زمان تخمینی مطالعه:</label>
                <input
                  type="text"
                  value={readingTime}
                  onChange={(e) => setReadingTime(e.target.value)}
                  placeholder="۵ دقیقه"
                  className="w-full bg-[#17181D] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-[#F0F0F1] outline-none focus:border-[#F0AE55]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#A0A3AD]">نام نویسنده:</label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="تیم تحلیل تیا"
                  className="w-full bg-[#17181D] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-[#F0F0F1] outline-none focus:border-[#F0AE55]"
                />
              </div>
            </div>

            {/* Cover Image URL */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#A0A3AD]">
                تصویر شاخص مقاله (Cover Image URL):
              </label>
              <input
                type="url"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
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
              <span>مطلب بلافاصله در وب‌سایت عمومی منتشر شود (Published)</span>
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
            <span className="text-[11px] text-[#8E929E]">پشتیبانی از جداول و تصاویر اختصاصی</span>
          </div>

          <RichTextEditor
            value={content}
            onChange={(html) => setContent(html)}
            placeholder="شروع به نگارش متن تحلیلی نمایید... می‌توانید از نوار ابزار بالا برای درج جداول، تصاویر، فرمت‌بندی و نکات اختصاصی استفاده کنید."
            minHeight="450px"
          />
        </div>
      </form>
    </div>
  );
}
