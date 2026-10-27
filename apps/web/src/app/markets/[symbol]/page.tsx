import { ResponsiveAuthLink } from "@/components/responsive-auth-link";
import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  TrendingUp,
  TrendingDown,
  ArrowRight,
  PlusCircle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { SUPPORTED_INSTRUMENTS } from "@/data/market-instruments";
import { webApi } from "@/lib/api";
import { MarketQuote } from "@/types/market";
import { cn, formatPriceNumber } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: Promise<{ symbol: string }>;
}

const SYMBOL_ALIASES: Record<string, string[]> = {
  USD: ["USD", "USD_IRR", "DOLLAR"],
  EUR: ["EUR", "EUR_IRR"],
  AED: ["AED", "AED_IRR", "DIRHAM"],
  GBP: ["GBP", "GBP_IRR"],
  TRY: ["TRY", "TRY_IRR"],
  CNY: ["CNY", "CNY_IRR"],
  CAD: ["CAD", "CAD_IRR"],
  CHF: ["CHF", "CHF_IRR"],
  IQD: ["IQD", "IQD_IRR"],
  SAR: ["SAR", "SAR_IRR"],
  AUD: ["AUD", "AUD_IRR"],
  BTC: ["BTC", "BTC_USD", "BITCOIN", "BTCUSDT"],
  ETH: ["ETH", "ETH_USD", "ETHEREUM", "ETHUSDT"],
  USDT: ["USDT", "USDT_IRT", "USDT_USD", "TETHER", "USDTUSD"],
  SOL: ["SOL", "SOL_USD", "SOLANA", "SOLUSDT"],
  BNB: ["BNB", "BNB_USD", "BINANCE_COIN", "BNBUSDT"],
  TON: ["TON", "TON_USD", "TONCOIN", "TONUSDT"],
  XRP: ["XRP", "XRP_USD", "RIPPLE", "XRPUSDT"],
  USDC: ["USDC", "USDC_USD", "USDCUSDT"],
  IR_GOLD_18K: ["IR_GOLD_18K", "GOLD_18K", "GOLD18K"],
  IR_MITHQAL: ["IR_MITHQAL", "MITHQAL", "MITHQAL_GOLD"],
  GOLD_24K: ["GOLD_24K", "GOLD24K", "IR_GOLD_24K"],
  EMAMI_COIN: ["EMAMI_COIN", "IR_COIN_EMAMI", "COIN_EMAMI", "EMAMI"],
  BAHAR_COIN: ["BAHAR_COIN", "IR_COIN_BAHAR", "COIN_BAHAR", "BAHAR"],
  HALF_COIN: ["HALF_COIN", "IR_COIN_HALF", "COIN_HALF", "HALF"],
  QUARTER_COIN: ["QUARTER_COIN", "IR_COIN_QUARTER", "COIN_QUARTER", "QUARTER"],
  GERMI_COIN: ["GERMI_COIN", "IR_COIN_GERMI", "COIN_GERMI", "GERMI"],
  XAUUSD: ["XAUUSD", "XAU_USD", "XAU", "GOLD_OUNCE"],
  XAGUSD: ["XAGUSD", "XAG_USD", "XAG", "SILVER_OUNCE"],
  BRENT: ["BRENT", "BRENT_CRUDE"],
  WTI: ["WTI", "WTI_CRUDE"],
  CU: ["CU", "COPPER"],
  TEDPIX: ["TEDPIX", "BOURSE", "INDEX"],
  TEPIX_EW: ["TEPIX_EW", "EQUAL_WEIGHT"],
  IFX: ["IFX", "FARABOURSE"],
  FOULAD: ["FOULAD"],
  FAMILI: ["FAMILI"],
  SHASTA: ["SHASTA"],
  FARS: ["FARS"],
  WEBMELAT: ["WEBMELAT"],
};

