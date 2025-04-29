export interface Payment {
  Id: string;
  StudentId: string;
  GroupId: string;
  Amount: number;
  Date: string;
  Status: 'paid' | 'pending' | 'refund';
  Note?: string;
  Branch?: string;
  EmployeeId?: string;
  GroupLevelAmount?: number;
  PreviouslyPaid?: number;
  Remaining?: number;
}
