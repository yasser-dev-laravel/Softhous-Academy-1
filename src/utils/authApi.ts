// Authentication API for login and token management
const API_BASE = "http://198.7.125.213:5000";

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
