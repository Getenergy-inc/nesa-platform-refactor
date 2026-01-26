import { api } from "./http";

export interface ContentPage {
  id: string;
  slug: string;
  title: string;
  content: string | null;
  metadata: Record<string, unknown>;
  is_published: boolean;
  author_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

export interface PressArticle {
  id: string;
  slug: string;
  title: string;
  content: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

// Get a single content page by slug
export async function getPage(slug: string) {
  return api.get<{ page: ContentPage }>("content", `/pages/${slug}`);
}

// Get all content pages (admin sees all, public sees published)
export async function getPages() {
  return api.get<{ pages: ContentPage[] }>("content", "/pages");
}

// Create a new content page (admin only)
export async function createPage(data: {
  slug: string;
  title: string;
  content?: string;
  metadata?: Record<string, unknown>;
  is_published?: boolean;
}) {
  return api.post<{ page: ContentPage }>("content", "/pages", data);
}

// Update a content page (admin only)
export async function updatePage(
  slug: string,
  data: Partial<{
    title: string;
    content: string;
    metadata: Record<string, unknown>;
    is_published: boolean;
  }>
) {
  return api.put<{ page: ContentPage }>("content", `/pages/${slug}`, data);
}

// Get FAQs, optionally filtered by category
export async function getFaqs(category?: string) {
  return api.get<{ faqs: FAQ[] }>("content", "/faqs", category ? { category } : undefined);
}

// Create a new FAQ (admin only)
export async function createFaq(data: {
  question: string;
  answer: string;
  category?: string;
  display_order?: number;
}) {
  return api.post<{ faq: FAQ }>("content", "/faqs", data);
}

// Get press articles
export async function getPress() {
  return api.get<{ articles: PressArticle[] }>("content", "/press");
}
