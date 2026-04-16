export interface Tool {
  id: string;
  category_id: string;
  name: string;
  logo_url: string;
  description: string;
  website_url: string;
  pricing: 'free' | 'freemium' | 'paid';
  tags: string[];
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ToolWithCategory extends Tool {
  category?: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface CreateToolInput {
  category_id: string;
  name: string;
  logo_url?: string;
  description?: string;
  website_url: string;
  pricing?: 'free' | 'freemium' | 'paid';
  tags?: string[];
  sort_order?: number;
}

export interface UpdateToolInput extends Partial<CreateToolInput> {}
