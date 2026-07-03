import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { login as loginRequest, signup as signupRequest } from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("expense_token") || "");
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("expense_user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const persistSession = useCallback((session) => {
    localStorage.setItem("expense_token", session.token);
    localStorage.setItem("expense_user", JSON.stringify(session.user));
    setToken(session.token);
    setUser(session.user);
  }, []);

  const login = useCallback(
    async (credentials) => {
      const response = await loginRequest(credentials);
      persistSession(response.data);
    },
    [persistSession]
  );

  const signup = useCallback(
    async (payload) => {
      const response = await signupRequest(payload);
      persistSession(response.data);
    },
    [persistSession]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("expense_token");
    localStorage.removeItem("expense_user");
    setToken("");
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(token),
      login,
      logout,
      signup,
      user
    }),
    [login, logout, signup, token, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
