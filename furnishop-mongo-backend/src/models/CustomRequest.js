
// // src/models/CustomRequest.js
// const mongoose = require("mongoose");

// const FILE_SCHEMA = new mongoose.Schema({
//   url: String,     // /uploads/custom/xxxx.jpg
//   name: String,
//   type: String,
//   size: Number,
// }, { _id: false });


// const PAYMENT_RECORD_SCHEMA = new mongoose.Schema({
//   provider: String,        // e.g. "stripe", "momo", "vnpay", "manual"
//   transactionId: String,   // id từ gateway / provider
//   amount: Number,          // số tiền (VNĐ)
//   currency: { type: String, default: "VND" },
//   paidAt: Date,
//   meta: mongoose.Schema.Types.Mixed, // lưu raw response nếu cần
// }, { _id: false });


// const QUOTE_SCHEMA = new mongoose.Schema({
//   price: Number,           // VND
//   leadTimeDays: Number,    // số ngày thực hiện
//   note: String,
//   expiresAt: Date,
//   createdAt: { type: Date, default: Date.now },
//   // --- deposit fields related to the quote (tính khi admin tạo quote)
//   depositPercent: { type: Number, default: 30 }, // % deposit mặc định (30%)
//   depositAmount: { type: Number, default: 0 },   // số tiền đặt cọc (VNĐ)
// }, { _id: false });



// const PAYMENT_STATUS = ["NONE", "DEPOSIT_PAID", "COMPLETED", "REFUNDED"];

// const STATUS = [
//   "SUBMITTED",   // KH gửi yêu cầu
//   "REVIEWING",   // cửa hàng đang xem
//   "QUOTED",      // đã báo giá
//   "ACCEPTED",    // KH đồng ý báo giá
//   "REJECTED",    // KH từ chối báo giá
//   "CANCELED",    // KH huỷ
//   "IN_PROGRESS", // đang thi công
//   "DONE",        // hoàn thành
// ];




// const CustomRequestSchema = new mongoose.Schema({
//   code: { type: String, index: true }, // VD: CR-20250101-AB12
//   customer: {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
//     name: String,
//     phone: String,
//     email: String,
//   },
//   brief: {
//     title: { type: String, required: true },
//     description: String,
//     // Lưu 3 chiều tách bạch + đơn vị
//     length: Number,  // dài
//     width: Number,   // rộng
//     height: Number,  // cao
//     unit: { type: String, default: "cm" }, // cm | mm | m
//     materials: String,
//     color: String,
//     budgetMax: Number,
//   },
//   files: [FILE_SCHEMA],
//   status: { type: String, enum: STATUS, default: "SUBMITTED", index: true },
//   quote: QUOTE_SCHEMA,


//   // Payment tracking (không bắt buộc)
//   paymentStatus: { type: String, enum: PAYMENT_STATUS, default: "NONE", index: true },

//   // record thanh toán đặt cọc (deposit) và thanh toán cuối
//   depositPayment: PAYMENT_RECORD_SCHEMA,   // nếu KH đã trả đặt cọc
//   finalPayment: PAYMENT_RECORD_SCHEMA,     // nếu KH đã trả phần còn lại

//   // refund tracking
//   refundAmount: { type: Number, default: 0 },
//   refundRecords: [PAYMENT_RECORD_SCHEMA],

//   // optional policy text snapshots (lưu trữ chính sách áp dụng cho request này)
//   cancellationPolicy: { type: String, default: "" },
//   refundPolicy: { type: String, default: "" },





  
//   history: [{
//     at: { type: Date, default: Date.now },
//     by: String,   // 'customer' | 'admin'
//     action: String,
//     meta: mongoose.Schema.Types.Mixed,
//   }],
// }, { timestamps: true });


// // * Helper instance method: compute depositAmount from quote.price and depositPercent
// //  * - sử dụng khi admin tạo quote: request.quote.depositAmount = request.quote.price * depositPercent / 100

// CustomRequestSchema.methods.recalculateDeposit = function () {
//   if (this.quote && typeof this.quote.price === "number" && typeof this.quote.depositPercent === "number") {
//     const amt = Math.round((this.quote.price * (this.quote.depositPercent || 30)) / 100);
//     this.quote.depositAmount = amt;
//     return amt;
//   }
//   return 0;
// };

// CustomRequestSchema.pre("save", function (next) {
//   try {
//     // only update if quote exists
//     if (this.quote && (this.isModified("quote.price") || this.isModified("quote.depositPercent") || !this.quote.depositAmount)) {
//       this.recalculateDeposit();
//     }
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// /**
//  * static helper (tuỳ chọn): tạo quote nhanh và recalc deposit
//  * usage: CustomRequest.createQuote(req, { price: 1000000, leadTimeDays: 7, depositPercent: 30 })
//  */
// CustomRequestSchema.statics.applyQuote = async function (id, quoteObj = {}, by = "admin") {
//   const r = await this.findById(id);
//   if (!r) throw new Error("Custom request not found");
//   r.quote = Object.assign(r.quote || {}, quoteObj);
//   // ensure depositPercent within 0..100
//   r.quote.depositPercent = Math.max(0, Math.min(100, Number(r.quote.depositPercent || 30)));
//   r.recalculateDeposit();
//   r.status = "QUOTED";
//   r.history = r.history || [];
//   r.history.push({ by, action: "quote_applied", meta: { quote: r.quote } });
//   await r.save();
//   return r;
// };


