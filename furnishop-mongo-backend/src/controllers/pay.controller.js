// // src/controllers/pay.controller.js
// const qs = require("qs");
// const crypto = require("crypto");
// const Order = require("../models/Order");
// const Product = require("../models/Product");


// const { VNPay, HashAlgorithm, ProductCode } = require('vnpay');


// function sortObj(obj) {
//   const sorted = {};
//   Object.keys(obj).sort().forEach(k => (sorted[k] = obj[k]));
//   return sorted;
// }


// const vnpay = new VNPay({
//   tmnCode: process.env.VNP_TMN_CODE,
//   secureSecret: process.env.VNP_HASH_SECRET,
//   vnpayHost: process.env.VNP_HOST || 'https://sandbox.vnpayment.vn',
//   testMode: process.env.NODE_ENV !== 'production',
//   hashAlgorithm: HashAlgorithm.SHA512,
//   endpoints: {
//     paymentEndpoint: 'paymentv2/vpcpay.html',
//   },
// });



// function clientIp(req) {
//   return (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
//       || req.socket?.remoteAddress
//       || '127.0.0.1';
// }



// async function vnpCreate(req, res) {
//   try {
//     const { items = [], customer = {}, shippingFee = 0, discount = 0 } = req.body;
//     if (!Array.isArray(items) || items.length === 0) {
//       return res.status(400).json({ message: "Giỏ hàng trống" });
//     }

//     // Tính tiền từ DB
//     let sub = 0;
//     const hydrated = [];
//     for (const it of items) {
//       const p = await Product.findById(it.id);
//       if (!p) return res.status(400).json({ message: `Sản phẩm không tồn tại: ${it.id}` });
//       const qty = Number(it.quantity || 1);
//       hydrated.push({ product: p._id, name: p.name, price: p.price, quantity: qty, image: p.poster || "" });
//       sub += (Number(p.price) || 0) * qty;
//     }
//     const total = Math.max(0, sub + (Number(shippingFee)||0) - (Number(discount)||0));
//     if (!total) return res.status(400).json({ message: "Tổng tiền không hợp lệ" });

//     // Tạo order pending
//     const order = await Order.create({
//       code: `ORD-${Date.now()}`,
//       user: req.user?.id || null,
//       items: hydrated,
//       amount: sub,
//       shippingFee: Number(shippingFee) || 0,
//       discount: Number(discount) || 0,
//       grandTotal: total,
//       customer,
//       paymentMethod: "VNPAY",
//       status: "pending",
//     });




//     // Theo mẫu ảnh: buildPaymentUrl({ vnp_Amount, vnp_IpAddr, vnp_TxnRef, vnp_OrderInfo, vnp_OrderType, vnp_ReturnUrl })
//     // Thư viện vnpay (v2) yêu cầu truyền vnp_Amount là **đơn vị VND** (nếu bản của bạn KHÔNG tự *100, thì đổi thành total*100)
//     const paymentUrl = vnpay.buildPaymentUrl({
//       vnp_Amount: total,                         // nếu vẫn báo sai chữ ký, thử total * 100
//       vnp_IpAddr: clientIp(req) || '127.0.0.1',
//       vnp_TxnRef: `${order._id}-${Date.now()}`,  // giống mẫu ảnh: id + timestamp
//       vnp_OrderInfo: `Thanh toan don ${order.code}`,
//       vnp_OrderType: ProductCode.Other,          // "booking" ở ảnh, mình dùng Other
//       vnp_ReturnUrl: process.env.VNP_RETURN_URL, // VD: http://localhost:8081/api/pay/vnpay/return
//       // vnp_ReturnUrl: (process.env.VNP_RETURN_URL || '').trim(),
//       // vnp_Locale: 'vn',
//       // vnp_BankCode: 'VNPAYQR',
//     });


// //     console.log("====================================");
// // console.log("🔍 VNPay DEBUG:");


// // console.log("TMN_CODE:", process.env.VNP_TMN_CODE);
// // console.log("HASH_SECRET:", process.env.VNP_HASH_SECRET);
// // console.log("RETURN_URL:", process.env.VNP_RETURN_URL);
// // console.log("RETURN_FE:", process.env.VNP_RETURN_FE);
// // console.log("TOTAL:", total, "→ amount gửi:", total * 100);
// // console.log("Payment URL:", paymentUrl);
// // console.log("====================================");



   
//     return res.json({ payUrl: paymentUrl, orderId: order._id });
//   } catch (e) {
//     console.error("[vnpCreate]", e);
//     return res.status(500).json({ message: e.message || "Không tạo được URL VNPay" });
//   }
// }




// async function vnpReturn(req, res) {
//   try {
//     const query = req.query || {};
//     const verify = vnpay.verifyReturnUrl(query); // sync là đủ
//     // tách orderId từ vnp_TxnRef: "{orderId}-{timestamp}"
//     const orderId = String(query.vnp_TxnRef || '').split('-')[0];
//     const amount = Number(query.vnp_Amount || 0)/100 ; // VNPay trả *100 về
//     const isSuccess = String(query.vnp_ResponseCode) === '00' && verify.isSuccess;
//     const transactionNo = query.vnp_TransactionNo;

//     const order = await Order.findById(orderId);
//     if (!order) {
//       const fail = new URL(process.env.VNP_RETURN_FE || 'http://localhost:5173/checkout/return');
//       fail.searchParams.set('status', 'failed');
//       return res.redirect(fail.toString());
//     }

//     // Lưu log giao dịch
//     order.paymentInfo = {
//       gateway: "VNPAY",
//       transactionNo,
//       amount,
//       vnpResponseCode: query.vnp_ResponseCode,
//       bankCode: query.vnp_BankCode,
//       bankTranNo: query.vnp_BankTranNo,
//       cardType: query.vnp_CardType,
//       payDate: query.vnp_PayDate,
//       raw: query,
//     };

//     // Cập nhật trạng thái đơn
//     if (isSuccess && order.status === 'pending') {
//       order.status = 'paid';
//       order.paidAt = new Date();
//     }
//     await order.save();

//     // Redirect về FE (giống ảnh: trả redirectUrl; ở đây ta chủ động 302)
//     const FE = process.env.VNP_RETURN_FE || 'http://localhost:5173/checkout/return';
//     const url = new URL(FE);
//     url.searchParams.set('status', isSuccess ? 'success' : 'failed');
//     url.searchParams.set('orderId', String(order._id));
//     url.searchParams.set('amount', String(amount));
//     return res.redirect(url.toString());
//   } catch (e) {
//     console.error("[vnpReturn]", e);
//     const FE = process.env.VNP_RETURN_FE || 'http://localhost:5173/checkout/return';
//     const url = new URL(FE);
//     url.searchParams.set('status', 'failed');
//     return res.redirect(url.toString());
//   }
// }



// module.exports = { vnpCreate, vnpReturn,};//14/11













// // src/controllers/pay.controller.js
// const qs = require("qs");
// const crypto = require("crypto");
// const Order = require("../models/Order");
// const Product = require("../models/Product");
// const CustomRequest = require("../models/CustomRequest"); // <- cần có model này
// const { VNPay, HashAlgorithm, ProductCode } = require('vnpay');

