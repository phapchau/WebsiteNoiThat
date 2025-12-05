


// // src/controllers/products.controller.js
// const mongoose = require("mongoose");
// const Product = require("../models/Product");
// const Category = require("../models/Category"); // ✅ thêm
// const Order = require("../models/Order");


// // slugify đơn giản, bạn có thể thay bằng slugify lib nếu muốn
// const slugify = (s) =>
//   String(s || "")
//     .toLowerCase()
//     .trim()
//     .replace(/\s+/g, "-")
//     .replace(/[^a-z0-9-]/g, "");

// // ---- helpers ----
// function toArrayTags(input) {
//   if (!input) return [];
//   if (Array.isArray(input)) return input.map(String).map((t) => t.trim()).filter(Boolean);
//   // "a, b, c"
//   return String(input)
//     .split(",")
//     .map((t) => t.trim())
//     .filter(Boolean);
// }

// // ✅ Chuẩn hoá category về slug (chấp nhận name/slug/_id)
// //    - nếu tồn tại Category → trả về slug của Category
// //    - nếu chưa có Category: trả lại slugify(input) để không chặn create
// async function normalizeCategory(input) {
//   if (!input) return "";
//   const raw = String(input).trim();

//   // _id
//   if (mongoose.Types.ObjectId.isValid(raw)) {
//     const byId = await Category.findById(raw);
//     if (byId) return byId.slug;
//   }

//   // slug khớp
//   const s = slugify(raw);
//   let doc = await Category.findOne({ slug: s });
//   if (doc) return doc.slug;

//   // tên khớp (không phân biệt hoa thường)
//   doc = await Category.findOne({ name: new RegExp(`^${raw}$`, "i") });
//   if (doc) return doc.slug;

//   // không tìm thấy → vẫn cho lưu theo slug đã slugify để không ngăn create
//   return s;
// }

// // Chuẩn hoá payload theo schema FE đang dùng
// function normalizePayload(body = {}) {
//   const payload = { ...body };

//   // map tên trường FE/BE
//   payload.description = body.description ?? body.desc ?? "";
//   payload.inStock =
//     body.inStock ??
//     body.stock ??
//     body.quantity ??
//     body.qty ??
//     body.countInStock ??
//     0;

//   // payload.model3d = body.model3d ?? body.model3dUrl ?? "";
//   payload.model3dUrl = body.model3dUrl ?? body.model3d ?? "";

//   // poster/images giữ nguyên nếu đã là url tương đối
//   payload.poster = body.poster ?? "";
//   payload.images = Array.isArray(body.images) ? body.images : [];

//   payload.tags = toArrayTags(body.tags);

//   // ép kiểu số
//   payload.price = Number(body.price || 0);
//   payload.inStock = Number(payload.inStock || 0);

//   // tên & slug
//   if (body.name != null) payload.name = String(body.name).trim();
//   if (payload.name && !body.slug) payload.slug = slugify(payload.name);
//   if (body.slug) payload.slug = slugify(body.slug);

//   return payload;
// }


// // Lấy toàn bộ review cho 1 sản phẩm
// exports.getReviews = async (req, res) => {
//   try {
//     const p = await Product.findById(req.params.id).select("reviews ratingAvg ratingCount");
//     if (!p) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
//     res.json({ reviews: p.reviews || [], ratingAvg: p.ratingAvg || 0, ratingCount: p.ratingCount || 0 });
//   } catch (e) {
//     res.status(500).json({ message: "Không tải được đánh giá", error: e.message });
//   }
// };

// // Tạo review (yêu cầu đăng nhập & đã mua sản phẩm)
// exports.addReview = async (req, res) => {
//   try {
//     const userId = req.user?.id;
//     if (!userId) return res.status(401).json({ message: "Bạn cần đăng nhập" });

//     const { rating, comment = "", orderId } = req.body;
//     const pid = req.params.id;

//     const p = await Product.findById(pid);
//     if (!p) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

