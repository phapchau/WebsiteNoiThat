
// const mongoose = require("mongoose");

// const AddressSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   phone: { type: String, required: true },
//   email: { type: String, default: "" },
//   address: { type: String, required: true },
//   isDefault: { type: Boolean, default: false },
// }, { _id: true, timestamps: true });

// const UserSchema = new mongoose.Schema({
//   name: String,
//   email: { type: String, unique: true, index: true },
//   password: String,
//   role: { type: String, default: "user" },
//   // thêm:
//   addresses: { type: [AddressSchema], default: [] },
// }, { timestamps: true });

// module.exports = mongoose.model("User", UserSchema);







// src/models/User.js
const mongoose = require("mongoose");
const Order = require("../models/Order");


const AddressSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: "" },
    line1: { type: String, required: true }, // <— đồng bộ với controllers & FE
    isDefault: { type: Boolean, default: false },
  },
  { _id: true, timestamps: true }
);

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, default: "" },
    email: { type: String, required: true, unique: true, index: true },
    password: { type: String, required: true }, // lưu hash ở đây
    role: { type: String, enum: ["user", "staff", "admin"], default: "user" },
    status : { type: String, enum: ["active", "blocked"], default: "active" },




// 👇 Thêm 2 field cấp user để FE có thể hiển thị lại khi load
    phone: { type: String, default: "" },
    address: { type: String, default: "" },


    addresses: { type: [AddressSchema], default: [] },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
