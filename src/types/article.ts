export interface Article {
  id: string;
  title: string;
  slug: string;
  cover_image: string;
  excerpt: string;
  content_markdown: string;
  tags: string[];
  status: 'draft' | 'published';
  featured: boolean;
  author_id: string;
  created_at: string;
  updated_at: string;
}

export interface ArticleWithAuthor extends Article {
  author?: {
    id: string;
    email: string;
  };
}

export interface CreateArticleInput {
  title: string;
  slug: string;
  cover_image?: string;
  excerpt?: string;
  content_markdown: string;
  tags?: string[];
  status?: 'draft' | 'published';
  featured?: boolean;
}

export interface UpdateArticleInput extends Partial<CreateArticleInput> {}