//     // Nếu có orderId: kiểm tra đơn thuộc user và chứa sản phẩm
//     if (orderId) {
//       const od = await Order.findOne({ _id: orderId, user: userId });
//       if (!od) return res.status(403).json({ message: "Bạn không sở hữu đơn này" });
//       const hasItem = (od.items || []).some(it => String(it.product) === String(pid));
//       if (!hasItem) return res.status(400).json({ message: "Đơn không chứa sản phẩm này" });
//     }

//     p.reviews.push({ user: userId, rating: Number(rating) || 5, comment: String(comment || ""), orderId: orderId || null });
//     p.recomputeRating(); // method đã có trong model
//     await p.save();

//     res.status(201).json({ message: "Đã gửi đánh giá", ratingAvg: p.ratingAvg, ratingCount: p.ratingCount, reviews: p.reviews });
//   } catch (e) {
//     res.status(500).json({ message: "Gửi đánh giá thất bại", error: e.message });
//   }
// };


// // exports.addReview = async (req, res) => {
// //   try {
// //     const { id } = req.params; // product id
// //     const { rating, comment, orderId } = req.body;
// //     const userId = req.user?._id;

// //     if (!rating) return res.status(400).json({ message: "Thiếu rating" });

// //     const product = await Product.findById(id);
// //     if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

// //     // (tuỳ chọn) kiểm tra đã mua:
// //     // const bought = await Order.exists({ _id: orderId, "items.productId": id, user: userId });
// //     // if (!bought) return res.status(400).json({ message: "Bạn chưa mua sản phẩm này" });

// //     product.reviews.push({
// //       user: userId,
// //       rating: Number(rating),
// //       comment: comment || "",
// //       orderId: orderId || undefined,
// //     });
// //     product.recomputeRating();
// //     await product.save();

// //     res.status(201).json({
// //       message: "Đã thêm đánh giá",
// //       ratingAvg: product.ratingAvg,
// //       ratingCount: product.ratingCount,
// //     });
// //   } catch (e) {
// //     res.status(500).json({ message: e.message });
// //   }
// // };////có sài
// // ---- Controllers ----

// exports.create = async (req, res) => {
//   try {
//     const data = normalizePayload(req.body);
//     if (!data.name) return res.status(400).json({ message: "Thiếu tên sản phẩm" });
//     if (!data.slug) data.slug = slugify(data.name);

//     // ✅ chuẩn hoá category về slug
//     const catSlug = await normalizeCategory(req.body.category);

//     // unique slug
//     const existed = await Product.findOne({ slug: data.slug });
//     if (existed) return res.status(409).json({ message: "Sản phẩm đã tồn tại" });

//     const doc = await Product.create({
//       name: data.name,
//       slug: data.slug,
//       price: data.price,
//       inStock: data.inStock,
//       description: data.description,
//       category: catSlug,              // ✅ lưu theo slug
//       tags: data.tags,
//       images: data.images,
//       poster: data.poster,
//       // model3d: data.model3d,
//        model3dUrl: data.model3dUrl,
//       // is3D: Boolean(req.body.is3D) || Boolean(data.model3d),
//       is3D: Boolean(req.body.is3D) || Boolean(data.model3dUrl),
//       // isActive: true, // nếu schema có trường này và muốn mặc định bật
//     });

//     res.status(201).json(doc);
//   } catch (e) {
//     res.status(500).json({ message: e.message });
//   }
// };

// exports.update = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const patch = normalizePayload(req.body);

//     // nếu có đổi category ⇒ chuẩn hoá về slug
//     if (req.body.category != null) {
//       patch.category = await normalizeCategory(req.body.category);
//     }

//     // nếu đổi name/slug → kiểm tra unique slug (tránh đụng doc khác)
//     if (patch.slug) {
//       const existed = await Product.findOne({ slug: patch.slug, _id: { $ne: id } });
//       if (existed) return res.status(409).json({ message: "Slug đã được sử dụng" });
//     }

