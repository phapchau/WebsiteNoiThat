// src/routes/products.routes.js (chuẩn)
const router = require("express").Router();
const ctrl = require("../controllers/products.controller");
const auth = require("../middlewares/auth");
const requireRole = require("../middlewares/requireRole");
const requireAuth = require("../middlewares/requireAuth");
const multer = require("multer");
const path = require("path");
const upload = require("../middlewares/uploadLocal"); // multer config


// Public
router.get("/", ctrl.list);
router.get("/sale", ctrl.listSale);
router.get("/flash-sale", ctrl.flashSalePro);

router.get("/:idOrSlug", ctrl.getOne);


// // Review (login required)
// router.post("/:id/reviews", auth, ctrl.addReview); // 👈 THÊM

// Reviews
router.get("/:id/reviews", ctrl.getReviews);
// router.post("/:id/reviews", requireAuth, ctrl.addReview);
router.post("/:id/reviews", requireAuth, upload.array("images", 5), ctrl.addReview);

// Admin
router.post("/", auth, requireRole(["admin", "staff"]), ctrl.create);
// router.put("/:id", auth, requireRole("admin"), ctrl.update);
router.patch("/:id", auth, requireRole(["admin", "staff"]), ctrl.update); 
router.delete("/:id", auth, requireRole(["admin", "staff"]), ctrl.remove);




module.exports = router; // <-- BẮT BUỘC