// function sortObj(obj) {
//   const sorted = {};
//   Object.keys(obj).sort().forEach(k => (sorted[k] = obj[k]));
//   return sorted;
// }

// const vnpay = new VNPay({
//   tmnCode: process.env.VNP_TMN_CODE,
//   secureSecret: process.env.VNP_HASH_SECRET,
//   vnpayHost: process.env.VNP_HOST || 'https://sandbox.vnpayment.vn',
//   testMode: process.env.NODE_ENV !== 'production',
//   hashAlgorithm: HashAlgorithm.SHA512,
//   endpoints: {
//     paymentEndpoint: 'paymentv2/vpcpay.html',
//   },
// });

// function clientIp(req) {
//   return (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
//       || req.socket?.remoteAddress
//       || '127.0.0.1';
// }

// // ---------- EXISTING generic order creation (kept) ----------
// async function vnpCreate(req, res) {
//   try {
//     const { items = [], customer = {}, shippingFee = 0, discount = 0 } = req.body;
//     if (!Array.isArray(items) || items.length === 0) {
//       return res.status(400).json({ message: "Giỏ hàng trống" });
//     }

//     // Tính tiền từ DB
//     let sub = 0;
//     const hydrated = [];
//     for (const it of items) {
//       const p = await Product.findById(it.id);
//       if (!p) return res.status(400).json({ message: `Sản phẩm không tồn tại: ${it.id}` });
//       const qty = Number(it.quantity || 1);
//       hydrated.push({ product: p._id, name: p.name, price: p.price, quantity: qty, image: p.poster || "" });
//       sub += (Number(p.price) || 0) * qty;
//     }
//     const total = Math.max(0, sub + (Number(shippingFee)||0) - (Number(discount)||0));
//     if (!total) return res.status(400).json({ message: "Tổng tiền không hợp lệ" });

//     // Tạo order pending
//     const order = await Order.create({
//       code: `ORD-${Date.now()}`,
//       user: req.user?.id || null,
//       items: hydrated,
//       amount: sub,
//       shippingFee: Number(shippingFee) || 0,
//       discount: Number(discount) || 0,
//       grandTotal: total,
//       customer,
//       paymentMethod: "VNPAY",
//       status: "pending",
//     });

//     const paymentUrl = vnpay.buildPaymentUrl({
//       vnp_Amount: total,                         // nếu cần thử total * 100
//       vnp_IpAddr: clientIp(req) || '127.0.0.1',
//       vnp_TxnRef: `${order._id}-${Date.now()}`,
//       vnp_OrderInfo: `Thanh toan don ${order.code}`,
//       vnp_OrderType: ProductCode.Other,
//       vnp_ReturnUrl: process.env.VNP_RETURN_URL,
//     });

//     return res.json({ payUrl: paymentUrl, orderId: order._id });
//   } catch (e) {
//     console.error("[vnpCreate]", e);
//     return res.status(500).json({ message: e.message || "Không tạo được URL VNPay" });
//   }
// }

// // ---------- NEW: create deposit payment for a CustomRequest ----------
// /**
//  * POST /api/pay/vnpay/create-deposit
//  * body: { customRequestId }
//  * requires: customRequest exists, has quote with price & depositPercent
//  */
// async function createDepositPayment(req, res) {
//   try {
//     const { customRequestId } = req.body;
//     if (!customRequestId) return res.status(400).json({ message: "Thiếu customRequestId" });

//     const cr = await CustomRequest.findById(customRequestId);
//     if (!cr) return res.status(404).json({ message: "Yêu cầu không tồn tại" });

//     const quote = cr.quote || {};
//     const price = Number(quote.price || 0);
//     const depositPercent = Number(quote.depositPercent || 0);

//     if (!price || depositPercent <= 0) {
//       return res.status(400).json({ message: "Không có khoản cọc để thanh toán" });
//     }

//     const depositAmount = Math.round((price * depositPercent) / 100);

//     // Tạo order để thanh toán cọc
//     const order = await Order.create({
//       code: `ORD-CUST-${customRequestId}-${Date.now()}`,
//       user: cr.user || null,
//       items: [],
//       amount: depositAmount,
//       shippingFee: 0,
//       discount: 0,
//       grandTotal: depositAmount,
//       customer: cr.customer || {},
//       paymentMethod: "VNPAY",
//       status: "pending",
//       metadata: {
//         type: "custom-deposit",
//         customRequestId: String(cr._id),
//         depositPercent,
//         depositAmount,
//       },
//     });

//     const paymentUrl = vnpay.buildPaymentUrl({
//       vnp_Amount: depositAmount,
//       vnp_IpAddr: clientIp(req) || '127.0.0.1',
//       vnp_TxnRef: `${order._id}-${Date.now()}`,
//       vnp_OrderInfo: `Coc ${depositAmount} cho yeu cau ${cr.code || cr._id}`,
//       vnp_OrderType: ProductCode.Other,
//       vnp_ReturnUrl: process.env.VNP_RETURN_URL,
//     });

//     return res.json({ payUrl: paymentUrl, orderId: order._id, depositAmount });
//   } catch (e) {
//     console.error("[createDepositPayment]", e);
//     return res.status(500).json({ message: e.message || "Không tạo được payment cọc" });
//   }
// }

// // ---------- NEW: create final payment for a CustomRequest ----------
// /**
//  * POST /api/pay/vnpay/create-final
//  * body: { customRequestId }
//  * final amount = quote.price - (any deposit previously paid recorded on custom request)
//  */// ---------- NEW / REPLACED: createFinalPayment ----------
// async function createFinalPayment(req, res) {
//   try {
//     const { customRequestId } = req.body;
//     if (!customRequestId) return res.status(400).json({ message: "Thiếu customRequestId" });

//     const cr = await CustomRequest.findById(customRequestId);
//     if (!cr) return res.status(404).json({ message: "Yêu cầu không tồn tại" });

//     const quote = cr.quote || {};
//     const price = Number(quote.price || 0);

//     // depositPaid: số tiền cọc đã thực sự nộp (ưu tiên)
//     let depositPaid = Number(cr.depositAmountPaid || 0);

//     // Nếu chưa có depositAmountPaid nhưng có depositPercent, tính dựa trên percent
//     if (!depositPaid && Number(quote.depositPercent || 0) > 0) {
//       const pct = Number(quote.depositPercent || 0);
//       depositPaid = Math.round((price * pct) / 100);
//     }

//     // remaining = price - depositPaid
//     const remaining = Math.max(0, Math.round(price) - Math.round(depositPaid));

//     if (!remaining) {
//       return res.status(400).json({ message: "Không còn khoản phải thanh toán" });
//     }

//     console.log("[createFinalPayment] customRequestId=", customRequestId, "price=", price, "depositPaid=", depositPaid, "remaining=", remaining);

//     const order = await Order.create({
//       code: `ORD-CUST-FINAL-${customRequestId}-${Date.now()}`,
//       user: cr.user || null,
//       items: [],
//       amount: remaining,
//       shippingFee: 0,
//       discount: 0,
//       grandTotal: remaining,
//       customer: cr.customer || {},
//       paymentMethod: "VNPAY",
//       status: "pending",
//       metadata: {
//         type: "custom-final",
//         customRequestId: String(cr._id),
//         remainingAmount: remaining,
//         depositPaidUsed: depositPaid,
//       },
//     });