//     const doc = await Product.findByIdAndUpdate(
//       id,
//       {
//         ...(patch.name != null ? { name: patch.name } : {}),
//         ...(patch.slug != null ? { slug: patch.slug } : {}),
//         ...(patch.price != null ? { price: patch.price } : {}),
//         ...(patch.inStock != null ? { inStock: patch.inStock } : {}),
//         ...(patch.description != null ? { description: patch.description } : {}),
//         ...(patch.category != null ? { category: patch.category } : {}),
//         ...(patch.tags != null ? { tags: patch.tags } : {}),
//         ...(patch.images != null ? { images: patch.images } : {}),
//         ...(patch.poster != null ? { poster: patch.poster } : {}),
//         // ...(patch.model3d != null ? { model3d: patch.model3d } : {}),
//         ...(patch.model3dUrl != null ? { model3dUrl: patch.model3dUrl } : {}),
//         ...(patch.model3dUrl ? { is3D: true } : {}),
//         ...(req.body.isActive != null ? { isActive: !!req.body.isActive } : {}),
//         ...(req.body.is3D != null ? { is3D: !!req.body.is3D } : {}),
//       },
//       { new: true }
//     );

//     if (!doc) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
//     res.json(doc);
//   } catch (e) {
//     res.status(500).json({ message: e.message });
//   }
// };

// exports.remove = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const ok = await Product.findByIdAndDelete(id);
//     if (!ok) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
//     res.json({ ok: true });
//   } catch (e) {
//     res.status(500).json({ message: e.message });
//   }
// };

// exports.getOne = async (req, res) => {
//   try {
//     const idOrSlug = req.params.idOrSlug || req.params.slug || req.params.id;
//     if (!idOrSlug) return res.status(400).json({ message: "Thiếu idOrSlug" });

//     let doc = null;
//     if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
//       doc = await Product.findById(idOrSlug);
//     }
//     if (!doc) doc = await Product.findOne({ slug: idOrSlug });

//     if (!doc) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
//     res.json(doc);
//   } catch (e) {
//     res.status(500).json({ message: "Lỗi lấy sản phẩm", error: e.message });
//   }
// };

// exports.list = async (req, res) => {
//   try {
//     const {
//       q,
//       category,
//       minPrice,
//       maxPrice,
//       sort = "-createdAt",
//       page = 1,
//       limit = 12,
//       active, // optional: true/false
//     } = req.query;

//     const filter = {};
//     if (q) filter.name = { $regex: q, $options: "i" };

//     // ✅ lọc theo category: chấp nhận slug/name/_id
//     if (category) {
//       const catSlug = await normalizeCategory(category);
//       filter.category = catSlug;
//     }

//     if (minPrice || maxPrice) {
//       filter.price = {};
//       if (minPrice) filter.price.$gte = Number(minPrice);
//       if (maxPrice) filter.price.$lte = Number(maxPrice);
//     }
//     if (active != null) filter.isActive = active === "true";

//     const pg = Math.max(1, Number(page));
//     const lim = Math.max(1, Math.min(100, Number(limit)));
//     const skip = (pg - 1) * lim;

//     const [items, total] = await Promise.all([
//       Product.find(filter).sort(String(sort)).skip(skip).limit(lim),
//       Product.countDocuments(filter),
//     ]);

//     res.json({ items, total, page: pg, pages: Math.ceil(total / lim) });
//   } catch (e) {
//     res.status(500).json({ message: e.message });
//   }
// };//7/11












// // src/controllers/products.controller.js
// const mongoose = require("mongoose");
// const Product = require("../models/Product");
// const Category = require("../models/Category"); // ✅ giữ nguyên
// const Order = require("../models/Order");

// // ---- helpers ----

// // slugify đơn giản
// const slugify = (s) =>
//   String(s || "")
//     .toLowerCase()
//     .trim()
//     .replace(/\s+/g, "-")
//     .replace(/[^a-z0-9-]/g, "");

// // mảng tags
// function toArrayTags(input) {
//   if (!input) return [];
//   if (Array.isArray(input)) return input.map(String).map((t) => t.trim()).filter(Boolean);
//   return String(input)
//     .split(",")
//     .map((t) => t.trim())
//     .filter(Boolean);
// }

// // generic: nhận mảng hoặc CSV
// function toArrayCSV(input) {
//   if (!input) return [];
//   if (Array.isArray(input)) return input.map(String).map((v) => v.trim()).filter(Boolean);
//   return String(input)
//     .split(",")
//     .map((v) => v.trim())
//     .filter(Boolean);
// }

