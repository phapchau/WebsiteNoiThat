








// // backend/models/Product.js
// const mongoose = require("mongoose");

// const ReviewSchema = new mongoose.Schema({
//   user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
//   rating: { type: Number, min: 1, max: 5, required: true },
//   comment: { type: String, default: "" },
//   orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
//   createdAt: { type: Date, default: Date.now },
// }, { _id: true });

// const productSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, trim: true, maxlength: 220 },
//     slug: { type: String, unique: true, index: true },
//     price: { type: Number, required: true, min: 0 },
//     inStock: { type: Number, default: 0 },
//     desc: { type: String, default: "" },
//     category: { type: String, index: true },
//     tags: [{ type: String, index: true }],
//     images: [{ type: String }],
//     poster: { type: String },
//     model3dUrl: { type: String },
//     is3D: { type: Boolean, default: false },
//     isActive: { type: Boolean, default: true },

//     // 👇 Bổ sung đánh giá
//     reviews: { type: [ReviewSchema], default: [] },
//     ratingAvg: { type: Number, default: 0 },
//     ratingCount: { type: Number, default: 0 },


    

//   },
//   { timestamps: true }
// );

// // tiện ích tính lại điểm
// productSchema.methods.recomputeRating = function () {
//   const n = this.reviews.length || 0;
//   if (!n) { this.ratingAvg = 0; this.ratingCount = 0; return; }
//   const sum = this.reviews.reduce((s, r) => s + (r.rating || 0), 0);
//   this.ratingAvg = Math.round((sum / n) * 10) / 10;
//   this.ratingCount = n;
// };

// module.exports = mongoose.model("Product", productSchema);
//7/11





// backend/models/Product.js
const mongoose = require("mongoose");

/* ==== Helpers để chuẩn hoá mảng chuỗi ==== */
const toStr = (v) => (typeof v === "string" ? v.trim() : v);
const uniqInsensitive = (arr = []) => {
  const m = new Map();
  arr.forEach((x) => {
    const s = (x ?? "").toString().trim();
    if (!s) return;
    const k = s.toLowerCase();
    if (!m.has(k)) m.set(k, s);
  });
  return Array.from(m.values());
};

const ReviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, default: "" },
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    images: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 220 },
    slug: { type: String, unique: true, index: true },
    price: { type: Number, required: true, min: 0 },
    inStock: { type: Number, default: 0 },
    desc: { type: String, default: "" },  
    category: { type: String, index: true },
    tags: [{ type: String, index: true }],
    images: [{ type: String }],
    poster: { type: String },
    model3dUrl: { type: String },
    is3D: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },

    /* ==== THÊM MỚI: màu sắc & kích cỡ ==== */
    colors: {
      type: [String],
      default: [],
      set: (v) => uniqInsensitive(Array.isArray(v) ? v.map(toStr) : []),
    },
    sizes: {
      type: [String],
      default: [],
      set: (v) => uniqInsensitive(Array.isArray(v) ? v.map(toStr) : []),
    },

    // Đánh giá
    reviews: { type: [ReviewSchema], default: [] },
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// tiện ích tính lại điểm
productSchema.methods.recomputeRating = function () {
  const n = this.reviews.length || 0;
  if (!n) {
    this.ratingAvg = 0;
    this.ratingCount = 0;
    return;
  }
  const sum = this.reviews.reduce((s, r) => s + (r.rating || 0), 0);
  this.ratingAvg = Math.round((sum / n) * 10) / 10;
  this.ratingCount = n;
};

module.exports = mongoose.model("Product", productSchema);
