









// // src/controllers/chat.controller.js
// const mongoose = require("mongoose");
// const Product = require("../models/Product");
// const Order = require("../models/Order");

// // ===== Helper =====

// // Detect intent: product / order / general
// function detectIntent(message) {
//   const msg = message.toLowerCase();
//   if (/đơn|order|trạng thái|mã/.test(msg)) return "order";
//   if (/tìm|mua|giá|sản phẩm|sofa|bàn|ghế|kệ|tủ|nội thất/.test(msg)) return "product";
//   return "general";
// }

// // Extract keyword + optional price range + color
// function extractProductQuery(message) {
//   let keyword = message.toLowerCase();
//   let minPrice = 0;
//   let maxPrice = Number.MAX_SAFE_INTEGER;
//   let color = "";

//   // Dưới X triệu / k
//   const matchBelow = keyword.match(/dưới\s*(\d+)\s*(triệu|k)/);
//   if (matchBelow) {
//     const value = parseInt(matchBelow[1], 10) * (matchBelow[2] === "triệu" ? 1000000 : 1000);
//     maxPrice = value;
//     keyword = keyword.replace(matchBelow[0], "").trim();
//   }

//   // Trên X triệu / k
//   const matchAbove = keyword.match(/trên\s*(\d+)\s*(triệu|k)/);
//   if (matchAbove) {
//     const value = parseInt(matchAbove[1], 10) * (matchAbove[2] === "triệu" ? 1000000 : 1000);
//     minPrice = value;
//     keyword = keyword.replace(matchAbove[0], "").trim();
//   }

//   // Khoảng X - Y triệu / k
//   const matchRange = keyword.match(/(\d+)\s*(triệu|k)\s*[-~]\s*(\d+)\s*(triệu|k)/);
//   if (matchRange) {
//     const v1 = parseInt(matchRange[1], 10) * (matchRange[2] === "triệu" ? 1000000 : 1000);
//     const v2 = parseInt(matchRange[3], 10) * (matchRange[4] === "triệu" ? 1000000 : 1000);
//     minPrice = Math.min(v1, v2);
//     maxPrice = Math.max(v1, v2);
//     keyword = keyword.replace(matchRange[0], "").trim();
//   }

//   // Màu sắc
//   const colors = ["đen", "trắng", "xám", "ghi", "be", "vàng", "xanh", "nâu", "hồng"];
//   for (const c of colors) {
//     if (keyword.includes(c)) {
//       color = c;
//       keyword = keyword.replace(c, "").trim();
//       break;
//     }
//   }

//   // Loại bỏ từ dư thừa
//   keyword = keyword.replace(/tôi|muốn|tìm|mua|màu|shop|giá|nội thất/gi, "").trim();

//   return { keyword, minPrice, maxPrice, color };
// }

// // ===== Controller =====
// exports.chatWithAI = async (req, res) => {
//   try {
//     const { message, userId } = req.body;
//     if (!message || !message.trim()) {
//       return res.json({ reply: "Xin hãy nhập câu hỏi.", type: "text", data: null });
//     }

//     const intent = detectIntent(message);

//     // ===== 1️⃣ PRODUCT SEARCH =====
//     if (intent === "product") {
//       const { keyword, minPrice, maxPrice, color } = extractProductQuery(message);

//       const query = {
//         name: { $regex: keyword || "", $options: "i" },
//         price: { $gte: minPrice, $lte: maxPrice },
//       };
//       if (color) query.colors = { $regex: color, $options: "i" };

//       const products = await Product.find(query).limit(5).lean();

//       if (!products.length) {
//         return res.json({ reply: "Không tìm thấy sản phẩm phù hợp.", type: "text", data: null });
//       }

//       const payload = products.map(p => ({
//         name: p.name,
//         slug: p.slug,
//         price: p.price,
//         poster: p.poster || p.images?.[0] || "",
//         description: p.description || p.desc || "",
//         colors: p.colors || [],
//       }));

//       return res.json({
//         reply: `Mình tìm thấy một số ${products.length} sản phẩm phù hợp:`,
//         type: "product_list",
//         data: payload
//       });
//     }

// // ===== 2️⃣ ORDER CHECK =====
// if (intent === "order") {
//   // Tìm mã đơn trong tin nhắn, ví dụ: ORD-123456 hoặc ORD-20250101-0001
//   const orderCodeMatch = message.match(/ORD-[A-Za-z0-9-]+/i);
//   if (!orderCodeMatch) {
//     return res.json({
//       reply: "Xin hãy nhập mã đơn hàng hợp lệ (ví dụ: ORD-123456).",
//       type: "text",
//       data: null
//     });
//   }

