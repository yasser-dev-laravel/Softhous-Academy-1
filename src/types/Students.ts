import { StudentGroupEnrollment } from "./StudentGroupEnrollment";

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  areaId: number;
  birthdate: string;
  applicationId: number;
  educationalQualificationDescriptionId: number;
  educationalQualificationTypeId: number;
  educationalQualificationIssuerId: number;
  sourceId: number;
  sourceName: string;
  groups?: StudentGroupEnrollment[];
}
