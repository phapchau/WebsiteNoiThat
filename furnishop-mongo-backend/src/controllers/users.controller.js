// const bcrypt = require("bcryptjs");
// const User = require("../models/User");

// // GET /api/users/me
// exports.getMe = async (req, res) => {
//   const u = await User.findById(req.user._id)
//     .select("_id name email role phone addresses");
//   res.json(u);
// };

// // PATCH /api/users/me
// exports.updateMe = async (req, res) => {
//   const { name, phone } = req.body;
//   const u = await User.findByIdAndUpdate(
//     req.user._id,
//     { $set: { name, phone } },
//     { new: true, runValidators: true }
//   ).select("_id name email role phone addresses");
//   res.json(u);
// };

// // PATCH /api/users/me/password
// exports.changePassword = async (req, res) => {
//   const { currentPassword, newPassword } = req.body;
//   const u = await User.findById(req.user._id);
//   if (!u) return res.status(404).json({ message: "Không tìm thấy user" });

//   const ok = await bcrypt.compare(currentPassword, u.passwordHash);
//   if (!ok) return res.status(400).json({ message: "Mật khẩu hiện tại không đúng" });

//   const salt = await bcrypt.genSalt(10);
//   u.passwordHash = await bcrypt.hash(newPassword, salt);
//   await u.save();

//   res.json({ ok: true });
// };

// /* -------------------- ADDRESS APIs -------------------- */

// // GET /api/users/addresses
// exports.addressList = async (req, res) => {
//   const u = await User.findById(req.user._id).select("addresses");
//   res.json(u?.addresses || []);
// };

// // POST /api/users/addresses
// exports.addressCreate = async (req, res) => {
//   // FE có thể gửi address hoặc line1 -> chấp nhận cả 2
//   const { name, phone, email = "", address, line1, isDefault } = req.body;
//   const addr = address ?? line1;

//   if (!name || !phone || !addr) {
//     return res.status(400).json({ message: "Thiếu thông tin địa chỉ" });
//   }

//   const u = await User.findById(req.user._id);
//   if (!u) return res.status(401).json({ message: "Unauthorized" });

//   if (isDefault) u.addresses.forEach(a => (a.isDefault = false));

//   u.addresses.push({ name, phone, email, address: addr, isDefault: !!isDefault });
//   await u.save();

//   // trả luôn toàn bộ list để FE tiện set lại state
//   res.status(201).json(u.addresses);
// };

// // PATCH /api/users/addresses/:id
// exports.addressUpdate = async (req, res) => {
//   const { id } = req.params; // đồng bộ với FE
//   const { name, phone, email, address, line1, isDefault } = req.body;
//   const addr = address ?? line1;

//   const u = await User.findById(req.user._id);
//   const a = u?.addresses.id(id);
//   if (!a) return res.status(404).json({ message: "Không tìm thấy địa chỉ" });

//   if (isDefault) u.addresses.forEach(x => (x.isDefault = false));

//   if (name != null) a.name = name;
//   if (phone != null) a.phone = phone;
//   if (email != null) a.email = email;
//   if (addr != null) a.address = addr;
//   if (isDefault != null) a.isDefault = !!isDefault;

//   await u.save();
//   res.json(u.addresses);
// };

// // DELETE /api/users/addresses/:id
// exports.addressDelete = async (req, res) => {
//   const { id } = req.params;
//   const u = await User.findById(req.user._id);
//   const a = u?.addresses.id(id);
//   if (!a) return res.status(404).json({ message: "Không tìm thấy địa chỉ" });
//   a.deleteOne();
//   await u.save();
//   res.json(u.addresses);
// };

// // PATCH /api/users/addresses/:id/default
// exports.addressSetDefault = async (req, res) => {
//   const { id } = req.params;
//   const u = await User.findById(req.user._id);
//   const a = u?.addresses.id(id);
//   if (!a) return res.status(404).json({ message: "Không tìm thấy địa chỉ" });

//   u.addresses.forEach(x => (x.isDefault = false));
//   a.isDefault = true;
//   await u.save();
//   res.json(u.addresses);
// };

