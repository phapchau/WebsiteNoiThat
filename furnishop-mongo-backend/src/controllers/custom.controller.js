

// src/controllers/custom.controller.js
const path = require("path");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const CustomRequest = require("../models/CustomRequest");



function makeCode(prefix = "CR") {
  const d = new Date();
  const Y = d.getFullYear();
  const M = String(d.getMonth() + 1).padStart(2, "0");
  const D = String(d.getDate()).padStart(2, "0");
  const sfx = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `${prefix}-${Y}${M}${D}-${sfx}`;
}

// KH tạo mới
async function createRequest(req, res) {
  try {
    const u = req.user; // từ requireAuth
    const {
      title, description,
      length, width, height, unit,
      materials, color, budgetMax
    } = req.body || {};

    // validate
    if (!title || !String(title).trim()) {
      return res.status(400).json({ message: "Vui lòng nhập tiêu đề." });
    }
    const L = Number(length), W = Number(width), H = Number(height);
    if (!(L > 0 && W > 0 && H > 0)) {
      return res.status(400).json({ message: "Vui lòng nhập đủ 3 chiều (L, W, H) > 0." });
    }

    const files = (req.files || []).map(f => ({
      url: `/uploads/custom/${path.basename(f.path)}`,
      name: f.originalname,
      type: f.mimetype,
      size: f.size,
    }));

    const doc = await CustomRequest.create({
      code: makeCode(),
      customer: {
        user: u?._id,
        name: u?.name || u?.email || "",
        phone: u?.phone || "",
        email: u?.email || "",
      },
      brief: {
        title: String(title).trim(),
        description: description || "",
        length: L, width: W, height: H,
        unit: unit || "cm",
        materials: materials || "",
        color: color || "",
        budgetMax: Number(budgetMax) || undefined,
      },
      files,
      status: "SUBMITTED",
      history: [{ by: "customer", action: "SUBMITTED" }],
    });

    res.json(doc);
  } catch (e) {
    console.error("createRequest error:", e);
    res.status(500).json({ message: "Không tạo được yêu cầu." });
  }
}

// KH – list theo user
async function listMine(req, res) {
  try {
    const docs = await CustomRequest.find({ "customer.user": req.user._id })
      .sort({ createdAt: -1 })
      .lean();
    res.json(docs);
  } catch (e) {
    res.status(500).json({ message: "Không tải được danh sách." });
  }
}

// KH – xem chi tiết
async function getOne(req, res) {
  try {
    const doc = await CustomRequest.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ message: "Không tìm thấy yêu cầu." });
    if (String(doc.customer.user) !== String(req.user._id) && req.user.role !== "admin") {
      return res.status(403).json({ message: "Không có quyền." });
    }
    res.json(doc);
  } catch (e) {
    res.status(500).json({ message: "Không xem được yêu cầu." });
  }
}

// Admin – list all (có lọc đơn giản nếu muốn)
async function listAll(req, res) {
  try {
    const { status, code, page = 1, limit = 20 } = req.query;
    const q = {};
    if (status) q.status = status;
    if (code) q.code = new RegExp(code, "i");

    const p = Math.max(1, Number(page) || 1);
    const l = Math.min(100, Math.max(1, Number(limit) || 20));

    const [items, total] = await Promise.all([
      CustomRequest.find(q).sort({ createdAt: -1 }).skip((p - 1) * l).limit(l).lean(),
      CustomRequest.countDocuments(q),
    ]);
    res.json({ items, total, page: p, limit: l });
  } catch (e) {
    res.status(500).json({ message: "Không tải được danh sách." });
  }
}

// Admin – báo giá
async function adminQuote(req, res) {
  try {
    const { id } = req.params;
    const { price, leadTimeDays, note, expiresAt } = req.body || {};
    const doc = await CustomRequest.findById(id);
    if (!doc) return res.status(404).json({ message: "Không tìm thấy yêu cầu." });

    doc.quote = {
      price: Number(price) || 0,
      leadTimeDays: Number(leadTimeDays) || 0,
      note: note || "",
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      createdAt: new Date(),
    };
    doc.status = "QUOTED";
    doc.history.push({ by: "admin", action: "QUOTED" });
    await doc.save();

    res.json(doc);
  } catch (e) {
    res.status(500).json({ message: "Không cập nhật báo giá." });
  }
}

// Admin – cập nhật trạng thái
async function adminUpdateStatus(req, res) {
  try {
    const { id } = req.params;
    const { status } = req.body || {};
    const { STATUS } = require("../models/CustomRequest");
    if (!STATUS.includes(status)) return res.status(400).json({ message: "Trạng thái không hợp lệ." });

    const doc = await CustomRequest.findByIdAndUpdate(
      id,
      { $set: { status }, $push: { history: { by: "admin", action: status } } },
      { new: true }
    );
    if (!doc) return res.status(404).json({ message: "Không tìm thấy yêu cầu." });

    res.json(doc);
  } catch (e) {
    res.status(500).json({ message: "Không cập nhật trạng thái." });
  }
}



