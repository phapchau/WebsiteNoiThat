const router = require("express").Router();
const upload = require("../middlewares/uploadLocal");
const auth = require("../middlewares/auth");
const requireRole = require("../middlewares/requireRole");

// Upload 1 file bất kỳ trong allowed mime-types
// form-data: key = "file" ; value = <chọn file>
router.post(
  "/file",
  auth,
  requireRole("admin"),
  upload.single("file"),
  (req, res) => {
    const url = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;
    res.json({
      ok: true,
      url,
      originalName: req.file.originalname,
      mime: req.file.mimetype,
      size: req.file.size
    });
  }
);

// Bắt lỗi từ multer/auth để FE nhận JSON thay vì HTML
router.use((err, _req, res, _next) => {
  if (err) {
    return res.status(400).json({ ok: false, message: err.message });
  }
  res.status(500).json({ ok: false, message: "Upload error" });
});


module.exports = router;