//     const paymentUrl = vnpay.buildPaymentUrl({
//       vnp_Amount: remaining, // nếu sandbox yêu cầu *100 thì đổi thành remaining*100
//       vnp_IpAddr: clientIp(req) || '127.0.0.1',
//       vnp_TxnRef: `${order._id}-${Date.now()}`,
//       vnp_OrderInfo: `Thanh toan phan con ${remaining} cho yeu cau ${cr.code || cr._id}`,
//       vnp_OrderType: ProductCode.Other,
//       vnp_ReturnUrl: process.env.VNP_RETURN_URL,
//     });

//     return res.json({ payUrl: paymentUrl, orderId: order._id, remaining });
//   } catch (e) {
//     console.error("[createFinalPayment]", e);
//     return res.status(500).json({ message: e.message || "Không tạo được payment cuối" });
//   }
// }


// // ---------- RETURN handler: khi VNPay redirect về đây ----------
// async function vnpReturn(req, res) {
//   try {
//     const query = req.query || {};
//     const verify = vnpay.verifyReturnUrl(query); // sync
//     const orderId = String(query.vnp_TxnRef || '').split('-')[0];
//     const amount = Number(query.vnp_Amount || 0) / 100; // nếu sandbox trả *100
//     const isSuccess = String(query.vnp_ResponseCode) === '00' && verify.isSuccess;
//     const transactionNo = query.vnp_TransactionNo;

//     const order = await Order.findById(orderId);
//     if (!order) {
//       const fail = new URL(process.env.VNP_RETURN_FE || 'http://localhost:5173/checkout/return');
//       fail.searchParams.set('status', 'failed');
//       return res.redirect(fail.toString());
//     }

//     order.paymentInfo = {
//       gateway: "VNPAY",
//       transactionNo,
//       amount,
//       vnpResponseCode: query.vnp_ResponseCode,
//       bankCode: query.vnp_BankCode,
//       bankTranNo: query.vnp_BankTranNo,
//       cardType: query.vnp_CardType,
//       payDate: query.vnp_PayDate,
//       raw: query,
//     };

//     if (isSuccess && order.status === 'pending') {
//       order.status = 'paid';
//       order.paidAt = new Date();
//     }
//     await order.save();

//     // Nếu order.metadata liên quan custom request thì cập nhật CustomRequest
//     try {
//       const meta = order.metadata || {};
//       if (meta.type && meta.customRequestId) {
//         const cr = await CustomRequest.findById(meta.customRequestId);
//         if (cr) {
//           // if (meta.type === 'custom-deposit') {
//           //   // Đánh dấu deposit đã nộp
//           //   cr.depositPaid = true;
//           //   cr.depositAmountPaid = meta.depositAmount || order.grandTotal || amount;
//           //   cr.depositPaidAt = new Date();
//           //   // Khi deposit xong, đặt status phù hợp (tuỳ luồng bạn muốn). Mình set 'approved' để bắt đầu xử lý.
//           //   cr.status = cr.status === 'approved' ? cr.status : 'approved';
//           //   await cr.save();
//           // trong vnpReturn, phần xử lý metadata.type === 'custom-deposit'
// if (meta.type === 'custom-deposit') {
//   // Prefer số tiền thực tế trong order.grandTotal (đảm bảo tính nhất quán)
//   const paidAmount = Number(order.grandTotal || meta.depositAmount || amount || 0);
//   cr.depositPaid = true;
//   cr.depositAmountPaid = paidAmount;
//   cr.depositPaidAt = new Date();
//   // nếu muốn chuyển status => approved
//   if (!['approved','in_progress','done'].includes(cr.status)) cr.status = 'approved';
//   await cr.save();


//           } else if (meta.type === 'custom-final') {
//             cr.finalPaid = true;
//             cr.finalAmountPaid = meta.remainingAmount || order.grandTotal || amount;
//             cr.finalPaidAt = new Date();
//             // Nếu muốn đánh dấu hoàn thành ngay khi thanh toán cuối, uncomment:
//             // cr.status = 'done';
//             await cr.save();
//           }
//         }
//       }
//     } catch (ex) {
//       console.error("[vnpReturn] update custom request failed", ex);
//     }

// //thêm 14//11


// // Build FE redirect: nếu custom payment -> redirect về trang custom request (FE)
//     if (customMeta) {
//       // ưu tiên dùng env dành riêng cho custom (FE)
//       const customType = customMeta.type === 'custom-deposit' ? 'DEPOSIT' : 'FINAL';
//       const envVar = customMeta.type === 'custom-deposit' ? 'VNP_RETURN_CUSTOM_DEPOSIT' : 'VNP_RETURN_CUSTOM_FINAL';
//       const customFE = process.env[envVar] || process.env.VNP_RETURN_FE || 'http://localhost:5173/checkout/return';

//       // Nếu env value chứa placeholder :id (ví dụ .../custom/request/:id) -> replace, else thêm query params
//       let redirectUrl;
//       if (customFE.includes(':id')) {
//         redirectUrl = customFE.replace(':id', encodeURIComponent(customMeta.customRequestId));
//         const u = new URL(redirectUrl);
//         u.searchParams.set('status', isSuccess ? 'success' : 'failed');
//         u.searchParams.set('orderId', String(order._id));
//         u.searchParams.set('amount', String(amount));
//         return res.redirect(u.toString());
//       } else {
//         const u = new URL(customFE);
//         u.searchParams.set('status', isSuccess ? 'success' : 'failed');
//         u.searchParams.set('customRequestId', customMeta.customRequestId);
//         u.searchParams.set('orderId', String(order._id));
//         u.searchParams.set('amount', String(amount));
//         return res.redirect(u.toString());
//       }
//     }




// //thêm 14/11


//     // Redirect về FE
//     const FE = process.env.VNP_RETURN_FE || 'http://localhost:5173/checkout/return';
//     const url = new URL(FE);
//     url.searchParams.set('status', isSuccess ? 'success' : 'failed');
//     url.searchParams.set('orderId', String(order._id));
//     url.searchParams.set('amount', String(amount));
//     return res.redirect(url.toString());
//   } catch (e) {
//     console.error("[vnpReturn]", e);
//     const FE = process.env.VNP_RETURN_FE || 'http://localhost:5173/checkout/return';
//     const url = new URL(FE);
//     url.searchParams.set('status', 'failed');
//     return res.redirect(url.toString());
//   }
// }

// module.exports = { vnpCreate, vnpReturn, createDepositPayment, createFinalPayment };//15/11












// // src/controllers/pay.controller.js
// const qs = require("qs");
// const crypto = require("crypto");
// const Order = require("../models/Order");
// const Product = require("../models/Product");
// const CustomRequest = require("../models/CustomRequest");
// const { VNPay, HashAlgorithm, ProductCode } = require('vnpay');

// function sortObj(obj) {
//   const sorted = {};
//   Object.keys(obj).sort().forEach(k => (sorted[k] = obj[k]));
//   return sorted;
// }

