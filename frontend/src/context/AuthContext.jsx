import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem("rozsewa_auth");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (auth) localStorage.setItem("rozsewa_auth", JSON.stringify(auth));
    else localStorage.removeItem("rozsewa_auth");
  }, [auth]);

  const login = (userData) => {
    const data = {
      ...userData,
      token: `tok_${Date.now().toString(36)}`,
      loginAt: new Date().toISOString(),
    };
    setAuth(data);
    // Also save user profile
    if (data.role === "customer") {
      const existing = JSON.parse(localStorage.getItem("rozsewa_user_profile") || "{}");
      localStorage.setItem("rozsewa_user_profile", JSON.stringify({ ...existing, ...data }));
    }
    return data;
  };

  const logout = () => {
    setAuth(null);
  };

  const value = {
    user: auth,
    isAuthenticated: !!auth,
    role: auth?.role || null,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
