import { MarketRatesResponse } from "@/types/market";
import { InsightArticle, Category } from "@/types/insights";
import { ContactSubmissionPayload, ContactSubmissionResponse } from "@/types/contact";
import { MarketSignal, CreateSignalInput } from "@/types/market-signals";
import {
  AdminUser,
  AdminDashboardStats,
  CommentItem,
  AdminArticleItem,
  AdminRole,
} from "@/types/admin";

function getApiBase(): string {
  const isServer = typeof window === "undefined";
  if (!isServer) {
    if (process.env.NEXT_PUBLIC_API_URL) {
      return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, "");
    }
    // Default to port 4000 where Theia Website API runs in development
    return "http://localhost:4000";
  }
  return (
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:4000"
  ).replace(/\/+$/, "");
}

const API_BASE = getApiBase();

function getAuthHeader(): Record<string, string> {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("theia_admin_token");
    if (token) {
      return { Authorization: `Bearer ${token}` };
    }
  }
  return {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}/api/v1${endpoint}`;
  const res = await fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
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
  // Public Market Data
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

  // Public Insights / Articles
  getArticles: async (
    category?: string,
    search?: string,
    type?: "blog" | "news",
  ): Promise<any[]> => {
    try {
      const query = new URLSearchParams();
      if (category && category !== "all") query.append("category", category);
      if (search) query.append("search", search);
      if (type) query.append("type", type);
      const qs = query.toString();
      const res = await request<{ items: any[] }>(`/public/articles${qs ? `?${qs}` : ""}`);
      return res.items || [];
    } catch {
      return [];
    }
  },

  getArticleBySlug: async (slug: string): Promise<any | null> => {
    try {
      return await request<any>(`/public/articles/${encodeURIComponent(slug)}`);
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

  // Public Comments on Articles
  getArticleComments: async (slug: string): Promise<CommentItem[]> => {
    try {
      return await request<CommentItem[]>(`/public/articles/${encodeURIComponent(slug)}/comments`);
    } catch {
      return [];
    }
  },

  submitArticleComment: async (
    slug: string,
    payload: { userName: string; userEmail: string; content: string },
  ): Promise<any> => {
    return await request<any>(`/public/articles/${encodeURIComponent(slug)}/comments`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  // Public Daily Signals & Chart Analyses
  getSignals: async (category?: string, symbol?: string): Promise<MarketSignal[]> => {
    try {
      const query = new URLSearchParams();
      if (category && category !== "all") query.append("category", category);
      if (symbol) query.append("symbol", symbol);
      const qs = query.toString();
      return await request<MarketSignal[]>(`/public/signals${qs ? `?${qs}` : ""}`);
    } catch {
      return [];
    }
  },

  getSignalById: async (id: number): Promise<MarketSignal | null> => {
    try {
      return await request<MarketSignal>(`/public/signals/${id}`);
    } catch {
      return null;
    }
  },

  // Public Contact Form
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

  // --- ADMIN & TRADER API METHODS ---

  // Auth
  adminLogin: async (email: string, password: string): Promise<{ token: string; user: AdminUser }> => {
    const res = await request<{ token: string; user: AdminUser }>("/admin/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
    if (res?.token && typeof window !== "undefined") {
      localStorage.setItem("theia_admin_token", res.token);
      localStorage.setItem("theia_admin_user", JSON.stringify(res.user));
    }
    return res;
  },

  adminLogout: async (): Promise<void> => {
    try {
      await request("/admin/auth/logout", { method: "POST" });
    } finally {
      if (typeof window !== "undefined") {
        localStorage.removeItem("theia_admin_token");
        localStorage.removeItem("theia_admin_user");
      }
    }
  },

  adminGetMe: async (): Promise<AdminUser> => {
    return await request<AdminUser>("/admin/auth/me");
  },

  adminGetStats: async (): Promise<AdminDashboardStats> => {
    return await request<AdminDashboardStats>("/admin/stats");
  },

  // Staff & Role Management (Admin only)
  getStaffUsers: async (): Promise<AdminUser[]> => {
    return await request<AdminUser[]>("/admin/users");
  },

  createStaffUser: async (data: {
    fullName: string;
    email: string;
    password: string;
    role: AdminRole;
    bio?: string;
  }): Promise<AdminUser> => {
    return await request<AdminUser>("/admin/users", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateStaffUser: async (
    id: number,
    data: {
      fullName?: string;
      role?: AdminRole;
      bio?: string;
      isActive?: boolean;
      password?: string;
    },
  ): Promise<AdminUser> => {
    return await request<AdminUser>(`/admin/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteStaffUser: async (id: number): Promise<{ success: boolean; message: string }> => {
    return await request<{ success: boolean; message: string }>(`/admin/users/${id}`, {
      method: "DELETE",
    });
  },

  // Admin Articles & News CRUD (Admin, Editor)
  getAdminArticles: async (type?: "blog" | "news", page = 1): Promise<{ items: AdminArticleItem[]; total: number }> => {
    const query = new URLSearchParams();
    if (type) query.append("type", type);
    query.append("page", String(page));
    const qs = query.toString();
    return await request<{ items: AdminArticleItem[]; total: number }>(`/admin/articles?${qs}`);
  },

  getAdminArticleById: async (id: number): Promise<AdminArticleItem> => {
    return await request<AdminArticleItem>(`/admin/articles/${id}`);
  },

  createArticle: async (data: {
    title: string;
    slug: string;
    summary: string;
    content: string;
    articleType: "blog" | "news";
    coverImage?: string;
    tags?: string;
    readingTime?: string;
    authorName?: string;
    authorRole?: string;
    categoryId?: number;
    isPublished?: boolean;
  }): Promise<any> => {
    return await request<any>("/admin/articles", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateArticle: async (id: number, data: Partial<AdminArticleItem>): Promise<any> => {
    return await request<any>(`/admin/articles/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteArticle: async (id: number): Promise<any> => {
    return await request<any>(`/admin/articles/${id}`, {
      method: "DELETE",
    });
  },

  uploadImage: async (dataUrl: string, filename?: string): Promise<{ success: boolean; url: string; filename: string }> => {
    return await request<{ success: boolean; url: string; filename: string }>("/admin/upload", {
      method: "POST",
      body: JSON.stringify({ dataUrl, filename }),
    });
  },

  // Admin Comments Moderation
  getAdminComments: async (page = 1): Promise<CommentItem[]> => {
    return await request<CommentItem[]>(`/admin/comments?page=${page}`);
  },

  updateCommentStatus: async (id: number, isApproved: boolean): Promise<any> => {
    return await request<any>(`/admin/comments/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ isApproved }),
    });
  },

  deleteComment: async (id: number): Promise<any> => {
    return await request<any>(`/admin/comments/${id}`, {
      method: "DELETE",
    });
  },

  // Admin & Trader Market Signals
  getAdminSignals: async (page = 1): Promise<MarketSignal[]> => {
    return await request<MarketSignal[]>(`/admin/signals?page=${page}`);
  },

  getAdminSignalById: async (id: number): Promise<MarketSignal> => {
    return await request<MarketSignal>(`/admin/signals/${id}`);
  },

  createSignal: async (data: CreateSignalInput): Promise<MarketSignal> => {
    return await request<MarketSignal>("/admin/signals", {
      method: "POST",
      body: JSON.stringify(data),
    });
  },

  updateSignal: async (id: number, data: Partial<CreateSignalInput>): Promise<MarketSignal> => {
    return await request<MarketSignal>(`/admin/signals/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  deleteSignal: async (id: number): Promise<{ success: boolean; message: string }> => {
    return await request<{ success: boolean; message: string }>(`/admin/signals/${id}`, {
      method: "DELETE",
    });
  },
};
