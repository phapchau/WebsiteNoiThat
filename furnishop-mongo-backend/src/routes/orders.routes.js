// // src/routes/orders.routes.js
// const router = require("express").Router();
// const orders = require("../controllers/orders.controller");
// const auth = require("../middlewares/auth");
// const requireRole = require("../middlewares/requireRole");

// // 1) Tạo đơn — KHÔNG bắt buộc đăng nhập (guest checkout)
// router.post("/", orders.create);

// // 2) Đơn của chính tôi — cần đăng nhập
// router.get("/me/list", auth, orders.myOrders);

// // 3) Danh sách đơn — admin
// router.get("/", auth, requireRole("admin"), orders.list);

// // 4) Xem chi tiết 1 đơn — cần đăng nhập (để controller kiểm tra owner/admin)
// router.get("/:id", auth, orders.getOne);

// // 5) Cập nhật trạng thái — admin
// router.patch("/:id/status", auth, requireRole("admin"), orders.updateStatus);

// module.exports = router;///









// routes/orders.routes.js
const router = require("express").Router();
const orders = require("../controllers/orders.controller");
const auth = require("../middlewares/auth");
const requireRole = require("../middlewares/requireRole");

// 1) Tạo đơn — KHÔNG bắt buộc đăng nhập (guest checkout)
router.post("/",auth, orders.create);


// ✨ KH hủy đơn
router.patch("/:id/cancel", auth, orders.cancelByCustomer);
router.delete("/:id", auth, orders.deleteOrder);

// 2) Đơn của chính tôi — CẦN đăng nhập
router.get("/me", auth, orders.myOrders);

// 3) Danh sách đơn — ADMIN
// router.get("/", auth, requireRole("admin"), orders.list);
router.get("/", auth, requireRole(["admin", "staff"]), orders.list);

// 4) Xem chi tiết 1 đơn
//    Public để khách vừa đặt xong có thể xem chi tiết qua link /orders/:id
//    (nếu muốn “khóa”, có thể thêm auth và kiểm tra owner trong controller)
router.get("/:id",auth, orders.getOne);

// 5) Cập nhật trạng thái — ADMIN
router.patch("/:id/status", auth, requireRole(["admin", "staff"]), orders.updateStatus);

router.get("/:id/receipt",auth, orders.generateReceiptPDF);
module.exports = router;