//   const orderCode = orderCodeMatch[0].toUpperCase();

//   // Không lọc theo user nữa, cho phép ai có mã đơn cũng xem
//   const orders = await Order.find({
//     code: { $regex: `^${orderCode}$`, $options: "i" },
//   }).lean();

//   if (!orders.length) {
//     return res.json({
//       reply: `Không tìm thấy đơn hàng ${orderCode}.`,
//       type: "text",
//       data: null
//     });
//   }

//   const payload = orders.map(o => ({
//     code: o.code,
//     status: o.status,
//     total: o.grandTotal,
//     createdAt: o.createdAt,
//     items: (o.items || []).map(i => ({
//       name: i.name,
//       quantity: i.quantity,
//       price: i.price,
//       // nếu muốn link tới product ở FE thì tuỳ bạn xử lý thêm
//       // slug: i.product ? i.product.slug : "",
//     }))
//   }));

//   return res.json({
//     reply: `Mình tìm thấy ${orders.length} đơn hàng:`,
//     type: "order_info",
//     data: payload
//   });
// }





//     // ===== 3️⃣ FALLBACK =====
//     return res.json({
//       reply: "Chào ban! Mình có thể giúp bạn tìm sản phẩm hoặc kiểm tra đơn hàng. Hãy thử nhập tên sản phẩm, màu sắc, giá hoặc mã đơn hàng.",
//       type: "text",
//       data: null
//     });

//   } catch (err) {
//     console.error("[chatbot]", err);
//     res.status(500).json({ reply: "Hệ thống chatbot gặp lỗi.", type: "text", data: null });
//   }
// };//20/11



























// src/controllers/chat.controller.js
const mongoose = require("mongoose");
const Product = require("../models/Product");
const Order = require("../models/Order");
const faqProduct = require("../data/faqProduct");

// ================= Helper =================
function text(message) {
  return {
    reply: message,
    type: "text",
    data: null
  };
}

async function findProduct(keyword) {
  const p = await Product.findOne({
    name: { $regex: keyword, $options: "i" }
  }).lean();

  return p ? {
    name: p.name,
    slug: p.slug,
    price: p.price,
    poster: p.poster || p.images?.[0] || ""
  } : null;
}



   

async function autoDetectProductName(msg) {
  if (!msg || msg.length < 2) return null;

  // cố match chính xác nhất
  let p = await Product.findOne({
    name: { $regex: "^" + msg.trim() + "$", $options: "i" }
  }).lean();

  // nếu không exact → match fuzzy (contains)
  if (!p) {
    p = await Product.findOne({
      name: { $regex: msg.trim(), $options: "i" }
    }).lean();
  }

  return p;
}

///giá cao thấp
function detectPriceLevel(msg) {
  msg = msg.toLowerCase();

  if (/giá rẻ|thấp nhất|rẻ nhất|bình dân/.test(msg)) {
    return { min: 0, max: 3000000 }; // dưới 3 triệu
  }
  if (/tầm trung|trung bình|giá vừa/.test(msg)) {
    return { min: 2000000, max: 10000000 }; // 3–10 triệu
  }
  if (/cao cấp|giá cao|đắt nhất|loại tốt/.test(msg)) {
    return { min: 10000000, max: 999999999 }; // trên 10 triệu
  }

  return null;
}



//ngân sách
function extractBudget(msg) {
  msg = msg.toLowerCase();

  // dạng: từ X đến Y triệu
  const range = msg.match(/từ\s*(\d+)\s*(triệu|k)?.*?(đến|-|tới)\s*(\d+)\s*(triệu|k)?/);
  if (range) {
    const min = parseInt(range[1]) * (range[2] === "triệu" ? 1_000_000 : 1_000);
    const max = parseInt(range[4]) * (range[5] === "triệu" ? 1_000_000 : 1_000);
    return { min, max };
  }

  // dưới X triệu
  const below = msg.match(/dưới\s*(\d+)\s*(triệu|k)?/);
  if (below) {
    return {
      min: 0,
      max: parseInt(below[1]) * (below[2] === "triệu" ? 1_000_000 : 1_000)
    };
  }

  // trên X triệu
  const above = msg.match(/trên\s*(\d+)\s*(triệu|k)?/);
  if (above) {
    return {
      min: parseInt(above[1]) * (above[2] === "triệu" ? 1_000_000 : 1_000),
      max: 999999999
    };
  }

  return null;
}

