// server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectDB } = require("./lib/db");
const path = require("path");           // ✅ thêm dòng này
const ordersRoutes = require("./routes/orders.routes");



dotenv.config();

const app = express();

const PORT = process.env.PORT || 8081;
const ORIGINS = process.env.CORS_ORIGINS
  ? process.env.CORS_ORIGINS.split(",")
  : ["http://localhost:5173"];


  
// const corsOptions = {
//   origin: ORIGINS,
//   credentials: true,
//   allowedHeaders: ["Content-Type", "Authorization"], // <-- thêm dòng này
// };
// app.use(cors(corsOptions));




app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true,
  methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"],
  allowedHeaders: ["Content-Type","Authorization"]
}));




app.use(express.json());

// Kết nối MongoDB bằng lib/db
connectDB(process.env.MONGO_URI);

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Routes
app.use("/api/auth", require("./routes/auth.routes"));


app.use("/uploads", express.static(path.join(__dirname, "uploads"), {
  setHeaders(res) {
    res.set("Cross-Origin-Resource-Policy", "cross-origin");
  }
}));
app.use("/api/users", require("./routes/users.routes"));

app.use("/api/products", require("./routes/products.routes"));
app.use("/api/uploads", require("./routes/uploads.local.routes"));
app.use("/api/orders", require("./routes/orders.routes"));
app.use("/api/categories", require("./routes/categories.routes"));

app.use("/api/addresses", require("./routes/addresses.routes"));
app.use("/api/pay/bank", require("./routes/bank.routes"));

app.use("/api/pay", require("./routes/pay.routes"));

app.use("/api/chat", require("./routes/chat.routes"));

app.use("/api/custom-requests", require("./routes/custom.routes"));
app.use("/api/products", require("./routes/products.routes"));

app.use("/api/admin/analytics", require("./routes/admin.analytics.routes"));
// app.use("/api/admin/payments", require("./routes/admin/payments.routes"));



app.listen(PORT, () => {
  console.log(`🚀 Server chạy tại http://localhost:${PORT}`);
});
