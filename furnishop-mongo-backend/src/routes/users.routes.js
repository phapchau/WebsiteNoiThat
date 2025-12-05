// const router = require("express").Router();
// const users = require("../controllers/users.controller");
// const auth = require("../middlewares/auth");

// router.get("/me", auth, users.getMe);
// router.patch("/me", auth, users.updateMe);
// router.patch("/me/password", auth, users.changePassword);


// module.exports = router;///













// const router = require("express").Router();
// const users = require("../controllers/users.controller");
// const auth = require("../middlewares/auth");
// const requireRole = require("../middlewares/requireRole");



// // Me
// router.get("/me", auth, users.getMe);
// router.patch("/me", auth, users.updateMe);
// router.patch("/me/password", auth, users.changePassword);

// // Addresses (cần đăng nhập)
// router.get("/addresses", auth, users.addressList);
// router.post("/addresses", auth, users.addressCreate);
// router.patch("/addresses/:id", auth, users.addressUpdate);
// router.delete("/addresses/:id", auth, users.addressDelete);
// router.patch("/addresses/:id/default", auth, users.addressSetDefault);

// // Dashboard helpers
// router.get("/count", users.count); // hoặc auth + requireRole("admin") nếu muốn
// // router.get("/", auth, requireRole("admin"), users.list);
// router.get("/", auth, users.list);

// module.exports = router;//2/11








// src/routes/users.routes.js
const router = require("express").Router();
const users = require("../controllers/users.controller");          // ../controllers
const requireAuth = require("../middlewares/requireAuth");         // ../middlewares
const requireRole = require("../middlewares/requireRole");         // nếu cần

// Me
router.get("/me", requireAuth, users.getMe);

router.patch("/me", requireAuth, users.updateMe);
router.patch("/me/password", requireAuth, users.changePassword);

// Addresses
router.get("/addresses", requireAuth, users.addressList);
router.post("/addresses", requireAuth, users.addressCreate);
// dùng :addrId (hoặc :id) thống nhất với controller của bạn
router.patch("/addresses/:addrId", requireAuth, users.addressUpdate);
router.delete("/addresses/:addrId", requireAuth, users.addressDelete);
router.patch("/addresses/:addrId/default", requireAuth, users.addressSetDefault);

// (tuỳ chọn) Dashboard helpers
router.get("/count", requireAuth, requireRole("admin"), users.count);
// router.get("/count", users.count);

// (tuỳ chọn) Danh sách users (admin)
// router.get("/", requireAuth, requireRole?.("admin") || ((req, res, next) => next()), users.list);
router.get("/", requireAuth, requireRole("admin"), users.list);
router.get("/:id", requireAuth, requireRole("admin"), users.getOneAdmin);

// quản lý user — chỉ admin
router.patch("/:id/role", requireAuth, requireRole("admin"), users.updateRole);
router.patch("/:id/status", requireAuth, requireRole("admin"), users.updateStatus);
router.delete("/:id", requireAuth, requireRole("admin"), users.deleteUser);

module.exports = router;
