// src/components/ImgSafe.jsx
import React from "react";

const ORIGIN = import.meta.env.VITE_API_ORIGIN || "http://localhost:8081";

// SVG "No Image" nội tuyến – không phụ thuộc mạng ngoài
const FALLBACK_IMG = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500'>
  <rect width='100%' height='100%' fill='#f3f4f6'/>
  <text x='50%' y='50%' font-size='32' text-anchor='middle' fill='#9ca3af' dy='.3em'>No Image</text>
</svg>`)}`
;

// Chuẩn hoá URL thành tuyệt đối
function normalize(u) {
  if (!u) return "";
  return /^https?:\/\//i.test(u) ? u : `${ORIGIN}${u.startsWith("/") ? u : "/" + u}`;
}

export default function ImgSafe({ src, alt = "", className = "" }) {
  const real = normalize(src);
  const [url, setUrl] = React.useState(real || FALLBACK_IMG);

  React.useEffect(() => {
    setUrl(real || FALLBACK_IMG);
  }, [real]);

  return (
    <img
      src={url}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={(e) => {
        // gán fallback 1 lần rồi bỏ handler để tránh vòng lặp
        e.currentTarget.onerror = null;
        setUrl(FALLBACK_IMG);
      }}
    />
  );
}
