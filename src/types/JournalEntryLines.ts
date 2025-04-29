export interface JournalEntryLine {
  Id: string;
  JournalEntryId: string;
  AccountId: string;
  Debit: number;
  Credit: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string;
}
