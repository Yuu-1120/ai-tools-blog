import { Tool } from './tool';

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  intro_markdown: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CategoryWithTools extends Category {
  tools: Tool[];
}

export interface CreateCategoryInput {
  name: string;
  slug: string;
  icon: string;
  description?: string;
  intro_markdown?: string;
  sort_order?: number;
}

export interface UpdateCategoryInput extends Partial<CreateCategoryInput> {}