// // ✅ Chuẩn hoá category về slug (chấp nhận name/slug/_id)
// async function normalizeCategory(input) {
//   if (!input) return "";
//   const raw = String(input).trim();

//   // _id
//   if (mongoose.Types.ObjectId.isValid(raw)) {
//     const byId = await Category.findById(raw);
//     if (byId) return byId.slug;
//   }

//   // slug
//   const s = slugify(raw);
//   let doc = await Category.findOne({ slug: s });
//   if (doc) return doc.slug;

//   // name (case-insensitive)
//   doc = await Category.findOne({ name: new RegExp(`^${raw}$`, "i") });
//   if (doc) return doc.slug;

//   // không tìm thấy → trả slugify để không chặn create
//   return s;
// }

// // Chuẩn hoá payload theo schema/FE
// function normalizePayload(body = {}) {
//   const payload = { ...body };

//   // map tên trường FE/BE cho mô tả
//   payload.description = body.description ?? body.desc ?? "";

//   // inStock (nhận nhiều biến thể)
//   payload.inStock =
//     body.inStock ??
//     body.stock ??
//     body.quantity ??
//     body.qty ??
//     body.countInStock ??
//     0;

//   // Model 3D (ưu tiên model3dUrl)
//   payload.model3dUrl = body.model3dUrl ?? body.model3d ?? "";

//   // Poster / images
//   payload.poster = body.poster ?? "";
//   payload.images = Array.isArray(body.images) ? body.images : [];

//   // Tags
//   payload.tags = toArrayTags(body.tags);

//   // Colors / Sizes (hỗ trợ cả CSV lẫn mảng)
//   payload.colors = toArrayCSV(body.colors ?? body.colorsText);
//   payload.sizes  = toArrayCSV(body.sizes  ?? body.sizesText);

//   // ép kiểu số
//   payload.price = Number(body.price || 0);
//   payload.inStock = Number(payload.inStock || 0);

//   // tên & slug
//   if (body.name != null) payload.name = String(body.name).trim();
//   if (payload.name && !body.slug) payload.slug = slugify(payload.name);
//   if (body.slug) payload.slug = slugify(body.slug);

//   return payload;
// }

// // ---- Reviews ----
// exports.getReviews = async (req, res) => {
//   try {
//     const p = await Product.findById(req.params.id).select("reviews ratingAvg ratingCount");
//     if (!p) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
//     res.json({ reviews: p.reviews || [], ratingAvg: p.ratingAvg || 0, ratingCount: p.ratingCount || 0 });
//   } catch (e) {
//     res.status(500).json({ message: "Không tải được đánh giá", error: e.message });
//   }
// };

// exports.addReview = async (req, res) => {
//   try {
//     const userId = req.user?.id;
//     if (!userId) return res.status(401).json({ message: "Bạn cần đăng nhập" });

//     const { rating, comment = "", orderId } = req.body;
//     const pid = req.params.id;

//     const p = await Product.findById(pid);
//     if (!p) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

//     if (orderId) {
//       const od = await Order.findOne({ _id: orderId, user: userId });
//       if (!od) return res.status(403).json({ message: "Bạn không sở hữu đơn này" });
//       const hasItem = (od.items || []).some(it => String(it.product) === String(pid));
//       if (!hasItem) return res.status(400).json({ message: "Đơn không chứa sản phẩm này" });
//     }

//     p.reviews.push({ user: userId, rating: Number(rating) || 5, comment: String(comment || ""), orderId: orderId || null });
//     p.recomputeRating();
//     await p.save();

//     res.status(201).json({ message: "Đã gửi đánh giá", ratingAvg: p.ratingAvg, ratingCount: p.ratingCount, reviews: p.reviews });
//   } catch (e) {
//     res.status(500).json({ message: "Gửi đánh giá thất bại", error: e.message });
//   }
// };

// // ---- CRUD ----
// exports.create = async (req, res) => {
//   try {
//     const data = normalizePayload(req.body);
//     if (!data.name) return res.status(400).json({ message: "Thiếu tên sản phẩm" });
//     if (!data.slug) data.slug = slugify(data.name);

