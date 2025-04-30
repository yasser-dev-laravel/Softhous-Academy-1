 import { api, formatResponseData } from './api';

const basePath = '/api/Users';

// تعريف الحقول المتوقعة في الاستجابة
const userFields = [
  'id',
  'name',
  'email',
  'emailVerified',
  'image',
  'salaryTypeId',
  'salaryTypeName',
  'salary',
  'phone',
  'address',
  'nationalId',
  'cityId',
  'education',
  'roleIds',
];

export async function getUsersPagination(params: Record<string, any> = {}) {
  const standardParams = {
    Page: params.Page || 1,
    Limit: params.Limit || 100,
    SortField: params.SortField || 'name',
    IsDesc: params.IsDesc || false,
    FreeText: params.FreeText || '',
    OnlyDeleted: params.OnlyDeleted || false,
    ...params
  };

  const response = await api.get(`${basePath}/pagination`, { params: standardParams });
  return formatResponseData(response.data, userFields);
}

export async function createUser(data: any) {
  const payload = {
    id: data.id,
    name: data.name,
    email: data.email,
    emailVerified: data.emailVerified,
    image: data.image,
    salaryTypeId: data.salaryTypeId,
    salaryTypeName: data.salaryTypeName,
    salary: data.salary,
    phone: data.phone,
    address: data.address,
    nationalId: data.nationalId,
    cityId: data.cityId,
    education: data.education,
    roleIds: data.roleIds,
  };
  const response = await api.post(basePath, payload);
  return formatResponseData(response.data, userFields);
}

export async function deleteUser(id: number) {
  const response = await api.delete(`${basePath}/${id}`);
  return response.status === 200;
}