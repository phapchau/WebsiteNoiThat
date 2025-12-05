

// const multer = require("multer");
// const path = require("path");
// const fs = require("fs");

// const UPLOAD_DIR = path.resolve(__dirname, "../../uploads"); // ✅ ra ngoài src
// if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// const allowed = new Set([
//   "image/jpeg","image/png","image/webp","image/gif",
//   "model/gltf-binary","model/gltf+json"
// ]);

// const fileFilter = (req, file, cb) => {
//   if (allowed.has(file.mimetype)) return cb(null, true);
//   cb(new Error("File type không được phép"));
// };

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, UPLOAD_DIR),
//   filename: (req, file, cb) => {
//     const ext = path.extname(file.originalname).toLowerCase();
//     const base = path.basename(file.originalname, ext)
//       .toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-_]/g, "");
//     cb(null, `${Date.now()}_${base}${ext}`);
//   }
// });

// module.exports = multer({ storage, fileFilter, limits: { fileSize: 50 * 1024 * 1024 } });












// src/middlewares/uploadLocal.js
const path = require("path");
const fs = require("fs");
const multer = require("multer");





// Thư mục lưu file: ../uploads (vì file này nằm trong /src/middlewares)
const uploadDir = path.resolve(__dirname, "../uploads");

// Tạo thư mục nếu chưa tồn tại
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Định nghĩa cách đặt tên file
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path
      .basename(file.originalname, ext)
      .replace(/\s+/g, "_") // bỏ khoảng trắng
      .replace(/[^a-zA-Z0-9_\-]/g, ""); // tránh ký tự lạ
    cb(null, `${Date.now()}_${base}${ext}`);
  },
});

// Whitelist MIME & EXT cho ảnh + GLB/GLTF
const MIME_ALLOW = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "model/gltf-binary",   // .glb
  "model/gltf+json",     // .gltf
  "application/octet-stream", // nhiều trình duyệt/Fetch gửi .glb kiểu này
]);

const EXT_ALLOW = new Set([
  ".jpg", ".jpeg", ".png", ".webp", ".gif",
  ".glb", ".gltf",
]);

function fileFilter(_req, file, cb) {
  const ext = path.extname(file.originalname).toLowerCase();
  const ok = MIME_ALLOW.has(file.mimetype) || EXT_ALLOW.has(ext);
  if (ok) return cb(null, true);
  // cb(new Error("File type not allowed")); // sẽ được error-handler của route bắt
  cb(ok ? null : new Error("File type not allowed"), ok);
}

// Tùy chỉnh giới hạn kích thước tại đây (50MB)
const limits = { fileSize: 50 * 1024 * 1024 };

const upload = multer({ storage, fileFilter, limits });

// module.exports = upload;
module.exports = multer({ storage, fileFilter, limits:{ fileSize: 50*1024*1024 }});
