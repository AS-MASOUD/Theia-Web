"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  TrendingUp,
  TrendingDown,
  Coins,
  DollarSign,
  BarChart3,
  Layers,
  ChevronLeft,
  ChevronDown,
  Search,
  Sparkles,
  Flame,
  ShieldCheck,
  Building2,
  Gem,
  X,
  ArrowRight,
  SlidersHorizontal,
} from "lucide-react";
import { MarketQuote } from "@/types/market";
import {
  INSTRUMENT_FALLBACKS,
  InstrumentMetadata,
} from "@/data/market-instruments";
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

export interface CategorySector {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: "amber" | "emerald" | "indigo" | "rose" | "cyan";
  categories: {
    id: string;
    label: string;
    symbols?: string[];
  }[];
}

// Main market categories for quick switching and simple dropdown
export const MAIN_MARKET_CATEGORIES = [
  { id: "all", label: "همه بازارها", icon: Layers, color: "text-[#F0AE55]" },
  { id: "gold_coin", label: "طلا و سکه", icon: Coins, color: "text-[#F0AE55]" },
  {
    id: "currency",
    label: "ارزهای بین‌المللی و منطقه‌ای",
    icon: DollarSign,
    color: "text-[#76A98C]",
  },
  {
    id: "stock",
    label: "بازار بورس و اوراق بهادار",
    icon: BarChart3,
    color: "text-cyan-400",
  },
  {
    id: "crypto",
    label: "رمزارزها و دارایی‌های دیجیتال",
    icon: Flame,
    color: "text-indigo-400",
  },
  {
    id: "commodity",
    label: "کالاها، انرژی و فلزات اساسی",
    icon: Gem,
    color: "text-[#C77A82]",
  },
];

export const PINNED_CATEGORIES = [
  { id: "all", label: "همه بازارها" },
  { id: "gold_coin", label: "طلا و سکه" },
  { id: "currency", label: "ارزهای بین‌المللی" },
  { id: "crypto", label: "رمزارزها" },
  { id: "stock", label: "بورس و سهام" },
  { id: "commodity", label: "کالا و انرژی" },
];

