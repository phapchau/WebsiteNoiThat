// // routes/chat.routes.js
// const express = require("express");
// const { askChat } = require("../controllers/chat.controller"); // đổi path nếu bạn để controller nơi khác

// const router = express.Router();

// // POST /api/chat/ask
// router.post("/ask", express.json(), askChat);

// module.exports = router;












// const express = require("express");
// const router = express.Router();
// const chatController = require("../controllers/chat.controller");
// const { chat } = require("../controllers/chat.controller");
// const auth = require("../middlewares/requireAuth"); 
// // --- Route POST /api/chat/ask ---
// // Chạy trực tiếp, không cần auth
// router.post('/', chatController.chat);

// module.exports = router;










// src/routes/chat.routes.js
const express = require("express");
const router = express.Router();
const { chatWithAI } = require("../controllers/chat.controller");
const auth = require("../middlewares/requireAuth");
// POST /api/chat
router.post("/", chatWithAI);

module.exports = router;

