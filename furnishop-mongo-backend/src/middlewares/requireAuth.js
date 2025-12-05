





// // src/middlewares/requireAuth.js
// const jwt = require("jsonwebtoken");

// /**
//  * Yêu cầu header: Authorization: Bearer <token>
//  * Gắn req.user = { id, role } khi hợp lệ
//  */
// module.exports = function requireAuth(req, res, next) {
//   try {
//     const h = req.headers.authorization || "";
//     const token = h.startsWith("Bearer ") ? h.slice(7) : "";
//     if (!token) return res.status(401).json({ message: "Unauthorized" });

//     const payload = jwt.verify(token, process.env.JWT_SECRET || "secret");
//     // payload nên chứa { id, role } từ lúc login
//     req.user = { id: payload.id, role: payload.role };
//     return next();
//   } catch (e) {
//     return res.status(401).json({ message: "Invalid token" });
//   }
// };///30/11






// src/middlewares/requireAuth.js
const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Giải mã token
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!payload?.id) {
      return res.status(401).json({ message: "Invalid token" });
    }

    // 🔥 Lấy user từ DB để kiểm tra trạng thái mới nhất (QUAN TRỌNG)
    const user = await User.findById(payload.id).select("_id role status email");

    if (!user) {
      return res.status(401).json({ message: "Không tìm thấy user" });
    }

    // ❌ CHẶN TÀI KHOẢN BỊ KHÓA
    if (user.status === "blocked") {
      return res.status(403).json({
        message: "Tài khoản đã bị khóa. Vui lòng liên hệ hỗ trợ.",
      });
    }

    // Lưu user vào req để controller sử dụng
    req.user = {
      id: user._id,
      role: user.role,
      status: user.status,
      email: user.email,
    };

    next();
  } catch (e) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

