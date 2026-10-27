import { MarketQuote, MarketRatesResponse } from "@/types/market";

export interface InstrumentMetadata {
  symbol: string;
  name: string;
  name_en: string;
  category: "gold_coin" | "currency" | "crypto" | "commodity" | "stock";
  sub_group?: string;
  unit: string;
  description: string;
  formula?: string;
}

export const SUPPORTED_INSTRUMENTS: InstrumentMetadata[] = [
  // Gold & Coins (طلا و مسکوکات)
  {
    symbol: "IR_GOLD_18K",
    name: "طلای ۱۸ عیار",
    name_en: "18 Karat Gold Gram",
    category: "gold_coin",
    sub_group: "raw_gold",
    unit: "تومان",
    description: "هر گرم طلای آب‌شده ۱۸ عیار استاندارد بازار طلا و جواهر تهران.",
    formula: "(انس طلا × نرخ دلار آزاد ÷ ۳۱.۱۰۳۵) × (۷۵۰ ÷ ۹۹۹.۹) + کارمزد و سود مرجع",
  },
  {
    symbol: "IR_MITHQAL",
    name: "مثقال طلا",
    name_en: "Mithqal Gold",
    category: "gold_coin",
    sub_group: "raw_gold",
    unit: "تومان",
    description: "یک مثقال طلای ۱۷ عیار (معادل ۴.۶۰۸ گرم) مبنای مظنه سنتی بازار تهران.",
    formula: "طلای ۱۸ عیار × ۴.۳۳۱۸",
  },
  {
    symbol: "GOLD_24K",
    name: "طلای ۲۴ عیار (شمش)",
    name_en: "24 Karat Pure Gold",
    category: "gold_coin",
    sub_group: "raw_gold",
    unit: "تومان",
    description: "هر گرم طلای خالص شمش ۲۴ عیار با عیار ۹۹۹.۹ استاندارد بین‌المللی.",
  },
  {
    symbol: "EMAMI_COIN",
    name: "سکه امامی (تمام طرح جدید)",
    name_en: "Emami Gold Coin",
    category: "gold_coin",
    sub_group: "full_coins",
    unit: "تومان",
    description: "مسکوک طلای بهار آزادی طرح امام با عیار ۹۰۰ در هزار و وزن ۸.۱۳۳ گرم.",
    formula: "قیمت ذاتی طلا + حباب قیمتی بازار عرضه و تقاضا",
  },
  {
    symbol: "BAHAR_COIN",
    name: "سکه بهار آزادی (طرح قدیم)",
    name_en: "Bahar Azadi Coin",
    category: "gold_coin",
    sub_group: "full_coins",
    unit: "تومان",
    description: "مسکوک رسمی طلای طرح قدیم با وزن ۸.۱۳۳ گرم و عیار ۲۱.۶ (۹۰۰ در هزار).",
  },
  {
    symbol: "HALF_COIN",
    name: "نیم سکه بهار آزادی",
    name_en: "Half Gold Coin",
    category: "gold_coin",
    sub_group: "fractional_coins",
    unit: "تومان",
    description: "نیم سکه بهار آزادی با وزن ۴.۰۶۶ گرم و عیار ۹۰۰ در هزار.",
  },
  {
    symbol: "QUARTER_COIN",
    name: "ربع سکه بهار آزادی",
    name_en: "Quarter Gold Coin",
    category: "gold_coin",
    sub_group: "fractional_coins",
    unit: "تومان",
    description: "ربع سکه بهار آزادی با وزن ۲.۰۳۳ گرم و عیار ۹۰۰ در هزار.",
  },
  {
    symbol: "GERMI_COIN",
    name: "سکه گرمی بانک مرکزی",
    name_en: "One Gram Bank Coin",
    category: "gold_coin",
    sub_group: "fractional_coins",
    unit: "تومان",
    description: "سکه رسمی یک گرمی ضرب بانک مرکزی جمهوری اسلامی ایران.",
  },
  {
    symbol: "XAUUSD",
    name: "انس جهانی طلا",
    name_en: "Gold Spot Ounce",
    category: "gold_coin",
    sub_group: "fractional_coins",
    unit: "دلار",
    description: "نرخ شاخص جهانی هر تروی انس طلای خالص ۲۴ عیار (۳۱.۱۰۳۵ گرم).",
  },

  // Foreign Currencies (ارزهای شاخص)
  {
    symbol: "USD",
    name: "دلار آمریکا (آزاد)",
    name_en: "US Dollar",
    category: "currency",
    sub_group: "major_fx",
    unit: "تومان",
    description: "اسکناس دلار نقدی بازار غیربانکی تهران.",
  },
  {
    symbol: "AED",
    name: "درهم امارات متحده",
    name_en: "UAE Dirham",
    category: "currency",
    sub_group: "major_fx",
    unit: "تومان",
    description: "حواله و اسکناس درهم دبی، پایه اصلی تسویه بازرگانی ایران.",
    formula: "برابری درهم به دلار با ضریب پیوند ثابت ۳.۶۷۲۵",
  },
  {
    symbol: "EUR",
    name: "یورو اروپا",
    name_en: "Euro",
    category: "currency",
    sub_group: "major_fx",
    unit: "تومان",
    description: "اسکناس رسمی حوزه اقتصادی اروپا.",
  },
  {
    symbol: "CNY",
    name: "یوان چین",
    name_en: "Chinese Yuan",
    category: "currency",
    sub_group: "major_fx",
    unit: "تومان",
    description: "اسکناس و حواله رنمینبی جمهوری خلق چین.",
  },
  {
    symbol: "GBP",
    name: "پوند بریتانیا",
    name_en: "British Pound",
    category: "currency",
    sub_group: "global_fx",
    unit: "تومان",
    description: "اسکناس پوند استرلینگ بریتانیا.",
  },
  {
    symbol: "CHF",
    name: "فرانک سوئیس",
    name_en: "Swiss Franc",
    category: "currency",
    sub_group: "global_fx",
    unit: "تومان",
    description: "اسکناس رسمی کشور سوئیس، پناهگاه امن سرمایه.",
  },
  {
    symbol: "CAD",
    name: "دلار کانادا",
    name_en: "Canadian Dollar",
    category: "currency",
    sub_group: "global_fx",
    unit: "تومان",
    description: "اسکناس دلار کانادا.",
  },
  {
    symbol: "TRY",
    name: "لیر ترکیه",
    name_en: "Turkish Lira",
    category: "currency",
    sub_group: "regional_fx",
    unit: "تومان",
    description: "اسکناس لیر ترکیه.",
  },
  {
    symbol: "IQD",
    name: "۱۰۰ دینار عراق",
    name_en: "100 Iraqi Dinar",
    category: "currency",
    sub_group: "regional_fx",
    unit: "تومان",
    description: "اسکناس ۱۰۰ دینار عراق، شاخص سفرهای زیارتی و مبادلات مرزی.",
  },
  {
    symbol: "SAR",
    name: "ریال عربستان",
    name_en: "Saudi Riyal",
    category: "currency",
    sub_group: "regional_fx",
    unit: "تومان",
    description: "اسکناس رسمی پادشاهی عربستان سعودی.",
  },

  // Stock Market & Equities (بورس و سهام)
  {
    symbol: "TEDPIX",
    name: "شاخص کل بورس تهران",
    name_en: "Tehran Stock Exchange Index",
    category: "stock",
    sub_group: "market_indices",
    unit: "واحد",
    description: "شاخص کل بازده نقدی و قیمت بورس اوراق بهادار تهران.",
  },
  {
    symbol: "TEPIX_EW",
    name: "شاخص کل هم‌وزن",
    name_en: "TSE Equal-Weight Index",
    category: "stock",
    sub_group: "market_indices",
    unit: "واحد",
    description: "شاخص هم‌وزن قیمت و بازده نقدی بورس تهران بدون احتساب وزن مارکت کپ.",
  },
  {
    symbol: "IFX",
    name: "شاخص کل فرابورس ایران",
    name_en: "Farabourse Total Index",
    category: "stock",
    sub_group: "market_indices",
    unit: "واحد",
    description: "شاخص کل فرابورس ایران نمایانگر وضعیت عمومی شرکت‌های فرابورسی.",
  },
  {
    symbol: "FOULAD",
    name: "فولاد مبارکه اصفهان",
    name_en: "Mobarakeh Steel Co.",
    category: "stock",
    sub_group: "metals_mining",
    unit: "ریال",
    description: "بزرگترین مجتمع فولادسازی کشور و از نمادهای تاثیرگذار بازار سرمایه.",
  },
  {
    symbol: "FAMILI",
    name: "ملی صنایع مس ایران",
    name_en: "National Iranian Copper (NICICO)",
    category: "stock",
    sub_group: "metals_mining",
    unit: "ریال",
    description: "شرکت ملی صنایع مس ایران، از بزرگترین تولیدکنندگان مس خاورمیانه.",
  },
  {
    symbol: "SHASTA",
    name: "سرمایه‌گذاری تامین اجتماعی",
    name_en: "Social Security Inv. (SSIC)",
    category: "stock",
    sub_group: "petro_holdings",
    unit: "ریال",
    description: "بزرگ‌ترین هلدینگ سرمایه‌گذاری چندرشته‌ای صنعتی کشور.",
  },
  {
    symbol: "FARS",
    name: "صنایع پتروشیمی خلیج فارس",
    name_en: "PGPIC Petrochemical Giant",
    category: "stock",
    sub_group: "petro_holdings",
    unit: "ریال",
    description: "بزرگ‌ترین هلدینگ پتروشیمی کشور و دارنده بالاترین ارزش بازار بورس.",
  },
  {
    symbol: "WEBMELAT",
    name: "بانک ملت",
    name_en: "Bank Mellat",
    category: "stock",
    sub_group: "petro_holdings",
    unit: "ریال",
    description: "از بزرگ‌ترین و نقدشونده‌ترین نمادهای بانکی و مالی بورس تهران.",
  },

  // Cryptocurrencies (رمزارزها)
  {
    symbol: "BTC",
    name: "بیت‌کوین",
    name_en: "Bitcoin",
    category: "crypto",
    sub_group: "l1_crypto",
    unit: "دلار",
    description: "نخستین دارایی رمزنگاری‌شده غیرمتمرکز جهان با سقف عرضه ۲۱ میلیون واحد.",
  },
  {
    symbol: "ETH",
    name: "اتریوم",
    name_en: "Ethereum",
    category: "crypto",
    sub_group: "l1_crypto",
    unit: "دلار",
    description: "بستر محاسباتی قراردادهای هوشمند و امور مالی غیرمتمرکز (DeFi).",
  },
  {
    symbol: "SOL",
    name: "سولانا",
    name_en: "Solana",
    category: "crypto",
    sub_group: "l1_crypto",
    unit: "دلار",
    description: "بلاکچین لایه اول پرسرعت برای برنامه‌های غیرمتمرکز مالی.",
  },
  {
    symbol: "USDT",
    name: "تتر (استیبل‌کوین)",
    name_en: "Tether USD",
    category: "crypto",
    sub_group: "stablecoins",
    unit: "دلار",
    description: "استیبل‌کوین متصل به برابری یک به یک با دلار آمریکا.",
  },
  {
    symbol: "USDC",
    name: "یو‌اس‌دی کوین",
    name_en: "USD Coin",
    category: "crypto",
    sub_group: "stablecoins",
    unit: "دلار",
    description: "استیبل‌کوین با پشتوانه نقدی کامل و تحت نظارت ارزی سیرکل.",
  },
  {
    symbol: "BNB",
    name: "بایننس کوین",
    name_en: "BNB Chain",
    category: "crypto",
    sub_group: "altcoins",
    unit: "دلار",
    description: "توکن بومی زنجیره بایننس و صرافی بین‌المللی بایننس.",
  },
  {
    symbol: "TON",
    name: "تون‌کوین",
    name_en: "Toncoin",
    category: "crypto",
    sub_group: "altcoins",
    unit: "دلار",
    description: "رمز ارز اکوسیستم باز تلگرام با یکپارچگی پرداخت درون برنامه‌ای.",
  },
  {
    symbol: "XRP",
    name: "ریپل",
    name_en: "Ripple XRP",
    category: "crypto",
    sub_group: "altcoins",
    unit: "دلار",
    description: "دارایی دیجیتال شبکه تسویه بین‌بانکی ریپل نت.",
  },

  // Commodities & Metals (فلزات و کالاها)
  {
    symbol: "BRENT",
    name: "نفت خام برنت دریای شمال",
    name_en: "Brent Crude Oil",
    category: "commodity",
    sub_group: "energy",
    unit: "دلار",
    description: "شاخص مرجع بین‌المللی قیمت نفت خام سبک و شیرین.",
  },
  {
    symbol: "WTI",
    name: "نفت خام وست تگزاس",
    name_en: "WTI Crude Oil",
    category: "commodity",
    sub_group: "energy",
    unit: "دلار",
    description: "شاخص نفت سبک آمریکا در بورس کالای نیویورک.",
  },
  {
    symbol: "XAGUSD",
    name: "نقره جهانی",
    name_en: "Silver Spot",
    category: "commodity",
    sub_group: "precious_metals",
    unit: "دلار",
    description: "نرخ هر انس نقره خالص جهانی در بازارهای بین‌المللی.",
  },
  {
    symbol: "CU",
    name: "مس جهانی (کاتد)",
    name_en: "Copper Spot",
    category: "commodity",
    sub_group: "industrial_metals",
    unit: "دلار",
    description: "فلز صنعتی مس بورس فلزات لندن (LME).",
  },
];

/**
 * Fallback values lookup dictionary indexed by symbol (Metadata only, zero hardcoded prices).
 */
export const INSTRUMENT_FALLBACKS: Record<string, InstrumentMetadata> =
  SUPPORTED_INSTRUMENTS.reduce(
    (acc, inst) => {
      acc[inst.symbol] = inst;
      return acc;
    },
    {} as Record<string, InstrumentMetadata>,
  );

/**
 * Returns an initial structure with metadata and 'unavailable' state
 * when no live or cached quotes have yet been fetched from the API.
 * Never invents fake numbers for the API contract test.
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
    change_value: null,
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
    stocks: quotes.filter((q) => q.category === "stock"),
  };
}
