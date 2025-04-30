export interface Lab {
  id: number;
  name: string;
  type: string;
  capacity: number;
  branchId: number;
  branchName: string;
}

export interface LabCreateInput {
  name: string;
  type: string;
  capacity: number;
  branchId: number;
  branchName: string;
}

// واجهة خاصة بإدخال أو تعديل المعمل في الشاشات
export interface LabInput {
  name: string;
  type: string;
  capacity: number;
  branchId: number;
  branchName: string;
}
