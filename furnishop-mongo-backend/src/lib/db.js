// // src/config/db.js
// const mongoose = require('mongoose');

// async function connectDB(uri) {
//   mongoose.set('strictQuery', true); // OK
//   await mongoose.connect(uri);       // ❗ không truyền useNewUrlParser/useUnifiedTopology
//   console.log(`[db] Connected to MongoDB: ${uri}`);
// }

// module.exports = { connectDB };//////










// db.js
const mongoose = require("mongoose");

async function connectDB(uri) {
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri); // Mongoose >= 7 không cần options legacy
  console.log(`[db] Connected to MongoDB: ${uri}`);

  // Đóng kết nối gọn gàng khi process thoát
  process.on("SIGINT", async () => {
    await mongoose.connection.close();
    console.log("[db] Connection closed");
    process.exit(0);
  });
}

module.exports = { connectDB };
