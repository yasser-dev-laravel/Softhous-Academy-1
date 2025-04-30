// واجهة خاصة بإدخال أو تعديل التصنيف في الشاشات
export interface CategoryInput {
  name: string;
  description: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface CategoryCreateInput {
  name: string;
  description: string;
}