export default async function MarketSymbolDetailPage({ params }: Props) {
  const { symbol } = await params;
  const upperSymbol = decodeURIComponent(symbol).toUpperCase().trim();

  const aliases = SYMBOL_ALIASES[upperSymbol] || [upperSymbol];
  const instrument =
    SUPPORTED_INSTRUMENTS.find((i) => i.symbol.toUpperCase() === upperSymbol) ||
    SUPPORTED_INSTRUMENTS.find((i) =>
      aliases.some((a) => a.toUpperCase() === i.symbol.toUpperCase()),
    );

  if (!instrument) {
    notFound();
  }

  // Fetch current synchronized rate from webApi without server cache
  let quote: MarketQuote | null = null;
  try {
    const marketRates = await webApi.getMarketRates();
    const allQuotes: MarketQuote[] = [
      ...(marketRates.gold_and_coins || []),
      ...(marketRates.currencies || []),
      ...(marketRates.cryptocurrency || []),
      ...(marketRates.commodities || []),
      ...(marketRates.stocks || []),
    ];
    const targetSymbol = instrument.symbol.toUpperCase();
    const targetAliases = SYMBOL_ALIASES[targetSymbol] || [targetSymbol];
    quote =
      allQuotes.find((q) =>
        targetAliases.some((a) => a.toUpperCase() === q.symbol.toUpperCase()),
      ) ||
      allQuotes.find(
        (q) =>
          q.symbol.toUpperCase().replace(/[^A-Z0-9]/g, "") ===
          targetSymbol.replace(/[^A-Z0-9]/g, ""),
      ) ||
      null;
  } catch {
    quote = null;
  }

  const dashboardUrl = (process.env.NEXT_PUBLIC_DASHBOARD_URL || "http://localhost:3000").replace(/\/+$/, "");
  const rawPrice = quote?.price ?? null;
  const hasPrice = rawPrice !== null && rawPrice !== undefined && rawPrice !== "";
  const priceNum = hasPrice
    ? typeof rawPrice === "string"
      ? Number(rawPrice.replace(/,/g, "").trim())
      : Number(rawPrice)
    : null;

  const chgPercent =
    quote?.change_percent !== null && quote?.change_percent !== undefined
      ? Number(quote.change_percent)
      : null;
  const isPos = chgPercent !== null && chgPercent >= 0;
  const isUsd = instrument.unit === "دلار" || instrument.unit === "USD" || instrument.unit === "$";
  const decimals = isUsd && priceNum !== null ? (priceNum < 100 && priceNum % 1 !== 0 ? 2 : 0) : 0;

  return (
    <div className="min-h-screen py-10 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-xs text-[#707581]">
          <Link href="/" className="hover:text-[#F0AE55] transition-colors">
            صفحه اصلی
          </Link>
          <span>/</span>
          <Link href="/markets" className="hover:text-[#F0AE55] transition-colors">
            دیده‌بان بازارها
          </Link>
          <span>/</span>
          <span className="text-[#A0A3AD] font-mono">{instrument.symbol}</span>
        </div>

        {/* Instrument Header */}
        <div className="rounded-[24px] bg-[#141519] border border-white/[0.08] p-6 sm:p-10 space-y-6 relative overflow-hidden">
          {/* Ambient Glow */}
          <div className="absolute top-0 right-0 w-72 h-72 bg-[radial-gradient(circle_at_top_right,rgba(240,174,85,0.1)_0%,transparent_70%)] pointer-events-none" />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs px-2.5 py-1 rounded-[8px] bg-[#1E2025] text-[#F0AE55] border border-white/[0.06] font-semibold">
                  {instrument.symbol}
                </span>
                <span className="text-xs text-[#707581]">
                  دسته: {instrument.category}
                </span>
                {quote?.is_stale && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    قیمت پیشین
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-[#F0F0F1]">
                {instrument.name}
              </h1>
              {instrument.name_en && (
                <p className="text-xs text-[#A0A3AD] font-mono">
                  {instrument.name_en}
                </p>
              )}
            </div>

            {/* Price Readout */}
            <div className="flex flex-col sm:items-end space-y-1">
              <span className="text-xs text-[#707581]">آخرین نرخ معامله شده:</span>
              <div className="flex items-baseline gap-2">
                {hasPrice && priceNum !== null ? (
                  <>
                    <span className="text-3xl sm:text-4xl font-black text-[#F0F0F1] font-mono tabular-nums" dir="ltr">
                      {isUsd
                        ? `$${formatPriceNumber(priceNum, decimals)}`
                        : formatPriceNumber(Math.round(priceNum))}
                    </span>
                    <span className="text-xs text-[#F0AE55] font-semibold">
                      {instrument.unit}
                    </span>
                  </>
                ) : (
                  <span className="text-lg font-bold text-[#9A9DA5]">
                    در حال دریافت نرخ زنده...
                  </span>
                )}
              </div>

              {/* Change badge */}
              {hasPrice && chgPercent !== null && (
                <div
                  className={cn(
                    "px-3 py-1 rounded-[8px] text-xs font-bold inline-flex items-center gap-1.5 mt-1 font-mono tabular-nums",
                    isPos
                      ? "bg-[#76A98C]/15 text-[#76A98C] border border-[#76A98C]/30"
                      : "bg-[#C77A82]/15 text-[#C77A82] border border-[#C77A82]/30"
                  )}
                  dir="ltr"
                >
                  {isPos ? (
                    <TrendingUp className="w-3.5 h-3.5 stroke-[2.5]" />
                  ) : (
                    <TrendingDown className="w-3.5 h-3.5 stroke-[2.5]" />
                  )}
                  <span>
                    {isPos ? "+" : ""}
                    {chgPercent.toFixed(2)}%
                  </span>
                  <span className="text-[10px] opacity-80 font-sans">در ۲۴ ساعت گذشته</span>
                </div>
              )}
            </div>
          </div>

          {/* Description & Formula if present */}
          <div className="pt-4 border-t border-white/[0.06] text-xs text-[#A0A3AD] space-y-2 relative z-10">
            <p className="leading-relaxed">{instrument.description}</p>
            {instrument.formula && (
              <div className="p-3 rounded-[12px] bg-[#101114] border border-white/[0.06] font-mono text-[11px] text-[#F0AE55]">
                <span className="text-[#707581] font-sans">فرمول محاسباتی: </span>
                {instrument.formula}
              </div>
            )}
          </div>

          {/* Key Stats Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/[0.06] relative z-10">
            <div className="space-y-1">
              <span className="text-[11px] text-[#707581]">واحد اندازه‌گیری</span>
              <p className="text-sm font-semibold text-[#E8E8E8]">{instrument.unit}</p>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] text-[#707581]">دامنه تغییرات روزانه</span>
              <p className="text-sm font-semibold text-[#E8E8E8]">
                {isPos ? "صعودی / تقاضای فعال" : "نزولی / تثبیت قیمت"}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] text-[#707581]">معادل تومانی تقریبی</span>
              <p className="text-sm font-semibold text-[#F0AE55] font-mono tabular-nums" dir="ltr">
                {quote?.price_toman
                  ? `${formatPriceNumber(Math.round(Number(quote.price_toman)))} ت`
                  : hasPrice && priceNum !== null
                    ? `${formatPriceNumber(Math.round(priceNum))} ت`
                    : "—"}
              </p>
            </div>
            <div className="space-y-1">
              <span className="text-[11px] text-[#707581]">وضعیت فید داده</span>
              <p className="text-sm font-semibold text-[#76A98C] flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#76A98C] animate-pulse" />
                {quote?.is_stale ? "مبتنی بر آخرین نرخ موفق" : "پایدار و معتبر"}
              </p>
            </div>
          </div>
        </div>

        {/* Action Callout */}
        <div className="rounded-[22px] bg-gradient-to-r from-[#17181D] to-[#121316] border border-[#F0AE55]/30 p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-right">
            <h3 className="text-lg font-bold text-[#F0F0F1]">
              این دارایی را در دارایی‌های شخصی خود ثبت کنید
            </h3>
            <p className="text-xs text-[#A0A3AD] max-w-md">
              با ایجاد حساب کاربری در تئا، می‌توانید تعداد یا وزن دارایی خود از {instrument.name} را ثبت نموده تا ارزش روز و سود تحقق‌نیافته آن به شکل لحظه‌ای محاسبه شود.
            </p>
          </div>

          <ResponsiveAuthLink
            href={`${dashboardUrl}/register`}
            className="px-6 py-3 rounded-[13px] bg-[#F0AE55] hover:bg-[#F3BE76] text-[#0D0E10] text-xs font-bold transition-all shadow-[0_0_20px_rgba(240,174,85,0.25)] shrink-0 flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4 stroke-[2.2]" />
            <span>ثبت رایگان دارایی در سامانه</span>
          </ResponsiveAuthLink>
        </div>

        {/* Return Button */}
        <div className="text-center pt-4">
          <Link
            href="/markets"
            className="inline-flex items-center gap-2 text-xs font-medium text-[#A0A3AD] hover:text-[#F0AE55] transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>مشاهده سایر ابزارهای دیده‌بان بازار</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