//nhận diện phòng
function detectRoomProducts(msg) {
  msg = msg.toLowerCase();

  if (/phòng khách/.test(msg)) {
    return ["sofa", "bàn", "bàn trà", "kệ", "đèn"];
  }
  if (/phòng ngủ/.test(msg)) {
    return ["giường", "tủ", "tủ quần áo", "bàn trang điểm"];
  }
  if (/phòng ăn|nhà bếp/.test(msg)) {
    return ["bàn ăn", "ghế ăn", "tủ bếp"];
  }

  return [];
}




// ================= INTENT DETECTOR =================
function detectIntent(message) {
  const msg = message.toLowerCase();

  // Order
  if (/ord-\d+/i.test(msg) || /đơn hàng|mã đơn|kiểm tra đơn/.test(msg))
    return "order";

   // FAQ sản phẩm (TRỪ "đổi trả" & "bảo hành")
  if (/chất liệu|kích thước|size|độ bền/.test(msg))
    return "faq_product";

  // Chính sách
  if (/đổi trả|bảo hành|hoàn tiền|chính sách/.test(msg))
    return "policy";

 

  // Shipping
  if (/giao|ship|vận chuyển|bao lâu|mất bao lâu|địa chỉ|tại đây|ở đây/.test(msg))
  return "shipping";

 // Advice
  if (/phòng khách | phòng ngủ |hợp với|phong cách|nên mua|gợi ý|tư vấn|màu nào/.test(msg))
    return "advice";
  
  // Combo
  if (/combo|bộ nội thất|set phòng|set|trọn gói|phòng khách|phòng ngủ/.test(msg))
    return "combo";

 

  // Product search
  if (/tìm|mua|giá|sofa|ghế|bàn|kệ|tủ|nội thất|giường/.test(msg))
    return "product";

  // Payment methods
if (/thanh toán|trả tiền|phương thức thanh toán|cách thanh toán|pay|payment/.test(msg))
  return "payment_method";


if (/bán chạy|best seller|bestseller|hot nhất|nhiều người mua/.test(msg))
  return "bestseller";


if (/khuyến mãi|giảm giá|sale|ưu đãi|khuyến mại|đang sale/.test(msg))
  return "promotion";



  return "general";
}



// Auto-detect: nếu người dùng copy tên sản phẩm
async function autoDetectProductName(msg) {
  const p = await Product.findOne({
    name: { $regex: msg.trim(), $options: "i" }
  }).lean();

  return p;
}



// ================= PRODUCT QUERY EXTRACTOR =================
function extractProductQuery(message) {
  let keyword = message.toLowerCase();
  let minPrice = 0;
  let maxPrice = Number.MAX_SAFE_INTEGER;
  let color = "";

  // dưới X triệu/k
  const matchBelow = keyword.match(/dưới\s*(\d+)\s*(triệu|k)/);
  if (matchBelow) {
    const value = parseInt(matchBelow[1], 10) * (matchBelow[2] === "triệu" ? 1000000 : 1000);
    maxPrice = value;
    keyword = keyword.replace(matchBelow[0], "").trim();
  }

  // trên X triệu/k
  const matchAbove = keyword.match(/trên\s*(\d+)\s*(triệu|k)/);
  if (matchAbove) {
    const value = parseInt(matchAbove[1], 10) * (matchAbove[2] === "triệu" ? 1000000 : 1000);
    minPrice = value;
    keyword = keyword.replace(matchAbove[0], "").trim();
  }

  // X - Y triệu/k
  const matchRange = keyword.match(/(\d+)\s*(triệu|k)\s*[-~]\s*(\d+)\s*(triệu|k)/);
  if (matchRange) {
    const v1 = parseInt(matchRange[1], 10) * (matchRange[2] === "triệu" ? 1000000 : 1000);
    const v2 = parseInt(matchRange[3], 10) * (matchRange[4] === "triệu" ? 1000000 : 1000);
    minPrice = Math.min(v1, v2);
    maxPrice = Math.max(v1, v2);
    keyword = keyword.replace(matchRange[0], "").trim();
  }

  // màu sắc
  const colors = ["đen", "trắng", "xám", "ghi", "be", "vàng", "xanh", "nâu", "hồng"];
  for (const c of colors) {
    if (keyword.includes(c)) {
      color = c;
      keyword = keyword.replace(c, "").trim();
      break;
    }
  }

keyword = keyword
  // loại bỏ phần giá
  .replace(/từ\s*\d+\s*(triệu|k)?/gi, "")
  .replace(/(đến|tới|-)\s*\d+\s*(triệu|k)?/gi, "")
  .replace(/\d+\s*(triệu|k)/gi, "")
  // loại bỏ từ dư
  .replace(/tôi|muốn|tìm|mua|màu|shop|giá|nội thất/gi, "")
  .replace(/\s+/g, " ")
  .trim();



  return { keyword, minPrice, maxPrice, color };
}