//     // category → slug
//     const catSlug = await normalizeCategory(req.body.category);

//     // unique slug
//     const existed = await Product.findOne({ slug: data.slug });
//     if (existed) return res.status(409).json({ message: "Sản phẩm đã tồn tại" });

//     const doc = await Product.create({
//       name: data.name,
//       slug: data.slug,
//       price: data.price,
//       inStock: data.inStock,
//       desc: data.description,            // ✅ ghi đúng field trong schema
//       category: catSlug,
//       tags: data.tags,
//       images: data.images,
//       poster: data.poster,
//       model3dUrl: data.model3dUrl,
//       is3D: Boolean(req.body.is3D) || Boolean(data.model3dUrl),
//       // ✅ mới
//       colors: data.colors,
//       sizes: data.sizes,
//     });

//     res.status(201).json(doc);
//   } catch (e) {
//     res.status(500).json({ message: e.message });
//   }
// };

// exports.update = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const patch = normalizePayload(req.body);

//     // category → slug nếu có
//     if (req.body.category != null) {
//       patch.category = await normalizeCategory(req.body.category);
//     }

//     // đổi slug → kiểm tra đụng doc khác
//     if (patch.slug) {
//       const existed = await Product.findOne({ slug: patch.slug, _id: { $ne: id } });
//       if (existed) return res.status(409).json({ message: "Slug đã được sử dụng" });
//     }

//     const doc = await Product.findByIdAndUpdate(
//       id,
//       {
//         ...(patch.name != null ? { name: patch.name } : {}),
//         ...(patch.slug != null ? { slug: patch.slug } : {}),
//         ...(patch.price != null ? { price: patch.price } : {}),
//         ...(patch.inStock != null ? { inStock: patch.inStock } : {}),
//         ...(patch.description != null ? { desc: patch.description } : {}), // ✅ ghi vào desc
//         ...(patch.category != null ? { category: patch.category } : {}),
//         ...(patch.tags != null ? { tags: patch.tags } : {}),
//         ...(patch.images != null ? { images: patch.images } : {}),
//         ...(patch.poster != null ? { poster: patch.poster } : {}),
//         ...(patch.model3dUrl != null ? { model3dUrl: patch.model3dUrl } : {}),
//         ...(patch.model3dUrl ? { is3D: true } : {}),
//         ...(req.body.isActive != null ? { isActive: !!req.body.isActive } : {}),
//         ...(req.body.is3D != null ? { is3D: !!req.body.is3D } : {}),
//         // ✅ mới
//         ...(patch.colors != null ? { colors: patch.colors } : {}),
//         ...(patch.sizes  != null ? { sizes: patch.sizes } : {}),
//       },
//       { new: true }
//     );

//     if (!doc) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
//     res.json(doc);
//   } catch (e) {
//     res.status(500).json({ message: e.message });
//   }
// };

// exports.remove = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const ok = await Product.findByIdAndDelete(id);
//     if (!ok) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
//     res.json({ ok: true });
//   } catch (e) {
//     res.status(500).json({ message: e.message });
//   }
// };

// exports.getOne = async (req, res) => {
//   try {
//     const idOrSlug = req.params.idOrSlug || req.params.slug || req.params.id;
//     if (!idOrSlug) return res.status(400).json({ message: "Thiếu idOrSlug" });

//     let doc = null;
//     if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
//       doc = await Product.findById(idOrSlug);
//     }
//     if (!doc) doc = await Product.findOne({ slug: idOrSlug });

//     if (!doc) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
//     res.json(doc);
//   } catch (e) {
//     res.status(500).json({ message: "Lỗi lấy sản phẩm", error: e.message });
//   }
// };

// exports.list = async (req, res) => {
//   try {
//     const {
//       q,
//       category,
//       minPrice,
//       maxPrice,
//       sort = "-createdAt",
//       page = 1,
//       limit = 12,
//       active, // optional: true/false
//     } = req.query;

//     const filter = {};
//     if (q) filter.name = { $regex: q, $options: "i" };

