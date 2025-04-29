export interface Lab {
  Id: string;
  Code: string;
  Name: string;
  Location: string;
  Capacity: number;
  Type: "computer" | "language" | "general";
  BranchId: string;
}

// واجهة خاصة بإدخال أو تعديل المعمل في الشاشات
export interface LabInput {
  Code: string;
  Name: string;
  Location: string;
  Capacity: number;
  Type: "computer" | "language" | "general";
  BranchId: string;
}
