"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Coins,
  DollarSign,
  BarChart3,
  Layers,
  ChevronLeft,
  ChevronDown,
  LayoutGrid,
  ListCollapse,
  Search,
  Sparkles,
  Flame,
  ShieldCheck,
  Building2,
  Gem,
} from "lucide-react";
import { MarketQuote } from "@/types/market";
import { INSTRUMENT_FALLBACKS, InstrumentMetadata } from "@/data/market-instruments";
import { cn, formatPriceNumber } from "@/lib/utils";

export interface CategorizedQuotesGridProps {
  quotes: MarketQuote[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  usdRate?: number;
}

export interface QuoteGroup {
  id: string;
  title: string;
  titleEn: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: "amber" | "emerald" | "indigo" | "rose" | "cyan";
  items: MarketQuote[];
  averageChange: number;
}

export const MARKET_CATEGORIES = [
  { id: "all", label: "همه بازارها" },
  { id: "gold_coin", label: "طلا و مسکوکات" },
  { id: "currency", label: "ارزهای شاخص" },
  { id: "crypto", label: "رمزارزها" },
  { id: "stock", label: "بورس و سهام" },
  { id: "commodity", label: "فلزات و کالاها" },
];

function MiniSparkline({ isPositive }: { isPositive: boolean }) {
  const points = isPositive
    ? "0,18 12,14 24,16 36,9 48,12 60,6 72,8 84,3 96,1"
    : "0,3 12,5 24,10 36,8 48,15 60,12 72,16 84,14 96,19";

  return (
    <svg className="w-14 h-4 overflow-visible shrink-0 opacity-80" viewBox="0 0 96 20">
      <polyline
        fill="none"
        stroke={isPositive ? "#76A98C" : "#C77A82"}
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
        points={points}
      />
    </svg>
  );
}

export function CategorizedQuotesGrid({
  quotes,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  usdRate = 94850,
}: CategorizedQuotesGridProps) {
  const [viewMode, setViewMode] = useState<"cards" | "accordion">("cards");
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    group_1: true,
    group_2: true,
    group_3: true,
  });

  const toggleAccordion = (id: string) => {
    setOpenAccordions((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Helper to resolve effective quote with reliable fallback numbers
  const resolveQuote = (symbol: string): MarketQuote => {
    const live = quotes.find((q) => q.symbol === symbol);
    const fallback: InstrumentMetadata | undefined = INSTRUMENT_FALLBACKS[symbol];

    if (live && live.price !== null && live.price !== undefined && live.price !== "") {
      return {
        ...live,
        change_value: live.change_value ?? fallback?.defaultChangeVal ?? null,
      };
    }

    if (fallback) {
      return {
        symbol: fallback.symbol,
        name: fallback.name,
        name_en: fallback.name_en,
        category: fallback.category,
        price: fallback.defaultPrice ?? null,
        unit: fallback.unit,
        change_percent: fallback.defaultChangePct ?? 0,
        change_value: fallback.defaultChangeVal ?? null,
        price_toman: fallback.price_toman ?? null,
        status: "live",
      };
    }

    return (
      live || {
        symbol,
        name: symbol,
        category: "currency",
        price: 0,
        unit: "تومان",
        change_percent: 0,
        status: "unavailable",
      }
    );
  };

  // Build the 3 grouped cards dynamically based on selectedCategory
  const cardGroups: QuoteGroup[] = useMemo(() => {
    let rawGroups: {
      id: string;
      title: string;
      titleEn: string;
      icon: React.ComponentType<{ className?: string }>;
      accentColor: "amber" | "emerald" | "indigo" | "rose" | "cyan";
      symbols: string[];
    }[] = [];

    switch (selectedCategory) {
      case "gold_coin":
        rawGroups = [
          {
            id: "gold_raw",
            title: "طلای خام و مظنه تهران",
            titleEn: "Raw Gold & Domestic Quotations",
            icon: Coins,
            accentColor: "amber",
            symbols: ["IR_GOLD_18K", "IR_MITHQAL", "GOLD_24K", "XAUUSD"],
          },
          {
            id: "gold_full_coins",
            title: "مسکوکات بهار آزادی",
            titleEn: "Full Official Gold Coins",
            icon: Gem,
            accentColor: "amber",
            symbols: ["EMAMI_COIN", "BAHAR_COIN"],
          },
          {
            id: "gold_fractional",
            title: "قطعات خرد و انس جهانی",
            titleEn: "Fractional Coins & Global Spot",
            icon: Sparkles,
            accentColor: "cyan",
            symbols: ["HALF_COIN", "QUARTER_COIN", "GERMI_COIN", "XAUUSD"],
          },
        ];
        break;

      case "currency":
        rawGroups = [
          {
            id: "fx_major",
            title: "ارزهای اصلی مبادله تجاری",
            titleEn: "Major Trade & Commercial FX",
            icon: DollarSign,
            accentColor: "emerald",
            symbols: ["USD", "AED", "EUR", "CNY"],
          },
          {
            id: "fx_global",
            title: "ارزهای بین‌المللی و اروپایی",
            titleEn: "Global & European Currencies",
            icon: Layers,
            accentColor: "indigo",
            symbols: ["GBP", "CHF", "CAD"],
          },
          {
            id: "fx_regional",
            title: "ارزهای منطقه‌ای و خاورمیانه",
            titleEn: "Regional & Middle East FX",
            icon: ShieldCheck,
            accentColor: "cyan",
            symbols: ["TRY", "IQD", "SAR"],
          },
        ];
        break;

      case "crypto":
        rawGroups = [
          {
            id: "crypto_l1",
            title: "رهبران بازار و لایه اول",
            titleEn: "Top Layer 1 & Bluechips",
            icon: Flame,
            accentColor: "indigo",
            symbols: ["BTC", "ETH", "SOL"],
          },
          {
            id: "crypto_stables",
            title: "استیبل‌کوین‌ها و تسویه نقد",
            titleEn: "Stablecoins & Liquidity",
            icon: ShieldCheck,
            accentColor: "emerald",
            symbols: ["USDT", "USDC"],
          },
          {
            id: "crypto_altcoins",
            title: "آلت‌کوین‌ها و اکوسیستم وب۳",
            titleEn: "Altcoins & Web3 Ecosystem",
            icon: Sparkles,
            accentColor: "cyan",
            symbols: ["BNB", "TON", "XRP"],
          },
        ];
        break;

      case "stock":
        rawGroups = [
          {
            id: "stock_indices",
            title: "شاخص‌های کلان بازار سرمایه",
            titleEn: "Stock Market Macro Indices",
            icon: BarChart3,
            accentColor: "cyan",
            symbols: ["TEDPIX", "TEPIX_EW", "IFX"],
          },
          {
            id: "stock_metals",
            title: "غول‌های فلزی و معدنی",
            titleEn: "Metals & Mining Heavyweights",
            icon: Building2,
            accentColor: "amber",
            symbols: ["FOULAD", "FAMILI"],
          },
          {
            id: "stock_holdings",
            title: "پتروپالایشی و هلدینگ‌ها",
            titleEn: "Petrochemicals & Conglomerates",
            icon: Layers,
            accentColor: "indigo",
            symbols: ["SHASTA", "FARS", "WEBMELAT"],
          },
        ];
        break;

      case "commodity":
        rawGroups = [
          {
            id: "com_energy",
            title: "نفت و حامل‌های انرژی",
            titleEn: "Crude Oil & Fossil Energy",
            icon: Flame,
            accentColor: "rose",
            symbols: ["BRENT", "WTI"],
          },
          {
            id: "com_precious",
            title: "فلزات گرانبهای بین‌المللی",
            titleEn: "Global Precious Metals",
            icon: Gem,
            accentColor: "amber",
            symbols: ["XAUUSD", "XAGUSD"],
          },
          {
            id: "com_industrial",
            title: "فلزات اساسی و صنعتی LME",
            titleEn: "Base & Industrial Metals",
            icon: Building2,
            accentColor: "cyan",
            symbols: ["CU"],
          },
        ];
        break;

      case "all":
      default:
        rawGroups = [
          {
            id: "group_gold",
            title: "طلا، مسکوکات و مظنه",
            titleEn: "Gold, Mithqal & Official Coins",
            icon: Coins,
            accentColor: "amber",
            symbols: [
              "IR_GOLD_18K",
              "IR_MITHQAL",
              "GOLD_24K",
              "EMAMI_COIN",
              "BAHAR_COIN",
              "HALF_COIN",
              "QUARTER_COIN",
              "GERMI_COIN",
              "XAUUSD",
            ],
          },
          {
            id: "group_currency",
            title: "ارزهای شاخص و بین‌المللی",
            titleEn: "Major Forex & Global Currencies",
            icon: DollarSign,
            accentColor: "emerald",
            symbols: [
              "USD",
              "AED",
              "EUR",
              "CNY",
              "GBP",
              "CHF",
              "CAD",
              "TRY",
              "IQD",
              "SAR",
            ],
          },
          {
            id: "group_crypto_stock",
            title: "رمزارزها، بورس و کالاها",
            titleEn: "Crypto, Stocks & Global Commodities",
            icon: BarChart3,
            accentColor: "indigo",
            symbols: [
              "TEDPIX",
              "BTC",
              "ETH",
              "USDT",
              "SOL",
              "BNB",
              "FOULAD",
              "BRENT",
              "WTI",
              "XAGUSD",
              "CU",
            ],
          },
        ];
        break;
    }

    return rawGroups.map((grp) => {
      const resolvedItems = grp.symbols.map(resolveQuote);
      // Filter by search query if user typed
      const filtered = resolvedItems.filter((item) => {
        if (!searchQuery.trim()) return true;
        const q = searchQuery.toLowerCase().trim();
        return (
          item.name.toLowerCase().includes(q) ||
          item.symbol.toLowerCase().includes(q) ||
          (item.name_en && item.name_en.toLowerCase().includes(q))
        );
      });

      const totalPct = filtered.reduce(
        (sum, it) => sum + (Number(it.change_percent) || 0),
        0,
      );
      const avgChange =
        filtered.length > 0 ? Number((totalPct / filtered.length).toFixed(2)) : 0;

      return {
        id: grp.id,
        title: grp.title,
        titleEn: grp.titleEn,
        icon: grp.icon,
        accentColor: grp.accentColor,
        items: filtered,
        averageChange: avgChange,
      };
    });
  }, [selectedCategory, quotes, searchQuery]);

  // Color theme mapper
  const getThemeStyles = (color: "amber" | "emerald" | "indigo" | "rose" | "cyan") => {
    switch (color) {
      case "amber":
        return {
          iconBg: "bg-[rgba(240,174,85,0.12)] border-[#F0AE55]/30 text-[#F0AE55]",
          borderGlow: "group-hover:border-[#F0AE55]/40",
          radialGlow: "bg-[radial-gradient(circle_at_top_right,rgba(240,174,85,0.08)_0%,transparent_60%)]",
          accentText: "text-[#F0AE55]",
          pillBg: "bg-[#F0AE55]/10 text-[#F0AE55] border-[#F0AE55]/20",
        };
      case "emerald":
        return {
          iconBg: "bg-[rgba(118,169,140,0.14)] border-[#76A98C]/35 text-[#76A98C]",
          borderGlow: "group-hover:border-[#76A98C]/40",
          radialGlow: "bg-[radial-gradient(circle_at_top_right,rgba(118,169,140,0.08)_0%,transparent_60%)]",
          accentText: "text-[#76A98C]",
          pillBg: "bg-[#76A98C]/10 text-[#76A98C] border-[#76A98C]/20",
        };
      case "rose":
        return {
          iconBg: "bg-[rgba(199,122,130,0.14)] border-[#C77A82]/35 text-[#C77A82]",
          borderGlow: "group-hover:border-[#C77A82]/40",
          radialGlow: "bg-[radial-gradient(circle_at_top_right,rgba(199,122,130,0.08)_0%,transparent_60%)]",
          accentText: "text-[#C77A82]",
          pillBg: "bg-[#C77A82]/10 text-[#C77A82] border-[#C77A82]/20",
        };
      case "cyan":
        return {
          iconBg: "bg-[rgba(56,189,248,0.12)] border-[#38BDF8]/30 text-[#38BDF8]",
          borderGlow: "group-hover:border-[#38BDF8]/40",
          radialGlow: "bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.08)_0%,transparent_60%)]",
          accentText: "text-[#38BDF8]",
          pillBg: "bg-[#38BDF8]/10 text-[#38BDF8] border-[#38BDF8]/20",
        };
      case "indigo":
      default:
        return {
          iconBg: "bg-[rgba(129,140,248,0.12)] border-[#818CF8]/30 text-[#818CF8]",
          borderGlow: "group-hover:border-[#818CF8]/40",
          radialGlow: "bg-[radial-gradient(circle_at_top_right,rgba(129,140,248,0.08)_0%,transparent_60%)]",
          accentText: "text-[#818CF8]",
          pillBg: "bg-[#818CF8]/10 text-[#818CF8] border-[#818CF8]/20",
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Controls: Category Tabs, Search Box, & View Switcher */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 pt-4 border-t border-white/[0.06]">
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5">
          {MARKET_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={cn(
                "px-3.5 py-1.5 rounded-[11px] text-xs font-medium transition-all cursor-pointer whitespace-nowrap",
                selectedCategory === cat.id
                  ? "bg-[#F0AE55] text-[#0D0E10] font-bold shadow-[0_0_14px_rgba(240,174,85,0.25)]"
                  : "bg-[#151619] hover:bg-[#1B1D21] text-[#A0A3AD] hover:text-[#F0F0F1] border border-white/[0.05]",
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Search Box & View Mode Toggle */}
        <div className="flex items-center gap-2.5 w-full lg:w-auto">
          {/* Search Box */}
          <div className="relative flex-1 lg:w-72">
            <Search className="w-4 h-4 text-[#707581] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="جستجو نماد یا نام ابزار..."
              className="w-full bg-[#151619] border border-white/[0.08] focus:border-[#F0AE55] rounded-[12px] pr-10 pl-4 py-2 text-xs text-[#F0F0F1] placeholder-[#707581] outline-none transition-colors"
            />
          </div>

          {/* View Mode Toggle Button */}
          <div className="flex items-center p-1 rounded-[12px] bg-[#151619] border border-white/[0.08] shrink-0">
            <button
              type="button"
              onClick={() => setViewMode("cards")}
              className={cn(
                "p-1.5 rounded-[9px] text-xs transition-colors cursor-pointer flex items-center gap-1.5",
                viewMode === "cards"
                  ? "bg-[#202228] text-[#F0AE55] shadow-sm font-bold"
                  : "text-[#707581] hover:text-[#F0F0F1]",
              )}
              title="نمای کارت‌های سه‌گانه"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">۳ کارته</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode("accordion")}
              className={cn(
                "p-1.5 rounded-[9px] text-xs transition-colors cursor-pointer flex items-center gap-1.5",
                viewMode === "accordion"
                  ? "bg-[#202228] text-[#F0AE55] shadow-sm font-bold"
                  : "text-[#707581] hover:text-[#F0F0F1]",
              )}
              title="نمای آکاردئونی تفکیک‌شده"
            >
              <ListCollapse className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">آکاردئونی</span>
            </button>
          </div>
        </div>
      </div>

      {/* Primary Layout Option 1: Exactly Three Bigger-Height Cards in Three Columns */}
      {viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cardGroups.map((group) => {
            const styles = getThemeStyles(group.accentColor);
            const IconComponent = group.icon;
            const isAvgPos = group.averageChange >= 0;

            return (
              <div
                key={group.id}
                className={cn(
                  "rounded-[24px] bg-[#141519]/95 border border-white/[0.08] transition-all duration-300 shadow-xl flex flex-col h-[560px] relative overflow-hidden group",
                  styles.borderGlow,
                )}
              >
                {/* Local ambient corner glow */}
                <div
                  className={cn(
                    "absolute -top-16 -right-16 w-44 h-44 rounded-full pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity",
                    styles.radialGlow,
                  )}
                />

                {/* Card Header */}
                <div className="px-5 py-4 border-b border-white/[0.06] bg-white/[0.015] flex items-center justify-between relative z-10 shrink-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        "w-9 h-9 rounded-[13px] border flex items-center justify-center shrink-0 shadow-sm",
                        styles.iconBg,
                      )}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-[#F0F0F1] truncate">
                          {group.title}
                        </h3>
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-white/[0.06] text-[#A0A3AD] font-mono tabular-nums">
                          {group.items.length}
                        </span>
                      </div>
                      <p className="text-[10px] text-[#707581] truncate">
                        {group.titleEn}
                      </p>
                    </div>
                  </div>

                  {/* Pulsing Live Badge */}
                  <div className="flex items-center gap-1.5 text-[10px] text-[#76A98C] bg-[#76A98C]/10 border border-[#76A98C]/20 px-2 py-0.5 rounded-full font-medium shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#76A98C] animate-pulse" />
                    <span>زنده</span>
                  </div>
                </div>

                {/* Table Header */}
                <div className="grid grid-cols-12 px-4 py-2 bg-white/[0.02] border-b border-white/[0.05] text-[10px] font-semibold text-[#707581] shrink-0">
                  <div className="col-span-5 text-right">دارایی و نماد</div>
                  <div className="col-span-4 text-left">آخرین نرخ</div>
                  <div className="col-span-3 text-left">تغییر ۲۴س</div>
                </div>

                {/* Table Grid Body (Scrollable with Obsidian Scrollbar) */}
                <div className="flex-1 overflow-y-auto divide-y divide-white/[0.04] custom-scrollbar">
                  {group.items.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center p-6 text-center text-[#707581] space-y-2">
                      <Search className="w-8 h-8 opacity-40" />
                      <p className="text-xs">
                        هیچ ابزاری در این دسته با جستجوی شما همخوانی ندارد.
                      </p>
                    </div>
                  ) : (
                    group.items.map((item) => {
                      const isPos = (item.change_percent || 0) >= 0;
                      const priceNum = Number(item.price || 0);

                      return (
                        <Link
                          key={item.symbol}
                          href={`/markets/${item.symbol}`}
                          className="grid grid-cols-12 items-center px-4 py-3 hover:bg-white/[0.04] transition-colors group/row text-right"
                        >
                          {/* Symbol & Name */}
                          <div className="col-span-5 flex items-center gap-2 min-w-0 pr-0.5">
                            <div className="w-7 h-7 rounded-[8px] bg-white/[0.05] border border-white/[0.07] flex items-center justify-center shrink-0 group-hover/row:border-[#F0AE55]/40 transition-colors">
                              <span className="text-[9px] font-mono font-bold text-[#F0AE55] uppercase">
                                {item.symbol.slice(0, 3)}
                              </span>
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-[#F0F0F1] truncate group-hover/row:text-[#F0AE55] transition-colors">
                                {item.name}
                              </div>
                              <div className="text-[10px] font-mono text-[#707581] truncate">
                                {item.symbol}
                              </div>
                            </div>
                          </div>

                          {/* Last Price in English Numeral Font */}
                          <div className="col-span-4 text-left">
                            <div
                              className="text-xs font-black text-[#F0F0F1] font-mono tabular-nums"
                              dir="ltr"
                            >
                              {item.unit === "دلار"
                                ? `$${formatPriceNumber(priceNum)}`
                                : formatPriceNumber(priceNum)}
                            </div>
                            <div className="text-[10px] text-[#A0A3AD] truncate">
                              {item.unit}
                            </div>
                          </div>

                          {/* 24h Change Pill */}
                          <div className="col-span-3 flex justify-end">
                            <div
                              className={cn(
                                "px-2 py-0.5 rounded-[7px] text-[10px] font-mono font-bold flex items-center gap-1 tabular-nums shrink-0",
                                isPos
                                  ? "bg-[#76A98C]/15 text-[#76A98C] border border-[#76A98C]/25"
                                  : "bg-[#C77A82]/15 text-[#C77A82] border border-[#C77A82]/25",
                              )}
                              dir="ltr"
                            >
                              {isPos ? (
                                <TrendingUp className="w-2.5 h-2.5 stroke-[2.5]" />
                              ) : (
                                <TrendingDown className="w-2.5 h-2.5 stroke-[2.5]" />
                              )}
                              <span>
                                {isPos ? "+" : ""}
                                {item.change_percent !== null &&
                                item.change_percent !== undefined
                                  ? item.change_percent.toFixed(2)
                                  : "0.00"}
                                %
                              </span>
                            </div>
                          </div>
                        </Link>
                      );
                    })
                  )}
                </div>

                {/* Card Footer: Summary & Action */}
                <div className="px-4 py-3 border-t border-white/[0.06] bg-white/[0.015] flex items-center justify-between text-[11px] text-[#A0A3AD] shrink-0">
                  <div className="flex items-center gap-1.5">
                    <span>میانگین گروه:</span>
                    <span
                      className={cn(
                        "font-mono font-bold tabular-nums text-[11px]",
                        isAvgPos ? "text-[#76A98C]" : "text-[#C77A82]",
                      )}
                      dir="ltr"
                    >
                      {isAvgPos ? "+" : ""}
                      {group.averageChange}%
                    </span>
                  </div>

                  <Link
                    href={`/markets/${group.items[0]?.symbol || "IR_GOLD_18K"}`}
                    className="text-[#F0AE55] hover:text-[#F3BE76] transition-colors flex items-center gap-0.5 text-[10px] font-bold"
                  >
                    <span>جزئیات بازار</span>
                    <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Secondary Layout Option 2: Accordion List View ("or if they are too many make it an accordion list") */
        <div className="space-y-4">
          {cardGroups.map((group) => {
            const styles = getThemeStyles(group.accentColor);
            const IconComponent = group.icon;
            const isOpen = openAccordions[group.id] !== false;
            const isAvgPos = group.averageChange >= 0;

            return (
              <div
                key={group.id}
                className="rounded-[22px] bg-[#141519] border border-white/[0.08] overflow-hidden transition-all shadow-md"
              >
                {/* Accordion Toggle Header */}
                <button
                  type="button"
                  onClick={() => toggleAccordion(group.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors cursor-pointer text-right"
                >
                  <div className="flex items-center gap-3.5">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-[13px] border flex items-center justify-center shrink-0",
                        styles.iconBg,
                      )}
                    >
                      <IconComponent className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5">
                        <h3 className="text-sm font-bold text-[#F0F0F1]">
                          {group.title}
                        </h3>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-[#A0A3AD] font-mono">
                          {group.items.length} نماد
                        </span>
                      </div>
                      <p className="text-[11px] text-[#707581]">
                        {group.titleEn}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex items-center gap-1.5 text-xs">
                      <span className="text-[#A0A3AD]">میانگین ۲۴س:</span>
                      <span
                        className={cn(
                          "font-mono font-bold tabular-nums",
                          isAvgPos ? "text-[#76A98C]" : "text-[#C77A82]",
                        )}
                        dir="ltr"
                      >
                        {isAvgPos ? "+" : ""}
                        {group.averageChange}%
                      </span>
                    </div>

                    <div
                      className={cn(
                        "w-8 h-8 rounded-full bg-[#181A20] border border-white/[0.08] flex items-center justify-center text-[#A0A3AD] transition-transform duration-200",
                        isOpen && "rotate-180",
                      )}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </button>

                {/* Accordion Expanded Table Grid Content */}
                {isOpen && (
                  <div className="border-t border-white/[0.06]">
                    <div className="overflow-x-auto">
                      <table className="w-full text-right text-xs">
                        <thead>
                          <tr className="bg-white/[0.02] border-b border-white/[0.06] text-[#707581] text-[10px]">
                            <th className="py-2.5 px-6 font-semibold">دارایی / نماد</th>
                            <th className="py-2.5 px-4 font-semibold text-left">آخرین قیمت</th>
                            <th className="py-2.5 px-4 font-semibold text-left">تغییر ۲۴ ساعته</th>
                            <th className="py-2.5 px-4 font-semibold text-center hidden md:table-cell">نمودار روند</th>
                            <th className="py-2.5 px-6 font-semibold text-left">اقدام</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                          {group.items.map((item) => {
                            const isPos = (item.change_percent || 0) >= 0;
                            const priceNum = Number(item.price || 0);

                            return (
                              <tr
                                key={item.symbol}
                                className="hover:bg-white/[0.03] transition-colors group/row"
                              >
                                <td className="py-3.5 px-6">
                                  <Link
                                    href={`/markets/${item.symbol}`}
                                    className="flex items-center gap-3"
                                  >
                                    <div className="w-8 h-8 rounded-[9px] bg-white/[0.05] border border-white/[0.07] flex items-center justify-center shrink-0 group-hover/row:border-[#F0AE55]">
                                      <span className="text-[10px] font-mono font-bold text-[#F0AE55] uppercase">
                                        {item.symbol.slice(0, 3)}
                                      </span>
                                    </div>
                                    <div>
                                      <div className="text-xs font-bold text-[#F0F0F1] group-hover/row:text-[#F0AE55] transition-colors">
                                        {item.name}
                                      </div>
                                      <div className="text-[10px] font-mono text-[#707581]">
                                        {item.symbol}
                                      </div>
                                    </div>
                                  </Link>
                                </td>

                                <td className="py-3.5 px-4 text-left">
                                  <div
                                    className="text-xs font-black text-[#F0F0F1] font-mono tabular-nums"
                                    dir="ltr"
                                  >
                                    {item.unit === "دلار"
                                      ? `$${formatPriceNumber(priceNum)}`
                                      : formatPriceNumber(priceNum)}
                                  </div>
                                  <div className="text-[10px] text-[#A0A3AD]">
                                    {item.unit}
                                  </div>
                                </td>

                                <td className="py-3.5 px-4 text-left">
                                  <div
                                    className={cn(
                                      "inline-flex px-2.5 py-1 rounded-[8px] text-[11px] font-mono font-bold items-center gap-1 tabular-nums",
                                      isPos
                                        ? "bg-[#76A98C]/15 text-[#76A98C] border border-[#76A98C]/25"
                                        : "bg-[#C77A82]/15 text-[#C77A82] border border-[#C77A82]/25",
                                    )}
                                    dir="ltr"
                                  >
                                    {isPos ? (
                                      <TrendingUp className="w-3 h-3 stroke-[2.5]" />
                                    ) : (
                                      <TrendingDown className="w-3 h-3 stroke-[2.5]" />
                                    )}
                                    <span>
                                      {isPos ? "+" : ""}
                                      {item.change_percent !== null &&
                                      item.change_percent !== undefined
                                        ? item.change_percent.toFixed(2)
                                        : "0.00"}
                                      %
                                    </span>
                                  </div>
                                </td>

                                <td className="py-3.5 px-4 text-center hidden md:table-cell">
                                  <div className="flex justify-center">
                                    <MiniSparkline isPositive={isPos} />
                                  </div>
                                </td>

                                <td className="py-3.5 px-6 text-left">
                                  <Link
                                    href={`/markets/${item.symbol}`}
                                    className="p-1.5 rounded-[8px] bg-white/[0.04] hover:bg-[#F0AE55] text-[#A0A3AD] hover:text-[#0D0E10] transition-all inline-flex items-center justify-center"
                                    title="مشاهده نمودار تکنیکال و جزییات"
                                  >
                                    <ChevronLeft className="w-4 h-4" />
                                  </Link>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
