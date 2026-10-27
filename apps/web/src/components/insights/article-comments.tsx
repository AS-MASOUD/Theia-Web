"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MessageSquare, Send, CheckCircle2, User, Mail, Sparkles, AlertCircle } from "lucide-react";
import { webApi } from "@/lib/api";
import { CommentItem } from "@/types/admin";

interface ArticleCommentsProps {
  articleSlug: string;
}

export function ArticleComments({ articleSlug }: ArticleCommentsProps) {
  const queryClient = useQueryClient();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [content, setContent] = useState("");
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { data: comments, isLoading } = useQuery<CommentItem[]>({
    queryKey: ["article-comments", articleSlug],
    queryFn: () => webApi.getArticleComments(articleSlug),
  });

  const commentMutation = useMutation({
    mutationFn: (payload: { userName: string; userEmail: string; content: string }) =>
      webApi.submitArticleComment(articleSlug, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["article-comments", articleSlug] });
      setSuccessMsg("دیدگاه شما با موفقیت ثبت شد.");
      setErrorMsg(null);
      setContent("");
      setTimeout(() => setSuccessMsg(null), 5000);
    },
    onError: (err: any) => {
      setErrorMsg(err?.message || "خطا در ارسال دیدگاه. لطفاً دوباره تلاش فرمایید.");
      setSuccessMsg(null);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !userEmail.trim() || !content.trim()) {
      setErrorMsg("لطفاً تمامی فیلدها را پر کنید.");
      return;
    }
    commentMutation.mutate({
      userName: userName.trim(),
      userEmail: userEmail.trim(),
      content: content.trim(),
    });
  };

  return (
    <div className="pt-10 border-t border-white/[0.08] space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#F0AE55]/15 border border-[#F0AE55]/30 flex items-center justify-center text-[#F0AE55]">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-lg text-[#F0F0F1]">دیدگاه‌ها و پرسش‌های کاربران</h3>
            <p className="text-xs text-[#8E929E]">نظرات خود را با نویسندگان و جامعه تحلیل‌گران تیا به اشتراک بگذارید</p>
          </div>
        </div>
        <span className="text-xs px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[#C7C9D1]">
          {comments?.length ?? 0} دیدگاه
        </span>
      </div>

      {/* Submission Form */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#141519] p-6 sm:p-7 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-xs font-bold text-[#F0AE55]">
          <Sparkles className="w-3.5 h-3.5" />
          <span>ارسال نظر یا سؤال درباره این مقاله</span>
        </div>

        {successMsg && (
          <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-[#76A98C]/15 border border-[#76A98C]/30 text-xs text-[#76A98C]">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {errorMsg && (
          <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-[#C77A82]/15 border border-[#C77A82]/30 text-xs text-[#C77A82]">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#A0A3AD]">نام و نام خانوادگی:</label>
              <div className="relative">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="مثال: علی رضایی"
                  required
                  className="w-full bg-[#18191E] border border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-[#F0F0F1] outline-none focus:border-[#F0AE55] transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-semibold text-[#A0A3AD]">نشانی ایمیل (محفوظ می‌ماند):</label>
              <div className="relative">
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="ali@example.com"
                  dir="ltr"
                  required
                  className="w-full bg-[#18191E] border border-white/10 rounded-2xl px-3.5 py-2.5 text-xs text-[#F0F0F1] outline-none focus:border-[#F0AE55] transition-all"
                />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-semibold text-[#A0A3AD]">متن نظر یا دیدگاه شما:</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={3}
              placeholder="دیدگاه خود را با کمال احترام و با تمرکز بر مباحث اقتصادی بنویسید..."
              required
              className="w-full bg-[#18191E] border border-white/10 rounded-2xl p-3.5 text-xs text-[#F0F0F1] outline-none focus:border-[#F0AE55] transition-all leading-relaxed"
            />
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={commentMutation.isPending}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-[#F0AE55] to-[#E59F45] text-[#0D0E10] text-xs font-black hover:opacity-95 transition-all shadow-[0_0_15px_rgba(240,174,85,0.25)] disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{commentMutation.isPending ? "در حال ارسال..." : "ثبت دیدگاه"}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Existing Comments List */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="p-6 text-center text-xs text-[#707581]">در حال بارگذاری نظرات...</div>
        ) : comments && comments.length > 0 ? (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="p-5 rounded-2xl bg-[#141518] border border-white/[0.06] space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#F0AE55]/30 to-[#F0AE55]/10 border border-[#F0AE55]/20 flex items-center justify-center text-[#F0AE55] font-bold text-xs">
                    {comment.userName[0]}
                  </div>
                  <div>
                    <span className="font-bold text-xs text-[#F0F0F1] block">{comment.userName}</span>
                    <span className="text-[10px] text-[#707581]">
                      {new Date(comment.createdAt).toLocaleDateString("fa-IR")}
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-[#D1D3D9] leading-relaxed pr-10">
                {comment.content}
              </p>
            </div>
          ))
        ) : (
          <div className="p-8 text-center rounded-2xl bg-[#141518] border border-white/[0.04] text-xs text-[#707581]">
            هنوز دیدگاهی برای این مطلب ثبت نشده است. اولین نفری باشید که نظر خود را به اشتراک می‌گذارد!
          </div>
        )}
      </div>
    </div>
  );
}
