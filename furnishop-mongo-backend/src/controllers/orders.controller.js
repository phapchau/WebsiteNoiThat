








// // src/controllers/orders.controller.js
// const Order = require("../models/Order");
// const Product = require("../models/Product");

// function genCode() {
//   return "ORD-" + Date.now();
// }


// // Danh sách (admin) + FILTERS: status | code/_id | paymentMethod | from/to | minTotal/maxTotal
// exports.list = async (req, res) => {
//   try {
//     const page  = Math.max(1, Number(req.query.page)  || 1);
//     const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
//     const skip  = (page - 1) * limit;

//     const {
//       status,          // "pending" | "paid" | ...
//       code,            // "ORD-..." hoặc _id 24hex
//       paymentMethod,   // "COD" | "VNPAY" ...
//       from,            // ISO date (YYYY-MM-DD) hoặc full ISO
//       to,              // ISO date
//       minTotal,        // số
//       maxTotal,        // số
//       sort = "-createdAt", // ví dụ: "-createdAt" (mới → cũ), "createdAt"
//     } = req.query;

//     const filter = {};

//     // Trạng thái
//     if (status && status !== "all") filter.status = status;

//     // Mã đơn: khớp code (regex) hoặc _id (nếu định dạng 24hex)
//     if (code) {
//       const like = new RegExp(String(code).trim(), "i");
//       filter.$or = [{ code: like }];
//       if (/^[a-f0-9]{24}$/i.test(String(code).trim())) {
//         filter.$or.push({ _id: String(code).trim() });
//       }
//     }

//     // Phương thức thanh toán
//     if (paymentMethod && paymentMethod !== "all") {
//       filter.paymentMethod = paymentMethod;
//     }

//     // Khoảng ngày theo createdAt
//     if (from || to) {
//       filter.createdAt = {};
//       if (from) filter.createdAt.$gte = new Date(from);
//       if (to) {
//         // nếu chỉ có YYYY-MM-DD, tự động lấy hết ngày đó (23:59:59.999)
//         const dt = new Date(to);
//         if (/^\d{4}-\d{2}-\d{2}$/.test(String(to))) {
//           dt.setHours(23,59,59,999);
//         }
//         filter.createdAt.$lte = dt;
//       }
//     }

//     // Tổng tiền: dùng grandTotal nếu có, fallback amount
//     // Ta tạo $or để bao phủ cả hai trường
//     const min = Number.isFinite(Number(minTotal)) ? Number(minTotal) : null;
//     const max = Number.isFinite(Number(maxTotal)) ? Number(maxTotal) : null;
//     if (min != null || max != null) {
//       const range = {};
//       if (min != null) range.$gte = min;
//       if (max != null) range.$lte = max;

//       filter.$and = (filter.$and || []).concat([{
//         $or: [
//           { grandTotal: range },
//           { amount: range },
//         ]
//       }]);
//     }

//     const [items, total] = await Promise.all([
//       Order.find(filter).sort(String(sort)).skip(skip).limit(limit),
//       Order.countDocuments(filter),
//     ]);

//     res.json({ items, total, page, limit });
//   } catch (err) {
//     console.error("[orders.list]", err);
//     res.status(500).json({ message: "Không lấy được danh sách", error: err.message });
//   }
// };





// // Tạo đơn: nhớ cấu hình routes dùng auth cho endpoint này
// exports.create = async (req, res) => {
//   try {
//     // BẮT BUỘC login: req.user.id phải có
//     if (!req.user?.id) {
//       return res.status(401).json({ message: "Bạn cần đăng nhập để đặt hàng" });
//     }

//     const {
//       items,
//       customer,
//       paymentMethod = "COD",
//       shippingFee = 0,
//       discount = 0,
//     } = req.body;

//     if (!Array.isArray(items) || items.length === 0) {
//       return res.status(400).json({ message: "Giỏ hàng trống" });
//     }

//     // Tính tiền + xác thực sản phẩm
//     let amount = 0;
//     const hydrated = [];

//     for (const it of items) {
//       const qty = Number(it.quantity) || 0;
//       if (qty <= 0) return res.status(400).json({ message: "Số lượng không hợp lệ" });

//       const p = await Product.findById(it.id);
//       if (!p) {
//         return res.status(400).json({ message: `Sản phẩm không tồn tại: ${it.id}` });
//       }

