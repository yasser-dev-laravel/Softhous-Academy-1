// واجهة خاصة بإدخال أو تعديل الخزنة في الشاشات
export interface SafeInput {
  Id: string;
  Name: string;
  Type: string;
  OwnerEmployeeId: string;
}

export interface Safe {
  Id: string;
  Name: string;
  Type: string;
  OwnerEmployeeId: string;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string;
}
