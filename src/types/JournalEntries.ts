export interface JournalEntry {
  Id: string;
  Date: string;
  Description: string;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string;
  ReferenceId: string;
  ReferenceType: string;
}