//       amount += (Number(p.price) || 0) * qty;
//       hydrated.push({
//         product: p._id,
//         name: p.name,
//         price: Number(p.price) || 0,
//         quantity: qty,
//         image: p.poster || p.images?.[0] || "",
        
//       });
//     }

//     const ship = Number(shippingFee) || 0;
//     const disc = Number(discount) || 0;
//     const grandTotal = Math.max(0, amount + ship - disc);

//     const order = await Order.create({
//       code: genCode(),
//       user: req.user.id, // ⬅️ bắt buộc có
//       items: hydrated,
//       amount,
//       shippingFee: ship,
//       discount: disc,
//       grandTotal,
//       customer,                 // { name, phone, email, address, note }
//       paymentMethod,            // "COD" | "VNPAY" ...
//       status: "pending",
//     });

//     res.status(201).json(order);
//   } catch (err) {
//     console.error("[orders.create]", err);
//     res.status(500).json({ message: "Tạo đơn thất bại", error: err.message });
//   }
// };

// // Đơn của chính tôi
// exports.myOrders = async (req, res) => {
//   try {
//     if (!req.user?.id) {
//       return res.status(401).json({ message: "Unauthorized" });
//     }
//     const page = Math.max(1, Number(req.query.page) || 1);
//     const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
//     const skip = (page - 1) * limit;

//     const filter = { user: req.user.id };

//     const [items, total] = await Promise.all([
//       Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
//       Order.countDocuments(filter),
//     ]);

//     res.json({ items, total, page, limit });
//   } catch (err) {
//     console.error("[orders.myOrders]", err);
//     res.status(500).json({ message: "Không lấy được danh sách đơn", error: err.message });
//   }
// };

// // Xem chi tiết 1 đơn — chỉ chủ đơn hoặc admin
// exports.getOne = async (req, res) => {
//   try {
//     if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

//     const o = await Order.findById(req.params.id);
//     if (!o) return res.status(404).json({ message: "Không tìm thấy đơn" });

//     const isOwner = String(o.user) === String(req.user.id);
//     const isAdmin = req.user.role === "admin";
//     if (!isOwner && !isAdmin) {
//       return res.status(403).json({ message: "Bạn không có quyền xem đơn này" });
//     }

//     res.json(o);
//   } catch (err) {
//     console.error("[orders.getOne]", err);
//     res.status(500).json({ message: "Lỗi khi tải đơn", error: err.message });
//   }
// };

// // Danh sách (admin)
// exports.list = async (req, res) => {
//   try {
//     const page = Math.max(1, Number(req.query.page) || 1);
//     const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
//     const skip = (page - 1) * limit;

//     const [items, total] = await Promise.all([
//       Order.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
//       Order.countDocuments(),
//     ]);

//     res.json({ items, total, page, limit });
//   } catch (err) {
//     console.error("[orders.list]", err);
//     res.status(500).json({ message: "Không lấy được danh sách", error: err.message });
//   }
// };

// // Cập nhật trạng thái (admin)
// exports.updateStatus = async (req, res) => {
//   try {
//     const { status } = req.body;
//     const allow = ["pending", "paid", "shipping", "completed", "cancelled"];
//     if (!allow.includes(status)) {
//       return res.status(400).json({ message: "Trạng thái không hợp lệ" });
//     }

//     const o = await Order.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true }
//     );
//     if (!o) return res.status(404).json({ message: "Không tìm thấy đơn" });

//     res.json(o);
//   } catch (err) {
//     console.error("[orders.updateStatus]", err);
//     res.status(500).json({ message: "Cập nhật trạng thái thất bại", error: err.message });
//   }
// };



// // KH tự hủy đơn khi còn 'pending'
// exports.cancelByCustomer = async (req, res) => {
//   try {
//     if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

//     const { id } = req.params;
//     const { reason = "" } = req.body;

//     const o = await Order.findById(id);
//     if (!o) return res.status(404).json({ message: "Không tìm thấy đơn" });

//     const isOwner = String(o.user) === String(req.user.id);
//     if (!isOwner) return res.status(403).json({ message: "Bạn không có quyền hủy đơn này" });