// ================= CONTROLLER =================
exports.chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message || !message.trim()) {
      return res.json(text("Xin hãy nhập câu hỏi."));
    }

    const intent = detectIntent(message);
    const msg = message.toLowerCase();

const autoProduct = await autoDetectProductName(message);

    if ((intent === "general" || intent === null) && autoProduct) {
      return res.json({
        reply: "Rất tiêt ! Mình tìm thấy sản phẩm bạn vừa nhắc đến:",
        type: "product_list",
        data: [
          {
            name: autoProduct.name,
            slug: autoProduct.slug,
            price: autoProduct.price,
            poster: autoProduct.poster || autoProduct.images?.[0] || "",
          },
        ],
      });
    }

    // ========== PRODUCT SEARCH ==========
    if (intent === "product") {
      const { keyword, minPrice, maxPrice, color } = extractProductQuery(message);

      // 🆕 1. Giá theo mức (giá rẻ / tầm trung / cao cấp)
  const priceLevel = detectPriceLevel(msg);
  let levelMin = 0, levelMax = Number.MAX_SAFE_INTEGER;
  if (priceLevel) {
    levelMin = priceLevel.min;
    levelMax = priceLevel.max;
  }

// 🆕 2. Giá theo budget (từ X đến Y / dưới / trên)
  const budget = extractBudget(msg);
  let budgetMin = 0, budgetMax = Number.MAX_SAFE_INTEGER;
  if (budget) {
    budgetMin = budget.min;
    budgetMax = budget.max;
  }

  // 🆕 3. Xác định min/max cuối cùng (ưu tiên theo thứ tự)
  const finalMin = Math.max(minPrice, levelMin, budgetMin);
  const finalMax = Math.min(maxPrice, levelMax, budgetMax);


   // 🆕 4. Nếu người dùng hỏi sản phẩm theo phòng:
  const roomList = detectRoomProducts(msg); // ["sofa", "bàn trà", "kệ tivi"]...

// 5. Keyword cuối cùng
  let finalKeyword = "";

  if (roomList.length) {
    finalKeyword = `(${roomList.join("|")})`;
  }
  // nếu không có roomList nhưng user nhập keyword -> dùng keyword
  else if (keyword) {
    finalKeyword = keyword;
  }
  // nếu không keyword -> match tất cả sản phẩm
  else {
    finalKeyword = ".*";     // <--- SỬA ĐIỂM QUAN TRỌNG NHẤT
  }

      const query = {
        name: { $regex: finalKeyword || "", $options: "i" },
        price: { $gte: finalMin, $lte: finalMax }
      };
      if (color) query.colors = { $regex: color, $options: "i" };

      const products = await Product.find(query).limit(5).lean();

      if (!products.length) {
        return res.json(text("Không tìm thấy sản phẩm phù hợp."));
      }

      return res.json({
        reply: `Mình tìm thấy ${products.length} sản phẩm phù hợp:`,
        type: "product_list",
        data: products.map(p => ({
          name: p.name,
          slug: p.slug,
          price: p.price,
          poster: p.poster || p.images?.[0] || "",
          colors: p.colors || []
        }))
      });
    }

    // ========== ORDER ==========
    if (intent === "order") {
      const orderCodeMatch = message.match(/ORD-[A-Za-z0-9-]+/i);
      if (!orderCodeMatch) return res.json(text("Vui lòng nhập mã đơn hợp lệ (VD: ORD-123456)."));

      const orderCode = orderCodeMatch[0];

      const order = await Order.findOne({ code: orderCode }).lean();
      if (!order) return res.json(text(`Không tìm thấy đơn hàng ${orderCode}.`));

      return res.json({
        reply: "Đây là thông tin đơn hàng của bạn cần tìm:",
        type: "order_info",
        data: [{
          code: order.code,
          status: order.status,
          total: order.grandTotal,
          items: order.items
        }]
      });
    }

     // ========== ADVICE ==========
    if (intent === "advice") {
      if (/phòng khách/.test(msg))
        return res.json(text("Phòng khách nhỏ nên dùng sofa chữ L + bàn trà tròn."));
      if (/phòng ngủ/.test(msg))
        return res.json(text("Phòng ngủ nên dùng giường 1m6 + tủ quần áo nhỏ."));
      if (/màu/.test(msg))
        return res.json(text("Tone sáng (trắng – be – nâu nhạt) phù hợp hầu hết không gian."));

      return res.json(text("Bạn mô tả phòng để mình tư vấn kỹ hơn nhé!"));
    }
    

    // ========== POLICY (Đổi trả & Bảo hành) ==========
    if (intent === "policy") {
      const msg = message.toLowerCase();

      const isReturn = /đổi trả|đổi|trả/.test(msg);
      const isWarranty = /bảo hành|bao hanh/.test(msg);

      // cả 2
      if (isReturn && isWarranty) {
        return res.json(text(
          "📌 *Chính sách đổi trả:*\n" +
          "- Đổi trả trong 7 ngày nếu sản phẩm lỗi nhà sản xuất.\n" +
          "- Sản phẩm phải còn nguyên tình trạng.\n\n\n\n\n\n" +
          "📌 *Chính sách bảo hành:*\n" +
          "- Bảo hành 12 tháng cho tất cả sản phẩm.\n" +
          "- Áp dụng cho lỗi kỹ thuật từ nhà sản xuất."
        ));
      }

      if (isReturn) {
        return res.json(text(
          "📌 *Chính sách đổi trả:*\n" +
          "- Đổi trả trong 7 ngày nếu sản phẩm lỗi nhà sản xuất.\n" +
          "- Sản phẩm phải còn nguyên tình trạng."
        ));
      }

      if (isWarranty) {
        return res.json(text(
          "📌 *Chính sách bảo hành:*\n" +
          "- Bảo hành 12 tháng cho tất cả sản phẩm.\n" +
          "- Áp dụng cho lỗi kỹ thuật."
        ));
      }

      return res.json(text("Bạn muốn xem đổi trả hay bảo hành?"));
    }

    // ========== FAQ PRODUCT ==========
    if (intent === "faq_product") {
      const msg = message.toLowerCase();

      // ❗ CHẶN các key liên quan policy
      const blockKeys = ["bảo hành", "đổi trả", "đổi", "trả"];

      for (const key in faqProduct) {
        if (blockKeys.includes(key)) continue;
        if (msg.includes(key)) {
          return res.json(text(faqProduct[key]));
        }
      }

      return res.json(text("Bạn muốn hỏi thêm điều gì về sản phẩm?"));
    }

    // ========== COMBO ==========
    if (intent === "combo") {
      const items = [];

      async function push(keyword) {
        const p = await findProduct(keyword);
        if (p) items.push(p);
      }

      if (/phòng khách/.test(msg)) {
        await push("sofa");
        await push("bàn");
        await push("kệ");

        return res.json({
          reply: "Cảm ơn bạn! Tôi đã tìm và gợi ý cho bạn Combo gợi ý cho phòng khách:",
          type: "product_list",
          data: items
        });
      }

      if (/phòng ngủ/.test(msg)) {
        await push("giường");
        await push("tủ");
        await push("bàn trang điểm");

        return res.json({
          reply: "Cảm ơn bạn! Tôi đã tìm và gợi ý cho bạnCombo gợi ý cho phòng ngủ:",
          type: "product_list",
          data: items
        });
      }
    }


    // ========== SHIPPING ==========
