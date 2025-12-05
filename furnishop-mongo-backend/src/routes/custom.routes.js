

// src/routes/custom.routes.js
const express = require("express");
const path = require("path");
const fs = require("fs");
const multer = require("multer");

const requireAuth = require("../middlewares/requireAuth");
const requireRole = require("../middlewares/requireRole");
const ctrl = require("../controllers/custom.controller");

const router = express.Router();

// ===== Multer upload =====
const UP_DIR = path.join(__dirname, "..", "uploads", "custom");
fs.mkdirSync(UP_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UP_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname || "");
    const base = path.basename(file.originalname || "file", ext)
      .replace(/\s+/g, "_")
      .slice(0, 64);
    cb(null, `${Date.now()}_${base}${ext}`);
  },
});
const fileFilter = (req, file, cb) => {
  if (/^image\//i.test(file.mimetype)) return cb(null, true);
  cb(new Error("Chỉ nhận file ảnh"));
};
const upload = multer({
  storage, fileFilter,
  limits: { fileSize: 8 * 1024 * 1024, files: 8 },
});

// routes/custom.routes.js
router.get("/:id/receipt", requireAuth, ctrl.exportReceipt);

// ===== Customer =====
router.post("/", requireAuth, upload.array("files", 8), ctrl.createRequest);
router.get("/me", requireAuth, ctrl.listMine);
router.get("/me/:id", requireAuth, ctrl.getOne);

// ===== Admin =====
router.get("/", requireAuth, requireRole(["admin", "staff"]), ctrl.listAll);
router.patch("/:id/quote", requireAuth, requireRole("admin"), ctrl.adminQuote);
router.patch("/:id/status", requireAuth, requireRole(["admin", "staff"]), ctrl.adminUpdateStatus);

// ===== Customer actions =====
router.post("/:id/accept", requireAuth, ctrl.customerAcceptQuote);
router.post("/:id/reject", requireAuth, ctrl.customerRejectQuote);
router.post("/:id/cancel", requireAuth, ctrl.customerCancel);



module.exports = router;

