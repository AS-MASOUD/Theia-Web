export type MarketQuoteStatus = "live" | "stale" | "unavailable";

export interface MarketQuote {
  symbol: string;
  name: string;
  name_en?: string | null;
  category: "gold_coin" | "commodity" | "currency" | "crypto" | string;
  price: number | string | null;
  unit: string;
  change_percent?: number | null;
  change_value?: number | string | null;
  price_toman?: number | string | null;
  updated_at?: string | null;
  status: MarketQuoteStatus;
  is_stale?: boolean;
  stale_reason?: string | null;
}

export interface MarketRatesResponse {
  gold_and_coins: MarketQuote[];
  commodities: MarketQuote[];
  currencies: MarketQuote[];
  cryptocurrency: MarketQuote[];
  stocks?: MarketQuote[];
  usd_toman_rate?: number | string | null;
  last_sync_time?: string | null;
  sync_source: string;
  status: "ok" | "degraded" | "unavailable";
}
