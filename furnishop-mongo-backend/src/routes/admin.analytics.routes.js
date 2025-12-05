const router = require("express").Router();
const requireAuth = require("../middlewares/requireAuth");
const requireRole = require("../middlewares/requireRole");
const Order = require("../models/Order");
const User = require("../models/User");

// GET /api/admin/analytics
router.get("/", requireAuth, requireRole(["admin", "staff"]), async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenueAgg = await Order.aggregate([
      { $match: { status: { $in: ["paid", "completed"] } } },
      { $group: { _id: null, sum: { $sum: "$grandTotal" } } }
    ]);

    const totalRevenue = totalRevenueAgg[0]?.sum || 0;

    const newUsers = await User.countDocuments({
      createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    // doanh thu theo tháng
    const revenueByMonth = await Order.aggregate([
      {
        $match: {
          status: { $in: ["paid", "completed"] }
        }
      },
      {
        $group: {
          _id: { $month: "$createdAt" },
          value: { $sum: "$grandTotal" }
        }
      },
      { $sort: { "_id": 1 } }
    ]);

    // phân loại đơn hàng
    const orderStatus = await Order.aggregate([
      {
        $group: {
          _id: "$status",
          value: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalOrders,
      totalRevenue,
      newUsers,
      revenueByMonth,
      orderStatus
    });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});



module.exports = router;