function MiniSparkline({ isPositive }: { isPositive: boolean }) {
  const points = isPositive
    ? "0,18 12,14 24,16 36,9 48,12 60,6 72,8 84,3 96,1"
    : "0,3 12,5 24,10 36,8 48,15 60,12 72,16 84,14 96,19";

  return (
    <svg
      className="w-14 h-4 overflow-visible shrink-0 opacity-80"
      viewBox="0 0 96 20"
    >
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
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoryDropdownOpen(false);
      }
    }
    if (isCategoryDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCategoryDropdownOpen]);

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
  BTC: ["BTC", "BTC_USD", "BITCOIN"],
  ETH: ["ETH", "ETH_USD", "ETHEREUM"],
  USDT: ["USDT", "USDT_IRT", "USDT_USD", "TETHER"],
  SOL: ["SOL", "SOL_USD", "SOLANA"],
  BNB: ["BNB", "BNB_USD", "BINANCE_COIN"],
  TON: ["TON", "TON_USD", "TONCOIN"],
  XRP: ["XRP", "XRP_USD", "RIPPLE"],
  USDC: ["USDC", "USDC_USD"],
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

  // Helper to find quote with symbol alias and fuzzy resilience
  const findLiveQuote = (symbol: string): MarketQuote | undefined => {
    const upper = symbol.toUpperCase();
    const direct = quotes.find((q) => q.symbol.toUpperCase() === upper);
    if (direct) return direct;

    const aliases = SYMBOL_ALIASES[upper] || [];
    const aliasMatch = quotes.find((q) =>
      aliases.some((a) => a.toUpperCase() === q.symbol.toUpperCase()),
    );
    if (aliasMatch) return aliasMatch;

    const stripped = upper.replace(/[^A-Z0-9]/g, "");
    return quotes.find(
      (q) => q.symbol.toUpperCase().replace(/[^A-Z0-9]/g, "") === stripped,
    );
  };

  // Helper to resolve effective quote with reliable fallback numbers
  const resolveQuote = (symbol: string): MarketQuote => {
    const live = findLiveQuote(symbol);
    const fallback: InstrumentMetadata | undefined =
      INSTRUMENT_FALLBACKS[symbol];

    if (
      live &&
      live.price !== null &&
      live.price !== undefined &&
      live.price !== ""
    ) {
      const parsedPrice =
        typeof live.price === "string"
          ? Number(live.price.replace(/,/g, "").trim())
          : Number(live.price);

      const chgPct =
        live.change_percent !== null && live.change_percent !== undefined
          ? Number(live.change_percent)
          : 0;

      const calculatedChgVal =
        live.change_value != null
          ? typeof live.change_value === "string"
            ? Number(live.change_value.replace(/,/g, ""))
            : Number(live.change_value)
          : (parsedPrice * chgPct) / 100;

      const calculatedToman =
        live.price_toman != null
          ? typeof live.price_toman === "string"
            ? Number(live.price_toman.replace(/,/g, ""))
            : Number(live.price_toman)
          : (fallback?.unit === "دلار" || live.unit === "دلار")
            ? Math.round(parsedPrice * usdRate)
            : parsedPrice;

      return {
        ...live,
        symbol: fallback?.symbol || live.symbol,
        name: fallback?.name || live.name,
        name_en: fallback?.name_en || live.name_en,
        category: fallback?.category || live.category,
        price: parsedPrice,
        unit: fallback?.unit || live.unit || "تومان",
        change_percent: chgPct,
        change_value: calculatedChgVal,
        price_toman: calculatedToman,
        status: live.status || "live",
      };
    }

    return {
      symbol: fallback?.symbol || symbol,
      name: fallback?.name || symbol,
      name_en: fallback?.name_en || symbol,
      category: fallback?.category || "currency",
      price: null,
      unit: fallback?.unit || "تومان",
      change_percent: null,
      change_value: null,
      price_toman: null,
      status: "unavailable",
    };
  };

  // 1. Definition for the 3 Cards when selectedCategory === "all"
  const defaultThreeCards: QuoteGroup[] = useMemo(() => {
    const rawCards = [
      {
        id: "group_gold",
        title: "طلا، مسکوکات و مظنه",
        titleEn: "Gold, Mithqal & Official Coins",
        icon: Coins,
        accentColor: "amber" as const,
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
        accentColor: "emerald" as const,
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
        accentColor: "indigo" as const,
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

    return rawCards.map((card) => {
      const resolved = card.symbols.map(resolveQuote);
      const filtered = resolved.filter((item) => {
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
        filtered.length > 0
          ? Number((totalPct / filtered.length).toFixed(2))
          : 0;

      return {
        id: card.id,
        title: card.title,
        titleEn: card.titleEn,
        icon: card.icon,
        accentColor: card.accentColor,
        items: filtered,
        averageChange: avgChange,
      };
    });
  }, [quotes, searchQuery]);

  // 2. Definition for the SINGLE Card when a specific category is selected
  const singleCategoryCard = useMemo(() => {
    if (selectedCategory === "all") return null;

    let title = "دسته انتخابی بازار";
    let titleEn = "Selected Market Category";
    let icon = Layers;
    let accentColor: "amber" | "emerald" | "indigo" | "rose" | "cyan" = "amber";
    let symbols: string[] = [];

    switch (selectedCategory) {
      // Gold categories
      case "gold_coin":
        title = "طلا و مسکوکات بهار آزادی";
        titleEn = "Gold & Official Coins Hub";
        icon = Coins;
        accentColor = "amber";
        symbols = [
          "IR_GOLD_18K",
          "IR_MITHQAL",
          "GOLD_24K",
          "EMAMI_COIN",
          "BAHAR_COIN",
          "HALF_COIN",
          "QUARTER_COIN",
          "GERMI_COIN",
          "XAUUSD",
        ];
        break;

      case "gold_raw":
        title = "طلای خام، آبشده و مظنه تهران";
        titleEn = "Raw & Melted Gold Quotations";
        icon = Coins;
        accentColor = "amber";
        symbols = ["IR_GOLD_18K", "IR_MITHQAL", "GOLD_24K", "XAUUSD"];
        break;

      case "gold_full_coins":
        title = "مسکوکات بهار آزادی (تمام طرح جدید و قدیم)";
        titleEn = "Full Official Gold Coins";
        icon = Gem;
        accentColor = "amber";
        symbols = ["EMAMI_COIN", "BAHAR_COIN"];
        break;

      case "gold_fractional":
        title = "قطعات خرد مسکوکات و سکه گرمی";
        titleEn = "Fractional Coins & Bank Gram Coins";
        icon = Sparkles;
        accentColor = "cyan";
        symbols = ["HALF_COIN", "QUARTER_COIN", "GERMI_COIN"];
        break;

      case "gold_global":
        title = "انس و مظنه جهانی طلا";
        titleEn = "Global Spot Gold Quotations";
        icon = Gem;
        accentColor = "amber";
        symbols = ["XAUUSD"];
        break;

      // Currency categories
      case "currency":
        title = "ارزهای شاخص و حوالجات بین‌المللی";
        titleEn = "Major Forex & International Currencies";
        icon = DollarSign;
        accentColor = "emerald";
        symbols = [
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
        ];
        break;

      case "fx_major":
        title = "ارزهای اصلی مبادله تجاری";
        titleEn = "Major Trade & Commercial Currencies";
        icon = DollarSign;
        accentColor = "emerald";
        symbols = ["USD", "AED", "EUR", "CNY"];
        break;

      case "fx_global":
        title = "ارزهای بین‌المللی و اروپایی";
        titleEn = "Global & European Currencies";
        icon = Layers;
        accentColor = "indigo";
        symbols = ["GBP", "CHF", "CAD"];
        break;

      case "fx_regional":
        title = "ارزهای منطقه‌ای و خاورمیانه";
        titleEn = "Regional & Middle East FX";
        icon = ShieldCheck;
        accentColor = "cyan";
        symbols = ["TRY", "IQD", "SAR"];
        break;

      // Stock categories
      case "stock":
        title = "بازار بورس و اوراق بهادار تهران";
        titleEn = "Tehran Stock Exchange & Indices";
        icon = BarChart3;
        accentColor = "cyan";
        symbols = [
          "TEDPIX",
          "TEPIX_EW",
          "IFX",
          "FOULAD",
          "FAMILI",
          "SHASTA",
          "FARS",
          "WEBMELAT",
        ];
        break;

      case "stock_indices":
        title = "شاخص‌های کلان بازار سرمایه";
        titleEn = "Macro Stock Market Indices";
        icon = BarChart3;
        accentColor = "cyan";
        symbols = ["TEDPIX", "TEPIX_EW", "IFX"];
        break;

      case "stock_metals":
        title = "غول‌های فلزی و معدنی بازار سرمایه";
        titleEn = "Metals & Mining Heavyweights";
        icon = Building2;
        accentColor = "amber";
        symbols = ["FOULAD", "FAMILI"];
        break;

      case "stock_holdings":
        title = "پتروپالایشی و هلدینگ‌های چندرشته‌ای";
        titleEn = "Petrochemicals & Conglomerates";
        icon = Layers;
        accentColor = "indigo";
        symbols = ["SHASTA", "FARS", "WEBMELAT"];
        break;

      // Crypto categories
      case "crypto":
        title = "رمزارزها و دارایی‌های دیجیتال";
        titleEn = "Cryptocurrencies & Digital Assets";
        icon = Flame;
        accentColor = "indigo";
        symbols = ["BTC", "ETH", "SOL", "USDT", "USDC", "BNB", "TON", "XRP"];
        break;

      case "crypto_l1":
        title = "رهبران بازار و بلاکچین‌های لایه اول";
        titleEn = "Top Layer 1 & Bluechips";
        icon = Flame;
        accentColor = "indigo";
        symbols = ["BTC", "ETH", "SOL"];
        break;

      case "crypto_stables":
        title = "استیبل‌کوین‌ها و ابزار نقدینگی";
        titleEn = "Stablecoins & Settlement Tokens";
        icon = ShieldCheck;
        accentColor = "emerald";
        symbols = ["USDT", "USDC"];
        break;

      case "crypto_altcoins":
        title = "آلت‌کوین‌ها و اکوسیستم وب۳";
        titleEn = "Altcoins & Web3 Ecosystem";
        icon = Sparkles;
        accentColor = "cyan";
        symbols = ["BNB", "TON", "XRP"];
        break;

      // Commodity categories
      case "commodity":
        title = "فلزات، انرژی و کالاهای اساسی";
        titleEn = "Commodities, Metals & Energy";
        icon = Gem;
        accentColor = "rose";
        symbols = ["BRENT", "WTI", "XAUUSD", "XAGUSD", "CU"];
        break;

      case "com_energy":
        title = "نفت خام و حامل‌های انرژی";
        titleEn = "Crude Oil & Energy Markets";
        icon = Flame;
        accentColor = "rose";
        symbols = ["BRENT", "WTI"];
        break;

      case "com_precious":
        title = "فلزات گرانبهای بین‌المللی";
        titleEn = "Global Precious Metals Spot";
        icon = Gem;
        accentColor = "amber";
        symbols = ["XAUUSD", "XAGUSD"];
        break;

      case "com_industrial":
        title = "فلزات اساسی و صنعتی LME";
        titleEn = "Base & Industrial Metals";
        icon = Building2;
        accentColor = "cyan";
        symbols = ["CU"];
        break;

      default:
        title = "دسته سفارشی";
        titleEn = selectedCategory;
        icon = Layers;
        accentColor = "amber";
        symbols = quotes
          .filter((q) => q.category === selectedCategory)
          .map((q) => q.symbol);
        break;
    }

    const resolved = symbols.map(resolveQuote);
    const filtered = resolved.filter((item) => {
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
      id: selectedCategory,
      title,
      titleEn,
      icon,
      accentColor,
      items: filtered,
      averageChange: avgChange,
    };
  }, [selectedCategory, quotes, searchQuery]);

  // Color theme mapper
  const getThemeStyles = (
    color: "amber" | "emerald" | "indigo" | "rose" | "cyan",
  ) => {
    switch (color) {
      case "amber":
        return {
          iconBg:
            "bg-[rgba(240,174,85,0.12)] border-[#F0AE55]/30 text-[#F0AE55]",
          borderGlow: "group-hover:border-[#F0AE55]/40",
          radialGlow:
            "bg-[radial-gradient(circle_at_top_right,rgba(240,174,85,0.08)_0%,transparent_60%)]",
          accentText: "text-[#F0AE55]",
          pillBg: "bg-[#F0AE55]/10 text-[#F0AE55] border-[#F0AE55]/20",
        };
      case "emerald":
        return {
          iconBg:
            "bg-[rgba(118,169,140,0.14)] border-[#76A98C]/35 text-[#76A98C]",
          borderGlow: "group-hover:border-[#76A98C]/40",
          radialGlow:
            "bg-[radial-gradient(circle_at_top_right,rgba(118,169,140,0.08)_0%,transparent_60%)]",
          accentText: "text-[#76A98C]",
          pillBg: "bg-[#76A98C]/10 text-[#76A98C] border-[#76A98C]/20",
        };
      case "rose":
        return {
          iconBg:
            "bg-[rgba(199,122,130,0.14)] border-[#C77A82]/35 text-[#C77A82]",
          borderGlow: "group-hover:border-[#C77A82]/40",
          radialGlow:
            "bg-[radial-gradient(circle_at_top_right,rgba(199,122,130,0.08)_0%,transparent_60%)]",
          accentText: "text-[#C77A82]",
          pillBg: "bg-[#C77A82]/10 text-[#C77A82] border-[#C77A82]/20",
        };
      case "cyan":
        return {
          iconBg:
            "bg-[rgba(56,189,248,0.12)] border-[#38BDF8]/30 text-[#38BDF8]",
          borderGlow: "group-hover:border-[#38BDF8]/40",
          radialGlow:
            "bg-[radial-gradient(circle_at_top_right,rgba(56,189,248,0.08)_0%,transparent_60%)]",
          accentText: "text-[#38BDF8]",
          pillBg: "bg-[#38BDF8]/10 text-[#38BDF8] border-[#38BDF8]/20",
        };
      case "indigo":
      default:
        return {
          iconBg:
            "bg-[rgba(129,140,248,0.12)] border-[#818CF8]/30 text-[#818CF8]",
          borderGlow: "group-hover:border-[#818CF8]/40",
          radialGlow:
            "bg-[radial-gradient(circle_at_top_right,rgba(129,140,248,0.08)_0%,transparent_60%)]",
          accentText: "text-[#818CF8]",
          pillBg: "bg-[#818CF8]/10 text-[#818CF8] border-[#818CF8]/20",
        };
    }
  };

  const isSpecificCategorySelected = selectedCategory !== "all";

  return (
    <div className="space-y-5">
      {/* Top Filter Controls: Quick Tabs, Categories Accordion Button & Live Search */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 pt-4 border-t border-white/[0.06]">
        {/* Category Selection Tabs & Accordion Toggle */}
        <div className="flex flex-wrap items-center gap-1.5">
          {PINNED_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={cn(
                "px-3 py-1.5 rounded-[11px] text-xs font-medium transition-all cursor-pointer whitespace-nowrap",
                selectedCategory === cat.id
                  ? "bg-[#F0AE55] text-[#0D0E10] font-bold shadow-[0_0_14px_rgba(240,174,85,0.25)]"
                  : "bg-[#151619] hover:bg-[#1B1D21] text-[#A0A3AD] hover:text-[#F0F0F1] border border-white/[0.05]",
              )}
            >
              {cat.label}
            </button>
          ))}

          {/* Simple Dropdown Menu */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsCategoryDropdownOpen((prev) => !prev)}
              className={cn(
                "px-3 py-1.5 rounded-[11px] text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 border",
                isCategoryDropdownOpen
                  ? "bg-[#202228] text-[#F0AE55] border-[#F0AE55]/40 shadow-sm"
                  : "bg-[#151619] hover:bg-[#1B1D21] text-[#A0A3AD] hover:text-[#F0F0F1] border-white/[0.06]",
              )}
              title="فهرست کشویی دسته‌بندی‌های اصلی بازار"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#F0AE55]" />
              <span>انتخاب بازار</span>
              <ChevronDown
                className={cn(
                  "w-3.5 h-3.5 transition-transform duration-200",
                  isCategoryDropdownOpen && "rotate-180 text-[#F0AE55]",
                )}
              />
            </button>

            {/* Simple Floating Dropdown Popover */}
            {isCategoryDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-64 rounded-[16px] bg-[#141519]/98 backdrop-blur-2xl border border-white/[0.1] shadow-2xl z-50 p-1.5 space-y-1 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-1.5 text-[10px] font-semibold text-[#707581] border-b border-white/[0.06] mb-1">
                  دسته‌بندی‌های اصلی بازار
                </div>
                {MAIN_MARKET_CATEGORIES.map((cat) => {
                  const IconComp = cat.icon;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        onSelectCategory(cat.id);
                        setIsCategoryDropdownOpen(false);
                      }}
                      className={cn(
                        "w-full flex items-center justify-between px-3 py-2 rounded-[10px] text-xs font-medium transition-all cursor-pointer text-right",
                        isSelected
                          ? "bg-[#F0AE55] text-[#0D0E10] font-bold shadow-sm"
                          : "text-[#A0A3AD] hover:text-[#F0F0F1] hover:bg-white/[0.05]",
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={cn(
                            "w-6 h-6 rounded-[7px] flex items-center justify-center",
                            isSelected
                              ? "bg-black/15 text-[#0D0E10]"
                              : "bg-white/[0.05] " + cat.color,
                          )}
                        >
                          <IconComp className="w-3.5 h-3.5" />
                        </div>
                        <span>{cat.label}</span>
                      </div>
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0D0E10]" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Direct Search Box for Currencies, Symbols or Categories */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-[#707581] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="جستجوی مستقیم نماد یا بازار..."
            className="w-full bg-[#151619] border border-white/[0.08] focus:border-[#F0AE55] rounded-[12px] pr-10 pl-4 py-2 text-xs text-[#F0F0F1] placeholder-[#707581] outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#707581] hover:text-[#F0F0F1] p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Primary Display Area: */}
      {/* CASE A: If "همه بازارها" is selected -> Display the THREE Cards Layout */}
      {!isSpecificCategorySelected && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {defaultThreeCards.map((group) => {
            const styles = getThemeStyles(group.accentColor);
            const IconComponent = group.icon;
            const isAvgPos = group.averageChange >= 0;

            return (
              <div
                key={group.id}
                className={cn(
                  "rounded-[24px] bg-[#141519]/95 border border-white/[0.08] transition-all duration-300 shadow-xl flex flex-col h-[425px] relative overflow-hidden group",
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
                <div className="px-5 py-3.5 border-b border-white/[0.06] bg-white/[0.015] flex items-center justify-between relative z-10 shrink-0">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={cn(
                        "w-8 h-8 rounded-[11px] border flex items-center justify-center shrink-0 shadow-sm",
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

                {/* Table Grid Body */}
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
                      const chgPercent =
                        item.change_percent !== null &&
                        item.change_percent !== undefined
                          ? Number(item.change_percent)
                          : 0;
                      const isPos = chgPercent >= 0;
                      const priceNum =
                        typeof item.price === "string"
                          ? Number(item.price.replace(/,/g, "").trim())
                          : Number(item.price || 0);
                      const isUsd =
                        item.unit === "دلار" ||
                        item.unit === "USD" ||
                        item.unit === "$";
                      const decimals = isUsd
                        ? priceNum < 100 && priceNum % 1 !== 0
                          ? 2
                          : 0
                        : 0;

                      return (
                        <Link
                          key={item.symbol}
                          href={`/markets/${item.symbol}`}
                          className="grid grid-cols-12 items-center px-4 py-2.5 hover:bg-white/[0.04] transition-colors group/row text-right"
                        >
                          {/* Symbol & Name */}
                          <div className="col-span-5 flex items-center gap-2 min-w-0 pr-0.5">
                            <div className="w-6 h-6 rounded-[7px] bg-white/[0.05] border border-white/[0.07] flex items-center justify-center shrink-0 group-hover/row:border-[#F0AE55]/40 transition-colors">
                              <span className="text-[8px] font-mono font-bold text-[#F0AE55] uppercase">
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
                            {item.price !== null && !isNaN(priceNum) && priceNum > 0 ? (
                              <>
                                <div
                                  className="text-xs font-black text-[#F0F0F1] font-mono tabular-nums"
                                  dir="ltr"
                                >
                                  {isUsd
                                    ? `$${formatPriceNumber(priceNum, decimals)}`
                                    : formatPriceNumber(Math.round(priceNum))}
                                </div>
                                <div className="text-[10px] text-[#A0A3AD] truncate">
                                  {item.unit}
                                </div>
                              </>
                            ) : (
                              <div className="text-[11px] text-[#707581] font-medium">
                                در انتظار نرخ...
                              </div>
                            )}
                          </div>

                          {/* 24h Change Pill */}
                          <div className="col-span-3 flex justify-end">
                            {item.price !== null && item.change_percent !== null ? (
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
                                  {chgPercent.toFixed(2)}%
                                </span>
                              </div>
                            ) : (
                              <div className="px-2 py-0.5 text-[10px] font-mono text-[#707581]">
                                —
                              </div>
                            )}
                          </div>
                        </Link>
                      );
                    })
                  )}
                </div>

                {/* Card Footer */}
                <div className="px-4 py-2.5 border-t border-white/[0.06] bg-white/[0.015] flex items-center justify-between text-[11px] text-[#A0A3AD] shrink-0">
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
      )}

      {/* CASE B: When a category IS selected -> Display exactly ONE comprehensive Card */}
      {isSpecificCategorySelected && singleCategoryCard && (
        <div
          className={cn(
            "w-full rounded-[24px] bg-[#141519]/95 border border-white/[0.08] transition-all duration-300 shadow-xl flex flex-col h-[425px] relative overflow-hidden group",
            getThemeStyles(singleCategoryCard.accentColor).borderGlow,
          )}
        >
          {/* Ambient Glow */}
          <div
            className={cn(
              "absolute -top-20 -right-20 w-56 h-56 rounded-full pointer-events-none opacity-40 group-hover:opacity-100 transition-opacity",
              getThemeStyles(singleCategoryCard.accentColor).radialGlow,
            )}
          />

          {/* Single Card Header */}
          <div className="px-6 py-4 border-b border-white/[0.06] bg-white/[0.015] flex flex-wrap items-center justify-between gap-3 relative z-10 shrink-0">
            <div className="flex items-center gap-3.5 min-w-0">
              <div
                className={cn(
                  "w-10 h-10 rounded-[13px] border flex items-center justify-center shrink-0 shadow-sm",
                  getThemeStyles(singleCategoryCard.accentColor).iconBg,
                )}
              >
                <singleCategoryCard.icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2.5">
                  <h3 className="text-base font-bold text-[#F0F0F1] truncate">
                    {singleCategoryCard.title}
                  </h3>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.07] text-[#A0A3AD] font-mono tabular-nums">
                    {singleCategoryCard.items.length} نماد فعال
                  </span>
                </div>
                <p className="text-xs text-[#707581] truncate">
                  {singleCategoryCard.titleEn}
                </p>
              </div>
            </div>

            {/* Header Right: Live Badge & Back Button to 3-Cards */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1.5 text-[11px] text-[#76A98C] bg-[#76A98C]/10 border border-[#76A98C]/20 px-2.5 py-1 rounded-full font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-[#76A98C] animate-pulse" />
                <span>نرخ‌های زنده</span>
              </div>

              {/* Close / Return to 3-Cards button */}
              <button
                type="button"
                onClick={() => onSelectCategory("all")}
                className="px-3 py-1.5 rounded-[10px] bg-[#202228] hover:bg-[#282A32] text-[#F0AE55] hover:text-[#F3BE76] border border-white/[0.08] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                title="بازگشت"
              >
                <span>بازگشت</span>
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Table Header */}
          <div className="grid grid-cols-12 px-6 py-2.5 bg-white/[0.02] border-b border-white/[0.05] text-[11px] font-semibold text-[#707581] shrink-0">
            <div className="col-span-5 md:col-span-4 text-right">
              دارایی / نماد معامله
            </div>
            <div className="col-span-4 md:col-span-3 text-left">
              آخرین نرخ رسمی
            </div>
            <div className="col-span-3 md:col-span-3 text-left">
              تغییر ۲۴ ساعته
            </div>
            <div className="hidden md:block col-span-2 text-center">
              روند / اقدام
            </div>
          </div>

          {/* Table Body (Scrollable with Obsidian Scrollbar) */}
          <div className="flex-1 overflow-y-auto divide-y divide-white/[0.04] custom-scrollbar">
            {singleCategoryCard.items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center p-8 text-center text-[#707581] space-y-2">
                <Search className="w-9 h-9 opacity-40" />
                <p className="text-xs">
                  هیچ نمادی در این دسته‌بندی با عبارت جستجوی شما پیدا نشد.
                </p>
                <button
                  type="button"
                  onClick={() => onSearchChange("")}
                  className="text-xs text-[#F0AE55] underline cursor-pointer"
                >
                  پاک کردن جستجو
                </button>
              </div>
            ) : (
              singleCategoryCard.items.map((item) => {
                const chgPercent =
                  item.change_percent !== null &&
                  item.change_percent !== undefined
                    ? Number(item.change_percent)
                    : 0;
                const isPos = chgPercent >= 0;
                const priceNum =
                  typeof item.price === "string"
                    ? Number(item.price.replace(/,/g, "").trim())
                    : Number(item.price || 0);
                const isUsd =
                  item.unit === "دلار" ||
                  item.unit === "USD" ||
                  item.unit === "$";
                const decimals = isUsd
                  ? priceNum < 100 && priceNum % 1 !== 0
                    ? 2
                    : 0
                  : 0;

                return (
                  <Link
                    key={item.symbol}
                    href={`/markets/${item.symbol}`}
                    className="grid grid-cols-12 items-center px-6 py-3 hover:bg-white/[0.04] transition-colors group/row text-right"
                  >
                    {/* Symbol & Name */}
                    <div className="col-span-5 md:col-span-4 flex items-center gap-3 min-w-0 pr-0.5">
                      <div className="w-8 h-8 rounded-[9px] bg-white/[0.05] border border-white/[0.07] flex items-center justify-center shrink-0 group-hover/row:border-[#F0AE55]/40 transition-colors">
                        <span className="text-[10px] font-mono font-bold text-[#F0AE55] uppercase">
                          {item.symbol.slice(0, 3)}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs md:text-sm font-bold text-[#F0F0F1] truncate group-hover/row:text-[#F0AE55] transition-colors">
                          {item.name}
                        </div>
                        <div className="text-[10px] font-mono text-[#707581] truncate">
                          {item.symbol}{" "}
                          {item.name_en ? `• ${item.name_en}` : ""}
                        </div>
                      </div>
                    </div>

                    {/* Price in English Typography */}
                    <div className="col-span-4 md:col-span-3 text-left">
                      {item.price !== null && !isNaN(priceNum) && priceNum > 0 ? (
                        <>
                          <div
                            className="text-xs md:text-sm font-black text-[#F0F0F1] font-mono tabular-nums"
                            dir="ltr"
                          >
                            {isUsd
                              ? `$${formatPriceNumber(priceNum, decimals)}`
                              : formatPriceNumber(Math.round(priceNum))}
                          </div>
                          <div className="text-[10px] text-[#A0A3AD] truncate">
                            {item.unit}
                          </div>
                        </>
                      ) : (
                        <div className="text-xs text-[#707581] font-medium">
                          در انتظار نرخ...
                        </div>
                      )}
                    </div>

                    {/* 24h Change Pill */}
                    <div className="col-span-3 md:col-span-3 flex justify-end">
                      {item.price !== null && item.change_percent !== null ? (
                        <div
                          className={cn(
                            "px-2.5 py-1 rounded-[8px] text-[11px] font-mono font-bold flex items-center gap-1.5 tabular-nums shrink-0",
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
                            {chgPercent.toFixed(2)}%
                          </span>
                        </div>
                      ) : (
                        <div className="px-2.5 py-1 text-xs font-mono text-[#707581]">
                          —
                        </div>
                      )}
                    </div>

                    {/* Sparkline & Detail Arrow */}
                    <div className="hidden md:flex col-span-2 items-center justify-end gap-3 pl-1">
                      <MiniSparkline isPositive={isPos} />
                      <div className="w-7 h-7 rounded-[8px] bg-white/[0.04] group-hover/row:bg-[#F0AE55] text-[#A0A3AD] group-hover/row:text-[#0D0E10] transition-colors flex items-center justify-center shrink-0">
                        <ChevronLeft className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>

          {/* Single Card Footer */}
          <div className="px-6 py-3 border-t border-white/[0.06] bg-white/[0.015] flex flex-wrap items-center justify-between gap-3 text-xs text-[#A0A3AD] shrink-0">
            <div className="flex items-center gap-2">
              <span>میانگین بازدهی این بازار:</span>
              <span
                className={cn(
                  "font-mono font-bold tabular-nums text-xs",
                  singleCategoryCard.averageChange >= 0
                    ? "text-[#76A98C]"
                    : "text-[#C77A82]",
                )}
                dir="ltr"
              >
                {singleCategoryCard.averageChange >= 0 ? "+" : ""}
                {singleCategoryCard.averageChange}%
              </span>
            </div>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => onSelectCategory("all")}
                className="text-[#A0A3AD] hover:text-[#F0F0F1] transition-colors text-xs flex items-center gap-1 cursor-pointer"
              >
                <span>نمایش همه دسته‌ها</span>
              </button>

              <Link
                href={`/markets/${singleCategoryCard.items[0]?.symbol || "IR_GOLD_18K"}`}
                className="text-[#F0AE55] hover:text-[#F3BE76] transition-colors flex items-center gap-1 font-bold text-xs"
              >
                <span>تحلیل تکنیکال نماد برتر</span>
                <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
