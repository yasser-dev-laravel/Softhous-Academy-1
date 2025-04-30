// API functions for Course entity
import { api, formatResponseData } from './api';

const basePath = '/api/Courses';

// تعريف الحقول المتوقعة في الاستجابة
const courseFields = [
  'id',
  'name',
  'description',
  'isActive',
  'categoryId',
  'categoryName',
  'applicationId',
  'levels',
 
  'total',
];

export async function createCourse(data: any) {
  const response = await api.post(basePath, data);
  return formatResponseData(response.data, courseFields);
}

export async function updateCourse(id: number, data: any) {
  const response = await api.put(`${basePath}/${id}`, data);
  return formatResponseData(response.data, courseFields);
}

export async function deleteCourse(id: number) {
  const response = await api.delete(`${basePath}/${id}`);
  return response.status === 200;
}

export async function restoreCourse(id: number) {
  const response = await api.put(`${basePath}/restore/${id}`);
  return response.status === 200;
}

export async function getCourse(id: number) {
  const response = await api.get(`${basePath}/${id}`);
  return formatResponseData(response.data, courseFields);
}

export async function getCoursesPagination(params: Record<string, any> = {}) {
  const standardParams = {
    Page: params.Page || 1,
    Limit: params.Limit || 100,
    SortField: params.SortField || 'Name',
    IsDesc: params.IsDesc || false,
    FreeText: params.FreeText || '',
    OnlyDeleted: params.OnlyDeleted || false,
    ...params
  };

  const response = await api.get(`${basePath}/pagination`, { params: standardParams });
  return formatResponseData(response.data, courseFields);
} 