// const vnpay = new VNPay({
//   tmnCode: process.env.VNP_TMN_CODE,
//   secureSecret: process.env.VNP_HASH_SECRET,
//   vnpayHost: process.env.VNP_HOST || 'https://sandbox.vnpayment.vn',
//   testMode: process.env.NODE_ENV !== 'production',
//   hashAlgorithm: HashAlgorithm.SHA512,
//   endpoints: {
//     paymentEndpoint: 'paymentv2/vpcpay.html',
//   },
// });

// function clientIp(req) {
//   return (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
//       || req.socket?.remoteAddress
//       || '127.0.0.1';
// }

// // ----------------- GENERIC VNPay ORDER -----------------
// async function vnpCreate(req, res) {
//   try {
//     const { items = [], customer = {}, shippingFee = 0, discount = 0 } = req.body;
//     if (!Array.isArray(items) || items.length === 0)
//       return res.status(400).json({ message: "Giỏ hàng trống" });

//     let sub = 0;
//     const hydrated = [];
//     for (const it of items) {
//       const p = await Product.findById(it.id);
//       if (!p) return res.status(400).json({ message: `Sản phẩm không tồn tại: ${it.id}` });
//       const qty = Number(it.quantity || 1);
//       hydrated.push({ product: p._id, name: p.name, price: p.price, quantity: qty, image: p.poster || "" });
//       sub += (Number(p.price) || 0) * qty;
//     }
//     const total = Math.max(0, sub + Number(shippingFee) - Number(discount));
//     if (!total) return res.status(400).json({ message: "Tổng tiền không hợp lệ" });

//     const order = await Order.create({
//       code: `ORD-${Date.now()}`,
//       user: req.user?.id || null,
//       items: hydrated,
//       amount: sub,
//       shippingFee: Number(shippingFee),
//       discount: Number(discount),
//       grandTotal: total,
//       customer,
//       paymentMethod: "VNPAY",
//       status: "pending",
//     });

//     const paymentUrl = vnpay.buildPaymentUrl({
//       vnp_Amount: total,
//       vnp_IpAddr: clientIp(req) || '127.0.0.1',
//       vnp_TxnRef: `${order._id}-${Date.now()}`,
//       vnp_OrderInfo: `Thanh toan don ${order.code}`,
//       vnp_OrderType: ProductCode.Other,
//       vnp_ReturnUrl: process.env.VNP_RETURN_URL,
//     });

//     return res.json({ payUrl: paymentUrl, orderId: order._id });
//   } catch (e) {
//     console.error("[vnpCreate]", e);
//     return res.status(500).json({ message: e.message || "Không tạo được URL VNPay" });
//   }
// }

// // ----------------- CREATE DEPOSIT PAYMENT -----------------
// async function createDepositPayment(req, res) {
//   try {
//     const { customRequestId } = req.body;
//     if (!customRequestId) return res.status(400).json({ message: "Thiếu customRequestId" });

//     const cr = await CustomRequest.findById(customRequestId);
//     if (!cr) return res.status(404).json({ message: "Yêu cầu không tồn tại" });

//     const quote = cr.quote || {};
//     const price = Number(quote.price || 0);
//     const depositPercent = Number(quote.depositPercent || 0);
//     if (!price || depositPercent <= 0)
//       return res.status(400).json({ message: "Không có khoản cọc để thanh toán" });

//     const depositAmount = Math.round((price * depositPercent) / 100);

//     const order = await Order.create({
//       code: `ORD-CUST-DEPOSIT-${customRequestId}-${Date.now()}`,
//       user: cr.user || null,
//       items: [],
//       amount: depositAmount,
//       shippingFee: 0,
//       discount: 0,
//       grandTotal: depositAmount,
//       customer: cr.customer || {},
//       paymentMethod: "VNPAY",
//       status: "pending",
//       metadata: {
//         type: "custom-deposit",
//         customRequestId: String(cr._id),
//         depositPercent,
//         depositAmount
//       },
//     });

//     console.log("[createDepositPayment] Created order metadata:", order.metadata);

//     const paymentUrl = vnpay.buildPaymentUrl({
//       vnp_Amount: depositAmount ,
//       vnp_IpAddr: clientIp(req) || '127.0.0.1',
//       vnp_TxnRef: `${order._id}-${Date.now()}`,
//       vnp_OrderInfo: `Cọc ${depositAmount} cho yêu cầu ${cr.code || cr._id}`,
//       vnp_OrderType: ProductCode.Other,
//       vnp_ReturnUrl: process.env.VNP_RETURN_URL,
//     });

//     return res.json({ payUrl: paymentUrl, orderId: order._id, depositAmount });
//   } catch (e) {
//     console.error("[createDepositPayment]", e);
//     return res.status(500).json({ message: e.message || "Không tạo được payment cọc" });
//   }
// }


// // ----------------- CREATE FINAL PAYMENT -----------------
// async function createFinalPayment(req, res) {
//   try {
//     const { customRequestId } = req.body;
//     if (!customRequestId) return res.status(400).json({ message: "Thiếu customRequestId" });

//     const cr = await CustomRequest.findById(customRequestId);
//     if (!cr) return res.status(404).json({ message: "Yêu cầu không tồn tại" });

//     const quote = cr.quote || {};
//     const price = Number(quote.price || 0);

//     // Tiền cọc đã thanh toán
//     const depositPaid = Number(cr.depositPayment?.amount || 0);

//     // Số tiền còn lại
//     const remaining = Math.max(0, price - depositPaid);
//     if (!remaining) return res.status(400).json({ message: "Không còn khoản phải thanh toán" });

//     const order = await Order.create({
//       code: `ORD-CUST-FINAL-${customRequestId}-${Date.now()}`,
//       user: cr.user || null,
//       items: [],
//       amount: remaining,
//       shippingFee: 0,
//       discount: 0,
//       grandTotal: remaining,
//       customer: cr.customer || {},
//       paymentMethod: "VNPAY",
//       status: "pending",
//       metadata: {
//         type: "custom-final",
//         customRequestId: String(cr._id),
//         remainingAmount: remaining
//       },
//     });

//     console.log("[createFinalPayment] Created order metadata:", order.metadata);

//     const paymentUrl = vnpay.buildPaymentUrl({
//       vnp_Amount: remaining ,
//       vnp_IpAddr: clientIp(req) || '127.0.0.1',
//       vnp_TxnRef: `${order._id}-${Date.now()}`,
//       vnp_OrderInfo: `Thanh toán phần còn lại ${remaining} cho yêu cầu ${cr.code || cr._id}`,
//       vnp_OrderType: ProductCode.Other,
//       vnp_ReturnUrl: process.env.VNP_RETURN_URL,
//     });

//     return res.json({ payUrl: paymentUrl, orderId: order._id, remaining });
//   } catch (e) {
//     console.error("[createFinalPayment]", e);
//     return res.status(500).json({ message: e.message || "Không tạo được payment cuối" });
//   }
// }


// // ----------------- VNPay RETURN HANDLER -----------------
// // async function vnpReturn(req, res) {
// //   try {
// //     const query = req.query || {};
// //     const verify = vnpay.verifyReturnUrl(query);
// //     const orderId = String(query.vnp_TxnRef || '').split('-')[0];
// //     const amount = Number(query.vnp_Amount || 0) / 100;
// //     const isSuccess = String(query.vnp_ResponseCode) === '00' && verify.isSuccess;
// //     const transactionNo = query.vnp_TransactionNo;