if (intent === "shipping") {
  const msg = message.toLowerCase();

  // Địa phương phổ biến
  const locations = [
    "hồ chí minh", "hcm", "sài gòn",
    "hà nội", "hn",
    "đà nẵng",
    "cần thơ",
    "bình dương",
    "đồng nai",
    "hải phòng",
    "quảng ninh",
    "vĩnh long",
    "cà mau",
    "vũng tàu",
  ];

  // Tìm địa điểm trong câu hỏi
  let foundLocation = "";
  for (const loc of locations) {
    if (msg.includes(loc)) {
      foundLocation = loc;
      break;
    }
  }

  // Nếu khách không nói địa chỉ
  if (!foundLocation) {
    return res.json(text(
      "Dạ shop giao hàng toàn quốc ạ! 💖\n" +
      "Bạn cho mình biết bạn đang ở khu vực nào để mình báo thời gian giao hàng chính xác nhé."
    ));
  }

  // Nếu tìm thấy địa chỉ
  if (["hồ chí minh", "hcm", "sài gòn"].includes(foundLocation)) {
    return res.json(text(
      "Dạ khu vực TP. Hồ Chí Minh shop giao nhanh trong **1–2 ngày** ạ! 🚚✨"
    ));
  }

  if (["hà nội", "hn"].includes(foundLocation)) {
    return res.json(text(
      "Dạ Hà Nội giao trong **3–5 ngày** bạn nhé! 🚚💨"
    ));
  }

  if (["đà nẵng"].includes(foundLocation)) {
    return res.json(text(
      "Dạ Đà Nẵng giao trong **3–5 ngày** bạn nhé! 🚛💨"
    ));
  }

  if (["bình dương", "đồng nai", "cần thơ"].includes(foundLocation)) {
    return res.json(text(
      `Dạ khu vực **${foundLocation.toUpperCase()}** shop giao trong **2–4 ngày** bạn nhé! 🚚`
    ));
  }

  // Mặc định
  return res.json(text(
    `Dạ khu vực **${foundLocation.toUpperCase()}** shop có giao hàng ạ!\n` +
    "Thời gian dự kiến: **3–7 ngày**, tuỳ tuyến vận chuyển. 🚚💨"
  ));
}


   // ========== PAYMENT METHOD ==========
