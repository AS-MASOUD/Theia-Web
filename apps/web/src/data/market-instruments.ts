import { MarketQuote, MarketRatesResponse } from "@/types/market";

export interface InstrumentMetadata {
  symbol: string;
  name: string;
  name_en: string;
  category: "gold_coin" | "currency" | "crypto" | "commodity";
  unit: string;
  description: string;
  formula?: string;
}

export const SUPPORTED_INSTRUMENTS: InstrumentMetadata[] = [
  // Gold & Coins
  {
    symbol: "IR_GOLD_18K",
    name: "طلای ۱۸ عیار",
    name_en: "18 Karat Gold Gram",
    category: "gold_coin",
    unit: "تومان",
    description: "هر گرم طلای آب‌شده ۱۸ عیار استاندارد بازار طلا و جواهر تهران.",
    formula: "(انس طلا × نرخ دلار آزاد ÷ ۳۱.۱۰۳۵) × (۷۵۰ ÷ ۹۹۹.۹) + کارمزد و سود مرجع",
  },
  {
    symbol: "EMAMI_COIN",
    name: "سکه امامی (تمام طرح جدید)",
    name_en: "Emami Gold Coin",
    category: "gold_coin",
    unit: "تومان",
    description: "مسکوک طلای بهار آزادی طرح امام خمینی با عیار ۹۰۰ در هزار و وزن ۸.۱۳۳ گرم.",
    formula: "قیمت ذاتی طلا + حباب قیمتی بازار عرضه و تقاضا",
  },
  {
    symbol: "BAHAR_COIN",
    name: "سکه بهار آزادی (طرح قدیم)",
    name_en: "Bahar Azadi Coin",
    category: "gold_coin",
    unit: "تومان",
    description: "مسکوک رسمی طلای طرح قدیم با وزن ۸.۱۳۳ گرم و عیار ۲۱.۶ (۹۰۰ در هزار).",
  },
  {
    symbol: "HALF_COIN",
    name: "نیم سکه بهار آزادی",
    name_en: "Half Gold Coin",
    category: "gold_coin",
    unit: "تومان",
    description: "نیم سکه بهار آزادی با وزن ۴.۰۶۶ گرم و عیار ۹۰۰ در هزار.",
  },
  {
    symbol: "QUARTER_COIN",
    name: "ربع سکه بهار آزادی",
    name_en: "Quarter Gold Coin",
    category: "gold_coin",
    unit: "تومان",
    description: "ربع سکه بهار آزادی با وزن ۲.۰۳۳ گرم و عیار ۹۰۰ در هزار.",
  },
  {
    symbol: "XAUUSD",
    name: "انس جهانی طلا",
    name_en: "Gold Spot Ounce",
    category: "gold_coin",
    unit: "دلار",
    description: "نرخ شاخص جهانی هر تروی انس طلای خالص ۲۴ عیار (۳۱.۱۰۳۵ گرم).",
  },

  // Foreign Currencies
  {
    symbol: "USD",
    name: "دلار آمریکا (آزاد)",
    name_en: "US Dollar",
    category: "currency",
    unit: "تومان",
    description: "اسکناس دلار نقدی بازار غیربانکی تهران.",
  },
  {
    symbol: "EUR",
    name: "یورو اروپا",
    name_en: "Euro",
    category: "currency",
    unit: "تومان",
    description: "اسکناس رسمی حوزه اقتصادی اروپا.",
  },
  {
    symbol: "GBP",
    name: "پوند بریتانیا",
    name_en: "British Pound",
    category: "currency",
    unit: "تومان",
    description: "اسکناس پوند استرلینگ بریتانیا.",
  },
  {
    symbol: "AED",
    name: "درهم امارات متحده",
    name_en: "UAE Dirham",
    category: "currency",
    unit: "تومان",
    description: "حواله و اسکناس درهم دبی، پایه اصلی تسویه بازرگانی ایران.",
    formula: "برابری درهم به دلار با ضریب پیوند ثابت ۳.۶۷۲۵",
  },
  {
    symbol: "TRY",
    name: "لیر ترکیه",
    name_en: "Turkish Lira",
    category: "currency",
    unit: "تومان",
    description: "اسکناس لیر ترکیه.",
  },
  {
    symbol: "CAD",
    name: "دلار کانادا",
    name_en: "Canadian Dollar",
    category: "currency",
    unit: "تومان",
    description: "اسکناس دلار کانادا.",
  },

  // Cryptocurrencies
  {
    symbol: "BTC",
    name: "بیت‌کوین",
    name_en: "Bitcoin",
    category: "crypto",
    unit: "دلار",
    description: "نخستین دارایی رمزنگاری‌شده غیرمتمرکز جهان با سقف عرضه ۲۱ میلیون واحد.",
  },
  {
    symbol: "ETH",
    name: "اتریوم",
    name_en: "Ethereum",
    category: "crypto",
    unit: "دلار",
    description: "بستر محاسباتی قراردادهای هوشمند و امور مالی غیرمتمرکز (DeFi).",
  },
  {
    symbol: "USDT",
    name: "تتر (استیبل‌کوین)",
    name_en: "Tether USD",
    category: "crypto",
    unit: "دلار",
    description: "استیبل‌کوین متصل به برابری یک به یک با دلار آمریکا.",
  },
  {
    symbol: "SOL",
    name: "سولانا",
    name_en: "Solana",
    category: "crypto",
    unit: "دلار",
    description: "بلاکچین لایه اول پرسرعت برای برنامه‌های غیرمتمرکز مالی.",
  },
  {
    symbol: "TON",
    name: "تن‌کوین",
    name_en: "Toncoin",
    category: "crypto",
    unit: "دلار",
    description: "رمز ارز اکوسیستم باز تلگرام.",
  },
  {
    symbol: "BNB",
    name: "بایننس کوین",
    name_en: "BNB",
    category: "crypto",
    unit: "دلار",
    description: "توکن بومی زنجیره بایننس.",
  },

  // Commodities
  {
    symbol: "XAGUSD",
    name: "نقره جهانی",
    name_en: "Silver Spot",
    category: "commodity",
    unit: "دلار",
    description: "نرخ انس جهانی نقره خالص.",
  },
  {
    symbol: "BRENT",
    name: "نفت خام برنت دریای شمال",
    name_en: "Brent Crude Oil",
    category: "commodity",
    unit: "دلار",
    description: "شاخص مرجع بین‌المللی قیمت نفت خام سبک و شیرین.",
  },
  {
    symbol: "WTI",
    name: "نفت خام وست تگزاس",
    name_en: "WTI Crude Oil",
    category: "commodity",
    unit: "دلار",
    description: "شاخص نفت سبک آمریکا.",
  },
  {
    symbol: "CU",
    name: "مس جهانی (کاتد)",
    name_en: "Copper Spot",
    category: "commodity",
    unit: "دلار",
    description: "فلز صنعتی مس بورس فلزات لندن (LME).",
  },
];

/**
 * Returns an initial structure with metadata and 'unavailable' state
 * when no live or cached quotes have yet been fetched from the API.
 * Never invents fake numbers.
 */
export function getInitialMarketCatalog(): MarketRatesResponse {
  const quotes: MarketQuote[] = SUPPORTED_INSTRUMENTS.map((inst) => ({
    symbol: inst.symbol,
    name: inst.name,
    name_en: inst.name_en,
    category: inst.category,
    price: null,
    unit: inst.unit,
    change_percent: null,
    price_toman: null,
    updated_at: null,
    status: "unavailable",
  }));

  return {
    sync_source: "theia_financial_engine",
    last_sync_time: null,
    usd_toman_rate: null,
    status: "unavailable",
    gold_and_coins: quotes.filter((q) => q.category === "gold_coin"),
    currencies: quotes.filter((q) => q.category === "currency"),
    cryptocurrency: quotes.filter((q) => q.category === "crypto"),
    commodities: quotes.filter((q) => q.category === "commodity"),
  };
}
