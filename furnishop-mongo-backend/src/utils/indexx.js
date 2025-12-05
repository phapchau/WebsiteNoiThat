// // const express = require("express");
// // const mongoose = require("mongoose");

// // const app = express();

// // // Chuỗi kết nối MongoDB
// // const uri = "mongodb://localhost:27017/furnishop"; // đổi theo tên DB của bạn

// // mongoose.connect(uri, {
// //   useNewUrlParser: true,
// //   useUnifiedTopology: true,
// // })
// // .then(() => console.log("✅ Kết nối MongoDB thành công!"))
// // .catch(err => console.error("❌ Lỗi kết nối MongoDB:", err));

// // app.get("/", (req, res) => {
// //   res.send("Server & MongoDB đã kết nối!");
// // });

// // app.listen(8080, () => console.log("🚀 Server chạy tại http://localhost:8080"));



// // src/index.js
// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const app = express();

// // Middleware cơ bản (để đọc JSON body)
// app.use(express.json());



// // CORS: cho phép frontend Vite
// app.use(cors({
//   origin: ["http://localhost:5173"], // URL Vite
//   credentials: true
// }));




// // Chuỗi kết nối MongoDB
// const uri = "mongodb://localhost:27017/furnishop"; // DB furnishop trong Compass

// // ❗Mongoose 8 trở lên: KHÔNG truyền useNewUrlParser/useUnifiedTopology nữa
// mongoose.set("strictQuery", true);
// mongoose
//   .connect(uri)
//   .then(() => console.log("✅ Kết nối MongoDB thành công!"))
//   .catch((err) => console.error("❌ Lỗi kết nối MongoDB:", err));

// // Health check
// app.get("/api/health", (req, res) => {
//   res.json({ status: "ok", time: new Date().toISOString() });
// });


// // Mount auth routes
// app.use("/api/auth", require("../routes/auth.routes"));








// // Trang chủ
// app.get("/", (req, res) => {
//   res.send("Server & MongoDB đã kết nối!");
// });

// // Lắng nghe cổng 8080
// app.listen(8081, () => console.log("🚀 Server chạy tại http://localhost:8081"));
