"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  MessageSquare,
  CheckCircle,
  XCircle,
  Trash2,
  ExternalLink,
  Eye,
  EyeOff,
  AlertTriangle,
  User,
  Mail,
  Calendar,
} from "lucide-react";
import { webApi } from "@/lib/api";
import { useAdminAuth } from "@/lib/admin-auth-context";
import { CommentItem } from "@/types/admin";

export default function AdminCommentsPage() {
  const queryClient = useQueryClient();
  const { isEditor, isAdmin } = useAdminAuth();
  const [deleteTarget, setDeleteTarget] = useState<CommentItem | null>(null);

  const { data: commentsList, isLoading } = useQuery({
    queryKey: ["admin-comments"],
    queryFn: () => webApi.getAdminComments(1),
    enabled: isEditor || isAdmin,
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, isApproved }: { id: number; isApproved: boolean }) =>
      webApi.updateCommentStatus(id, isApproved),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-comments"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => webApi.deleteComment(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-comments"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      setDeleteTarget(null);
    },
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#F0F0F1] tracking-tight">
            نظارت بر دیدگاه‌ها و بازخوردهای کاربران
          </h1>
          <p className="text-xs text-[#8E929E] mt-1">
            بررسی و مدیریت نظرات ارسال‌شده توسط کاربران ذیل مقالات و اخبار تحلیلی
          </p>
        </div>
      </div>

      {/* Comments List Table */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#121316] overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
          <h3 className="font-bold text-sm text-[#F0F0F1] flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#F0AE55]" />
            <span>فهرست نظرات</span>
          </h3>
          <span className="text-xs text-[#707581]">
            تعداد کل: {commentsList?.length ?? 0}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-white/[0.06] bg-[#16171B] text-[#A0A3AD] font-semibold">
                <th className="p-4">کاربر</th>
                <th className="p-4">مطلب مرتبط</th>
                <th className="p-4">متن دیدگاه</th>
                <th className="p-4">وضعیت انتشار</th>
                <th className="p-4">تاریخ ثبت</th>
                <th className="p-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#707581]">
                    در حال دریافت دیدگاه‌ها...
                  </td>
                </tr>
              ) : commentsList && commentsList.length > 0 ? (
                commentsList.map((c) => (
                  <tr key={c.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="p-4 whitespace-nowrap">
                      <div className="space-y-0.5">
                        <span className="font-bold text-[#F0F0F1] block">{c.userName}</span>
                        <span className="text-[10px] text-[#707581] font-mono dir-ltr inline-block">
                          {c.userEmail}
                        </span>
                      </div>
                    </td>
                    <td className="p-4 max-w-xs">
                      {c.articleTitle ? (
                        <div className="flex items-center gap-1.5">
                          <span className="truncate block font-semibold text-[#C7C9D1]">
                            {c.articleTitle}
                          </span>
                          {c.articleSlug && (
                            <Link
                              href={`/insights/${c.articleSlug}`}
                              target="_blank"
                              className="text-[#707581] hover:text-[#F0AE55]"
                            >
                              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                            </Link>
                          )}
                        </div>
                      ) : (
                        <span className="text-[#707581]">—</span>
                      )}
                    </td>
                    <td className="p-4 max-w-md">
                      <p className="text-[#D1D3D9] line-clamp-3 leading-relaxed">
                        {c.content}
                      </p>
                    </td>
                    <td className="p-4 whitespace-nowrap">
                      {c.isApproved ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#76A98C]/15 text-[#76A98C] text-[10px] font-bold border border-[#76A98C]/30">
                          <CheckCircle className="w-3 h-3" />
                          <span>تأیید شده</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#C77A82]/15 text-[#C77A82] text-[10px] font-bold border border-[#C77A82]/30">
                          <EyeOff className="w-3 h-3" />
                          <span>مخفی</span>
                        </span>
                      )}
                    </td>
                    <td className="p-4 whitespace-nowrap text-[#707581] text-[11px]">
                      {new Date(c.createdAt).toLocaleDateString("fa-IR")}
                    </td>
                    <td className="p-4 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            toggleMutation.mutate({
                              id: c.id,
                              isApproved: !c.isApproved,
                            })
                          }
                          className={`p-1.5 rounded-lg transition-all ${
                            c.isApproved
                              ? "text-[#C77A82] hover:bg-[#C77A82]/10"
                              : "text-[#76A98C] hover:bg-[#76A98C]/10"
                          }`}
                          title={c.isApproved ? "مخفی‌سازی نظر" : "تأیید و نمایش نظر"}
                        >
                          {c.isApproved ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteTarget(c)}
                          className="p-1.5 rounded-lg text-[#A0A3AD] hover:text-[#C77A82] hover:bg-white/5 transition-all"
                          title="حذف دیدگاه"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-[#707581]">
                    دیدگاهی ثبت نشده است.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Comment Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-[#17181D] border border-white/15 p-6 space-y-4 shadow-2xl text-right">
            <div className="flex items-center gap-3 text-[#C77A82]">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-bold text-base text-[#F0F0F1]">حذف دیدگاه</h3>
            </div>

            <p className="text-xs text-[#A0A3AD] leading-relaxed">
              آیا از حذف دیدگاه ارسالی توسط <strong className="text-[#F0F0F1]">{deleteTarget.userName}</strong> اطمینان دارید؟
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
