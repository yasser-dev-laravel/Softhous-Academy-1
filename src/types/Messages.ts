export interface Message {
  Id: string;
  StudentId: string;
  MessageTemplateId: string;
  IsSent: boolean;
  PhoneNumber: string;
  SentAt: string;
  Error?: string;
  RetryCount: number;
  NextAttempt: string;
  Body: string;
}
