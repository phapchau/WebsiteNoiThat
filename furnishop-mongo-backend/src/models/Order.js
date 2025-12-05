const mongoose = require("mongoose");

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: String,
  price: Number,
  quantity: Number,
  image: String, // poster lúc đặt
}, { _id: false });

const orderSchema = new mongoose.Schema({
  code: { type: String, unique: true },           // VD: ORD-20251010-0001
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // nếu có đăng nhập
  items: [orderItemSchema],
  amount: { type: Number, required: true },        // tổng tiền hàng
  shippingFee: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  grandTotal: { type: Number, required: true },    // amount + shipping - discount
  customer: {
    name: String, phone: String, email: String,
    address: String, note: String,
  },
  
  paymentMethod: { type: String, default: "COD" }, // COD, VNPay, ...
  // status: { type: String, default: "pending" }, 
  status: {
      type: String,
      enum: ["pending", "paid", "shipping", "completed", "cancelled"],
      default: "pending",
    }, 

    cancelledAt: Date,
    cancelledBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    cancelReason: String,
  //   // pending/paid/shipping/completed/cancelled
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
