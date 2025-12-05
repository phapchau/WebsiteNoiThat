const router = require("express").Router();
const { makeVietQR } = require("../controllers/bank.controller");
const auth = require("../middlewares/auth");

// Có thể cho phép cả guest xem QR, nhưng để đồng bộ đơn thì nên buộc login
router.get("/qr", auth, makeVietQR);
router.post("/qr", auth, makeVietQR);

module.exports = router;
