import { api } from './api';
import { Category, CategoryCreateInput } from '@/types/Categories';

const basePath = '/api/Categories';

export async function createCategory(data: CategoryCreateInput) {
  try {
    const formattedData = {
      name: data.name,
      description: data.description
    };
    const response = await api.post(basePath, formattedData);
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
}

export async function updateCategory(id: string, data: CategoryCreateInput) {
  const response = await api.put(`${basePath}/${id}`, {
    name: data.name,
    description: data.description
  });
  return response.data;
}

export async function deleteCategory(id: string) {
  const response = await api.delete(`${basePath}/${id}`);
  return response.data;
}

export async function getCategory(id: string) {
  const response = await api.get(`${basePath}/${id}`);
  return response.data;
}

export async function getCategoriesPagination(params: Record<string, any> = {}) {
  const standardParams = {
    Page: params.Page || 1,
    Limit: params.Limit || 100,
    ...params
  };
  const response = await api.get(basePath + '/pagination', { params: standardParams });
  // استخرج البيانات من data مباشرة
  let items = [];
  let total = 0;
  if (Array.isArray(response.data.data)) {
    items = response.data.data.map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description
    }));
    total = response.data.total ?? response.data.data.length;
  } else if (Array.isArray(response.data.items)) {
    items = response.data.items.map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description
    }));
    total = response.data.total ?? response.data.items.length;
  } else if (Array.isArray(response.data)) {
    items = response.data.map((item: any) => ({
      id: item.id,
      name: item.name,
      description: item.description
    }));
    total = response.data.length;
  }
  return { items, total };
}
