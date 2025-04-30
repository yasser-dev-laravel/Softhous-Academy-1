// API functions for Department entity based on Swagger (OpenAPI)
// يمكنك تعديل baseURL حسب بيئة السيرفر

import { api, formatResponseData } from './api';

const basePath = '/api/Departments';

// تعريف الحقول المتوقعة في الاستجابة
const departmentFields = [
  'Id',
  'Name',
  'Description',
  'CreatedAt',
  'UpdatedAt',
  'DeletedAt'
];

export async function createDepartment(data: any) {
  try {
    // تنسيق البيانات المرسلة
    const formattedData = {
      name: data.Name,
      code: data.Code,
      branchId: data.BranchId
    };
    
    console.log("Creating department with formatted data:", formattedData);
    const response = await api.post(basePath, formattedData);
    console.log("Department creation response:", response);
    return formatResponseData(response.data, departmentFields);
  } catch (error) {
    console.error("Error creating department:", error);
    throw error;
  }
}

export async function updateDepartment(id: number, data: any) {
  const response = await api.put(`${basePath}/${id}`, data);
  return formatResponseData(response.data, departmentFields);
}

export async function deleteDepartment(id: number) {
  const response = await api.delete(`${basePath}/${id}`);
  return response.status === 200;
}

export async function restoreDepartment(id: number) {
  const response = await api.put(`${basePath}/restore/${id}`);
  return response.status === 200;
}

export async function getDepartment(id: number) {
  const response = await api.get(`${basePath}/${id}`);
  return formatResponseData(response.data, departmentFields);
}

export async function getDepartmentsPagination(params: Record<string, any> = {}) {
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
  return formatResponseData(response.data, departmentFields);
} 