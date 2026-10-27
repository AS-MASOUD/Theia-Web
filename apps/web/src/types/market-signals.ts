export type MarketCategory = "gold_coin" | "currency" | "crypto" | "commodity";
export type SignalType = "BUY" | "SELL" | "HOLD" | "NEUTRAL";
export type TrendBias = "BULLISH" | "BEARISH" | "NEUTRAL";
export type SignalRiskLevel = "LOW" | "MEDIUM" | "HIGH";
export type SignalStatus = "ACTIVE" | "TARGET_REACHED" | "STOPPED_OUT" | "EXPIRED" | "CANCELLED";

export interface MarketSignal {
  id: number;
  title: string;
  symbol: string;
  marketCategory: MarketCategory;
  trendBias: TrendBias;
  signalType?: SignalType;
  timeframe: string;
  summary?: string | null;
  chartImageUrl?: string | null;
  analysisText: string;
  fundamentalData?: string | null;
  indexesSummary?: string | null;
  keyLevels?: string | null;
  readingTime?: string | null;

  // Optional legacy fields (no longer mandatory)
  entryPrice?: string | null;
  targetPrice?: string | null;
  stopLoss?: string | null;
  riskReward?: string | null;
  riskLevel?: SignalRiskLevel | null;
  status?: SignalStatus | null;

  traderId?: number | null;
  traderName: string;
  traderRole: string;
  isPublished?: boolean;
  viewsCount?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface CreateSignalInput {
  title: string;
  symbol: string;
  marketCategory: MarketCategory;
  trendBias?: TrendBias;
  signalType?: SignalType;
  timeframe: string;
  summary?: string;
  chartImageUrl?: string;
  analysisText: string;
  fundamentalData?: string;
  indexesSummary?: string;
  keyLevels?: string;
  readingTime?: string;
  traderName?: string;
  traderRole?: string;
  status?: SignalStatus;
  isPublished?: boolean;

  entryPrice?: string;
  targetPrice?: string;
  stopLoss?: string;
  riskReward?: string;
  riskLevel?: SignalRiskLevel;
}