// //     const order = await Order.findById(orderId);
// //     if (!order) return res.redirect(process.env.VNP_RETURN_FE || 'http://localhost:5173/checkout/return');

// //     order.paymentInfo = {
// //       gateway: "VNPAY",
// //       transactionNo,
// //       amount,
// //       vnpResponseCode: query.vnp_ResponseCode,
// //       bankCode: query.vnp_BankCode,
// //       bankTranNo: query.vnp_BankTranNo,
// //       cardType: query.vnp_CardType,
// //       payDate: query.vnp_PayDate,
// //       raw: query,
// //     };

// //     if (isSuccess && order.status === 'pending') {
// //       order.status = 'paid';
// //       order.paidAt = new Date();
// //     }
// //     await order.save();

// //     // Cập nhật CustomRequest nếu liên quan
// //     const meta = order.metadata || {};
// //     if (meta.type && meta.customRequestId) {
// //       const cr = await CustomRequest.findById(meta.customRequestId);
// //       if (cr) {
// //         if (meta.type === 'custom-deposit') {
// //           cr.depositPaid = true;
// //           cr.depositAmountPaid = order.grandTotal;
// //           cr.depositPaidAt = new Date();
// //           if (!['approved','in_progress','done'].includes(cr.status)) cr.status = 'approved';
// //           await cr.save();
// //         } else if (meta.type === 'custom-final') {
// //           cr.finalPaid = true;
// //           cr.finalAmountPaid = order.grandTotal;
// //           cr.finalPaidAt = new Date();
// //           // Nếu muốn set status done khi thanh toán cuối:
// //           // cr.status = 'done';
// //           await cr.save();
// //         }
// //       }
// //     }

// //     // Redirect về FE
// //     const FE = process.env.VNP_RETURN_FE || 'http://localhost:5173/checkout/return';
// //     const url = new URL(FE);
// //     url.searchParams.set('status', isSuccess ? 'success' : 'failed');
// //     url.searchParams.set('orderId', String(order._id));
// //     url.searchParams.set('amount', String(amount));
// //     return res.redirect(url.toString());

// //   } catch (e) {
// //     console.error("[vnpReturn]", e);
// //     const FE = process.env.VNP_RETURN_FE || 'http://localhost:5173/checkout/return';
// //     const url = new URL(FE);
// //     url.searchParams.set('status', 'failed');
// //     return res.redirect(url.toString());
// //   }
// // }


// // async function vnpReturn(req, res) {
// //   try {
// //     const query = req.query || {};
// //     const verify = vnpay.verifyReturnUrl(query);
// //     const orderId = String(query.vnp_TxnRef || '').split('-')[0];
// //     const amount = Number(query.vnp_Amount || 0) / 100;
// //     const isSuccess = String(query.vnp_ResponseCode) === '00' && verify.isSuccess;
// //     const transactionNo = query.vnp_TransactionNo;

// //     const order = await Order.findById(orderId);
// //     // if (!order) return res.redirect(process.env.VNP_RETURN_FE || 'http://localhost:5173/payment-return');
// //     if (!order) {
// //       return res.redirect(`${process.env.VNP_RETURN_FE || 'http://localhost:5173/payment-return'}?status=failed`);
// //     }

// //     order.paymentInfo = {
// //       gateway: "VNPAY",
// //       transactionNo,
// //       amount,
// //       vnpResponseCode: query.vnp_ResponseCode,
// //       bankCode: query.vnp_BankCode,
// //       bankTranNo: query.vnp_BankTranNo,
// //       cardType: query.vnp_CardType,
// //       payDate: query.vnp_PayDate,
// //       raw: query,
// //     };

// //     if (isSuccess && order.status === 'pending') {
// //       order.status = 'paid';
// //       order.paidAt = new Date();
// //     }
// //     await order.save();

// //     // CẬP NHẬT CustomRequest
// //     const meta = order.metadata || {};
// //     if (meta.type && meta.customRequestId) {
// //       const cr = await CustomRequest.findById(meta.customRequestId);
// //       if (cr) {
// //         if (meta.type === 'custom-deposit') {
// //           // GHI VÀO depositPayment (chuẩn)
// //           cr.depositPayment = {
// //             gateway: "VNPAY",
// //             transactionNo,
// //             amount: amount, // ← Dùng amount từ VNPay
// //             bankCode: query.vnp_BankCode,
// //             bankTranNo: query.vnp_BankTranNo,
// //             cardType: query.vnp_CardType,
// //             payDate: query.vnp_PayDate,
// //             raw: query,
// //           };
// //           cr.depositPaid = true;
// //           cr.depositPaidAt = new Date();
// //           if (!['approved','in_progress','done'].includes(cr.status)) {
// //             cr.status = 'approved';
// //           }
// //           await cr.save();
// //           console.log("[vnpReturn] ĐÃ GHI depositPayment:", cr.depositPayment);
// //         } else if (meta.type === 'custom-final') {
// //           cr.finalPayment = {
// //             gateway: "VNPAY",
// //             transactionNo,
// //             amount: amount,
// //             bankCode: query.vnp_BankCode,
// //             bankTranNo: query.vnp_BankTranNo,
// //             cardType: query.vnp_CardType,
// //             payDate: query.vnp_PayDate,
// //             raw: query,
// //           };
// //           cr.finalPaid = true;
// //           cr.finalPaidAt = new Date();
// //           await cr.save();
// //         }
// //       }
// //     }

// //     // Redirect FE
// //     const FE = process.env.VNP_RETURN_FE || 'http://localhost:5173/payment-return';
// //     const url = new URL(FE);
// //     url.searchParams.set('status', isSuccess ? 'success' : 'failed');
// //     url.searchParams.set('orderId', String(order._id));
// //     url.searchParams.set('amount', String(amount));
// //     return res.redirect(url.toString());

// //   } catch (e) {
// //     console.error("[vnpReturn]", e);
// //     const FE = process.env.VNP_RETURN_FE || 'http://localhost:5173/payment-return';
// //     const url = new URL(FE);
// //     url.searchParams.set('status', 'failed');
// //     return res.redirect(url.toString());
// //   }
// // }





// async function vnpReturn(req, res) {
//   try {
//     const query = req.query || {};
//     console.log("[vnpReturn] VNPay query:", query);

//     // verify VNPay
//     const verify = vnpay.verifyReturnUrl(query);
//     console.log("[vnpReturn] verifyReturnUrl result:", verify);

//     // lấy orderId từ vnp_TxnRef
//     const rawTxnRef = String(query.vnp_TxnRef || '');
//     const orderId = rawTxnRef.split('-')[0];
//     console.log("[vnpReturn] orderId extracted:", orderId);

//     const order = await Order.findById(orderId);
//     if (!order) {
//       console.error("[vnpReturn] Order not found!");
//       return res.redirect(`${process.env.VNP_RETURN_FE || 'http://localhost:5173/payment-return'}?status=failed`);
//     }
//     console.log("[vnpReturn] Order found:", order.code);

//     const amount = Number(query.vnp_Amount || 0) / 100;
//     const isSuccess = String(query.vnp_ResponseCode) === '00' && verify.isSuccess;
//     const transactionNo = query.vnp_TransactionNo;