//     // lọc theo category (slug)
//     if (category) {
//       const catSlug = await normalizeCategory(category);
//       filter.category = catSlug;
//     }

//     if (minPrice || maxPrice) {
//       filter.price = {};
//       if (minPrice) filter.price.$gte = Number(minPrice);
//       if (maxPrice) filter.price.$lte = Number(maxPrice);
//     }
//     if (active != null) filter.isActive = active === "true";

//     const pg = Math.max(1, Number(page));
//     const lim = Math.max(1, Math.min(100, Number(limit)));
//     const skip = (pg - 1) * lim;

//     const [items, total] = await Promise.all([
//       Product.find(filter).sort(String(sort)).skip(skip).limit(lim),
//       Product.countDocuments(filter),
//     ]);

//     res.json({ items, total, page: pg, pages: Math.ceil(total / lim) });
//   } catch (e) {
//     res.status(500).json({ message: e.message });
//   }
// };///16//11













// src/controllers/products.controller.js
const mongoose = require("mongoose");
const Product = require("../models/Product");
const Category = require("../models/Category");
const Order = require("../models/Order");
const path = require("path");
const fs = require("fs");

// ================= Helpers =================

// slugify đơn giản
const slugify = (s) =>
  String(s || "")
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "");

// array từ CSV / mảng
const toArray = (input) => {
  if (!input) return [];
  if (Array.isArray(input)) return input.map(String).map(v => v.trim()).filter(Boolean);
  return String(input).split(",").map(v => v.trim()).filter(Boolean);
};

// chuẩn hoá category → slug
async function normalizeCategory(input) {
  if (!input) return "";
  const raw = String(input).trim();

  if (mongoose.Types.ObjectId.isValid(raw)) {
    const doc = await Category.findById(raw);
    if (doc) return doc.slug;
  }

  const s = slugify(raw);
  let doc = await Category.findOne({ slug: s });
  if (doc) return doc.slug;

  doc = await Category.findOne({ name: new RegExp(`^${raw}$`, "i") });
  if (doc) return doc.slug;

  return s;
}

// chuẩn hoá payload FE → BE
function normalizePayload(body = {}) {
  const payload = { ...body };
  payload.name = body.name ? String(body.name).trim() : undefined;
  payload.slug = body.slug ? slugify(body.slug) : payload.name ? slugify(payload.name) : undefined;
  payload.description = body.description ?? body.desc ?? "";
  payload.price = Number(body.price || 0);
  payload.inStock = Number(body.inStock ?? body.stock ?? body.quantity ?? body.qty ?? body.countInStock ?? 0);
  payload.model3dUrl = body.model3dUrl ?? body.model3d ?? "";
  payload.poster = body.poster ?? "";
  payload.images = Array.isArray(body.images) ? body.images : [];
  payload.tags = toArray(body.tags);
  payload.colors = toArray(body.colors ?? body.colorsText);
  payload.sizes = toArray(body.sizes ?? body.sizesText);
  return payload;
}

// recompute rating
function recomputeRating(product) {
  const reviews = product.reviews || [];
  const count = reviews.length;
  const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
  product.ratingCount = count;
  product.ratingAvg = count ? sum / count : 0;
}

// ================= Controllers =================

// GET Reviews
exports.getReviews = async (req, res) => {
  try {
    const p = await Product.findById(req.params.id).select("reviews ratingAvg ratingCount");
    if (!p) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json({ reviews: p.reviews || [], ratingAvg: p.ratingAvg || 0, ratingCount: p.ratingCount || 0 });
  } catch (e) {
    res.status(500).json({ message: "Không tải được đánh giá", error: e.message });
  }
};

// POST Review + upload ảnh
// exports.addReview = async (req, res) => {
//   try {
//     const userId = req.user?.id;
//     if (!userId) return res.status(401).json({ message: "Bạn cần đăng nhập" });

//     const { rating, comment = "", orderId } = req.body;
//     const pid = req.params.id;
//     const product = await Product.findById(pid);
//     if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

