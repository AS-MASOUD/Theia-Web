export interface Author {
  name: string;
  role: string;
  avatarUrl?: string;
  bio?: string;
}

export interface InsightArticle {
  id?: string;
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  categoryLabel: string;
  publishedAt: string;
  readTimeMinutes: number;
  author: Author;
  featured?: boolean;
  content: string[];
  keyTakeaways: string[];
  seoTitle?: string;
  seoDescription?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description?: string;
  displayOrder: number;
}
