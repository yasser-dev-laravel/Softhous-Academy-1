// API functions for Branch entity based on Swagger (OpenAPI)
// يمكنك تعديل baseURL حسب بيئة السيرفر

function getToken() {
  return localStorage.getItem("token") || "";
}

const API_BASE = "http://198.7.125.213:5000";
const baseURL = `${API_BASE}/api/Branches`;

export async function createBranch(data: any) {
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

export async function updateBranch(id: number, data: any) {
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

export async function deleteBranch(id: number) {
  const response = await fetch(`${baseURL}/${id}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${getToken()}`
    }
  });
  if (!response.ok) throw new Error("Unauthorized or error occurred");
  return response.ok;
}

export async function restoreBranch(id: number) {
  const response = await fetch(`${baseURL}/restore/${id}`, {
    method: "PUT",
    headers: {
      "Authorization": `Bearer ${getToken()}`
    }
  });
  if (!response.ok) throw new Error("Unauthorized or error occurred");
  return response.ok;
}

export async function getBranch(id: number) {
  const response = await fetch(`${baseURL}/${id}`, {
    headers: {
      "Authorization": `Bearer ${getToken()}`
    }
  });
  if (!response.ok) throw new Error("Unauthorized or error occurred");
  return response.json();
}

export async function getBranchesPagination(params: Record<string, any> = {}) {
  const url = new URL(`${baseURL}/pagination`, API_BASE);
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) url.searchParams.append(key, value);
  });
  const response = await fetch(url.toString(), {
    headers: {
      "Authorization": `Bearer ${getToken()}`
    }
  });
  if (!response.ok) throw new Error("Unauthorized or error occurred");
  return response.json();
}
