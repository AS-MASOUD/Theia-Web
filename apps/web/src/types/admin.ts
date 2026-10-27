export type AdminRole = "admin" | "editor" | "trader";

export interface AdminUser {
  id: number;
  email: string;
  fullName: string;
  role: AdminRole;
  avatarUrl?: string | null;
  bio?: string | null;
  isActive?: boolean;
  createdAt?: string;
  lastLoginAt?: string | null;
}

export interface AdminDashboardStats {
  totalArticles: number;
  totalBlogs: number;
  totalNews: number;
  totalSignals: number;
  totalComments: number;
  totalStaff: number;
  totalTraders: number;
}

export interface CommentItem {
  id: number;
  articleId?: number;
  articleTitle?: string;
  articleSlug?: string;
  userName: string;
  userEmail: string;
  content: string;
  isApproved: boolean;
  createdAt: string;
}

export interface AdminArticleItem {
  id: number;
  slug: string;
  title: string;
  summary: string;
  content?: string;
  articleType: "blog" | "news";
  coverImage?: string | null;
  tags?: string | null;
  readingTime?: string;
  authorName?: string;
  authorRole?: string;
  isPublished: boolean;
  viewsCount?: number;
  publishedAt?: string;
  categoryId?: number | null;
  categoryName?: string | null;
}
