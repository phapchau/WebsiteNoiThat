



// src/pages/admin/AdminDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import axiosClient from "../../services/axiosClient";
import { Link } from "react-router-dom";

const VND = (n) => (Number(n || 0)).toLocaleString("vi-VN") + " đ";

function Kpi({ icon, label, value, sub }) {
  return (
    <div className="bg-white/5 rounded-2xl p-6 lg:p-8">
      <div className="flex items-center justify-between">
        <div className="text-3xl">{icon}</div>
        <div className="text-xs opacity-70">{label}</div>
      </div>
      <div className="text-3xl lg:text-4xl font-semibold mt-2">{value ?? "—"}</div>
      {sub && <div className="text-xs opacity-70 mt-1">{sub}</div>}
    </div>
  );
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [productsCount, setProductsCount] = useState(0);
  const [categoriesCount, setCategoriesCount] = useState(0);
  const [customersCount, setCustomersCount] = useState(undefined); // undefined ⇒ ẩn KPI nếu thiếu API
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);

        // Orders (admin) – lấy nhiều nhất có thể để tính KPI
        const oRes = await axiosClient
          .get("/api/orders?limit=200&sort=-createdAt")
          .catch(() => ({ data: [] }));

        // Products – cố lấy total, nếu không có thì lấy items
        const pRes = await axiosClient
          .get("/api/products?limit=200&sort=-createdAt")
          .catch(() => ({ data: { items: [], total: 0 } }));

        // Categories – để có tên hiển thị khi nhóm theo category slug
        const cRes = await axiosClient
          .get("/api/categories?active=true&limit=500&sort=order name")
          .catch(() => ({ data: { items: [], total: 0 } }));

        // Users count (tuỳ chọn). Nếu BE chưa có, KPI Customers sẽ ẩn hoặc hiển thị "—".
        let uCount;
        try {
          const u = await axiosClient.get("/api/users/count");
          uCount = u?.data?.total ?? u?.data?.count ?? u?.data?.length ?? 0;
        } catch {
          uCount = undefined; // để mình ẩn KPI thay vì log lỗi
        }

        if (!alive) return;

        const oData = Array.isArray(oRes.data) ? oRes.data : oRes.data?.items || [];
        const pItems = Array.isArray(pRes.data) ? pRes.data : pRes.data?.items || [];
        const pTotal = Array.isArray(pRes.data) ? pRes.data.length : (pRes.data?.total ?? pItems.length);
        const cItems = cRes.data?.items || [];
        const cTotal = cRes.data?.total ?? cItems.length;

        setOrders(oData);
        setProducts(pItems);
        setProductsCount(pTotal);
        setCategories(cItems);
        setCategoriesCount(cTotal);
        setCustomersCount(uCount);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Tính KPI doanh thu/đơn hàng
  const { totalRevenue, monthRevenue, totalOrders, failedOrders, statusCounts } = useMemo(() => {
    const now = new Date();
    const m = now.getMonth(), y = now.getFullYear();
    let total = 0, monthTotal = 0, failed = 0;
    const stMap = {};
    for (const od of orders) {
      const amount = Number(od.total ?? od.amount ?? 0);
      total += amount;
      const d = od.createdAt ? new Date(od.createdAt) : null;
      if (d && d.getMonth() === m && d.getFullYear() === y) monthTotal += amount;
      const st = od.status || "pending";
      stMap[st] = (stMap[st] || 0) + 1;
      if (st === "failed" || st === "cancelled") failed++;
    }
    return { totalRevenue: total, monthRevenue: monthTotal, totalOrders: orders.length, failedOrders: failed, statusCounts: stMap };
  }, [orders]);

  // Gom sản phẩm theo category slug để làm "Top Categories"
  const topCategories = useMemo(() => {
    const nameBySlug = new Map(categories.map(c => [c.slug, c.name]));
    const countBySlug = new Map();
    for (const p of products) {
      const slug = p?.category || "";
      countBySlug.set(slug, (countBySlug.get(slug) || 0) + 1);
    }
    const rows = Array.from(countBySlug.entries())
      .map(([slug, count]) => ({
        slug,
        name: nameBySlug.get(slug) || (slug || "Chưa phân loại"),
        count
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
    return rows;
  }, [products, categories]);

  const recentOrders = useMemo(
    () => [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10),
    [orders]
  );

  return (
    <section className="space-y-8">
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-6">
        <Kpi icon="💰" label="Tổng doanh thu" value={VND(totalRevenue)} />
        <Kpi icon="📅" label="Doanh thu tháng này" value={VND(monthRevenue)} />
        <Kpi icon="🧾" label="Tổng giao dịch" value={totalOrders} />
        <Kpi icon="🗂️" label="Categories" value={categoriesCount} />
        {/* Chỉ hiển thị nếu lấy được users count */}
        {customersCount !== undefined && <Kpi icon="👤" label="Customers" value={customersCount} />}
      </div>

      {/* Bộ lọc (placeholder) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <input
          className="bg-white/10 border border-white/20 text-white placeholder:text-white/60 caret-white
                     rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40"
          placeholder="Tìm kiếm..."
        />
        <select
          className="bg-white/10 border border-white/20 text-white placeholder:text-white/60
                     rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40"
          defaultValue=""
        >
          <option value="" className="bg-[#0f172a]">Tất cả phương thức</option>
          <option className="bg-[#0f172a]">COD</option>
          <option className="bg-[#0f172a]">SePay</option>
        </select>
        <select
          className="bg-white/10 border border-white/20 text-white placeholder:text-white/60
                     rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40"
          defaultValue=""
        >
          <option value="" className="bg-[#0f172a]">Tất cả trạng thái</option>
          <option className="bg-[#0f172a]">pending</option>
          <option className="bg-[#0f172a]">processing</option>
          <option className="bg-[#0f172a]">completed</option>
          <option className="bg-[#0f172a]">cancelled</option>
        </select>
        <input
          type="date"
          className="bg-white/10 border border-white/20 text-white placeholder:text-white/60 caret-white
                     rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40"
          placeholder="Từ ngày"
        />
        <input
          type="date"
          className="bg-white/10 border border-white/20 text-white placeholder:text-white/60 caret-white
                     rounded-xl px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40"
          placeholder="Đến ngày"
        />
      </div>

      {/* Quick stats */}
      <div className="bg-white/5 rounded-2xl p-6 lg:p-8">
        <div className="text-sm opacity-80 mb-4">Quick Stats</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[15px]">
          <div className="bg-white/5 p-4 rounded-xl">Products: <span className="font-semibold">{productsCount}</span></div>
          <div className="bg-white/5 p-4 rounded-xl">Orders: <span className="font-semibold">{totalOrders}</span></div>
          {customersCount !== undefined && (
            <div className="bg-white/5 p-4 rounded-xl">Customers: <span className="font-semibold">{customersCount}</span></div>
          )}
          <div className="bg-white/5 p-4 rounded-xl">
            Statuses:{" "}
            <span className="opacity-90">
              {Object.entries(statusCounts).map(([k, v]) => `${k}: ${v}`).join(" • ") || "—"}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white/5 rounded-2xl p-6 lg:p-8">
        <div className="flex items-center justify-between mb-4">
          <div className="text-lg font-semibold">Recent Orders</div>
          <Link to="/admin/orders" className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg">View All</Link>
        </div>

        <div className="overflow-auto">
          <table className="min-w-full text-[15px]">
            <thead className="text-left opacity-80">
              <tr>
                <th className="py-3 pr-4">Order</th>
                <th className="py-3 pr-4">Khách hàng</th>
                <th className="py-3 pr-4">Ngày</th>
                <th className="py-3 pr-4">Phương thức</th>
                <th className="py-3 pr-4">Trạng thái</th>
                <th className="py-3 pr-4 text-right">Tổng tiền</th>
                <th className="py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {recentOrders.map((o) => (
                <tr key={o._id} className="align-middle">
                  <td className="py-3 pr-4">{o.code || o._id?.slice(-8)}</td>
                  <td className="py-3 pr-4">{o.name || o.customer?.name || "Guest"}</td>
                  <td className="py-3 pr-4">{o.createdAt ? new Date(o.createdAt).toLocaleString() : "—"}</td>
                  <td className="py-3 pr-4">{o.paymentMethod || o.payment?.method || "—"}</td>
                  <td className="py-3 pr-4">
                    <span className="px-2 py-1 rounded-lg bg-white/10 text-xs">{o.status || "pending"}</span>
                  </td>
                  <td className="py-3 pr-4 text-right">{VND(o.total ?? o.amount)}</td>
                  <td className="py-3 pr-4">
                    <Link to={`/orders/${o._id}`} className="text-xs underline">Xem</Link>
                  </td>
                </tr>
              ))}
              {!recentOrders.length && (
                <tr>
                  <td colSpan="7" className="py-10 text-center opacity-60">
                    {loading ? "Đang tải…" : "Chưa có đơn hàng"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Categories & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 rounded-2xl p-6">
          <div className="text-lg font-semibold mb-3">Top Categories</div>
          <div className="overflow-auto">
            <table className="min-w-full text-[15px]">
              <thead className="text-left opacity-80">
                <tr>
                  <th className="py-2 pr-4">Danh mục</th>
                  <th className="py-2 pr-4">Slug</th>
                  <th className="py-2 pr-0 text-right">Số SP</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {topCategories.map((c) => (
                  <tr key={c.slug || "none"}>
                    <td className="py-2 pr-4">{c.name}</td>
                    <td className="py-2 pr-4 opacity-70">{c.slug || "—"}</td>
                    <td className="py-2 pr-0 text-right">{c.count}</td>
                  </tr>
                ))}
                {!topCategories.length && (
                  <tr><td colSpan="3" className="py-8 text-center opacity-60">Không có dữ liệu</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-white/5 rounded-2xl p-6 h-80 grid place-items-center text-sm opacity-70">
          Charts placeholder
        </div>
      </div>
    </section>
  );
}

