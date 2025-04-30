export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface CategoryCreateInput {
  name: string;
  description: string;
}
