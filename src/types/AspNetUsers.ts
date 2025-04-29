export interface AspNetUser {
  Id: string;
  Name: string;
  Phone: string;
  Address: string;
  NationalId: string;
  CityId: string;
  Education: string;
  Image: string;
  UserName: string;
  NormalizedUserName: string;
  Email: string;
  NormalizedEmail: string;
  EmailConfirmed: boolean;
  PasswordHash: string;
  SecurityStamp: string;
  ConcurrencyStamp: string;
  PhoneNumber: string;
  PhoneNumberConfirmed: boolean;
  TwoFactorEnabled: boolean;
  LockoutEnd: string | null;
  LockoutEnabled: boolean;
  AccessFailedCount: number;
  EmployeeProfileId?: string;
  InstructorProfileId?: string;
}
