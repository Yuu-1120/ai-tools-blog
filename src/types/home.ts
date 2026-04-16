import { Category } from './category';
import { Tool } from './tool';

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
  tools: Tool[];
}
