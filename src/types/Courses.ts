import { CourseLevel } from "./CourseLevels";

export interface Course {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  categoryId: string;
  categoryName?: string;
  applicationId: string;
  levels: CourseLevel[];
  total?: number;
}

// واجهة خاصة بإدخال أو تعديل الكورس في الشاشات بناءً على CreateCourseDto و UpdateCourseDto
export interface CourseInput {
  Name: string;
  Description: string;
  IsActive: boolean;
  CategoryId: string;
  ApplicationId: string;
}