// KH – chấp nhận báo giá
async function customerAcceptQuote(req, res) {
  try {
    const { id } = req.params;
    const doc = await CustomRequest.findById(id);
    if (!doc) return res.status(404).json({ message: "Không tìm thấy yêu cầu." });

    if (String(doc.customer.user) !== String(req.user._id))
      return res.status(403).json({ message: "Không có quyền." });

    if (!doc.quote)
      return res.status(400).json({ message: "Chưa có báo giá." });

    // KHÔNG CÒN ĐẶT CỌC – CHỈ CHUYỂN SANG ACCEPTED
    doc.status = "ACCEPTED";
    doc.history.push({ by: "customer", action: "ACCEPTED" });

    await doc.save();
    res.json(doc);
  } catch (e) {
    res.status(500).json({ message: "Không xác nhận được." });
  }
}


// KH – từ chối báo giá
async function customerRejectQuote(req, res) {
  try {
    const { id } = req.params;
    const doc = await CustomRequest.findById(id);
    if (!doc) return res.status(404).json({ message: "Không tìm thấy yêu cầu." });
    if (String(doc.customer.user) !== String(req.user._id)) {
      return res.status(403).json({ message: "Không có quyền." });
    }
    doc.status = "REJECTED";
    doc.history.push({ by: "customer", action: "REJECTED" });
    await doc.save();
    res.json(doc);
  } catch (e) {
    res.status(500).json({ message: "Không thực hiện được." });
  }
}


// thêm dưới các hàm customerAcceptQuote / customerRejectQuote
async function customerCancel(req, res) {
  try {
    const { id } = req.params;
    const doc = await CustomRequest.findById(id);
    if (!doc) return res.status(404).json({ message: "Không tìm thấy yêu cầu." });

    // chỉ chủ đơn mới được hủy
    if (String(doc.customer.user) !== String(req.user._id)) {
      return res.status(403).json({ message: "Không có quyền." });
    }

    // nếu đã thi công/hoàn thành thì không cho hủy (tùy ý)
    if (["IN_PROGRESS", "COMPLETE"].includes(doc.status)) {
      return res.status(400).json({ message: "Không thể hủy ở giai đoạn này." });
    }

    doc.status = "CANCELED";
    doc.history.push({ by: "customer", action: "CANCELED" });
    await doc.save();
    res.json(doc);
  } catch (e) {
    res.status(500).json({ message: "Không hủy được yêu cầu." });
  }
}

async function exportReceipt(req, res) {
  try {
    const cr = await CustomRequest.findById(req.params.id);
    if (!cr) return res.status(404).json({ message: "Không tìm thấy yêu cầu" });
    if (!cr.paid) return res.status(400).json({ message: "Yêu cầu chưa thanh toán" });

    const PDFDocument = require("pdfkit");
    const doc = new PDFDocument({ size: "A4", margin: 50 });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="receipt-${cr.code}.pdf"`
    );

    doc.pipe(res);

    // ==== HEADER ====
    doc
      .font("Helvetica-Bold")
      .fontSize(26)
      .fillColor("#B88E2F")
      .text("BIÊN LAI THANH TOÁN", { align: "center" });

    doc.moveDown(2);

    // ==== INFORMATION ====
    doc.font("Helvetica-Bold").fontSize(14).fillColor("#000");
    doc.text("Thông tin giao dịch");
    doc.moveDown(0.5);

    const add = (label, value) => {
      doc.font("Helvetica-Bold").text(label + ":", { continued: true });
      doc.font("Helvetica").text(" " + value);
      doc.moveDown(0.3);
    };

    add("Mã yêu cầu", cr.code);
    add("Khách hàng", cr.customer.name);
    add("Email", cr.customer.email);
    add(
      "Ngày thanh toán",
      cr.paidAt ? new Date(cr.paidAt).toLocaleString("vi-VN") : "-"
    );

    doc.moveDown(1.5);

    // ==== PAYMENT BOX ====
    const top = doc.y;

    doc
      .roundedRect(50, top, 500, 100, 8)
      .fillOpacity(0.08)
      .fill("#B88E2F")
      .fillOpacity(1);

    doc.font("Helvetica-Bold").fontSize(14).fillColor("#000");
    doc.text("Chi tiết thanh toán", 60, top + 10);

    doc.font("Helvetica-Bold");
    doc.text("Nội dung", 60, top + 40);
    doc.text("Số tiền", 380, top + 40);

    doc
      .moveTo(50, top + 60)
      .lineTo(550, top + 60)
      .strokeColor("#D9B98C")
      .stroke();

    doc.font("Helvetica");
    doc.text("Thanh toán thiết kế theo yêu cầu", 60, top + 75);
    doc.text(
      `${Number(cr.paidAmount || 0).toLocaleString("vi-VN")} đ`,
      380,
      top + 75
    );

    doc.moveDown(5);

    // ==== FOOTER ====
    doc
      .font("Helvetica")
      .fontSize(11)
      .fillColor("#777")
      .text("Cảm ơn bạn đã sử dụng dịch vụ!", { align: "center" })
      .moveDown(0.3)
      .text("Biên lai được tạo tự động, không cần chữ ký.", {
        align: "center",
      });

    doc.end();
  } catch (e) {
    console.error("EXPORT RECEIPT ERROR:", e);
    res.status(500).json({ message: "Lỗi tạo PDF" });
  }
}



module.exports = {
  createRequest,
  listMine,
  getOne,
  listAll,
  adminQuote,
  adminUpdateStatus,
  customerAcceptQuote,
  customerRejectQuote,
  customerCancel,
  exportReceipt,
};

