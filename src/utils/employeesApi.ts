// API functions for Employee entity
import { api, formatResponseData } from './api';

const basePath = '/api/Users';

// تعريف الحقول المتوقعة في الاستجابة
const employeeFields = [
  'id',
  'email',
  'name',
  'phone',
  'address',
  'nationalId',
  'cityName',
  'department',
  'salary',
  'salaryTypeId',
  'salaryTypeName',
  'jobTitle',
];

export async function createEmployee(data: any) {
  const response = await api.post(basePath, data);
  return formatResponseData(response.data, employeeFields);
}

export async function updateEmployee(id: number, data: any) {
  const response = await api.put(`${basePath}/${id}`, data);
  return formatResponseData(response.data, employeeFields);
}

export async function deleteEmployee(id: number) {
  const response = await api.delete(`${basePath}/${id}`);
  return response.status === 200;
}

export async function restoreEmployee(id: number) {
  const response = await api.put(`${basePath}/restore/${id}`);
  return response.status === 200;
}

export async function getEmployee(id: number) {
  const response = await api.get(`${basePath}/${id}`);
  return formatResponseData(response.data, employeeFields);
}

export async function getEmployeesPagination(params: Record<string, any> = {}) {
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
  return formatResponseData(response.data, employeeFields);
} 