//     if (o.status !== "pending") {
//       return res.status(400).json({ message: "Chỉ có thể hủy khi đơn còn chờ xác nhận" });
//     }

//     o.status = "cancelled";
//     o.cancelledAt = new Date();
//     o.cancelledBy = req.user.id;
//     o.cancelReason = reason;
//     await o.save();

//     res.json(o);
//   } catch (err) {
//     console.error("[orders.cancelByCustomer]", err);
//     res.status(500).json({ message: "Hủy đơn thất bại", error: err.message });
//   }
// };////20/11

























// src/controllers/orders.controller.js
const Order = require("../models/Order");
const Product = require("../models/Product");
const mongoose = require("mongoose");
const PDFDocument = require("pdfkit");
const path = require("path");


function genCode() {
  return "ORD-" + Date.now();
}


// Danh sách (admin) + FILTERS: status | code/_id | paymentMethod | from/to | minTotal/maxTotal
exports.list = async (req, res) => {
  try {
    const page  = Math.max(1, Number(req.query.page)  || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
    const skip  = (page - 1) * limit;

    const {
      status,          // "pending" | "paid" | ...
      code,            // "ORD-..." hoặc _id 24hex
      paymentMethod,   // "COD" | "VNPAY" ...
      from,            // ISO date (YYYY-MM-DD) hoặc full ISO
      to,              // ISO date
      minTotal,        // số
      maxTotal,        // số
      sort = "-createdAt", // ví dụ: "-createdAt" (mới → cũ), "createdAt"
    } = req.query;

    const filter = {};

    // Trạng thái
    if (status && status !== "all") filter.status = status;

    // Mã đơn: khớp code (regex) hoặc _id (nếu định dạng 24hex)
    if (code) {
      const like = new RegExp(String(code).trim(), "i");
      filter.$or = [{ code: like }];
      if (/^[a-f0-9]{24}$/i.test(String(code).trim())) {
        filter.$or.push({ _id: String(code).trim() });
      }
    }

    // Phương thức thanh toán
    if (paymentMethod && paymentMethod !== "all") {
      filter.paymentMethod = paymentMethod;
    }

    // Khoảng ngày theo createdAt
    if (from || to) {
      filter.createdAt = {};
      if (from) filter.createdAt.$gte = new Date(from);
      if (to) {
        // nếu chỉ có YYYY-MM-DD, tự động lấy hết ngày đó (23:59:59.999)
        const dt = new Date(to);
        if (/^\d{4}-\d{2}-\d{2}$/.test(String(to))) {
          dt.setHours(23,59,59,999);
        }
        filter.createdAt.$lte = dt;
      }
    }

    // Tổng tiền: dùng grandTotal nếu có, fallback amount
    // Ta tạo $or để bao phủ cả hai trường
    const min = Number.isFinite(Number(minTotal)) ? Number(minTotal) : null;
    const max = Number.isFinite(Number(maxTotal)) ? Number(maxTotal) : null;
    if (min != null || max != null) {
      const range = {};
      if (min != null) range.$gte = min;
      if (max != null) range.$lte = max;

      filter.$and = (filter.$and || []).concat([{
        $or: [
          { grandTotal: range },
          { amount: range },
        ]
      }]);
    }

    const [items, total] = await Promise.all([
      Order.find(filter).sort(String(sort)).skip(skip).limit(limit),
      Order.countDocuments(filter),
    ]);

    res.json({ items, total, page, limit });
  } catch (err) {
    console.error("[orders.list]", err);
    res.status(500).json({ message: "Không lấy được danh sách", error: err.message });
  }
};





// Tạo đơn: nhớ cấu hình routes dùng auth cho endpoint này
exports.create = async (req, res) => {
  try {
    // BẮT BUỘC login: req.user.id phải có
    if (!req.user?.id) {
      return res.status(401).json({ message: "Bạn cần đăng nhập để đặt hàng" });
    }

    const {
      items,
      customer,
      paymentMethod = "COD",
      shippingFee = 0,
      discount = 0,
    } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Giỏ hàng trống" });
    }

    // Tính tiền + xác thực sản phẩm
    let amount = 0;
    const hydrated = [];

    for (const it of items) {
      const qty = Number(it.quantity) || 0;
      if (qty <= 0) return res.status(400).json({ message: "Số lượng không hợp lệ" });

      const p = await Product.findById(it.id);
      if (!p) {
        return res.status(400).json({ message: `Sản phẩm không tồn tại: ${it.id}` });
      }

      amount += (Number(p.price) || 0) * qty;
      hydrated.push({
        product: p._id,
        name: p.name,
        price: Number(p.price) || 0,
        quantity: qty,
        image: p.poster || p.images?.[0] || "",
        
      });
    }

    const ship = Number(shippingFee) || 0;
    const disc = Number(discount) || 0;
    const grandTotal = Math.max(0, amount + ship - disc);

    const order = await Order.create({
      code: genCode(),
      user: req.user.id, // ⬅️ bắt buộc có
      items: hydrated,
      amount,
      shippingFee: ship,
      discount: disc,
      grandTotal,
      customer,                 // { name, phone, email, address, note }
      paymentMethod,            // "COD" | "VNPAY" ...
      status: "pending",
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("[orders.create]", err);
    res.status(500).json({ message: "Tạo đơn thất bại", error: err.message });
  }
};

// Đơn của chính tôi
exports.myOrders = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 10));
    const skip = (page - 1) * limit;

    const filter = { user: req.user.id };

    const [items, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Order.countDocuments(filter),
    ]);

    res.json({ items, total, page, limit });
  } catch (err) {
    console.error("[orders.myOrders]", err);
    res.status(500).json({ message: "Không lấy được danh sách đơn", error: err.message });
  }
};



