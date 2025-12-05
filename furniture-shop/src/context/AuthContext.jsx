// import { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
// import axiosClient from "../services/axiosClient";

// const AuthContext = createContext(null);

// export function AuthProvider({ children }) {
//   const [user, setUser] = useState(null);
//   const [hydrated, setHydrated] = useState(false);   // đã kiểm tra token xong chưa
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   // gọi /api/auth/me nếu có token để lấy thông tin user
//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) { setHydrated(true); return; }
//     (async () => {
//       try {
//         const { data } = await axiosClient.get("/api/auth/me");
//         setUser(data?.user || null);
//       } catch {
//         localStorage.removeItem("token");
//         setUser(null);
//       } finally {
//         setHydrated(true);
//       }
//     })();
//   }, []);

//   const login = useCallback(async ({ email, password }) => {
//     setLoading(true); setError("");
//     try {
//       const { data } = await axiosClient.post("/api/auth/login", { email, password });
//       if (data?.token) localStorage.setItem("token", data.token);
//       setUser(data?.user || null);
//       return data;
//     } catch (e) {
//       const msg = e?.response?.data?.message || "Đăng nhập thất bại";
//       setError(msg);
//       throw e;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const register = useCallback(async ({ name, email, password }) => {
//     setLoading(true); setError("");
//     try {
//       const { data } = await axiosClient.post("/api/auth/register", { name, email, password });
//       if (data?.token) localStorage.setItem("token", data.token);
//       setUser(data?.user || null);
//       return data;
//     } catch (e) {
//       const msg = e?.response?.data?.message || "Đăng ký thất bại";
//       setError(msg);
//       throw e;
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   const logout = useCallback(() => {
//     localStorage.removeItem("token");
//     setUser(null);
//   }, []);

//   const value = useMemo(() => ({
//     user, hydrated, loading, error, login, register, logout, setError
//   }), [user, hydrated, loading, error, login, register, logout]);

//   return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
// }

// export const useAuth = () => {
//   const ctx = useContext(AuthContext);
//   if (!ctx) throw new Error("useAuth must be used within AuthProvider");
//   return ctx;
// };///




// src/context/AuthContext.jsx
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import axiosClient from "../services/axiosClient";

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [hydrated, setHydrated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ---- helpers ----
  const attachToken = (token) => {
    if (token) {
      localStorage.setItem("token", token);
      axiosClient.defaults.headers.Authorization = `Bearer ${token}`;
    }
  };
  const clearToken = () => {
    localStorage.removeItem("token");
    delete axiosClient.defaults.headers.Authorization;
  };

  const pickUser = (data) => {
    // BE có thể trả { user: {...} } hoặc trả thẳng {...}
    if (!data) return null;
    if (data.user) return data.user;
    return data;
  };

  const me = useCallback(async () => {
    try {
      const { data } = await axiosClient.get("/api/auth/me");
      setUser(pickUser(data));
    } catch {
      setUser(null);
    } finally {
      setHydrated(true);
    }
  }, []);

  // Hydrate từ localStorage khi app khởi tạo
  useEffect(() => {
    const t = localStorage.getItem("token");
    if (t) {
      axiosClient.defaults.headers.Authorization = `Bearer ${t}`;
      me();
    } else {
      setHydrated(true);
    }
  }, [me]);

  const login = useCallback(async ({ email, password }) => {
    setLoading(true); setError("");
    try {
      const { data } = await axiosClient.post("/api/auth/login", { email, password });
      if (data?.token) attachToken(data.token);
      // set ngay user theo response login (nhanh), sau đó gọi me để đồng bộ
      setUser(pickUser(data));
      me().catch(() => {}); // không block luồng đăng nhập
      return pickUser(data);
    } catch (err) {
      const msg = err?.response?.data?.message || "Đăng nhập thất bại";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [me]);

  const register = useCallback(async ({ name, email, password }) => {
    setLoading(true); setError("");
    try {
      const { data } = await axiosClient.post("/api/auth/register", { name, email, password });
      if (data?.token) attachToken(data.token);
      setUser(pickUser(data));
      me().catch(() => {});
      return pickUser(data);
    } catch (err) {
      const msg = err?.response?.data?.message || "Đăng ký thất bại";
      setError(msg);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [me]);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  const value = useMemo(() => ({
    user, hydrated, loading, error,
    login, register, logout,
    setError, setUser
  }), [user, hydrated, loading, error, login, register, logout]);

  return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>;
}
