import { MarketRatesResponse } from "@/types/market";
import { InsightArticle, Category } from "@/types/insights";
import { ContactSubmissionPayload, ContactSubmissionResponse } from "@/types/contact";

function getApiBase(): string {
  const isServer = typeof window === "undefined";
  if (!isServer) {
    if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, "");
    }
    return window.location.origin;
  }
  return (process.env.INTERNAL_API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8082").replace(/\/+$/, "");
}

const API_BASE = getApiBase();

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}/api/v1${endpoint}`;
  const res = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string>),
    },
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => ({ message: res.statusText }));
    throw new Error(errorBody.message || `Request failed with status ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export const webApi = {
  // Public Market Data Adapter
  getMarketRates: async (): Promise<MarketRatesResponse> => {
    try {
      return await request<MarketRatesResponse>("/public/market/rates");
    } catch {
      return {
        gold_and_coins: [],
        commodities: [],
        currencies: [],
        cryptocurrency: [],
        usd_toman_rate: null,
        last_sync_time: null,
        sync_source: "theia_cache",
        status: "unavailable",
      };
    }
  },

  // Insights / Articles
  getArticles: async (category?: string, search?: string): Promise<InsightArticle[]> => {
    try {
      const query = new URLSearchParams();
      if (category) query.append("category", category);
      if (search) query.append("search", search);
      const qs = query.toString();
      return await request<InsightArticle[]>(`/articles${qs ? `?${qs}` : ""}`);
    } catch {
      return [];
    }
  },

  getArticleBySlug: async (slug: string): Promise<InsightArticle | null> => {
    try {
      return await request<InsightArticle>(`/articles/${encodeURIComponent(slug)}`);
    } catch {
      return null;
    }
  },

  getCategories: async (): Promise<Category[]> => {
    try {
      return await request<Category[]>("/categories");
    } catch {
      return [];
    }
  },

  // Contact Form
  submitContact: async (payload: ContactSubmissionPayload): Promise<ContactSubmissionResponse> => {
    return await request<ContactSubmissionResponse>("/contact", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // FAQ & Releases
  getFaq: async (): Promise<Array<{ id: string; question: string; answer: string; category: string }>> => {
    try {
      return await request<Array<{ id: string; question: string; answer: string; category: string }>>("/faq");
    } catch {
      return [];
    }
  },

  getReleases: async (): Promise<Array<{ id: string; version: string; releaseDate: string; title: string; changes: string[] }>> => {
    try {
      return await request<Array<{ id: string; version: string; releaseDate: string; title: string; changes: string[] }>>("/releases");
    } catch {
      return [];
    }
  },
};
