// const router = require("express").Router();
// const ctrl = require("../controllers/auth.controller");
// const { registerRules, loginRules } = require("../validators/auth.validator");
// const validate = require("../middlewares/validate");
// const auth = require("../middlewares/auth");

// router.post("/register", registerRules, validate, ctrl.register);
// router.post("/login", loginRules, validate, ctrl.login);
// router.get("/me", auth, ctrl.me);

// module.exports = router;


// routes/auth.routes.js
const router = require("express").Router();
const ctrl = require("../controllers/auth.controller");
const { registerRules, loginRules } = require("../lib/validators/auth.validator");
const validate = require("../middlewares/validate");
const auth = require("../middlewares/auth");

router.post("/register", registerRules, validate, ctrl.register);
router.post("/login", loginRules, validate, ctrl.login);
router.get("/me", auth, ctrl.me);

module.exports = router;
