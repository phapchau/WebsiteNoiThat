

// // /src/middlewares/auth.js
// const jwt = require("jsonwebtoken");

// module.exports = function auth(req, res, next) {
//   try {
//     const token = (req.headers.authorization || "").replace(/^Bearer\s+/i, "");
//     if (!token) return res.status(401).json({ message: "Thiếu token" });

//     const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret_key");
//     // đính kèm cả 2 kiểu cho tiện dùng
//     // req.userId = decoded.id || decoded._id;
//     req.userId = decoded.sub || decoded.id || decoded._id;
//     req.user = { _id: req.userId, role: decoded.role, email: decoded.email, name: decoded.name };
//     next();
//   } catch (err) {
//     return res.status(401).json({ message: "Token không hợp lệ" });
//   }
// };






// src/middlewares/auth.js
const jwt = require("jsonwebtoken");

module.exports = function auth(req, res, next) {
  try {
    const h = req.headers.authorization || "";
    const token = h.startsWith("Bearer ") ? h.slice(7) : null;
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.id, role: payload.role, email: payload.email };
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
};
