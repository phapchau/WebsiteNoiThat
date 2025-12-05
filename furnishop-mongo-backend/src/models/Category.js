const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name:      { type: String, required: true, trim: true },
  slug:      { type: String, required: true, unique: true, index: true },
  // tuỳ chọn: 1 cấp cha (nếu bạn muốn nhóm lớn: Sofa, Bàn, Ghế…)
  parent:    { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null },

  order:     { type: Number, default: 0 },     // sắp xếp
  isActive:  { type: Boolean, default: true }, // bật/tắt
  image:     { type: String, default: "" },    // thumbnail dùng ở trang Home/Danh mục

  metaTitle:       { type: String, default: "" },  // SEO (tuỳ chọn)
  metaDescription: { type: String, default: "" },
}, { timestamps: true });

CategorySchema.index({ parent: 1, order: 1 });
module.exports = mongoose.model("Category", CategorySchema);
