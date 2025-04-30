// واجهة خاصة بإدخال أو تعديل الغرفة في الشاشات
export interface RoomInput {
  id: number;
  name: string;
  type: string;
  capacity: number;
  branchId: number;
  branchName: string;
}

export interface Room {
  id: number;
  name: string;
  type: string;
  capacity: number;
  branchId: number;
  branchName: string;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string;
}

export interface RoomCreateInput {
  name: string;
  type: string;
  capacity: number;
  branchId: number;
  branchName: string;
}
