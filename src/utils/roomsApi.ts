// API functions for Room entity
import { api, formatResponseData } from './api';

const basePath = '/api/Rooms';

// تعريف الحقول المتوقعة في الاستجابة
const roomFields = [
  'Id',
  'Name',
  'Description',
  'BranchId',
  'Capacity',
  'RoomTypeId',
  'CreatedAt',
  'UpdatedAt',
  'DeletedAt'
];

export async function createRoom(data: any) {
  const response = await api.post(basePath, data);
  return formatResponseData(response.data, roomFields);
}

export async function updateRoom(id: number, data: any) {
  const response = await api.put(`${basePath}/${id}`, data);
  return formatResponseData(response.data, roomFields);
}

export async function deleteRoom(id: number) {
  const response = await api.delete(`${basePath}/${id}`);
  return response.status === 200;
}

export async function restoreRoom(id: number) {
  const response = await api.put(`${basePath}/restore/${id}`);
  return response.status === 200;
}

export async function getRoom(id: number) {
  const response = await api.get(`${basePath}/${id}`);
  return formatResponseData(response.data, roomFields);
}

export async function getRoomsPagination(params: Record<string, any> = {}) {
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
  return formatResponseData(response.data, roomFields);
} 