// module.exports = mongoose.model("CustomRequest", CustomRequestSchema);
// module.exports.STATUS = STATUS;
// module.exports.PAYMENT_STATUS = PAYMENT_STATUS;///15/11








// // src/models/CustomRequest.js
// const mongoose = require("mongoose");

// const FILE_SCHEMA = new mongoose.Schema({
//   url: String,
//   name: String,
//   type: String,
//   size: Number,
// }, { _id: false });

// const PAYMENT_RECORD_SCHEMA = new mongoose.Schema({
//   provider: String,        // e.g. "stripe", "momo", "vnpay", "manual"
//   transactionId: String,   // id từ gateway / provider
//   amount: Number,          // số tiền (VNĐ)
//   currency: { type: String, default: "VND" },
//   paidAt: Date,
//   meta: mongoose.Schema.Types.Mixed,
// }, { _id: false });

// const QUOTE_SCHEMA = new mongoose.Schema({
//   price: Number,           
//   leadTimeDays: Number,    
//   note: String,
//   expiresAt: Date,
//   createdAt: { type: Date, default: Date.now },
//   depositPercent: { type: Number, default: 30 },
//   depositAmount: { type: Number, default: 0 },   
// }, { _id: false });

// const PAYMENT_STATUS = ["NONE", "DEPOSIT_PAID", "COMPLETED", "REFUNDED"];

// const STATUS = [
//   "SUBMITTED", "REVIEWING", "QUOTED", "ACCEPTED", 
//   "REJECTED", "CANCELED", "IN_PROGRESS", "DONE",
// ];

// const CustomRequestSchema = new mongoose.Schema({
//   code: { type: String, index: true },
//   customer: {
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
//     name: String,
//     phone: String,
//     email: String,
//   },
//   brief: {
//     title: { type: String, required: true },
//     description: String,
//     length: Number,
//     width: Number,
//     height: Number,
//     unit: { type: String, default: "cm" },
//     materials: String,
//     color: String,
//     budgetMax: Number,
//   },
//   files: [FILE_SCHEMA],
//   status: { type: String, enum: STATUS, default: "SUBMITTED", index: true },
//   quote: QUOTE_SCHEMA,

//   paymentStatus: { type: String, enum: PAYMENT_STATUS, default: "NONE", index: true },

//   // depositPayment: PAYMENT_RECORD_SCHEMA,   // payment cọc
//   depositPayment: { type: PAYMENT_RECORD_SCHEMA, default: null },

//   // finalPayment: PAYMENT_RECORD_SCHEMA,     // payment cuối
// finalPayment: { type: PAYMENT_RECORD_SCHEMA, default: null },

//   refundAmount: { type: Number, default: 0 },
//   refundRecords: [PAYMENT_RECORD_SCHEMA],

//   cancellationPolicy: { type: String, default: "" },
//   refundPolicy: { type: String, default: "" },

//   history: [{
//     at: { type: Date, default: Date.now },
//     by: String,
//     action: String,
//     meta: mongoose.Schema.Types.Mixed,
//   }],
// }, { timestamps: true });

// // ----------- Helpers ------------

// // Tính depositAmount từ quote.price và depositPercent (chỉ khi chưa thanh toán)
// CustomRequestSchema.methods.recalculateDeposit = function () {
//   if (this.depositPayment) return this.depositPayment.amount || 0;
//   if (this.quote && typeof this.quote.price === "number" && typeof this.quote.depositPercent === "number") {
//     const amt = Math.round((this.quote.price * (this.quote.depositPercent || 30)) / 100);
//     this.quote.depositAmount = amt;
//     return amt;
//   }
//   return 0;
// };

// // Tính số tiền còn lại cho final payment
// CustomRequestSchema.methods.remainingAmount = function () {
//   const paid = this.depositPayment?.amount || 0;
//   const price = this.quote?.price || 0;
//   return Math.max(0, price - paid);
// };

// // ----------- Middleware ------------
// CustomRequestSchema.pre("save", function (next) {
//   try {
//     if (this.quote && (this.isModified("quote.price") || this.isModified("quote.depositPercent") || !this.quote.depositAmount)) {
//       this.recalculateDeposit();
//     }
//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// // ----------- Static helpers -----------
// CustomRequestSchema.statics.applyQuote = async function (id, quoteObj = {}, by = "admin") {
//   const r = await this.findById(id);
//   if (!r) throw new Error("Custom request not found");
//   r.quote = Object.assign(r.quote || {}, quoteObj);
//   r.quote.depositPercent = Math.max(0, Math.min(100, Number(r.quote.depositPercent || 30)));
//   r.recalculateDeposit();
//   r.status = "QUOTED";
//   r.history = r.history || [];
//   r.history.push({ by, action: "quote_applied", meta: { quote: r.quote } });
//   await r.save();
//   return r;
// };

