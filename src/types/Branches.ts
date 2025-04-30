// واجهة خاصة بإدخال أو تعديل الفرع في الشاشات
export interface BranchCreateInput {
  Name: string;
  Address: string;
  AreaId: string;
}

export interface Branch {
  Id: string;
  Name: string;
  Code: string;
  Address: string;
  AreaId: string;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string;
}
