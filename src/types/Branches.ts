// واجهة خاصة بإدخال أو تعديل الفرع في الشاشات
export interface BranchInput {
  Id: string;
  Name: string;
  Address: string;
  AreaId: string;
}

export interface Branch {
  Id: string;
  Name: string;
  Address: string;
  AreaId: string;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string;
}
