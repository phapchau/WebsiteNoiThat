// // src/utils/fileUrl.js
// const ORIGIN = import.meta.env.VITE_API_ORIGIN || "http://localhost:8081";

// export function fileUrl(u) {
//   if (!u) return "";
//   const s = String(u).trim();
//   if (/^https?:\/\//i.test(s)) return s;
//   const path = s.startsWith("/") ? s : "/" + s;
//   return `${ORIGIN}${path}`.replace(/([^:]\/)\/+/g, "$1");//3/11
// }3/11








// src/utils/fileUrl.js
const ORIGIN = import.meta.env.VITE_API_ORIGIN || "http://localhost:8081";
export function fileUrl(u) {
  if (!u) return "";
  const s = String(u).trim();
  if (/^https?:\/\//i.test(s)) return s;
  const path = s.startsWith("/") ? s : `/${s}`;
  return `${ORIGIN}${path}`.replace(/([^:]\/)\/+/g, "$1");
}

