// Unified API functions with Axios
import axios, { AxiosInstance, AxiosError } from 'axios';
import { getToken, refreshToken } from './authApi';

const API_BASE = "http://198.7.125.213:5000";

// إنشاء instance من Axios مع الإعدادات الأساسية
const api: AxiosInstance = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json'
  }
});

// إضافة interceptor للطلبات
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// إضافة interceptor للاستجابات
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    // إذا كان الخطأ 401 وليس طلب تجديد التوكن
    if (error.response?.status === 401 && !originalRequest?.url?.includes('/refresh-token')) {
      try {
        // محاولة تجديد التوكن
        await refreshToken();
        
        // إعادة المحاولة مع التوكن الجديد
        if (originalRequest) {
          originalRequest.headers.Authorization = `Bearer ${getToken()}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        // تسجيل الخروج وإعادة التوجيه
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// دالة مساعدة لبناء URL مع المعلمات
function buildUrl(basePath: string, params: Record<string, any> = {}) {
  const url = new URL(`${API_BASE}${basePath}`);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value.toString());
    }
  });
  
  return url.toString();
}

// دالة مساعدة لتنسيق البيانات المستلمة
function formatResponseData(data: any, fields: string[]) {
  if (!data) return null;
  
  if (Array.isArray(data)) {
    return data.map(item => formatItem(item, fields));
  }
  
  if (typeof data === 'object') {
    if ('data' in data && Array.isArray(data.data)) {
      return {
        ...data,
        items: data.data.map(item => formatItem(item, fields)),
        data: data.data.map(item => formatItem(item, fields))
      };
    }
    return formatItem(data, fields);
  }
  
  return data;
}

// دالة مساعدة لتنسيق عنصر واحد
function formatItem(item: any, fields: string[]) {
  const formatted: any = {};
  fields.forEach(field => {
    const value = item[field.toLowerCase()] || item[field];
    if (value !== undefined) {
      formatted[field] = value;
    }
  });
  return formatted;
}

// تصدير الدوال المساعدة
export {
  API_BASE,
  api,
  buildUrl,
  formatResponseData
}; 