//     // kiểm tra order nếu có
//     if (orderId) {
//       const order = await Order.findOne({ _id: orderId, user: userId });
//       if (!order) return res.status(403).json({ message: "Bạn không sở hữu đơn này" });
//       const hasItem = (order.items || []).some(i => String(i.product) === String(pid));
//       if (!hasItem) return res.status(400).json({ message: "Đơn không chứa sản phẩm này" });
//     }

//     // xử lý ảnh upload
//     let images = [];
//     if (req.files && req.files.length > 0) {
//       images = req.files.map(f => `/uploads/${f.filename}`);
//     }

//     product.reviews.push({ user: userId, rating: Number(rating) || 5, comment, orderId: orderId || null, images });
//     recomputeRating(product);
//     await product.save();

//     res.status(201).json({ message: "Đã gửi đánh giá", ratingAvg: product.ratingAvg, ratingCount: product.ratingCount, reviews: product.reviews });
//   } catch (e) {
//     res.status(500).json({ message: "Gửi đánh giá thất bại", error: e.message });
//   }
// };


// POST Review + upload ảnh
// POST Review + upload ảnh
exports.addReview = async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Bạn cần đăng nhập" });

    const { rating, comment = "", orderId } = req.body;
    const pid = req.params.id;
    const product = await Product.findById(pid);
    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    // Kiểm tra order nếu có
    if (orderId) {
      const order = await Order.findOne({ _id: orderId, user: userId });
      if (!order) return res.status(403).json({ message: "Bạn không sở hữu đơn này" });
      const hasItem = (order.items || []).some(i => String(i.product) === String(pid));
      if (!hasItem) return res.status(400).json({ message: "Đơn không chứa sản phẩm này" });
    }

    // Xử lý ảnh upload
    let images = [];
    if (req.files && req.files.length > 0) {
      const ORIGIN = process.env.VITE_API_ORIGIN || "http://localhost:8081";
      images = req.files.map(f => `${ORIGIN}/uploads/${f.filename}`);
    }

    // Thêm review
    const newReview = {
      user: userId,
      rating: Number(rating) || 5,
      comment,
      orderId: orderId || null,
      images
    };
    product.reviews.push(newReview);

    // Cập nhật rating
    const reviews = product.reviews || [];
    const sum = reviews.reduce((acc, r) => acc + (r.rating || 0), 0);
    product.ratingCount = reviews.length;
    product.ratingAvg = reviews.length ? sum / reviews.length : 0;

    await product.save();

    res.status(201).json({
      message: "Đã gửi đánh giá",
      review: newReview,
      ratingAvg: product.ratingAvg,
      ratingCount: product.ratingCount,
      reviews: product.reviews
    });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Gửi đánh giá thất bại", error: e.message });
  }
};