if (intent === "payment_method") {
  return res.json(text(
    "Hiện tại shop hỗ trợ 2 hình thức thanh toán:\n\n" +
    "💵 **Thanh toán khi nhận hàng (COD)** – tiện lợi & an toàn.\n" +
    "💳 **VNPay** – thanh toán online nhanh chóng, bảo mật.\n\n" +
    "Bạn muốn thanh toán theo cách nào ạ?"
  ));
}


// ========== BEST SELLER ==========
if (intent === "bestseller") {
  // Nếu Product của bạn có trường "sold" (đã bán)
  const products = await Product.find()
    .sort({ sold: -1 })   // sắp xếp theo sold giảm dần
    .limit(5)
    .lean();

  if (!products.length) {
    return res.json(text("Hiện chưa có dữ liệu sản phẩm bán chạy nhất ạ."));
  }

  return res.json({
    reply: "Top sản phẩm bán chạy nhất shop là đây nè 🔥:",
    type: "product_list",
    data: products.map(p => ({
      name: p.name,
      slug: p.slug,
      price: p.price,
      poster: p.poster || p.images?.[0] || "",
      sold: p.sold || 0
    }))
  });
}



// ========== PROMOTION / SALE ==========
if (intent === "promotion") {
  // Lấy sản phẩm có giảm giá mạnh nhất
  const products = await Product.find({
    $or: [
      { discount: { $gt: 0 } },
      { salePercent: { $gt: 0 } },
      { comparePrice: { $gt: 0 } },
    ]
  })
    .limit(5)
    .lean();

  if (!products.length) {
    return res.json(text("Hiện tại shop chưa có chương trình khuyến mãi nào ạ 💛"));
  }

  // Tính % giảm giá (nếu có comparePrice)
  const mapped = products.map(p => {
    let percent = p.salePercent || 0;

    if (p.comparePrice && p.comparePrice > p.price) {
      percent = Math.round(((p.comparePrice - p.price) / p.comparePrice) * 100);
    }

    return {
      name: p.name,
      slug: p.slug,
      price: p.price,
      comparePrice: p.comparePrice || null,
      salePercent: percent,
      poster: p.poster || p.images?.[0] || ""
    };
  });

  // Sắp xếp theo % giảm mạnh nhất
  mapped.sort((a, b) => (b.salePercent || 0) - (a.salePercent || 0));

  return res.json({
    reply: "🔥 Đây là những sản phẩm đang có khuyến mãi tốt nhất:",
    type: "product_list",
    data: mapped.slice(0, 5),
  });
}



    // ========== FALLBACK ==========
    return res.json(text("Mình có thể giúp bạn tìm sản phẩm hoặc kiểm tra đơn hàng nhé!"));

  } catch (err) {
    console.error("[chatbot]", err);
    return res.status(500).json(text("Hệ thống chatbot gặp lỗi."));
  }
};
