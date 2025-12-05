


// src/routes/addresses.routes.js
const router = require("express").Router();
const auth = require("../middlewares/auth");

router.get("/", auth, async (req, res) => {
  try {
    const user = req.user;
    res.json(user.addresses || []);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const { name, phone, email, line1, isDefault } = req.body;
    if (!name || !phone || !line1) return res.status(400).json({ message: "Thiếu name/phone/line1" });

    if (isDefault) {
      req.user.addresses = (req.user.addresses || []).map(a => ({ ...a.toObject?.() || a, isDefault: false }));
    }
    const addr = { name, phone, email, line1, isDefault: !!isDefault };
    req.user.addresses = req.user.addresses || [];
    req.user.addresses.unshift(addr);
    await req.user.save();
    res.status(201).json(req.user.addresses[0]);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

module.exports = router;