//     // Ghi payment info vào order
//     order.paymentInfo = {
//       gateway: "VNPAY",
//       transactionNo,
//       amount,
//       vnpResponseCode: query.vnp_ResponseCode,
//       bankCode: query.vnp_BankCode,
//       bankTranNo: query.vnp_BankTranNo,
//       cardType: query.vnp_CardType,
//       payDate: query.vnp_PayDate,
//       raw: query,
//     };

//     if (isSuccess && order.status === 'pending') {
//       order.status = 'paid';
//       order.paidAt = new Date();
//     }
//     await order.save();
//     console.log("[vnpReturn] Order saved with paymentInfo");

//     // Debug metadata
//     const meta = order.metadata || {};
//     console.log("[vnpReturn] order.metadata:", meta);

//     if (meta.type && meta.customRequestId) {
//       const cr = await CustomRequest.findById(meta.customRequestId);
//       if (!cr) {
//         console.error("[vnpReturn] CustomRequest not found:", meta.customRequestId);
//       } else {
//         console.log("[vnpReturn] CustomRequest found:", cr._id);

//         if (meta.type === 'custom-deposit') {
//           cr.depositPayment = {
//             gateway: "VNPAY",
//             transactionNo,
//             amount,
//             bankCode: query.vnp_BankCode,
//             bankTranNo: query.vnp_BankTranNo,
//             cardType: query.vnp_CardType,
//             payDate: query.vnp_PayDate,
//             raw: query,
//           };
//           cr.depositPaid = true;
//           cr.depositPaidAt = new Date();
//           if (!['approved','in_progress','done'].includes(cr.status)) {
//             cr.status = 'approved';
//           }
//           await cr.save();
//           console.log("[vnpReturn] depositPayment saved:", cr.depositPayment);
//         } else if (meta.type === 'custom-final') {
//           cr.finalPayment = {
//             gateway: "VNPAY",
//             transactionNo,
//             amount,
//             bankCode: query.vnp_BankCode,
//             bankTranNo: query.vnp_BankTranNo,
//             cardType: query.vnp_CardType,
//             payDate: query.vnp_PayDate,
//             raw: query,
//           };
//           cr.finalPaid = true;
//           cr.finalPaidAt = new Date();
//           await cr.save();
//           console.log("[vnpReturn] finalPayment saved:", cr.finalPayment);
//         }
//       }
//     } else {
//       console.warn("[vnpReturn] metadata missing type or customRequestId");
//     }

//     // Redirect FE
//     const FE = process.env.VNP_RETURN_FE || 'http://localhost:5173/payment-return';
//     const url = new URL(FE);
//     url.searchParams.set('status', isSuccess ? 'success' : 'failed');
//     url.searchParams.set('orderId', String(order._id));
//     url.searchParams.set('amount', String(amount));
//     console.log("[vnpReturn] Redirecting to FE:", url.toString());
//     return res.redirect(url.toString());

//   } catch (e) {
//     console.error("[vnpReturn] ERROR:", e);
//     const FE = process.env.VNP_RETURN_FE || 'http://localhost:5173/payment-return';
//     const url = new URL(FE);
//     url.searchParams.set('status', 'failed');
//     return res.redirect(url.toString());
//   }
// }




// module.exports = { vnpCreate, vnpReturn, createDepositPayment, createFinalPayment };21/11















// // src/controllers/pay.controller.js
// const qs = require("qs");
// const crypto = require("crypto");
// const Order = require("../models/Order");
// const Product = require("../models/Product");
// const CustomRequest = require("../models/CustomRequest");
// const { VNPay, HashAlgorithm, ProductCode } = require('vnpay');

// function sortObj(obj) {
//   const sorted = {};
//   Object.keys(obj).sort().forEach(k => (sorted[k] = obj[k]));
//   return sorted;
// }

// const vnpay = new VNPay({
//   tmnCode: process.env.VNP_TMN_CODE,
//   secureSecret: process.env.VNP_HASH_SECRET,
//   vnpayHost: process.env.VNP_HOST || 'https://sandbox.vnpayment.vn',
//   testMode: process.env.NODE_ENV !== 'production',
//   hashAlgorithm: HashAlgorithm.SHA512,
//   endpoints: {
//     paymentEndpoint: 'paymentv2/vpcpay.html',
//   },
// });

// function clientIp(req) {
//   return (req.headers['x-forwarded-for'] || '').split(',')[0].trim()
//       || req.socket?.remoteAddress
//       || '127.0.0.1';
// }

// // ----------------- GENERIC VNPay ORDER -----------------
// async function vnpCreate(req, res) {
//   try {
//     const { items = [], customer = {}, shippingFee = 0, discount = 0 } = req.body;
//     if (!Array.isArray(items) || items.length === 0)
//       return res.status(400).json({ message: "Giỏ hàng trống" });

//     let sub = 0;
//     const hydrated = [];
//     for (const it of items) {
//       const p = await Product.findById(it.id);
//       if (!p) return res.status(400).json({ message: `Sản phẩm không tồn tại: ${it.id}` });
//       const qty = Number(it.quantity || 1);
//       hydrated.push({ product: p._id, name: p.name, price: p.price, quantity: qty, image: p.poster || "" });
//       sub += (Number(p.price) || 0) * qty;
//     }
//     const total = Math.max(0, sub + Number(shippingFee) - Number(discount));
//     if (!total) return res.status(400).json({ message: "Tổng tiền không hợp lệ" });

//     const order = await Order.create({
//       code: `ORD-${Date.now()}`,
//       user: req.user?.id || null,
//       items: hydrated,
//       amount: sub,
//       shippingFee: Number(shippingFee),
//       discount: Number(discount),
//       grandTotal: total,
//       customer,
//       paymentMethod: "VNPAY",
//       status: "pending",
//     });

//     const paymentUrl = vnpay.buildPaymentUrl({
//       vnp_Amount: total,
//       vnp_IpAddr: clientIp(req) || '127.0.0.1',
//       vnp_TxnRef: `${order._id}-${Date.now()}`,
//       vnp_OrderInfo: `Thanh toan don ${order.code}`,
//       vnp_OrderType: ProductCode.Other,
//       vnp_ReturnUrl: process.env.VNP_RETURN_URL,
//     });

//     return res.json({ payUrl: paymentUrl, orderId: order._id });
//   } catch (e) {
//     console.error("[vnpCreate]", e);
//     return res.status(500).json({ message: e.message || "Không tạo được URL VNPay" });
//   }
// }

// // ----------------- CREATE DEPOSIT PAYMENT -----------------
// async function createDepositPayment(req, res) {
//   try {
//     const { customRequestId } = req.body;
//     if (!customRequestId) return res.status(400).json({ message: "Thiếu customRequestId" });

//     const cr = await CustomRequest.findById(customRequestId);
//     if (!cr) return res.status(404).json({ message: "Yêu cầu không tồn tại" });

//     const quote = cr.quote || {};
//     const price = Number(quote.price || 0);
//     const depositPercent = Number(quote.depositPercent || 0);
//     if (!price || depositPercent <= 0)
//       return res.status(400).json({ message: "Không có khoản cọc để thanh toán" });

//     const depositAmount = Math.round((price * depositPercent) / 100);

