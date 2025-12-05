const router = require("express").Router();
const ctrl = require("../controllers/categories.controller");
const auth = require("../middlewares/auth");
const requireRole = require("../middlewares/requireRole");

// Public
router.get("/", ctrl.list);
router.get("/count", ctrl.count);
router.get("/:idOrSlug", ctrl.getOne);

// Admin
router.post("/", auth, requireRole("admin"), ctrl.create);
router.patch("/:id", auth, requireRole("admin"), ctrl.update);
router.put("/:id", auth, requireRole("admin"), ctrl.update);
router.delete("/:id", auth, requireRole("admin"), ctrl.remove);

module.exports = router;