// /* -------------------- DASHBOARD HELPERS -------------------- */

// // GET /api/users/count
// exports.count = async (_req, res) => {
//   try {
//     const total = await User.estimatedDocumentCount();
//     res.json({ total });
//   } catch (e) {
//     res.status(500).json({ message: e.message });
//   }
// };

// // GET /api/users (admin – optional)
// exports.list = async (req, res) => {
//   try {
//     const { q, page = 1, limit = 20, sort = "-createdAt" } = req.query;
//     const filter = q
//       ? { $or: [{ name: { $regex: q, $options: "i" } }, { email: { $regex: q, $options: "i" } }] }
//       : {};
//     const pg = Math.max(1, Number(page));
//     const lim = Math.max(1, Math.min(100, Number(limit)));
//     const skip = (pg - 1) * lim;

//     const [items, total] = await Promise.all([
//       User.find(filter)
//         .sort(sort)
//         .skip(skip)
//         .limit(lim)
//         .select("-password -passwordHash -hash -salt"),
//       User.countDocuments(filter),
//     ]);

//     res.json({ items, total, page: pg, pages: Math.ceil(total / lim) });
//   } catch (e) {
//     res.status(500).json({ message: e.message });
//   }
// };////













const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Order = require("../models/Order");


// GET /api/users/me
exports.getMe = async (req, res) => {
  const u = await User.findById(req.user.id).select("_id name email role phone address addresses");
  res.json({ user: u });
};

// // PATCH /api/users/me
// exports.updateMe = async (req, res) => {
//   const { name, phone, address } = req.body;
//   const u = await User.findByIdAndUpdate(
//     req.user.id,
//     { $set: { name, phone, address } },
//     { new: true, runValidators: true }
//   ).select("_id name email role phone address addresses");
//   res.json({ user: u });
// };


exports.updateMe = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?._id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    // chấp nhận nhiều biến thể key cho SĐT
    const phoneInput =
      req.body.phone ?? req.body.phoneNumber ?? req.body.sdt ?? req.body.tel;

    const patch = {};
    if (req.body.name != null) patch.name = String(req.body.name).trim();
    if (req.body.address != null) patch.address = String(req.body.address).trim();
    if (phoneInput != null) patch.phone = String(phoneInput).trim();

    const user = await User.findByIdAndUpdate(userId, patch, { new: true })
      .select("name email phone address role addresses");

    res.json({ user });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};




// PATCH /api/users/me/password
exports.changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const u = await User.findById(req.user.id);
  if (!u) return res.status(404).json({ message: "Không tìm thấy user" });

  const ok = await bcrypt.compare(currentPassword, u.password);
  if (!ok) return res.status(400).json({ message: "Mật khẩu hiện tại không đúng" });

  const salt = await bcrypt.genSalt(10);
  u.password = await bcrypt.hash(newPassword, salt);
  await u.save();
  res.json({ ok: true });
};

/* ---------- ĐỊA CHỈ ---------- */

// GET /api/users/addresses
exports.addressList = async (req, res) => {
  const u = await User.findById(req.user.id).select("addresses");
  res.json(u?.addresses || []);
};

// POST /api/users/addresses
exports.addressCreate = async (req, res) => {
  const { name, phone, email, line1, isDefault } = req.body;
  const u = await User.findById(req.user.id);
  if (!u) return res.status(401).json({ message: "Unauthorized" });

  if (isDefault) u.addresses.forEach(a => a.isDefault = false);
  u.addresses.push({ name, phone, email, line1, isDefault: !!isDefault });
  await u.save();

  const created = u.addresses[u.addresses.length - 1];
  res.status(201).json(created);
};

// PATCH /api/users/addresses/:addrId
exports.addressUpdate = async (req, res) => {
  const { addrId } = req.params;
  const { name, phone, email, line1, isDefault } = req.body;
  const u = await User.findById(req.user.id);
  if (!u) return res.status(401).json({ message: "Unauthorized" });

  const a = u.addresses.id(addrId);
  if (!a) return res.status(404).json({ message: "Không tìm thấy địa chỉ" });

  if (isDefault) u.addresses.forEach(x => x.isDefault = false);

  if (name != null) a.name = name;
  if (phone != null) a.phone = phone;
  if (email != null) a.email = email;
  if (line1 != null) a.line1 = line1;
  if (isDefault != null) a.isDefault = !!isDefault;

  await u.save();
  res.json(a);
};

