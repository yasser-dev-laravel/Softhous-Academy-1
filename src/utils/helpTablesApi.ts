// API functions for HelpTables
import { api, formatResponseData } from './api';

const basePath = '/api/HelpTables';

// تعريف الحقول المتوقعة في الاستجابة
const areaFields = [
  'Id',
  'Name',
  'CreatedAt',
  'UpdatedAt',
  'DeletedAt'
];

export async function getAreas() {
  const response = await api.get(`${basePath}/Area`);
  return formatResponseData(response.data, areaFields);
}

export async function createArea(data: any) {
  const response = await api.post(`${basePath}/Area`, data);
  return formatResponseData(response.data, areaFields);
}

export async function updateArea(id: number, data: any) {
  const response = await api.put(`${basePath}/Area/${id}`, data);
  return formatResponseData(response.data, areaFields);
}

export async function deleteArea(id: number) {
  const response = await api.delete(`${basePath}/Area/${id}`);
  return response.status === 200;
}

export async function restoreArea(id: number) {
  const response = await api.put(`${basePath}/Area/restore/${id}`);
  return response.status === 200;
}

export async function getArea(id: number) {
  const response = await api.get(`${basePath}/Area/${id}`);
  return formatResponseData(response.data, areaFields);
}

export async function getAreasPagination(params: Record<string, any> = {}) {
  const standardParams = {
    Page: params.Page || 1,
    Limit: params.Limit || 100,
    SortField: params.SortField || 'Name',
    IsDesc: params.IsDesc || false,
    FreeText: params.FreeText || '',
    OnlyDeleted: params.OnlyDeleted || false,
    ...params
  };

  const response = await api.get(`${basePath}/Area/pagination`, { params: standardParams });
  return formatResponseData(response.data, areaFields);
} 