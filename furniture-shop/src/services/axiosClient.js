


// import axios from "axios";

// const axiosClient = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || "http://localhost:8081",
//   headers: { "Content-Type": "application/json" },
//   timeout: 10000,
// });

// axiosClient.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) config.headers.Authorization = `Bearer ${token}`;
//   return config;
// });

// axiosClient.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     if (err.response) {
//       console.error("API Error:", err.response.status, err.response.data);
//     } else {
//       console.error("Network Error:", err.message);
//     }
//     return Promise.reject(err);
//   }
// );

// export default axiosClient;//





// src/services/axiosClient.js
import axios from "axios";

const API_ORIGIN = import.meta.env.VITE_API_ORIGIN || "http://localhost:8081";

const axiosClient = axios.create({
  baseURL: API_ORIGIN,
  headers: { "Content-Type": "application/json" },
  timeout: 10000,
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

axiosClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("token");
      // Optional: window.location.assign("/login");
    }
    return Promise.reject(err);
  }
);

export default axiosClient;

