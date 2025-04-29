// واجهة خاصة بإدخال أو تعديل الغرفة في الشاشات
export interface RoomInput {
  Id: string;
  Name: string;
  Type: string;
  Capacity: number;
  BranchId: string;
}

export interface Room {
  Id: string;
  Name: string;
  Type: string;
  Capacity: number;
  BranchId: string;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string;
}