exports.getOne = async (req, res) => {
  try {
    const idOrCode = req.params.id;

    let order = null;

    // Nếu là ObjectId → tìm theo _id
    if (mongoose.Types.ObjectId.isValid(idOrCode)) {
      order = await Order.findById(idOrCode);
    }

    // Nếu không phải ObjectId → tìm theo mã đơn (ORD-xxxx)
    if (!order) {
      order = await Order.findOne({ code: idOrCode });
    }

    if (!order) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng." });
    }

    return res.json(order);

  } catch (err) {
    console.error("[orders.getOne]", err);
    res.status(500).json({ message: "Lỗi khi tải đơn", error: err.message });
  }
};


// Danh sách (admin)
// exports.list = async (req, res) => {
//   try {
//     const page = Math.max(1, Number(req.query.page) || 1);
//     const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 20));
//     const skip = (page - 1) * limit;

//     const [items, total] = await Promise.all([
//       Order.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
//       Order.countDocuments(),
//     ]);

//     res.json({ items, total, page, limit });
//   } catch (err) {
//     console.error("[orders.list]", err);
//     res.status(500).json({ message: "Không lấy được danh sách", error: err.message });
//   }
// };

// Cập nhật trạng thái (admin)
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allow = ["pending", "paid", "shipping", "completed", "cancelled"];
    if (!allow.includes(status)) {
      return res.status(400).json({ message: "Trạng thái không hợp lệ" });
    }

    const o = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!o) return res.status(404).json({ message: "Không tìm thấy đơn" });

    res.json(o);
  } catch (err) {
    console.error("[orders.updateStatus]", err);
    res.status(500).json({ message: "Cập nhật trạng thái thất bại", error: err.message });
  }
};



// KH tự hủy đơn khi còn 'pending'
exports.cancelByCustomer = async (req, res) => {
  try {
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    const { reason = "" } = req.body;

    const o = await Order.findById(id);
    if (!o) return res.status(404).json({ message: "Không tìm thấy đơn" });

    const isOwner = String(o.user) === String(req.user.id);
    if (!isOwner) return res.status(403).json({ message: "Bạn không có quyền hủy đơn này" });

    if (o.status !== "pending") {
      return res.status(400).json({ message: "Chỉ có thể hủy khi đơn còn chờ xác nhận" });
    }

    o.status = "cancelled";
    o.cancelledAt = new Date();
    o.cancelledBy = req.user.id;
    o.cancelReason = reason;
    await o.save();

    res.json(o);
  } catch (err) {
    console.error("[orders.cancelByCustomer]", err);
    res.status(500).json({ message: "Hủy đơn thất bại", error: err.message });
  }
};


