"use client";

import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Users,
  UserPlus,
  Shield,
  Edit2,
  Trash2,
  CheckCircle,
  XCircle,
  Sparkles,
  Lock,
  Mail,
  User,
  AlertTriangle,
  X,
  TrendingUp,
  FileText,
} from "lucide-react";
import { webApi } from "@/lib/api";
import { useAdminAuth } from "@/lib/admin-auth-context";
import { AdminRole, AdminUser } from "@/types/admin";

export default function AdminRolesPage() {
  const queryClient = useQueryClient();
  const { user: currentUser, isAdmin } = useAdminAuth();

  // Modals state
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<AdminRole>("trader");
  const [bio, setBio] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  const { data: staffList, isLoading, refetch } = useQuery({
    queryKey: ["admin-staff-users"],
    queryFn: () => webApi.getStaffUsers(),
    enabled: isAdmin,
  });

  const createMutation = useMutation({
    mutationFn: (data: {
      fullName: string;
      email: string;
      password: string;
      role: AdminRole;
      bio?: string;
    }) => webApi.createStaffUser(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-staff-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      setShowCreateModal(false);
      resetForm();
    },
    onError: (err: any) => {
      setFormError(err?.message || "خطا در ایجاد کاربر جدید");
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: {
        fullName?: string;
        role?: AdminRole;
        bio?: string;
        isActive?: boolean;
        password?: string;
      };
    }) => webApi.updateStaffUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-staff-users"] });
      setShowEditModal(false);
      resetForm();
    },
    onError: (err: any) => {
      setFormError(err?.message || "خطا در ویرایش کاربر");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => webApi.deleteStaffUser(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-staff-users"] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      setShowDeleteModal(false);
      setSelectedUser(null);
    },
    onError: (err: any) => {
      setFormError(err?.message || "خطا در حذف کاربر");
    },
  });

  const resetForm = () => {
    setFullName("");
    setEmail("");
    setPassword("");
    setRole("trader");
    setBio("");
    setIsActive(true);
    setFormError(null);
    setSelectedUser(null);
  };

  const openEdit = (u: AdminUser) => {
    setSelectedUser(u);
    setFullName(u.fullName || "");
    setEmail(u.email);
    setRole(u.role);
    setBio(u.bio || "");
    setIsActive(u.isActive ?? true);
    setPassword("");
    setFormError(null);
    setShowEditModal(true);
  };

  const openDelete = (u: AdminUser) => {
    setSelectedUser(u);
    setFormError(null);
    setShowDeleteModal(true);
  };

  if (!isAdmin) {
    return (
      <div className="p-8 rounded-3xl bg-[#141518] border border-white/10 text-center space-y-4">
        <Shield className="w-12 h-12 text-[#C77A82] mx-auto" />
        <h2 className="text-lg font-bold text-[#F0F0F1]">عدم دسترسی به بخش مدیریت نقش‌ها</h2>
        <p className="text-xs text-[#A0A3AD]">
          تنها مدیران ارشد سیستم (Admin) مجاز به تعریف و تخصیص نقش‌های معامله‌گران و نویسندگان هستند.
        </p>
      </div>
    );
  }

  const getRoleBadge = (r: AdminRole) => {
    switch (r) {
      case "admin":
        return {
          label: "مدیر کل (Admin)",
          bg: "bg-[#F0AE55]/15 text-[#F0AE55] border-[#F0AE55]/30",
        };
      case "trader":
        return {
          label: "معامله‌گر (Trader)",
          bg: "bg-[#76A98C]/15 text-[#76A98C] border-[#76A98C]/30",
        };
      case "editor":
        return {
          label: "سردبیر (Editor)",
          bg: "bg-sky-500/15 text-sky-400 border-sky-500/30",
        };
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#F0F0F1] tracking-tight">
            مدیریت نقش‌ها و دسترسی‌های پرسنل
          </h1>
          <p className="text-xs text-[#8E929E] mt-1">
            تخصیص نقش‌های معامله‌گر ارشد، سردبیر محتوا و مدیران سیستم با تفکیک کامل مجوزها
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetForm();
            setShowCreateModal(true);
          }}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[#F0AE55] to-[#E59F45] text-[#0D0E10] font-black text-xs hover:opacity-95 transition-all shadow-[0_0_20px_rgba(240,174,85,0.25)] self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>افزودن عضو جدید</span>
        </button>
      </div>

      {/* Role Explanations */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="rounded-2xl bg-[#141518] border border-[#F0AE55]/20 p-5 space-y-2">
          <div className="flex items-center gap-2 text-[#F0AE55] font-bold text-xs">
            <Shield className="w-4 h-4" />
            <span>مدیر ارشد سیستم (Admin)</span>
          </div>
          <p className="text-[11px] text-[#A0A3AD] leading-relaxed">
            دسترسی کامل به مدیریت نقش‌ها، پرسنل، حذف و تأیید مقالات، انتشار سیگنال‌ها و آمار کلی سامانه.
          </p>
        </div>

        <div className="rounded-2xl bg-[#141518] border border-[#76A98C]/20 p-5 space-y-2">
          <div className="flex items-center gap-2 text-[#76A98C] font-bold text-xs">
            <TrendingUp className="w-4 h-4" />
            <span>معامله‌گر و تحلیل‌گر (Trader)</span>
          </div>
          <p className="text-[11px] text-[#A0A3AD] leading-relaxed">
            دسترسی اختصاصی به ثبت سیگنال‌های روزانه، تحلیل چارت‌ها، مدیریت سطوح ورود، حد سود و حد ضرر.
          </p>
        </div>

        <div className="rounded-2xl bg-[#141518] border border-sky-500/20 p-5 space-y-2">
          <div className="flex items-center gap-2 text-sky-400 font-bold text-xs">
            <FileText className="w-4 h-4" />
            <span>سردبیر و نویسنده (Editor)</span>
          </div>
          <p className="text-[11px] text-[#A0A3AD] leading-relaxed">
            تولید و ویرایش مقالات وبلاگ، انتشار اخبار بازار با ویرایشگر غنی، و نظارت بر دیدگاه‌های کاربران.
          </p>
        </div>
      </div>

      {/* Staff Table */}
      <div className="rounded-3xl border border-white/[0.08] bg-[#121316] overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-white/[0.06] flex items-center justify-between">
          <h3 className="font-bold text-sm text-[#F0F0F1] flex items-center gap-2">
            <Users className="w-4 h-4 text-[#F0AE55]" />
            <span>فهرست اعضای دارای دسترسی</span>
          </h3>
          <span className="text-xs text-[#707581]">
            تعداد کل: {staffList?.length ?? 0} نفر
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-right text-xs">
            <thead>
              <tr className="border-b border-white/[0.06] bg-[#16171B] text-[#A0A3AD] font-semibold">
                <th className="p-4">کاربر</th>
                <th className="p-4">ایمیل</th>
                <th className="p-4">نقش سازمانی</th>
                <th className="p-4">بیوگرافی / تخصص</th>
                <th className="p-4">وضعیت</th>
                <th className="p-4">آخرین ورود</th>
                <th className="p-4 text-center">عملیات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#707581]">
                    در حال دریافت فهرست کاربران...
                  </td>
                </tr>
              ) : staffList && staffList.length > 0 ? (
                staffList.map((u) => {
                  const badge = getRoleBadge(u.role);
                  const isCurrent = currentUser?.id === u.id;
                  return (
                    <tr key={u.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-[#1C1E24] border border-white/10 flex items-center justify-center font-bold text-[#F0AE55]">
                            {u.fullName ? u.fullName[0] : "U"}
                          </div>
                          <div>
                            <span className="font-bold text-[#F0F0F1] block">{u.fullName}</span>
                            {isCurrent && (
                              <span className="text-[10px] text-[#F0AE55]">(حساب جاری شما)</span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="p-4 dir-ltr text-right text-[#A0A3AD] font-mono text-[11px]">
                        {u.email}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold border ${badge.bg}`}
                        >
                          {badge.label}
                        </span>
                      </td>
                      <td className="p-4 max-w-xs truncate text-[#8E929E]">
                        {u.bio || "—"}
                      </td>
                      <td className="p-4">
                        {u.isActive ? (
                          <span className="inline-flex items-center gap-1 text-[#76A98C] text-[11px] font-semibold">
                            <CheckCircle className="w-3.5 h-3.5" />
                            <span>فعال</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[#C77A82] text-[11px] font-semibold">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>غیرفعال</span>
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-[#707581] text-[11px]">
                        {u.lastLoginAt
                          ? new Date(u.lastLoginAt).toLocaleDateString("fa-IR")
                          : "ثبت نشده"}
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <button
                            type="button"
                            onClick={() => openEdit(u)}
                            className="p-1.5 rounded-lg text-[#A0A3AD] hover:text-[#F0AE55] hover:bg-white/5 transition-all"
                            title="ویرایش نقش"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          {!isCurrent && (
                            <button
                              type="button"
                              onClick={() => openDelete(u)}
                              className="p-1.5 rounded-lg text-[#A0A3AD] hover:text-[#C77A82] hover:bg-white/5 transition-all"
                              title="حذف کاربر"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-[#707581]">
                    کاربری یافت نشد.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-[#17181D] border border-white/15 p-7 space-y-5 shadow-2xl text-right">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-base font-bold text-[#F0F0F1] flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#F0AE55]" />
                <span>افزودن عضو جدید به پنل تیا</span>
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

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#A0A3AD]">نام و نام خانوادگی:</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="مثال: مهندس کاوه پیروز"
                  className="w-full bg-[#101114] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-[#F0F0F1] outline-none focus:border-[#F0AE55]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#A0A3AD]">ایمیل سازمانی:</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kaveh@theia-finance.ir"
                  dir="ltr"
                  className="w-full bg-[#101114] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-[#F0F0F1] outline-none focus:border-[#F0AE55]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#A0A3AD]">کلمه عبور اولیه:</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="حداقل ۶ کاراکتر"
                  dir="ltr"
                  className="w-full bg-[#101114] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-[#F0F0F1] outline-none focus:border-[#F0AE55]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#A0A3AD]">انتخاب نقش:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole("trader")}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      role === "trader"
                        ? "bg-[#76A98C]/20 border-[#76A98C] text-[#76A98C] font-bold"
                        : "bg-[#101114] border-white/10 text-[#A0A3AD]"
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 mx-auto mb-1" />
                    <span>معامله‌گر</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("editor")}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      role === "editor"
                        ? "bg-sky-500/20 border-sky-500 text-sky-400 font-bold"
                        : "bg-[#101114] border-white/10 text-[#A0A3AD]"
                    }`}
                  >
                    <FileText className="w-4 h-4 mx-auto mb-1" />
                    <span>سردبیر</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("admin")}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      role === "admin"
                        ? "bg-[#F0AE55]/20 border-[#F0AE55] text-[#F0AE55] font-bold"
                        : "bg-[#101114] border-white/10 text-[#A0A3AD]"
                    }`}
                  >
                    <Shield className="w-4 h-4 mx-auto mb-1" />
                    <span>مدیر ارشد</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#A0A3AD]">بیوگرافی / تخصص:</label>
                <input
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="مثال: کارشناس ارشد تحلیل تکنیکال انس جهانی طلا"
                  className="w-full bg-[#101114] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-[#F0F0F1] outline-none focus:border-[#F0AE55]"
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
                  createMutation.mutate({ fullName, email, password, role, bio })
                }
                disabled={createMutation.isPending || !email || !password || !fullName}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#F0AE55] to-[#E59F45] text-[#0D0E10] text-xs font-black disabled:opacity-50 hover:opacity-95 transition-all shadow-[0_0_15px_rgba(240,174,85,0.25)]"
              >
                {createMutation.isPending ? "در حال ایجاد..." : "ثبت کاربر"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit User Modal */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-[#17181D] border border-white/15 p-7 space-y-5 shadow-2xl text-right">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-base font-bold text-[#F0F0F1] flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-[#F0AE55]" />
                <span>ویرایش کاربر: {selectedUser.email}</span>
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

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#A0A3AD]">نام کامل:</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#101114] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-[#F0F0F1] outline-none focus:border-[#F0AE55]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#A0A3AD]">نقش سازمانی:</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole("trader")}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      role === "trader"
                        ? "bg-[#76A98C]/20 border-[#76A98C] text-[#76A98C] font-bold"
                        : "bg-[#101114] border-white/10 text-[#A0A3AD]"
                    }`}
                  >
                    <TrendingUp className="w-4 h-4 mx-auto mb-1" />
                    <span>معامله‌گر</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("editor")}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      role === "editor"
                        ? "bg-sky-500/20 border-sky-500 text-sky-400 font-bold"
                        : "bg-[#101114] border-white/10 text-[#A0A3AD]"
                    }`}
                  >
                    <FileText className="w-4 h-4 mx-auto mb-1" />
                    <span>سردبیر</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("admin")}
                    className={`p-3 rounded-2xl border text-center transition-all ${
                      role === "admin"
                        ? "bg-[#F0AE55]/20 border-[#F0AE55] text-[#F0AE55] font-bold"
                        : "bg-[#101114] border-white/10 text-[#A0A3AD]"
                    }`}
                  >
                    <Shield className="w-4 h-4 mx-auto mb-1" />
                    <span>مدیر ارشد</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#A0A3AD]">تخصص / بیوگرافی:</label>
                <input
                  type="text"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-[#101114] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-[#F0F0F1] outline-none focus:border-[#F0AE55]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#A0A3AD]">
                  تغییر رمز عبور (در صورت نیاز):
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="در صورت عدم تمایل به تغییر، خالی بگذارید"
                  dir="ltr"
                  className="w-full bg-[#101114] border border-white/10 rounded-2xl px-4 py-2.5 text-xs text-[#F0F0F1] outline-none focus:border-[#F0AE55]"
                />
              </div>

              <label className="flex items-center gap-3 p-3 rounded-2xl bg-[#101114] border border-white/10 cursor-pointer text-xs text-[#F0F0F1]">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="rounded accent-[#F0AE55] w-4 h-4"
                />
                <span>حساب کاربری فعال باشد و اجازه ورود داشته باشد</span>
              </label>
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
                    id: selectedUser.id,
                    data: {
                      fullName,
                      role,
                      bio,
                      isActive,
                      password: password ? password : undefined,
                    },
                  })
                }
                disabled={updateMutation.isPending}
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[#F0AE55] to-[#E59F45] text-[#0D0E10] text-xs font-black disabled:opacity-50 hover:opacity-95 transition-all shadow-[0_0_15px_rgba(240,174,85,0.25)]"
              >
                {updateMutation.isPending ? "در حال ذخیره..." : "ذخیره تغییرات"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete User Modal */}
      {showDeleteModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl bg-[#17181D] border border-white/15 p-6 space-y-4 shadow-2xl text-right">
            <div className="flex items-center gap-3 text-[#C77A82]">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-bold text-base text-[#F0F0F1]">حذف کاربر از سیستم</h3>
            </div>

            {formError && (
              <div className="p-3 rounded-2xl bg-[#C77A82]/15 border border-[#C77A82]/30 text-xs text-[#C77A82]">
                {formError}
              </div>
            )}

            <p className="text-xs text-[#A0A3AD] leading-relaxed">
              آیا از حذف حساب کاربری{" "}
              <strong className="text-[#F0F0F1]">{selectedUser.fullName}</strong> (
              <span className="dir-ltr inline-block">{selectedUser.email}</span>) اطمینان دارید؟ این
              عملیات غیرقابل برگشت است.
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
                onClick={() => deleteMutation.mutate(selectedUser.id)}
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
