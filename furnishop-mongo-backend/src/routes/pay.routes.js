// // src/routes/pay.routes.js
// const router = require("express").Router();
// const pay = require("../controllers/pay.controller");
// const auth = require("../middlewares/auth");



// router.post("/vnpay/create",auth, pay.vnpCreate);       // khách có thể là guest
// router.get("/vnpay/return", pay.vnpReturn);        // VNPay redirect về (BE)

// // NEW: create deposit payment for custom request (customer will call this)
// router.post("/vnpay/create-deposit", auth, pay.createDepositPayment);

// // NEW: create final payment for custom request (customer will call this)
// router.post("/vnpay/create-final", auth, pay.createFinalPayment);


// module.exports = router;//24/111





// src/routes/pay.routes.js
const router = require("express").Router();
const requireAuth = require("../middlewares/requireAuth");
const payCtrl = require("../controllers/pay.controller");

// Thanh toán FULL qua VNPay
router.post(
  "/vnpay/custom/full",
  requireAuth,
  payCtrl.createCustomFullPayment
);



router.post("/vnpay/create", requireAuth, payCtrl.createOrderVnpay);

// Thanh toán COD
router.post(
  "/custom/:id/pay-cod",
  requireAuth,
  payCtrl.payCustomCOD
);

// Callback VNPay
router.get("/vnpay/return", payCtrl.vnpReturn);

module.exports = router;