// DELETE /api/users/addresses/:addrId
exports.addressDelete = async (req, res) => {
  const { addrId } = req.params;
  const u = await User.findById(req.user.id);
  if (!u) return res.status(401).json({ message: "Unauthorized" });

  const a = u.addresses.id(addrId);
  if (!a) return res.status(404).json({ message: "Không tìm thấy địa chỉ" });

  a.deleteOne();
  await u.save();
  res.json({ ok: true });
};

// PATCH /api/users/addresses/:addrId/default
exports.addressSetDefault = async (req, res) => {
  const { addrId } = req.params;
  const u = await User.findById(req.user.id);
  if (!u) return res.status(401).json({ message: "Unauthorized" });

  const a = u.addresses.id(addrId);
  if (!a) return res.status(404).json({ message: "Không tìm thấy địa chỉ" });

  u.addresses.forEach(x => x.isDefault = false);
  a.isDefault = true;
  await u.save();
  res.json(a);
};

/* ---------- CHO DASHBOARD ---------- */

exports.count = async (_req, res) => {
  try {
    const total = await User.estimatedDocumentCount();
    res.json({ total });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.list = async (req, res) => {
  try {
    const { q, page = 1, limit = 20, sort = "-createdAt" } = req.query;
    const filter = q
      ? { $or: [{ name: { $regex: q, $options: "i" } }, { email: { $regex: q, $options: "i" } }] }
      : {};
    const pg = Math.max(1, Number(page));
    const lim = Math.max(1, Math.min(100, Number(limit)));
    const skip = (pg - 1) * lim;

    const [items, total] = await Promise.all([
      User.find(filter).sort(sort).skip(skip).limit(lim).select("-password"),
      User.countDocuments(filter),
    ]);

    res.json({ items, total, page: pg, pages: Math.ceil(total / lim) });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};


// LẤY CHI TIẾT 1 KHÁCH HÀNG + THỐNG KÊ (ADMIN)
exports.getOneAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");
    if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

    // Lấy tất cả đơn của user này
    const orders = await Order.find({ user: id }).sort({ createdAt: -1 });

    const totalOrders = orders.length;
    const totalSpent = orders.reduce(
      (sum, o) => sum + Number(o.grandTotal ?? o.amount ?? 0),
      0
    );
    const cancelledOrders = orders.filter(o => o.status === "cancelled").length;
    const lastOrder = orders[0] || null;
    const avgOrderValue = totalOrders ? Math.round(totalSpent / totalOrders) : 0;

    return res.json({
      user,
      stats: {
        totalOrders,
        totalSpent,
        avgOrderValue,
        cancelledOrders,
        lastOrderAt: lastOrder?.createdAt || null,
        lastOrderCode: lastOrder?.code || null,
      },
      orders,
    });
  } catch (e) {
    console.error("[users.getOneAdmin]", e);
    return res.status(500).json({
      message: "Không lấy được thông tin khách hàng",
      error: e.message,
    });
  }
};



///đổi quyền
exports.updateRole = async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!["admin", "staff", "customer"].includes(role))
    return res.status(400).json({ message: "Role không hợp lệ" });

  const user = await User.findByIdAndUpdate(id, { role }, { new: true })
    .select("-password");

  if (!user) return res.status(404).json({ message: "Không tìm thấy user" });

  res.json({ user });
};


///mở khóa tài khoản
exports.updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!["active", "blocked"].includes(status))
    return res.status(400).json({ message: "Status không hợp lệ" });

  const user = await User.findByIdAndUpdate(id, { status }, { new: true })
    .select("-password");

  res.json({ user });
};



//xóa tài khoản
exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  await User.findByIdAndDelete(id);
  res.json({ ok: true });
};