exports.deleteOrder = async (req, res) => {
  try {
    const id = req.params.id;

    const order = await Order.findById(id);
    if (!order) return res.status(404).json({ message: "Không tìm thấy đơn" });

    const isOwner = String(order.user) === String(req.user.id);
    if (!isOwner) return res.status(403).json({ message: "Không có quyền xóa đơn" });

    if (!["cancelled", "completed"].includes(order.status)) {
      return res.status(400).json({ message: "Chỉ được xóa khi đơn đã huỷ hoặc hoàn thành" });
    }

    await Order.findByIdAndDelete(id);

    res.json({ message: "Đã xóa đơn thành công" });
  } catch (err) {
    console.error("[orders.deleteOrder]", err);
    res.status(500).json({ message: "Xóa đơn thất bại" });
  }
};



exports.generateReceiptPDF = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    // Load font Unicode
    const fontRegular = path.join(__dirname, "..", "fonts", "Roboto-Regular.ttf");
    const fontBold = path.join(__dirname, "..", "fonts", "Roboto-Bold.ttf");

    // Prepare PDF
    const doc = new PDFDocument({ margin: 40 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=receipt-${order.code || order._id}.pdf`
    );

    doc.pipe(res);

    // HEADER
    doc.font(fontBold).fontSize(24).text("NATURAHOME", 40, 40);
    doc.moveDown();
    doc.font(fontRegular).fontSize(14).text("HÓA ĐƠN MUA HÀNG");
    doc.moveDown(2);

    // ORDER INFO
    doc.font(fontBold).fontSize(16).text("Thông tin đơn hàng");
    doc.moveDown(0.5);
    doc.font(fontRegular).fontSize(12);
    doc.text(`Mã đơn: ${order.code || order._id}`);
    doc.text(`Ngày tạo: ${new Date(order.createdAt).toLocaleString("vi-VN")}`);
    doc.text(`Phương thức thanh toán: ${order.paymentMethod}`);
    doc.text(`Trạng thái: ${order.status}`);
    doc.moveDown(1.5);

    // CUSTOMER
    const c = order.customer || {};
    doc.font(fontBold).fontSize(16).text("Thông tin khách hàng");
    doc.moveDown(0.5);
    doc.font(fontRegular).fontSize(12);
    doc.text(`Họ tên: ${c.name}`);
    doc.text(`Điện thoại: ${c.phone}`);
    doc.text(`Email: ${c.email}`);
    doc.text(`Địa chỉ: ${c.address}`);
    if (c.note) doc.text(`Ghi chú: ${c.note}`);
    doc.moveDown(1.5);

    // ITEMS
    doc.font(fontBold).fontSize(16).text("Sản phẩm");
    doc.moveDown(0.5);

    doc.font(fontBold).fontSize(12);
    doc.text("Tên", 40);
    doc.text("SL", 260);
    doc.text("Giá", 310);
    doc.text("Tổng", 400);

    doc.moveTo(40, doc.y + 5).lineTo(550, doc.y + 5).stroke();
    doc.moveDown();

    doc.font(fontRegular).fontSize(12);

    (order.items || []).forEach((it) => {
      const qty = Number(it.quantity || 0);
      const price = Number(it.price || 0);
      doc.text(it.name, 40);
      doc.text(String(qty), 260);
      doc.text(price.toLocaleString("vi-VN"), 310);
      doc.text((qty * price).toLocaleString("vi-VN"), 400);
      doc.moveDown(0.3);
    });

    doc.moveDown(1);

    // TOTAL
    const amount = order.amount || 0;
    const ship = order.shippingFee || 0;
    const discount = order.discount || 0;
    const total = amount + ship - discount;

    doc.font(fontBold).fontSize(14);
    doc.text(`Tạm tính: ${amount.toLocaleString("vi-VN")} đ`, { align: "right" });
    doc.text(`Vận chuyển: ${ship.toLocaleString("vi-VN")} đ`, { align: "right" });
    doc.text(`Giảm giá: -${discount.toLocaleString("vi-VN")} đ`, { align: "right" });
    doc.moveDown(0.5);
    doc.fontSize(18).text(`Tổng thanh toán: ${total.toLocaleString("vi-VN")} đ`, {
      align: "right"
    });

    doc.end();
  } catch (err) {
    console.error("PDF ERROR:", err);
    res.status(500).json({ message: "Không tạo được PDF" });
  }
};