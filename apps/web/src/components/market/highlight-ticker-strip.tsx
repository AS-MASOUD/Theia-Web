"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { MarketQuote } from "@/types/market";

export interface TickerConfigItem {
  symbol: string;
  name: string;
  unit?: string;
  defaultPrice: number;
  defaultChangePct: number;
  defaultChangeVal?: number;
  isIndex?: boolean;
}

export const DEFAULT_TICKERS: TickerConfigItem[] = [
  {
    symbol: "TEDPIX",
    name: "بورس",
    defaultPrice: 2154363,
    defaultChangePct: -1.71,
    defaultChangeVal: -135881,
    isIndex: true,
  },
  {
    symbol: "XAUUSD",
    name: "انس طلا",
    defaultPrice: 2720.5,
    defaultChangePct: -0.2,
    defaultChangeVal: -7.87,
    unit: "$",
  },
  {
    symbol: "IR_MITHQAL",
    name: "مثقال طلا",
    defaultPrice: 18995000,
    defaultChangePct: 0.27,
    defaultChangeVal: 51200,
    unit: "تومان",
  },
  {
    symbol: "IR_GOLD_18K",
    name: "طلا ۱۸",
    defaultPrice: 4385000,
    defaultChangePct: 0.3,
    defaultChangeVal: 13155,
    unit: "تومان",
  },
  {
    symbol: "EMAMI_COIN",
    name: "سکه",
    defaultPrice: 51200000,
    defaultChangePct: 0.71,
    defaultChangeVal: 363520,
    unit: "تومان",
  },
  {
    symbol: "USD",
    name: "دلار",
    defaultPrice: 94850,
    defaultChangePct: 0.25,
    defaultChangeVal: 237,
    unit: "تومان",
  },
  {
    symbol: "BRENT",
    name: "نفت برنت",
    defaultPrice: 74.8,
    defaultChangePct: 0.78,
    defaultChangeVal: 0.58,
    unit: "$",
  },
  {
    symbol: "USDT",
    name: "تتر",
    defaultPrice: 95100,
    defaultChangePct: 0.0,
    defaultChangeVal: 0,
    unit: "تومان",
  },
];

interface HighlightTickerStripProps {
  quotes?: MarketQuote[];
  usdRate?: number;
}