//     const order = await Order.create({
//       code: `ORD-CUST-DEPOSIT-${customRequestId}-${Date.now()}`,
//       // user: cr.user || null,
//       user: cr.customer?.user || null,

//       items: [],
//       amount: depositAmount,
//       shippingFee: 0,
//       discount: 0,
//       grandTotal: depositAmount,
//       customer: cr.customer || {},
//       paymentMethod: "VNPAY",
//       status: "pending",
//       metadata: {
//         type: "custom-deposit",
//         customRequestId: String(cr._id),
//         depositPercent,
//         depositAmount
//       },
//     });

//     console.log("[createDepositPayment] Created order metadata:", order.metadata);

//     const paymentUrl = vnpay.buildPaymentUrl({
//       vnp_Amount: depositAmount ,
//       vnp_IpAddr: clientIp(req) || '127.0.0.1',
//       vnp_TxnRef: `${order._id}-${Date.now()}`,
//       vnp_OrderInfo: `Cọc ${depositAmount} cho yêu cầu ${cr.code || cr._id}`,
//       vnp_OrderType: ProductCode.Other,
//       vnp_ReturnUrl: process.env.VNP_RETURN_URL,
//     });

//     return res.json({ payUrl: paymentUrl, orderId: order._id, depositAmount });
//   } catch (e) {
//     console.error("[createDepositPayment]", e);
//     return res.status(500).json({ message: e.message || "Không tạo được payment cọc" });
//   }
// }


// // ----------------- CREATE FINAL PAYMENT -----------------
// async function createFinalPayment(req, res) {
//   try {
//     const { customRequestId } = req.body;
//     if (!customRequestId) return res.status(400).json({ message: "Thiếu customRequestId" });

//     const cr = await CustomRequest.findById(customRequestId);
//     if (!cr) return res.status(404).json({ message: "Yêu cầu không tồn tại" });

//     const quote = cr.quote || {};
//     const price = Number(quote.price || 0);

//     // Tiền cọc đã thanh toán
//     // const depositPaid = Number(cr.depositPayment?.amount || 0);
//     const depositPaid = Number(cr.depositAmountPaid || 0);


//     // Số tiền còn lại
//     const remaining = Math.max(0, price - depositPaid);
//     if (!remaining) return res.status(400).json({ message: "Không còn khoản phải thanh toán" });

//     const order = await Order.create({
//       code: `ORD-CUST-FINAL-${customRequestId}-${Date.now()}`,
//       user: cr.user || null,
//       items: [],
//       amount: remaining,
//       shippingFee: 0,
//       discount: 0,
//       grandTotal: remaining,
//       customer: cr.customer || {},
//       paymentMethod: "VNPAY",
//       status: "pending",
//       metadata: {
//         type: "custom-final",
//         customRequestId: String(cr._id),
//         remainingAmount: remaining
//       },
//     });

//     console.log("[createFinalPayment] Created order metadata:", order.metadata);

//     const paymentUrl = vnpay.buildPaymentUrl({
//       vnp_Amount: remaining ,
//       vnp_IpAddr: clientIp(req) || '127.0.0.1',
//       vnp_TxnRef: `${order._id}-${Date.now()}`,
//       vnp_OrderInfo: `Thanh toán phần còn lại ${remaining} cho yêu cầu ${cr.code || cr._id}`,
//       vnp_OrderType: ProductCode.Other,
//       vnp_ReturnUrl: process.env.VNP_RETURN_URL,
//     });

//     return res.json({ payUrl: paymentUrl, orderId: order._id, remaining });
//   } catch (e) {
//     console.error("[createFinalPayment]", e);
//     return res.status(500).json({ message: e.message || "Không tạo được payment cuối" });
//   }
// }




// async function vnpReturn(req, res) {
//   try {
//     const query = req.query || {};
//     console.log("[vnpReturn] VNPay query:", query);

//     // verify VNPay
//     const verify = vnpay.verifyReturnUrl(query);
//     console.log("[vnpReturn] verifyReturnUrl result:", verify);

//     // lấy orderId từ vnp_TxnRef
//     const rawTxnRef = String(query.vnp_TxnRef || '');
//     const orderId = rawTxnRef.split('-')[0];
//     console.log("[vnpReturn] orderId extracted:", orderId);

//     const order = await Order.findById(orderId);
//     if (!order) {
//       console.error("[vnpReturn] Order not found!");
//       return res.redirect(`${process.env.VNP_RETURN_FE || 'http://localhost:5173/payment-return'}?status=failed`);
//     }
//     console.log("[vnpReturn] Order found:", order.code);

//     const amount = Number(query.vnp_Amount || 0) / 100;
//     const isSuccess = String(query.vnp_ResponseCode) === '00' && verify.isSuccess;
//     const transactionNo = query.vnp_TransactionNo;

//     // Ghi payment info vào order
//     order.paymentInfo = {
//       gateway: "VNPAY",
//       transactionNo,
//       amount,
//       vnpResponseCode: query.vnp_ResponseCode,
//       bankCode: query.vnp_BankCode,
//       bankTranNo: query.vnp_BankTranNo,
//       cardType: query.vnp_CardType,
//       payDate: query.vnp_PayDate,
//       raw: query,
//     };

//     if (isSuccess && order.status === 'pending') {
//       order.status = 'paid';
//       order.paidAt = new Date();
//     }
//     await order.save();
//     console.log("[vnpReturn] Order saved with paymentInfo");

//     // Debug metadata
//     const meta = order.metadata || {};
//     console.log("[vnpReturn] order.metadata:", meta);

//     if (meta.type && meta.customRequestId) {
//       const cr = await CustomRequest.findById(meta.customRequestId);
//       if (!cr) {
//         console.error("[vnpReturn] CustomRequest not found:", meta.customRequestId);
//       } else {
//         console.log("[vnpReturn] CustomRequest found:", cr._id);

//         if (meta.type === 'custom-deposit') {
//           cr.depositPayment = {
//             gateway: "VNPAY",
//             transactionNo,
//             amount,
//             bankCode: query.vnp_BankCode,
//             bankTranNo: query.vnp_BankTranNo,
//             cardType: query.vnp_CardType,
//             payDate: query.vnp_PayDate,
//             raw: query,
//           };//
//           cr.depositAmountPaid = amount; //mới thêm
//           cr.depositPaid = true;
//           cr.depositPaidAt = new Date();
//           if (!['approved','in_progress','done'].includes(cr.status)) {
//             cr.status = 'approved';
//           }
//           await cr.save();
//           console.log("[vnpReturn] depositPayment saved:", cr.depositPayment);
//         } else if (meta.type === 'custom-final') {
//           cr.finalPayment = {
//             gateway: "VNPAY",
//             transactionNo,
//             amount,
//             bankCode: query.vnp_BankCode,
//             bankTranNo: query.vnp_BankTranNo,
//             cardType: query.vnp_CardType,
//             payDate: query.vnp_PayDate,
//             raw: query,
//           };
//           cr.finalPaid = true;
//           cr.finalPaidAt = new Date();
//           await cr.save();
//           console.log("[vnpReturn] finalPayment saved:", cr.finalPayment);
//         }
//       }
//     } else {
//       console.warn("[vnpReturn] metadata missing type or customRequestId");
//     }

