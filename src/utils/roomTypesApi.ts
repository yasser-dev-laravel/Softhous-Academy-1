// API functions for RoomType entity
import { api, formatResponseData } from './api';

const basePath = '/api/HelpTables/RoomType';

// تعريف الحقول المتوقعة في الاستجابة
const roomTypeFields = [
  'Id',
  'Name',
  'CreatedAt',
  'UpdatedAt',
  'DeletedAt'
];

export async function getRoomTypes() {
  const response = await api.get(basePath);
  return formatResponseData(response.data, roomTypeFields);
}

export async function createRoomType(data: any) {
  const response = await api.post(basePath, data);
  return formatResponseData(response.data, roomTypeFields);
}

export async function updateRoomType(id: number, data: any) {
  const response = await api.put(`${basePath}/${id}`, data);
  return formatResponseData(response.data, roomTypeFields);
}

export async function deleteRoomType(id: number) {
  const response = await api.delete(`${basePath}/${id}`);
  return response.status === 200;
}

export async function restoreRoomType(id: number) {
  const response = await api.put(`${basePath}/restore/${id}`);
  return response.status === 200;
}

export async function getRoomType(id: number) {
  const response = await api.get(`${basePath}/${id}`);
  return formatResponseData(response.data, roomTypeFields);
}

export async function getRoomTypesPagination(params: Record<string, any> = {}) {
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
  return formatResponseData(response.data, roomTypeFields);
} 