export function HighlightTickerStrip({
  quotes = [],
  usdRate,
}: HighlightTickerStripProps) {
  const items = useMemo(() => {
    const gold18kQuote = quotes.find((q) => q.symbol === "IR_GOLD_18K");
    const gold18kPrice = gold18kQuote?.price
      ? Number(gold18kQuote.price)
      : 4385000;

    return DEFAULT_TICKERS.map((cfg) => {
      const q = quotes.find(
        (quote) =>
          quote.symbol.toUpperCase() === cfg.symbol.toUpperCase() ||
          (cfg.symbol === "TEDPIX" &&
            (quote.symbol === "BOURSE" || quote.symbol === "TEDPIX")),
      );

      let price = cfg.defaultPrice;
      let changePercent = cfg.defaultChangePct;
      let changeVal = cfg.defaultChangeVal ?? 0;

      if (q && q.price !== null && q.price !== undefined) {
        price = Number(q.price);
        if (q.change_percent !== null && q.change_percent !== undefined) {
          changePercent = Number(q.change_percent);
        }
        if (q.change_value !== null && q.change_value !== undefined) {
          changeVal = Number(q.change_value);
        } else {
          const isDecimal = cfg.unit === "$" || cfg.isIndex || price < 1000;
          const delta = (price * changePercent) / 100;
          changeVal = isDecimal ? Number(delta.toFixed(2)) : Math.round(delta);
        }
      } else if (cfg.symbol === "IR_MITHQAL" && gold18kPrice) {
        price = Math.round(gold18kPrice * 4.3318);
        if (gold18kQuote?.change_percent) {
          changePercent = Number(gold18kQuote.change_percent);
        }
        changeVal = Math.round((price * changePercent) / 100);
      } else if (cfg.symbol === "USD" && usdRate) {
        price = Number(usdRate);
      } else if (cfg.symbol === "USDT" && usdRate) {
        price = Number(usdRate) + 250;
      }

      const isPos = changePercent > 0;
      const isNeg = changePercent < 0;
      const sign = isPos ? "+" : isNeg ? "-" : "";

      // Format price string in English digits
      const isDecimalUnit = cfg.unit === "$" || (price < 1000 && !cfg.isIndex);
      const formattedPrice = isDecimalUnit
        ? price.toLocaleString("en-US", {
            minimumFractionDigits: price % 1 === 0 ? 0 : 2,
            maximumFractionDigits: 2,
          })
        : price.toLocaleString("en-US", { maximumFractionDigits: 0 });

      // Format change value in English digits
      const absVal = Math.abs(changeVal);
      const formattedChangeVal =
        isDecimalUnit || (absVal < 100 && absVal % 1 !== 0)
          ? absVal.toLocaleString("en-US", {
              minimumFractionDigits: absVal % 1 === 0 ? 0 : 2,
              maximumFractionDigits: 2,
            })
          : absVal.toLocaleString("en-US", { maximumFractionDigits: 0 });

      const pctText = `${Math.abs(changePercent).toFixed(2)}%`;

      return {
        ...cfg,
        price,
        formattedPrice,
        changePercent,
        changeVal,
        formattedChangeVal,
        pctText,
        isPos,
        isNeg,
        sign,
      };
    });
  }, [quotes, usdRate]);

  return (
    <div className="relative w-full">
      {/* Scrollable Container with Subtle Touch-Friendly Scrollbar */}
      <div className="overflow-x-auto custom-scrollbar pb-1.5 -mx-4 px-4 sm:mx-0 sm:px-0">
        <div className="flex items-stretch gap-2 min-w-max xl:min-w-0 xl:grid xl:grid-cols-8">
          {items.map((item) => {
            const cardContent = (
              <div
                className={cn(
                  "rounded-[14px] bg-[#141518] border border-white/[0.07] p-2.5 sm:p-3 flex flex-col justify-between transition-all group shrink-0 min-w-[120px] sm:min-w-[126px] xl:min-w-0 flex-1 cursor-pointer",
                  item.isPos
                    ? "hover:border-[#76A98C]/40 hover:bg-[#161917]"
                    : item.isNeg
                      ? "hover:border-[#C77A82]/40 hover:bg-[#1A1617]"
                      : "hover:border-white/[0.15] hover:bg-[#18191E]",
                )}
              >
                {/* Top Row: Title + Trending Indicator */}
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[18px]! sm:text-xs font-bold text-[#E8E8E8] group-hover:text-white transition-colors truncate">
                    {item.name}
                  </span>
                  <span className="shrink-0 flex items-center justify-center">
                    {item.isPos ? (
                      <TrendingUp className="w-3.5 h-3.5 text-[#76A98C] stroke-[2.5]" />
                    ) : item.isNeg ? (
                      <TrendingDown className="w-3.5 h-3.5 text-[#C77A82] stroke-[2.5]" />
                    ) : (
                      <Minus className="w-3.5 h-3.5 text-[#F0AE55] stroke-[2.5]" />
                    )}
                  </span>
                </div>

                {/* Hairline Divider */}
                <div className="border-t border-white/[0.06] my-1 sm:my-1.5" />

                {/* Center: Main Price Value in Green or Red with English Font */}
                <div className="my-0.5 text-center">
                  <span
                    className={cn(
                      "text-sm sm:text-[20px] font-black font-mono tracking-tight",
                      item.isPos
                        ? "text-[#76A98C]"
                        : item.isNeg
                          ? "text-[#C77A82]"
                          : "text-[#F0AE55]",
                    )}
                  >
                    {item.formattedPrice}
                  </span>
                </div>

                {/* Bottom Row: Absolute Daily Change & Percentage */}
                <div
                  className="flex items-center justify-center gap-1 text-[10px] sm:text-[12px] font-mono text-center truncate mt-0.5"
                  dir="ltr"
                >
                  <span
                    className={cn(
                      "font-semibold",
                      item.isPos
                        ? "text-[#76A98C]"
                        : item.isNeg
                          ? "text-[#C77A82]"
                          : "text-[#8E929E]",
                    )}
                  >
                    {item.sign}
                    {item.formattedChangeVal}
                  </span>
                  <span className="text-[#707581] font-medium">
                    ({item.sign}
                    {item.pctText})
                  </span>
                </div>
              </div>
            );

            // Link to symbol details if supported, otherwise render interactive card
            const href =
              item.symbol === "TEDPIX" ? "/markets" : `/markets/${item.symbol}`;

            return (
              <Link key={item.symbol} href={href} className="flex-1 block">
                {cardContent}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