//     // Redirect FE
//     const FE = process.env.VNP_RETURN_FE || 'http://localhost:5173/payment-return';
//     const url = new URL(FE);
//     url.searchParams.set('status', isSuccess ? 'success' : 'failed');
//     url.searchParams.set('orderId', String(order._id));
//     url.searchParams.set('amount', String(amount));
//     url.searchParams.set("type", meta.type);
// url.searchParams.set("customRequestId", meta.customRequestId);

//     console.log("[vnpReturn] Redirecting to FE:", url.toString());
//     return res.redirect(url.toString());

//   } catch (e) {
//     console.error("[vnpReturn] ERROR:", e);
//     const FE = process.env.VNP_RETURN_FE || 'http://localhost:5173/payment-return';
//     const url = new URL(FE);
//     url.searchParams.set('status', 'failed');
//     return res.redirect(url.toString());
//   }
// }




// module.exports = { vnpCreate, vnpReturn, createDepositPayment, createFinalPayment };///24/11










// src/controllers/pay.controller.js
const qs = require("qs");
const crypto = require("crypto");
const Order = require("../models/Order");
const Product = require("../models/Product");
const CustomRequest = require("../models/CustomRequest");
const { VNPay, HashAlgorithm, ProductCode } = require("vnpay");

function clientIp(req) {
  return (
    (req.headers["x-forwarded-for"] || "").split(",")[0].trim() ||
    req.socket?.remoteAddress ||
    "127.0.0.1"
  );
}

const vnpay = new VNPay({
  tmnCode: process.env.VNP_TMN_CODE,
  secureSecret: process.env.VNP_HASH_SECRET,
  vnpayHost: process.env.VNP_HOST || "https://sandbox.vnpayment.vn",
  testMode: process.env.NODE_ENV !== "production",
  hashAlgorithm: HashAlgorithm.SHA512,
  endpoints: { paymentEndpoint: "paymentv2/vpcpay.html" },
});

/* ===============================
   1) TẠO THANH TOÁN FULL VNPay
================================ */
async function createCustomFullPayment(req, res) {
  try {
    const { customRequestId } = req.body;
    if (!customRequestId)
      return res.status(400).json({ message: "Thiếu customRequestId" });

    const cr = await CustomRequest.findById(customRequestId);
    if (!cr) return res.status(404).json({ message: "Không tìm thấy yêu cầu" });

    const price = Number(cr.quote?.price || 0);
    if (!price)
      return res.status(400).json({
        message: "Yêu cầu chưa có báo giá hoặc báo giá không hợp lệ",
      });

    // Nếu đã thanh toán rồi thì không tạo lại
    if (cr.paid === true)
      return res.status(400).json({ message: "Đơn này đã thanh toán rồi" });

    const order = await Order.create({
      code: `ORD-CUSTOMFULL-${cr._id}-${Date.now()}`,
      user: cr.customer?.user || null,
      items: [],
      amount: price,
      grandTotal: price,
      shippingFee: 0,
      discount: 0,
      paymentMethod: "VNPAY",
      status: "pending",
      metadata: {
        type: "custom-full",
        customRequestId: String(cr._id),
      },
    });

    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: price,
      vnp_IpAddr: clientIp(req),
      vnp_TxnRef: `${order._id}-${Date.now()}`,
      vnp_OrderInfo: `Thanh toán thiết kế ${cr.code}`,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: process.env.VNP_RETURN_URL,
    });

    return res.json({ payUrl: paymentUrl });
  } catch (e) {
    console.error("[createCustomFullPayment]", e);
    return res.status(500).json({ message: "Không tạo được thanh toán" });
  }
}


async function createOrderVnpay(req, res) {
  try {
    const { orderId } = req.body;
    if (!orderId) return res.status(400).json({ message: "Thiếu orderId" });

    const order = await Order.findById(orderId);
    if (!order)
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });

    const amount = Number(order.grandTotal || 0);

    const paymentUrl = vnpay.buildPaymentUrl({
      vnp_Amount: amount,
      vnp_IpAddr: clientIp(req),
      vnp_TxnRef: `${order._id}-${Date.now()}`,
      vnp_OrderInfo: `Thanh toán đơn hàng ${order.code}`,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: process.env.VNP_RETURN_URL,
    });

    res.json({ payUrl: paymentUrl });
  } catch (e) {
    console.error("[createOrderVnpay]", e);
    res.status(500).json({ message: "Không tạo được thanh toán VNPay" });
  }
}


/* ===============================
   2) THANH TOÁN COD (KHÔNG ONLINE)
================================ */
async function payCustomCOD(req, res) {
  try {
    const { id } = req.params;
    const cr = await CustomRequest.findById(id);
    if (!cr) return res.status(404).json({ message: "Không tìm thấy yêu cầu" });

    if (cr.paid)
      return res.status(400).json({ message: "Yêu cầu đã được thanh toán" });

    cr.paymentFull = {
      provider: "COD",
      amount: cr.quote?.price || 0,
      paidAt: new Date(),
      meta: { note: "Khách chọn COD" },
    };

    cr.paid = true;
    cr.paidAmount = cr.quote.price;
    cr.paidAt = new Date();

    await cr.save();

    return res.json({ message: "Ghi nhận thanh toán COD thành công" });
  } catch (e) {
    console.error("payCustomCOD:", e);
    return res.status(500).json({ message: "Lỗi COD" });
  }
}

/* ===============================
   3) VNPay RETURN — XỬ LÝ FULL PAYMENT
================================ */
async function vnpReturn(req, res) {
  try {
    const query = req.query || {};
    const verify = vnpay.verifyReturnUrl(query);

    const rawTxn = String(query.vnp_TxnRef || "");
    const orderId = rawTxn.split("-")[0];

    const order = await Order.findById(orderId);
    if (!order)
      return res.redirect(
        `${process.env.VNP_RETURN_FE}?status=failed`
      );

    const amount = Number(query.vnp_Amount || 0) / 100;
    const isSuccess =
      verify.isSuccess && query.vnp_ResponseCode === "00";

    order.paymentInfo = { gateway: "VNPAY", raw: query, amount };
    if (isSuccess) {
      order.status = "paid";
      order.paidAt = new Date();
    }
    await order.save();

    const meta = order.metadata || {};
    if (meta.type === "custom-full" && meta.customRequestId) {
      const cr = await CustomRequest.findById(meta.customRequestId);
      if (cr) {
        cr.paymentFull = {
          provider: "VNPAY",
          transactionId: query.vnp_TransactionNo,
          amount,
          paidAt: new Date(),
          meta: query,
        };

        cr.paid = true;
        cr.paidAmount = amount;
        cr.paidAt = new Date();

        // KHÔNG đổi trạng thái đơn — vẫn giữ DONE
        await cr.save();
      }
    }

    const FE = process.env.VNP_RETURN_FE;
    const url = new URL(FE);
    url.searchParams.set("status", isSuccess ? "success" : "failed");
    url.searchParams.set("amount", String(amount));

    return res.redirect(url.toString());
  } catch (e) {
    console.error("[vnpReturn ERROR]", e);
    const FE = process.env.VNP_RETURN_FE;
    return res.redirect(`${FE}?status=failed`);
  }
}

module.exports = {
  createCustomFullPayment,
  payCustomCOD,
  vnpReturn,
  createOrderVnpay,
};