// CREATE product
exports.create = async (req, res) => {
  try {
    const data = normalizePayload(req.body);
    if (!data.name) return res.status(400).json({ message: "Thiếu tên sản phẩm" });

    data.category = await normalizeCategory(req.body.category);
    const existed = await Product.findOne({ slug: data.slug });
    if (existed) return res.status(409).json({ message: "Sản phẩm đã tồn tại" });

    const product = await Product.create({ ...data, desc: data.description, is3D: Boolean(data.model3dUrl) || !!req.body.is3D });
    res.status(201).json(product);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// UPDATE product
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const patch = normalizePayload(req.body);
    if (req.body.category != null) patch.category = await normalizeCategory(req.body.category);

    if (patch.slug) {
      const existed = await Product.findOne({ slug: patch.slug, _id: { $ne: id } });
      if (existed) return res.status(409).json({ message: "Slug đã được sử dụng" });
    }

    const updated = await Product.findByIdAndUpdate(id, { ...patch, desc: patch.description }, { new: true });
    if (!updated) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json(updated);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// DELETE product
exports.remove = async (req, res) => {
  try {
    const { id } = req.params;
    const ok = await Product.findByIdAndDelete(id);
    if (!ok) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

// GET one product
exports.getOne = async (req, res) => {
  try {
    const idOrSlug = req.params.idOrSlug || req.params.slug || req.params.id;
    if (!idOrSlug) return res.status(400).json({ message: "Thiếu idOrSlug" });

    let product = null;
    if (mongoose.Types.ObjectId.isValid(idOrSlug)) product = await Product.findById(idOrSlug);
    if (!product) product = await Product.findOne({ slug: idOrSlug });
    if (!product) return res.status(404).json({ message: "Không tìm thấy sản phẩm" });

    res.json(product);
  } catch (e) {
    res.status(500).json({ message: "Lỗi lấy sản phẩm", error: e.message });
  }
};

// LIST products
exports.list = async (req, res) => {
  try {
    const { q, category, minPrice, maxPrice, sort = "-createdAt", page = 1, limit = 12, active } = req.query;
    const filter = {};

    if (q) filter.name = { $regex: q, $options: "i" };
    if (category) filter.category = await normalizeCategory(category);
    if (minPrice || maxPrice) filter.price = { ...(minPrice ? { $gte: Number(minPrice) } : {}), ...(maxPrice ? { $lte: Number(maxPrice) } : {}) };
    if (active != null) filter.isActive = active === "true";

    const pg = Math.max(1, Number(page));
    const lim = Math.max(1, Math.min(100, Number(limit)));
    const skip = (pg - 1) * lim;

    const [items, total] = await Promise.all([
      Product.find(filter).sort(sort).skip(skip).limit(lim),
      Product.countDocuments(filter),
    ]);

    res.json({ items, total, page: pg, pages: Math.ceil(total / lim) });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};




// GET /api/products/sale
// GET /api/products/sale
exports.listSale = async (req, res) => {
  try {
    const products = await Product.find({
      $or: [
        { comparePrice: { $exists: true, $gt: 0 } },
        { salePercent: { $exists: true, $gt: 0 } }
      ]
    }).lean();

    const mapped = products.map(p => {
      const oldPrice = p.comparePrice || p.price;
      const percent =
        p.salePercent ||
        (p.comparePrice > p.price
          ? Math.round(((p.comparePrice - p.price) / p.comparePrice) * 100)
          : 0);

      const newPrice = percent > 0
        ? Math.round(oldPrice * (1 - percent / 100))
        : p.price;

      return {
        ...p,
        oldPrice,
        salePercent: percent,
        salePrice: newPrice
      };
    });

    res.json(mapped);
  } catch (err) {
    console.error("[listSale]", err);
    res.status(500).json({ message: "Không tải được sản phẩm khuyến mãi" });
  }
};


exports.flashSalePro = async (req, res) => {
  try {
    const now = new Date();
    const hour = now.getHours();

    const sessions = [
      { label: "09:00", start: 9, end: 12 },
      { label: "12:00", start: 12, end: 15 },
      { label: "15:00", start: 15, end: 21 },
      { label: "21:00", start: 21, end: 24 },
    ];

    const current = sessions.find(s => hour >= s.start && hour < s.end);

    if (!current) {
      return res.json({
        session: null,
        products: [],
        message: "Flash Sale hôm nay đã kết thúc!"
      });
    }

    // Lấy sản phẩm có giảm giá
    const raw = await Product.find({
      $or: [
        { comparePrice: { $exists: true, $gt: 0 } },
        { salePercent: { $exists: true, $gt: 0 } }
      ]
    }).lean();

    const products = raw.map(p => {
      const old = p.comparePrice > 0 ? p.comparePrice : p.price;

      // Nếu có salePercent → ưu tiên
      let percent = p.salePercent;
      if (!percent && p.comparePrice > p.price) {
        percent = Math.round(((p.comparePrice - p.price) / p.comparePrice) * 100);
      }

      // Tính giá sau giảm
      const salePrice = Math.round(old * (1 - percent / 100));

      return {
        ...p,
        oldPrice: old,
        salePercent: percent,
        salePrice,
        soldPercent: Math.floor(Math.random() * 80) + 10
      };
    });

    res.json({
      session: {
        start: current.start,
        end: current.end,
        label: current.label,
      },
      products
    });

  } catch (err) {
    console.error("FLASH SALE PRO ERROR:", err);
    res.status(500).json({ message: "Không tải được Flash Sale" });
  }
};
