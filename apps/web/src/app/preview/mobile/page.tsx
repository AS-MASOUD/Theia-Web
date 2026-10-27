"use client";

import React, { useState } from "react";
import {
  Wallet,
  Coins,
  ShieldAlert,
  Sparkles,
  ArrowUpRight,
  ArrowDownLeft,
  Flame,
  Lock,
  Plus,
  RefreshCw,
  Bell,
  SlidersHorizontal,
  ChevronLeft,
  Home,
  Eye,
  Zap,
} from "lucide-react";

interface MobileCardProps {
  title: string;
  subtitle?: string;
  value?: string;
  badge?: string;
  badgeVariant?: "amber" | "emerald" | "coral" | "neutral";
  icon?: React.ComponentType<{ className?: string }>;
  iconColor?: "amber" | "emerald" | "coral" | "neutral";
}

function MobileCard({
  title,
  subtitle,
  value,
  badge,
  badgeVariant = "amber",
  icon: Icon,
  iconColor = "amber",
}: MobileCardProps) {
  const badgeClasses = {
    amber: "text-[#F0AE55] bg-[rgba(240,174,85,0.09)] border-[rgba(240,174,85,0.22)] shadow-[0_0_8px_rgba(240,174,85,0.12)]",
    emerald: "text-[#76A98C] bg-[rgba(118,169,140,0.1)] border-[rgba(118,169,140,0.22)] shadow-[0_0_8px_rgba(118,169,140,0.12)]",
    coral: "text-[#C77A82] bg-[rgba(199,122,130,0.1)] border-[rgba(199,122,130,0.22)] shadow-[0_0_8px_rgba(199,122,130,0.12)]",
    neutral: "text-[#9A9DA5] bg-[#191A1E] border-[#26282E]",
  }[badgeVariant];

  const iconClasses = {
    amber: "text-[#F0AE55] bg-[rgba(240,174,85,0.08)] border-[rgba(240,174,85,0.22)] shadow-[0_0_12px_rgba(240,174,85,0.15)]",
    emerald: "text-[#76A98C] bg-[rgba(118,169,140,0.08)] border-[rgba(118,169,140,0.22)] shadow-[0_0_12px_rgba(118,169,140,0.15)]",
    coral: "text-[#C77A82] bg-[rgba(199,122,130,0.08)] border-[rgba(199,122,130,0.22)] shadow-[0_0_12px_rgba(199,122,130,0.15)]",
    neutral: "text-[#9A9DA5] bg-[#191A1E] border-[#26282E]",
  }[iconColor];

  return (
    <div className="rounded-[18px] bg-gradient-to-b from-[#17181C] via-[#141518] to-[#111215] border border-white/[0.06] p-3.5 flex flex-col justify-between relative overflow-hidden group transition-all duration-150 hover:border-white/10 active:scale-[0.98]">
      {/* Top row: Icon & Status Badge */}
      <div className="flex items-center justify-between w-full mb-2.5">
        {Icon && (
          <div className={`w-8 h-8 rounded-[12px] border flex items-center justify-center ${iconClasses}`}>
            <Icon className="w-4 h-4 stroke-[2]" />
          </div>
        )}
        {badge && (
          <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${badgeClasses}`}>
            {badge}
          </span>
        )}
      </div>

      {/* Metric Value */}
      <div className="space-y-0.5">
        <span className="text-[11px] font-medium text-[#9A9DA5] block">
          {title}
        </span>
        <span className="text-sm sm:text-base font-bold text-[#E8E8E8] tracking-tight font-mono tabular-nums block">
          {value}
        </span>
        {subtitle && (
          <p className="text-[10px] text-[#696D77] truncate mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

export default function MobilePreviewPage() {
  const [currency, setCurrency] = useState<"TOMAN" | "USD">("TOMAN");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("home");

  const toggleCurrency = () => {
    setCurrency((prev) => (prev === "TOMAN" ? "USD" : "TOMAN"));
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  const formatAmount = (tomanVal: number) => {
    if (currency === "TOMAN") {
      return tomanVal.toLocaleString("en-US") + " تومان";
    }
    // Approx rate 60,000 Toman / USD
    const usdVal = Math.round(tomanVal / 60000);
    return "$" + usdVal.toLocaleString("en-US");
  };

  return (
    <div className="w-full min-h-screen bg-[#0D0E10] text-[#E8E8E8] font-sans antialiased selection:bg-[#F0AE55]/20 selection:text-[#F0AE55] flex flex-col justify-between p-3.5 pb-20 relative select-none">
      <div className="space-y-4">
        {/* Top Bar: Profile Greeting & Currency Toggle */}
        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <div className="w-10 h-10 rounded-[14px] bg-[#141518] border border-[#282A2F] flex items-center justify-center text-[#F0AE55] font-bold text-sm shadow-[0_0_12px_rgba(240,174,85,0.18)]">
                ع
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 border-2 border-[#0D0E10] rounded-full bg-[#76A98C]" />
            </div>

            <div>
              <div className="flex items-center gap-1.5 text-[10px] text-[#9A9DA5]">
                <span>عصر بخیر</span>
                <span>•</span>
                <button
                  type="button"
                  onClick={toggleCurrency}
                  className="text-[#F0AE55] font-bold hover:underline cursor-pointer font-mono"
                  title="تغییر واحد پول"
                >
                  {currency === "TOMAN" ? "تومان" : "USD"}
                </button>
              </div>
              <h1 className="text-xs sm:text-sm font-bold text-[#E8E8E8] tracking-tight">
                امیرحسین رضایی
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleRefresh}
              className="w-8 h-8 rounded-[12px] bg-[#141518] border border-[#282A2F] flex items-center justify-center text-[#696D77] hover:text-[#E8E8E8] active:scale-95 transition-colors cursor-pointer"
              title="بروزرسانی داده‌ها"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-[#F0AE55]" : ""}`}
              />
            </button>
            <div className="w-8 h-8 rounded-[12px] bg-[#141518] border border-[#282A2F] flex items-center justify-center text-[#696D77] relative">
              <Bell className="w-3.5 h-3.5" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-[#F0AE55] rounded-full shadow-[0_0_6px_rgba(240,174,85,0.8)]" />
            </div>
          </div>
        </div>

        {/* Financial Status Chips Bar */}
        <div className="flex items-center gap-2 text-[11px] font-normal text-[#9A9DA5] overflow-x-auto no-scrollbar py-0.5">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#141518] border border-[#282A2F] shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F0AE55] shadow-[0_0_6px_rgba(240,174,85,0.8)]" />
            <span>ارزش خالص:</span>
            <span className="text-[#E8E8E8] font-bold font-mono tabular-nums">
              {formatAmount(845000000)}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#141518] border border-[#282A2F] shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-[#76A98C] shadow-[0_0_6px_rgba(118,169,140,0.8)]" />
            <span>۲ تعهد فعال</span>
          </div>
        </div>

        {/* Quick Scene Navigation Pills */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-0.5">
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] text-xs font-semibold bg-[rgba(240,174,85,0.09)] text-[#F0AE55] border border-[rgba(240,174,85,0.25)] shadow-[0_0_12px_rgba(240,174,85,0.15)] shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>نمای کلی</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] text-xs font-medium bg-[#141518] text-[#9A9DA5] border border-[#282A2F] hover:text-[#E8E8E8] shrink-0"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#696D77]" />
            <span>تخصیص سبد</span>
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-[12px] text-xs font-medium bg-[#141518] text-[#9A9DA5] border border-[#282A2F] hover:text-[#E8E8E8] shrink-0"
          >
            <Flame className="w-3.5 h-3.5 text-[#696D77]" />
            <span>اقلیم مالی</span>
          </button>
        </div>

        {/* 2x3 Tactile Grid Cards */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Card 1: Net Worth */}
          <MobileCard
            title="ارزش خالص"
            value={formatAmount(845000000)}
            subtitle="+14.2% نسبت به ۳۰ روز قبل"
            badge="فعال"
            badgeVariant="amber"
            icon={Wallet}
            iconColor="amber"
          />

          {/* Card 2: Financial Health */}
          <MobileCard
            title="اقلیم سلامت"
            value="84 / 100"
            subtitle="وضعیت بسیار مطلوب"
            badge="مطلوب"
            badgeVariant="amber"
            icon={Flame}
            iconColor="amber"
          />

          {/* Card 3: Free Liquidity */}
          <MobileCard
            title="نقدینگی آزاد"
            value={formatAmount(185000000)}
            subtitle="سهم از دارایی: ۲۲٪"
            badge="سالم"
            badgeVariant="emerald"
            icon={Coins}
            iconColor="emerald"
          />

          {/* Card 4: Liabilities */}
          <MobileCard
            title="بدهی و تسهیلات"
            value={formatAmount(405000000)}
            subtitle={`قسط ماهانه: ${formatAmount(28500000)}`}
            badge="جاری"
            badgeVariant="coral"
            icon={ShieldAlert}
            iconColor="coral"
          />

          {/* Card 5: Emergency Lock */}
          <MobileCard
            title="سپرده اضطراری"
            value="۶.۵ ماه پوشش"
            subtitle="پوشش هزینه‌های غیرمنتظره"
            badge="امن"
            badgeVariant="neutral"
            icon={Lock}
            iconColor="neutral"
          />

          {/* Card 6: AI Assistant Advice */}
          <MobileCard
            title="دستیار هوشمند تئا"
            value="توازن پایدار سبد"
            subtitle="سیگنال تعدیل طلای ۱۸ عیار"
            badge="پایش"
            badgeVariant="neutral"
            icon={Sparkles}
            iconColor="neutral"
          />
        </div>

        {/* Quick Action Banner */}
        <div className="rounded-[16px] bg-gradient-to-r from-[#17181C] to-[#121316] border border-white/[0.07] p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[12px] bg-[rgba(240,174,85,0.08)] border border-[rgba(240,174,85,0.25)] flex items-center justify-center text-[#F0AE55] shadow-[0_0_10px_rgba(240,174,85,0.18)]">
              <Plus className="w-4 h-4 stroke-[2]" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-[#E8E8E8]">ثبت تراکنش سریع</h4>
              <p className="text-[10px] text-[#707581]">افزودن درآمد، هزینه یا خرید دارایی</p>
            </div>
          </div>
          <button
            type="button"
            className="px-2.5 py-1 rounded-[10px] bg-[#F0AE55] text-[#0D0E10] text-[11px] font-bold flex items-center gap-1 active:scale-95 shadow-[0_0_10px_rgba(240,174,85,0.25)]"
          >
            <span>شروع</span>
            <ChevronLeft className="w-3 h-3 stroke-[2.5]" />
          </button>
        </div>

        {/* Recent Activity List */}
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[11px] font-semibold text-[#9A9DA5]">آخرین رویدادهای مالی</h2>
            <span className="text-[10px] text-[#F0AE55] font-medium">دفتر کل</span>
          </div>

          <div className="space-y-1.5">
            <div className="rounded-[14px] bg-[#141518]/90 border border-white/[0.05] p-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-[10px] bg-[#18191E] border border-white/[0.08] flex items-center justify-center text-[#76A98C]">
                  <ArrowDownLeft className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-[#E8E8E8]">سود سرمایه‌گذاری صندوق طلا</p>
                  <p className="text-[9px] text-[#707581] font-mono">امروز • ۱۴:۳۰</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#76A98C] font-mono tabular-nums">
                +{formatAmount(14200000)}
              </span>
            </div>

            <div className="rounded-[14px] bg-[#141518]/90 border border-white/[0.05] p-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-[10px] bg-[#18191E] border border-white/[0.08] flex items-center justify-center text-[#C77A82]">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-[#E8E8E8]">قسط تسهیلات مسکن</p>
                  <p className="text-[9px] text-[#707581] font-mono">دیروز • ۱۰:۱۵</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#C77A82] font-mono tabular-nums">
                -{formatAmount(18500000)}
              </span>
            </div>

            <div className="rounded-[14px] bg-[#141518]/90 border border-white/[0.05] p-2.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-[10px] bg-[#18191E] border border-white/[0.08] flex items-center justify-center text-[#C77A82]">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </div>
                <div>
                  <p className="text-[11px] font-semibold text-[#E8E8E8]">خرید شمش طلا ۱۸ عیار</p>
                  <p className="text-[9px] text-[#707581] font-mono">۳ روز پیش</p>
                </div>
              </div>
              <span className="text-[11px] font-bold text-[#C77A82] font-mono tabular-nums">
                -{formatAmount(45000000)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Bottom Navigation */}
      <div className="fixed bottom-2 left-0 right-0 z-50 pointer-events-none px-4">
        <nav
          aria-label="Mobile Navigation"
          className="pointer-events-auto max-w-[340px] mx-auto px-2 py-1 bg-[#141518]/95 backdrop-blur-xl border border-white/[0.08] rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.65),inset_0_1px_0_rgba(255,255,255,0.06)] flex items-center justify-around"
        >
          <button
            type="button"
            onClick={() => setActiveTab("home")}
            className="relative flex flex-col items-center justify-center w-11 h-11 rounded-full active:scale-95 transition-all"
          >
            {activeTab === "home" && (
              <div className="absolute inset-0 m-auto w-9 h-9 rounded-full bg-[radial-gradient(circle,rgba(240,174,85,0.32)_0%,transparent_75%)] pointer-events-none" />
            )}
            <Home
              className={`w-4.5 h-4.5 transition-colors relative z-10 ${
                activeTab === "home"
                  ? "text-[#F0AE55] stroke-[2.2] drop-shadow-[0_0_6px_rgba(240,174,85,0.4)]"
                  : "text-[#696D77] stroke-[1.8]"
              }`}
            />
            <span
              className={`text-[9px] font-medium mt-0.5 ${
                activeTab === "home" ? "text-[#F0AE55]" : "text-[#696D77]"
              }`}
            >
              خانه
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("portfolio")}
            className="relative flex flex-col items-center justify-center w-11 h-11 rounded-full active:scale-95 transition-all"
          >
            {activeTab === "portfolio" && (
              <div className="absolute inset-0 m-auto w-9 h-9 rounded-full bg-[radial-gradient(circle,rgba(240,174,85,0.32)_0%,transparent_75%)] pointer-events-none" />
            )}
            <SlidersHorizontal
              className={`w-4.5 h-4.5 transition-colors relative z-10 ${
                activeTab === "portfolio"
                  ? "text-[#F0AE55] stroke-[2.2] drop-shadow-[0_0_6px_rgba(240,174,85,0.4)]"
                  : "text-[#696D77] stroke-[1.8]"
              }`}
            />
            <span
              className={`text-[9px] font-medium mt-0.5 ${
                activeTab === "portfolio" ? "text-[#F0AE55]" : "text-[#696D77]"
              }`}
            >
              تخصیص
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("health")}
            className="relative flex flex-col items-center justify-center w-11 h-11 rounded-full active:scale-95 transition-all"
          >
            {activeTab === "health" && (
              <div className="absolute inset-0 m-auto w-9 h-9 rounded-full bg-[radial-gradient(circle,rgba(240,174,85,0.32)_0%,transparent_75%)] pointer-events-none" />
            )}
            <Flame
              className={`w-4.5 h-4.5 transition-colors relative z-10 ${
                activeTab === "health"
                  ? "text-[#F0AE55] stroke-[2.2] drop-shadow-[0_0_6px_rgba(240,174,85,0.4)]"
                  : "text-[#696D77] stroke-[1.8]"
              }`}
            />
            <span
              className={`text-[9px] font-medium mt-0.5 ${
                activeTab === "health" ? "text-[#F0AE55]" : "text-[#696D77]"
              }`}
            >
              اقلیم مالی
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("assets")}
            className="relative flex flex-col items-center justify-center w-11 h-11 rounded-full active:scale-95 transition-all"
          >
            {activeTab === "assets" && (
              <div className="absolute inset-0 m-auto w-9 h-9 rounded-full bg-[radial-gradient(circle,rgba(240,174,85,0.32)_0%,transparent_75%)] pointer-events-none" />
            )}
            <Eye
              className={`w-4.5 h-4.5 transition-colors relative z-10 ${
                activeTab === "assets"
                  ? "text-[#F0AE55] stroke-[2.2] drop-shadow-[0_0_6px_rgba(240,174,85,0.4)]"
                  : "text-[#696D77] stroke-[1.8]"
              }`}
            />
            <span
              className={`text-[9px] font-medium mt-0.5 ${
                activeTab === "assets" ? "text-[#F0AE55]" : "text-[#696D77]"
              }`}
            >
              دارایی‌ها
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("cashflow")}
            className="relative flex flex-col items-center justify-center w-11 h-11 rounded-full active:scale-95 transition-all"
          >
            {activeTab === "cashflow" && (
              <div className="absolute inset-0 m-auto w-9 h-9 rounded-full bg-[radial-gradient(circle,rgba(240,174,85,0.32)_0%,transparent_75%)] pointer-events-none" />
            )}
            <Zap
              className={`w-4.5 h-4.5 transition-colors relative z-10 ${
                activeTab === "cashflow"
                  ? "text-[#F0AE55] stroke-[2.2] drop-shadow-[0_0_6px_rgba(240,174,85,0.4)]"
                  : "text-[#696D77] stroke-[1.8]"
              }`}
            />
            <span
              className={`text-[9px] font-medium mt-0.5 ${
                activeTab === "cashflow" ? "text-[#F0AE55]" : "text-[#696D77]"
              }`}
            >
              جریان نقد
            </span>
          </button>
        </nav>
      </div>
    </div>
  );
}
