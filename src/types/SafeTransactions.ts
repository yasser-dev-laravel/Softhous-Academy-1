export interface SafeTransaction {
  Id: string;
  FromSafeId: string;
  ToSafeId: string;
  Amount: number;
  TransactionDate: string;
  TransactionType: string;
  ReferenceType: string;
  ReferenceId: string;
  Description: string;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string;
}