// module.exports = mongoose.model("CustomRequest", CustomRequestSchema);
// module.exports.STATUS = STATUS;
// module.exports.PAYMENT_STATUS = PAYMENT_STATUS;//24/11









// src/models/CustomRequest.js
const mongoose = require("mongoose");

const FILE_SCHEMA = new mongoose.Schema({
  url: String,
  name: String,
  type: String,
  size: Number,
}, { _id: false });

const PAYMENT_RECORD_SCHEMA = new mongoose.Schema({
  provider: String,        // e.g. "stripe", "momo", "vnpay", "manual"
  transactionId: String,   // id từ gateway / provider
  amount: Number,          // số tiền (VNĐ)
  currency: { type: String, default: "VND" },
  paidAt: Date,
  meta: mongoose.Schema.Types.Mixed,
}, { _id: false });

const QUOTE_SCHEMA = new mongoose.Schema({
  price: Number,           
  leadTimeDays: Number,    
  note: String,
  expiresAt: Date,
  createdAt: { type: Date, default: Date.now },
  depositPercent: { type: Number, default: 30 },
  depositAmount: { type: Number, default: 0 },   
}, { _id: false });

const PAYMENT_STATUS = ["NONE", "DEPOSIT_PAID", "COMPLETED", "REFUNDED"];

const STATUS = [
  "SUBMITTED", "REVIEWING", "QUOTED", "ACCEPTED", 
  "REJECTED", "CANCELED", "IN_PROGRESS", "DONE",
];

const CustomRequestSchema = new mongoose.Schema({
  code: { type: String, index: true },
  customer: {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", index: true },
    name: String,
    phone: String,
    email: String,
  },
  brief: {
    title: { type: String, required: true },
    description: String,
    length: Number,
    width: Number,
    height: Number,
    unit: { type: String, default: "cm" },
    materials: String,
    color: String,
    budgetMax: Number,
  },
  files: [FILE_SCHEMA],
  status: { type: String, enum: STATUS, default: "SUBMITTED", index: true },
  quote: QUOTE_SCHEMA,


// THANH TOÁN FULL (mô hình mới)
    paymentFull: { type: PAYMENT_RECORD_SCHEMA, default: null },
    paid: { type: Boolean, default: false },
    paidAmount: { type: Number, default: 0 },
    paidAt: Date,


  paymentStatus: { type: String, enum: PAYMENT_STATUS, default: "NONE", index: true },

  // depositPayment: PAYMENT_RECORD_SCHEMA,   // payment cọc
  depositPayment: { type: PAYMENT_RECORD_SCHEMA, default: null },

  // finalPayment: PAYMENT_RECORD_SCHEMA,     // payment cuối
finalPayment: { type: PAYMENT_RECORD_SCHEMA, default: null },

  refundAmount: { type: Number, default: 0 },
  refundRecords: [PAYMENT_RECORD_SCHEMA],

  cancellationPolicy: { type: String, default: "" },
  refundPolicy: { type: String, default: "" },

  history: [{
    at: { type: Date, default: Date.now },
    by: String,
    action: String,
    meta: mongoose.Schema.Types.Mixed,
  }],
}, { timestamps: true });

// ----------- Helpers ------------

// Tính depositAmount từ quote.price và depositPercent (chỉ khi chưa thanh toán)
CustomRequestSchema.methods.recalculateDeposit = function () {
  if (this.depositPayment) return this.depositPayment.amount || 0;
  if (this.quote && typeof this.quote.price === "number" && typeof this.quote.depositPercent === "number") {
    const amt = Math.round((this.quote.price * (this.quote.depositPercent || 30)) / 100);
    this.quote.depositAmount = amt;
    return amt;
  }
  return 0;
};

// Tính số tiền còn lại cho final payment
CustomRequestSchema.methods.remainingAmount = function () {
  const paid = this.depositPayment?.amount || 0;
  const price = this.quote?.price || 0;
  return Math.max(0, price - paid);
};

// ----------- Middleware ------------
CustomRequestSchema.pre("save", function (next) {
  try {
    if (this.quote && (this.isModified("quote.price") || this.isModified("quote.depositPercent") || !this.quote.depositAmount)) {
      this.recalculateDeposit();
    }
    next();
  } catch (err) {
    next(err);
  }
});

// ----------- Static helpers -----------
CustomRequestSchema.statics.applyQuote = async function (id, quoteObj = {}, by = "admin") {
  const r = await this.findById(id);
  if (!r) throw new Error("Custom request not found");
  r.quote = Object.assign(r.quote || {}, quoteObj);
  r.quote.depositPercent = Math.max(0, Math.min(100, Number(r.quote.depositPercent || 30)));
  r.recalculateDeposit();
  r.status = "QUOTED";
  r.history = r.history || [];
  r.history.push({ by, action: "quote_applied", meta: { quote: r.quote } });
  await r.save();
  return r;
};

module.exports = mongoose.model("CustomRequest", CustomRequestSchema);
module.exports.STATUS = STATUS;
module.exports.PAYMENT_STATUS = PAYMENT_STATUS;

