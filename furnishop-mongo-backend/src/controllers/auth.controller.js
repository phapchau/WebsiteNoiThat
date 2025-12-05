
// // src/controllers/auth.controller.js
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// const JWT_SECRET = process.env.JWT_SECRET || "dev_only_secret_change_me";
// const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// function signToken(user) {
//   return jwt.sign(
//     { sub: String(user._id), role: user.role || "customer", email: user.email, name: user.name || "" },
//     JWT_SECRET,
//     { expiresIn: JWT_EXPIRES_IN }
//   );
// }

// exports.register = async (req, res) => {
//   try {
//     const { name, email, password } = req.body || {};
//     if (!name || !email || !password) {
//       return res.status(400).json({ message: "Thiếu trường bắt buộc" });
//     }
//     const existed = await User.findOne({ email });
//     if (existed) return res.status(409).json({ message: "Email đã được sử dụng" });

//     const passwordHash = await bcrypt.hash(password, 10);
//     const user = await User.create({ name, email, passwordHash, role: "customer" });

//     const token = signToken(user);
//     return res.status(201).json({
//       user: { id: user._id, name: user.name, email: user.email, role: user.role },
//       token,
//     });
//   } catch (err) {
//     console.error("[register] error", err);
//     return res.status(500).json({ message: "Đăng ký thất bại", error: err.message });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body || {};
//     if (!email || !password) {
//       return res.status(400).json({ message: "Email và mật khẩu là bắt buộc" });
//     }

//     const user = await User.findOne({ email }); // KHÔNG .lean()
//     if (!user) return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });

//     // Hỗ trợ dữ liệu cũ (plaintext) và chuẩn (passwordHash)
//     const stored = user.passwordHash || user.password;
//     if (!stored) return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });

//     let ok = false;
//     if (stored.startsWith && stored.startsWith("$2")) {
//       ok = await bcrypt.compare(password, stored); // bcrypt hash
//     } else {
//       ok = password === stored; // plaintext legacy
//     }
//     if (!ok) return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });

//     // Nâng cấp plaintext -> hash (một lần)
//     if (!user.passwordHash || !user.passwordHash.startsWith("$2")) {
//       try {
//         user.passwordHash = await bcrypt.hash(password, 10);
//         if (user.password) user.password = undefined;
//         await user.save();
//       } catch (e) {
//         console.warn("[login] upgrade-to-hash failed:", e?.message);
//       }
//     }

//     const token = signToken(user);
//     return res.json({
//       user: { id: user._id, name: user.name, email: user.email, role: user.role },
//       token,
//     });
//   } catch (err) {
//     console.error("[login] error", err);
//     return res.status(500).json({ message: "Đăng nhập thất bại", error: err.message });
//   }
// };

// exports.me = async (req, res) => {
//   return res.json({ user: req.user });
// };




// // src/controllers/auth.controller.js
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// function signToken(user) {
//   return jwt.sign(
//     { id: user._id, role: user.role, email: user.email },
//     process.env.JWT_SECRET,
//     { expiresIn: "7d" }
//   );
// }

// exports.register = async (req, res) => {
//   try {
//     const { name, email, password } = req.body;

//     const existed = await User.findOne({ email });
//     if (existed) return res.status(409).json({ message: "Email đã tồn tại" });

//     const salt = await bcrypt.genSalt(10);
//     const hash = await bcrypt.hash(password, salt);

//     const doc = await User.create({
//       name: name?.trim() || email.split("@")[0],
//       email: email.toLowerCase().trim(),
//       password: hash, // lưu hash vào password
//       role: "user",
//     });

//     const token = signToken(doc);
//     res.status(201).json({
//       token,
//       user: {
//         _id: doc._id,
//         name: doc.name,
//         email: doc.email,
//         role: doc.role,
//         addresses: doc.addresses || [],
//       },
//     });
//   } catch (e) {
//     res.status(500).json({ message: e.message });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const doc = await User.findOne({ email: email.toLowerCase().trim() });
//     if (!doc) return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });

//     const ok = await bcrypt.compare(password, doc.password); // so sánh với password (hash)
//     if (!ok) return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });

//     const token = signToken(doc);
//     res.json({
//       token,
//       user: {
//         _id: doc._id,
//         name: doc.name,
//         email: doc.email,
//         role: doc.role,
//         addresses: doc.addresses || [],
//       },
//     });
//   } catch (e) {
//     res.status(500).json({ message: e.message });
//   }
// };

// exports.me = async (req, res) => {
//   try {
//     const u = await User.findById(req.user.id).select("_id name email role addresses");
//     if (!u) return res.status(404).json({ message: "Không tìm thấy user" });
//     res.json(u);
//   } catch (e) {
//     res.status(500).json({ message: e.message });
//   }
// };//




const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

function signToken(user) {
  return jwt.sign(
    { id: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const doc = await User.findOne({ email: email.toLowerCase().trim() });
    if (!doc) {
      return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
    }

    // ❌ Nếu tài khoản bị khóa → Không cho đăng nhập
    if (doc.status === "blocked") {
      return res.status(403).json({
        message: "Tài khoản đã bị khóa. Vui lòng liên hệ hỗ trợ."
      });
    }

    const ok = await bcrypt.compare(password, doc.password);
    if (!ok) {
      return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });
    }

    const token = signToken(doc);
    res.json({
      token,
      user: {
        _id: doc._id,
        name: doc.name,
        email: doc.email,
        role: doc.role,
        status: doc.status,
        addresses: doc.addresses || []
      },
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};


/* ===============================
   ME (Get profile)
================================ */
exports.me = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const user = await User.findById(userId)
      .select("_id name email role status phone address addresses");

    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    res.json({ user });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};







exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existed = await User.findOne({ email });
    if (existed) return res.status(409).json({ message: "Email đã tồn tại" });

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = await User.create({
      name: name?.trim() || email.split("@")[0],
      email: email.toLowerCase().trim(),
      password: hash,
      role: "user",
    });

    const token = signToken(doc);
    res.status(201).json({
      token,
      user: { _id: doc._id, name: doc.name, email: doc.email, role: doc.role, addresses: doc.addresses || [] },
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const doc = await User.findOne({ email: email.toLowerCase().trim() });
//     if (!doc) return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });

//     const ok = await bcrypt.compare(password, doc.password);
//     if (!ok) return res.status(401).json({ message: "Email hoặc mật khẩu không đúng" });

//     const token = signToken(doc);
//     res.json({
//       token,
//       user: { _id: doc._id, name: doc.name, email: doc.email, role: doc.role, addresses: doc.addresses || [] },
//     });
//   } catch (e) {
//     res.status(500).json({ message: e.message });
//   }
// };

// exports.me = async (req, res) => {
//   try {
//     const u = await User.findById(req.user.id).select("_id name email role addresses");
//     if (!u) return res.status(404).json({ message: "Không tìm thấy user" });
//     res.json({ user: u });
//   } catch (e) {
//     res.status(500).json({ message: e.message });
//   }
// };2/11




exports.me = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // 👇 NHỚ select cả phone & address
    const user = await User.findById(userId).select("name email phone address role");
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    res.json({ user });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};
