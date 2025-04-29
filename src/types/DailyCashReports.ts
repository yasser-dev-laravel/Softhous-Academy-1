export interface DailyCashReport {
  Id: string;
  ReportDate: string;
  TotalCollected: number;
  TotalExpenses: number;
  NetBalance: number;
  GeneratedById: string;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string;
}
