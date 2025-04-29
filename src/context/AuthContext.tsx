import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { saveToLocalStorage, getFromLocalStorage } from "@/utils/localStorage";
import { apiRequest } from "@/utils/authApi";

type Role = "admin" | "employee" | "teacher" | "student";

interface User {
  id: string;
  name: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AUTH_STORAGE_KEY = "latin_academy_user";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  // Check if user is already logged in
  useEffect(() => {
    const storedUser = getFromLocalStorage<User | null>(AUTH_STORAGE_KEY, null);
    if (storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
  }, []);

  // تسجيل الدخول باستخدام API حقيقية
  const login = async (username: string, password: string): Promise<boolean> => {
    setLoading(true);
    try {
      // تسجيل الدخول بدون إرسال Authorization header
      const response = await fetch("http://198.7.125.213:5000/api/Auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userNameOrEmail: username, password }),
      });
      if (!response.ok) throw new Error("فشل تسجيل الدخول. تأكد من البيانات");
      const data = await response.json();
      // console.log('Login API response:', data); // لوج مؤقت لمعرفة شكل الريسبونس
      if (!data.accessToken) throw new Error("لم يتم استلام التوكن من السيرفر");
      localStorage.setItem("token", data.accessToken);
      // لا يوجد /api/Auth/me في الـ API، لذا سنتخطى هذه الخطوة مؤقتاً
      setUser({ id: username, name: username, role: "admin" }); // مؤقتاً حتى يتوفر endpoint لجلب البيانات
      setIsAuthenticated(true);
      saveToLocalStorage(AUTH_STORAGE_KEY, { id: username, name: username, role: "admin" });
      return true;
    } catch (error: any) {
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("token");
      throw new Error(error.message || "فشل تسجيل الدخول. تأكد من البيانات");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
