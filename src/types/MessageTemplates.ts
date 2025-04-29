export interface MessageTemplate {
  Id: string;
  Name: string;
  CourseId: string;
  Title: string;
  Body: string;
  FlowStep: string;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string;
  SendAutomatically: boolean;
}
