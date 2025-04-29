export interface CourseEnrollment {
  Id: string;
  StudentId: string;
  CourseId: string;
  LevelId: string;
  EnrollmentDate: string;
  TotalFee: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string;
}
