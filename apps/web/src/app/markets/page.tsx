"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { Coins, LineChart, ChevronLeft } from "lucide-react";
import { webApi } from "@/lib/api";
import { getInitialMarketCatalog } from "@/data/market-instruments";
import { MarketQuote, MarketRatesResponse } from "@/types/market";
import { HighlightTickerStrip } from "@/components/market/highlight-ticker-strip";
import { CategorizedQuotesGrid } from "@/components/market/categorized-quotes-grid";

export default function MarketsHubPage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: marketData } = useQuery<MarketRatesResponse>({
    queryKey: ["public-market-rates"],
    queryFn: () => webApi.getMarketRates(),
    initialData: getInitialMarketCatalog(),
    refetchInterval: 30000,
  });

  const allQuotes: MarketQuote[] = useMemo(() => {
    if (!marketData) return [];
    return [
      ...(marketData.gold_and_coins || []),
      ...(marketData.currencies || []),
      ...(marketData.cryptocurrency || []),
      ...(marketData.commodities || []),
      ...(marketData.stocks || []),
    ];
  }, [marketData]);

  const usdRate = Number(marketData?.usd_toman_rate || 94850);

  return (
    <div className="min-h-screen py-10 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1B1D21] border border-white/[0.08] text-xs text-[#F0AE55]">
              <Coins className="w-3.5 h-3.5" />
              <span>پایگاه رصد داده‌های مالی و نرخ‌های زنده</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-[#F0F0F1] tracking-tight">
              دیده‌بان جامع بازارهای مالی
            </h1>
            <p className="text-xs md:text-sm text-[#A0A3AD] leading-relaxed">
              نرخ‌های رسمی و لحظه‌ای طلای ۱۸ عیار، انواع مسکوکات، ارزهای آزاد و
              مبادله‌ای، شاخص‌های بورس، رمزارزها و فلزات اساسی، متصل به فید پایدار شبکه تئا.
            </p>
          </div>
        </div>

        {/* Highlight Ticker Strip */}
        <HighlightTickerStrip quotes={allQuotes} usdRate={usdRate} />

        {/* Quotes Grid: Three Bigger-Height Cards in Three Columns with Internal Table Grids & Accordion Option */}
        <CategorizedQuotesGrid
          quotes={allQuotes}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          usdRate={usdRate}
        />

        {/* Navigation Banner Link to Dedicated Chart Analysis Page */}
        <div className="rounded-[22px] bg-gradient-to-r from-[#14161A] via-[#1A1D23] to-[#14161A] border border-white/[0.08] hover:border-[#76A98C]/40 p-6 flex flex-col sm:flex-row items-center justify-between gap-5 transition-all group shadow-lg">
          <div className="flex items-center gap-4 text-center sm:text-right">
            <div className="w-12 h-12 rounded-[14px] bg-[rgba(118,169,140,0.15)] border border-[#76A98C]/30 flex items-center justify-center text-[#76A98C] shrink-0 shadow-sm">
              <LineChart className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-[#F0F0F1] group-hover:text-[#76A98C] transition-colors">
                دیده‌بان چارت و سیگنال‌های تحلیلی معامله‌گران ارشد
              </h3>
              <p className="text-xs text-[#A0A3AD] max-w-xl">
                مشاهده چارت‌های تکنیکال، الگوهای قیمتی، سطوح کلیدی عرضه و تقاضا و ایده‌های ساختاری در صفحه اختصاصی تحلیل‌ها
              </p>
            </div>
          </div>

          <Link
            href="/analysis"
            className="px-5 py-2.5 rounded-[12px] bg-[#76A98C] hover:bg-[#8EC0A3] text-[#0D0E10] text-xs font-bold transition-all shadow-[0_0_16px_rgba(118,169,140,0.25)] flex items-center gap-2 shrink-0 cursor-pointer"
          >
            <span>ورود به تالار تحلیل و سیگنال‌ها</span>
            <ChevronLeft className="w-4 h-4" />
          </Link>
        </div>

        {/* Integration Call to action */}
        <div className="rounded-[22px] bg-gradient-to-r from-[#17181D] via-[#1B1D23] to-[#17181D] border border-white/[0.08] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-right">
            <h3 className="text-lg font-bold text-[#F0F0F1]">
              می‌خواهید دارایی‌های واقعی خود را با این قیمت‌ها بسنجید؟
            </h3>
            <p className="text-xs text-[#A0A3AD]">
              با ثبت دارایی‌های خود در پلتفرم Personal FC، ارزش خالص، سود و زیان
              تحقق‌نیافته و تخصیص بهینه پورتفولیوی شما به صورت زنده محاسبه
              می‌شود.
            </p>
          </div>

          <Link
            href="/register"
            className="px-6 py-3 rounded-[13px] bg-[#F0AE55] hover:bg-[#F3BE76] text-[#0D0E10] text-xs font-bold transition-all shadow-[0_0_20px_rgba(240,174,85,0.25)] shrink-0"
          >
            شروع پایش سبد دارایی
          </Link>
        </div>
      </div>
    </div>
  );
}
