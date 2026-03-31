export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  bg_color: string;
  sort_order: number;
}

export interface Tool {
  id: string;
  name: string;
  slug: string;
  description: string;
  category_slug: string;
  users: string;
  tags: string[];
  featured: boolean;
  website_url: string | null;
  icon_url: string | null;
}

export interface ProcessStep {
  id: string;
  step: string;
  title: string;
  description: string;
  tools: string[];
  sort_order: number;
}

export interface HomeData {
  categories: Category[];
  featuredTools: Tool[];
  processSteps: ProcessStep[];
}
