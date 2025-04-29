export interface Course {
  Id: string;
  Name: string;
  Description: string;
  IsActive: boolean;
  CategoryId: string;
  ApplicationId: string;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string;
}

// واجهة خاصة بإدخال أو تعديل الكورس في الشاشات بناءً على CreateCourseDto و UpdateCourseDto
export interface CourseInput {
  Name: string;
  Description: string;
  IsActive: boolean;
  CategoryId: string;
  ApplicationId: string;
}
