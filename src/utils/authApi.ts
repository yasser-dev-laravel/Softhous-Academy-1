// Authentication API for login and token management
import { api } from './api';

const basePath = '/api/Auth';

// دالة عامة لإرسال أي طلب API مع التوكن تلقائياً
export async function apiRequest(url: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    "Content-Type": "application/json",
  };
  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers,
  });
  if (response.status === 401) {
    throw new Error("غير مصرح. يرجى تسجيل الدخول مرة أخرى.");
  }
  return response.json();
}

export async function login(email: string, password: string) {
  try {
    const response = await api.post(`${basePath}/login`, { email, password });
    const data = response.data;
    
    if (data && data.token) {
      localStorage.setItem("token", data.token);
      return data;
    } else {
      throw new Error("Invalid response format: token not found");
    }
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

export async function register(userData: any) {
  try {
    const response = await api.post(`${basePath}/register`, userData);
    return response.data;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}

export async function refreshToken() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No token found");
    }

    const response = await api.post(`${basePath}/refresh-token`);
    const data = response.data;
    
    if (data && data.token) {
      localStorage.setItem("token", data.token);
      return data;
    } else {
      throw new Error("Invalid response format: token not found");
    }
  } catch (error) {
    console.error("Token refresh error:", error);
    throw error;
  }
}

export function logout() {
  localStorage.removeItem("token");
  window.location.href = "/login";
}

export function isAuthenticated() {
  return !!localStorage.getItem("token");
}

export function getToken() {
  return localStorage.getItem("token") || "";
}
