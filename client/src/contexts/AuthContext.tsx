import { useCallback, useEffect, useMemo, useState } from "react";
import api from "@/lib/axios";
import { AuthContext, type AuthUser, type Credentials, type RegisterData } from "@/contexts/auth-context";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const response = await api.get<{ user: AuthUser | null }>("/auth/me");
      setUser(response.data.user);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { void refresh(); }, [refresh]);

  const login = useCallback(async (credentials: Credentials) => {
    const response = await api.post<{ user: AuthUser }>("/auth/login", credentials);
    setUser(response.data.user);
    return response.data.user;
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    const response = await api.post<{ user: AuthUser }>("/auth/register", data);
    setUser(response.data.user);
    return response.data.user;
  }, []);

  const logout = useCallback(async () => {
    await api.post("/auth/logout");
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    const response = await api.get<{ user: AuthUser | null }>("/auth/me");
    setUser(response.data.user);
  }, []);

  const value = useMemo(() => ({
    user,
    isLoading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
    refreshUser,
  }), [user, isLoading, login, register, logout, refreshUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
