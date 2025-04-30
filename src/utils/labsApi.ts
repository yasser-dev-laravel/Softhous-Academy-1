import { Lab, LabInput } from "@/types/Labs";
import { api, formatResponseData } from './api';

const basePath = '/api/Rooms';

// تعريف الحقول المتوقعة في الاستجابة
const labFields = [
  'Id',
  'Name',
  'Type',
  'Capacity',
  'BranchId',
  'BranchName',
  'CreatedAt',
  'UpdatedAt',
  'DeletedAt'
];

// Get token from localStorage
const getToken = () => {
  return localStorage.getItem("token");
};

// Create a new lab
export async function createLab(data: any) {
  try {
    // تنسيق البيانات المرسلة حسب أسماء الحقول في API
    const formattedData = {
      Name: data.Name,
      Type: data.Type,
      Capacity: data.Capacity,
      BranchId: data.BranchId
    };
    
    console.log("Creating lab with formatted data:", formattedData);
    const response = await api.post(basePath, formattedData);
    console.log("Lab creation response:", response);
    return formatResponseData(response.data, labFields);
  } catch (error) {
    console.error("Error creating lab:", error);
    throw error;
  }
}

// Update an existing lab
export async function updateLab(id: number, data: any) {
  const response = await api.put(`${basePath}/${id}`, data);
  return formatResponseData(response.data, labFields);
}

// Delete a lab
export async function deleteLab(id: number) {
  const response = await api.delete(`${basePath}/${id}`);
  return response.status === 200;
}

// Restore a deleted lab
export async function restoreLab(id: number) {
  const response = await api.put(`${basePath}/restore/${id}`);
  return response.status === 200;
}

// Get a single lab by ID
export async function getLab(id: number) {
  const response = await api.get(`${basePath}/${id}`);
  return formatResponseData(response.data, labFields);
}

// Get labs with pagination
export async function getLabsPagination(params: Record<string, any> = {}) {
  try {
    console.log("A. بدء دالة getLabsPagination");
    
    // تجهيز المعلمات
    const standardParams = {
      Page: params.Page || 1,
      Limit: params.Limit || 100,
      SortField: params.SortField || 'Name',
      IsDesc: params.IsDesc || false,
      FreeText: params.FreeText || '',
      OnlyDeleted: params.OnlyDeleted || false
    };
    console.log("B. المعلمات المجهزة:", standardParams);
    
    // التحقق من التوكن
    const token = getToken();
    console.log("C. التوكن المستخدم:", token ? "موجود" : "غير موجود");
    
    // تجهيز الطلب
    const url = `${basePath}/pagination`;
    console.log("D. عنوان الطلب:", url);
    
    // إرسال الطلب
    console.log("E. إرسال طلب GET...");
    const response = await api.get(url, { params: standardParams });
    console.log("F. استجابة الطلب:", response);
    
    // تنسيق البيانات
    console.log("G. تنسيق البيانات...");
    const formattedData = formatResponseData(response.data, labFields);
    console.log("H. البيانات المنسقة:", formattedData);
    
    return formattedData;
  } catch (error) {
    console.error("I. حدث خطأ:", error);
    throw error;
  }
} 