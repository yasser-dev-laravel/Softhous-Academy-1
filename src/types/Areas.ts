// واجهة خاصة بإدخال أو تعديل المنطقة في الشاشات بناءً على CreateAreaDto و UpdateAreaDto
export interface AreaInput {
  Name: string;
  CityId: string;
}

export interface Area {
  Id: string;
  Name: string;
  CityId: string;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt?: string;
}
