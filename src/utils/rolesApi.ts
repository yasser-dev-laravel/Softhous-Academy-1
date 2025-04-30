// API functions for Role entity based on Swagger (OpenAPI)
// يمكنك تعديل baseURL حسب بيئة السيرفر

function getToken() {
  return localStorage.getItem("token") || "";
}

const API_BASE = "http://198.7.125.213:5000";
const baseURL = `${API_BASE}/api/Roles`;

export async function createRole(data: any) {
  const response = await fetch(baseURL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Unauthorized or error occurred");
  return response.json();
}

export async function updateRole(id: number, data: any) {
  const response = await fetch(`${baseURL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${getToken()}`
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Unauthorized or error occurred");
  return response.json();
}

export async function deleteRole(id: number) {
  const response = await fetch(`${baseURL}/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${getToken()}`
    }
  });
  if (!response.ok) throw new Error("Unauthorized or error occurred");
  return response.ok;
}

export async function restoreRole(id: number) {
  const response = await fetch(`${baseURL}/restore/${id}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${getToken()}`
    }
  });
  if (!response.ok) throw new Error("Unauthorized or error occurred");
  return response.ok;
}

export async function getRole(id: number) {
  const response = await fetch(`${baseURL}/${id}`, {
    headers: {
      "Authorization": `Bearer ${getToken()}`
    }
  });
  if (!response.ok) throw new Error("Unauthorized or error occurred");
  return response.json();
}

export async function getRolesPagination(params: Record<string, any> = {}) {
  try {
    const url = new URL(`${API_BASE}/api/Roles/pagination`);
    
    // إضافة معلمات التصفح القياسية
    const standardParams = {
      Page: params.Page || 1,
      Limit: params.Limit || 100,
      SortField: params.SortField || "Name",
      IsDesc: params.IsDesc || false,
      FreeText: params.FreeText || "",
      OnlyDeleted: params.OnlyDeleted || false
    };
    
    // إضافة المعلمات إلى URL
    Object.entries(standardParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, value.toString());
      }
    });
    
    console.log("Token:", getToken());
    console.log("Fetching roles from URL:", url.toString());
    
    const response = await fetch(url.toString(), {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${getToken()}`,
        "Content-Type": "application/json"
      }
    });
    
    console.log("Response status:", response.status);
    console.log("Response headers:", Object.fromEntries(response.headers.entries()));
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("Error fetching roles:", errorText);
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const responseData = await response.json();
    console.log("Raw roles data received:", JSON.stringify(responseData, null, 2));
    
    // معالجة البيانات المستلمة من الخادم
    if (responseData && 'data' in responseData && Array.isArray(responseData.data)) {
      // تحويل البيانات إلى الشكل المطلوب
      const formattedData = {
        items: responseData.data.map(item => ({
          Id: item.id || item.Id,
          Name: item.name || item.Name,
          CreatedAt: item.createdAt || item.CreatedAt,
          UpdatedAt: item.updatedAt || item.UpdatedAt,
          DeletedAt: item.deletedAt || item.DeletedAt
        })),
        total: responseData.total || responseData.data.length
      };
      console.log("Formatted data:", JSON.stringify(formattedData, null, 2));
      return formattedData;
    } else if (Array.isArray(responseData)) {
      // إذا كانت البيانات مصفوفة مباشرة
      const formattedData = {
        items: responseData.map(item => ({
          Id: item.id || item.Id,
          Name: item.name || item.Name,
          CreatedAt: item.createdAt || item.CreatedAt,
          UpdatedAt: item.updatedAt || item.UpdatedAt,
          DeletedAt: item.deletedAt || item.DeletedAt
        })),
        total: responseData.length
      };
      console.log("Formatted array data:", JSON.stringify(formattedData, null, 2));
      return formattedData;
    } else if (responseData && typeof responseData === 'object' && 'items' in responseData) {
      // إذا كانت البيانات بالفعل بالتنسيق المتوقع
      const formattedData = {
        ...responseData,
        items: responseData.items.map(item => ({
          Id: item.id || item.Id,
          Name: item.name || item.Name,
          CreatedAt: item.createdAt || item.CreatedAt,
          UpdatedAt: item.updatedAt || item.UpdatedAt,
          DeletedAt: item.deletedAt || item.DeletedAt
        }))
      };
      console.log("Formatted object data:", JSON.stringify(formattedData, null, 2));
      return formattedData;
    } else {
      console.error("Unexpected data format:", responseData);
      return { items: [], total: 0 };
    }
  } catch (error) {
    console.error("Error in getRolesPagination:", error);
    throw error;
  }
} 