// واجهة خاصة بإدخال أو تعديل الحساب في الشاشات
export interface AccountInput {
  Id: string;
  Code: string;
  Name: string;
  Category: string;
}

export interface Account {
  Id: string;
  Code: string;
  Name: string;
  Category: string;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string;
}
