import { useEffect, useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axiosClient from "../../services/axiosClient";

const VND = (n) => (Number(n || 0)).toLocaleString("vi-VN") + " đ";

export default function AdminCustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null); // { user, stats, orders }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(`/api/users/${id}`);
        if (!alive) return;
        setData(res.data);
      } catch (e) {
        console.error("[AdminCustomerDetail]", e);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  const user = data?.user;
  const stats = data?.stats;
  const orders = data?.orders || [];

  const totalProductsBought = useMemo(() => {
    return orders.reduce(
      (sum, o) => sum + (o.items || []).reduce((s, i) => s + (i.quantity || 0), 0),
      0
    );
  }, [orders]);

  if (!loading && !user) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate(-1)}
          className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg"
        >
          ← Quay lại
        </button>
        <div className="bg-white/5 rounded-2xl p-6 text-center opacity-70">
          Không tìm thấy khách hàng.
        </div>
      </div>
    );
  }

  return (
  <section className="space-y-10 animate-fadeIn">

    {/* HEADER */}
    <div className="flex items-center justify-between flex-wrap gap-4">
      <div>
        <button
          onClick={() => navigate(-1)}
          className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition mb-2"
        >
          ← Quay lại
        </button>

        <h1 className="text-2xl font-semibold tracking-tight">
          {user?.name || "Khách hàng"}
        </h1>
        <p className="text-sm opacity-70">{user?.email}</p>
      </div>

      {/* Vai trò + trạng thái */}
      <div className="flex flex-col items-end text-xs gap-1">
        <span>
          Vai trò:{" "}
          <span className="px-2 py-1 rounded-lg bg-blue-500/20 text-blue-300">
            {user?.role}
          </span>
        </span>
        <span>
          Trạng thái:{" "}
          <span
            className={`px-2 py-1 rounded-lg ${
              user?.status === "blocked"
                ? "bg-red-500/20 text-red-300"
                : "bg-emerald-500/20 text-emerald-300"
            }`}
          >
            {user?.status || "active"}
          </span>
        </span>
      </div>
    </div>

    {/* 3 BLOCK LỚN */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

      {/* BLOCK 1 — THÔNG TIN KHÁCH */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 space-y-3 shadow-lg">
        <div className="text-lg font-semibold mb-2">Thông tin khách hàng</div>

        <div className="space-y-2 text-sm">
          <div><span className="opacity-70">Tên: </span>{user?.name || "—"}</div>
          <div><span className="opacity-70">Email: </span>{user?.email}</div>
          <div><span className="opacity-70">SĐT: </span>{user?.phone || "—"}</div>
          <div><span className="opacity-70">Địa chỉ: </span>{user?.address || "—"}</div>
          <div>
            <span className="opacity-70">Ngày tạo: </span>
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleString("vi-VN")
              : "—"}
          </div>
        </div>
      </div>

      {/* BLOCK 2 — KPI MUA HÀNG */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 space-y-3 shadow-lg">
        <div className="text-lg font-semibold mb-2">Thống kê mua hàng</div>

        <div className="space-y-2 text-sm">
          <div>
            <span className="opacity-70">Tổng đơn: </span>
            <span className="font-semibold">
              {stats?.totalOrders ?? orders.length}
            </span>
          </div>

          <div>
            <span className="opacity-70">Tổng chi tiêu: </span>
            <span className="font-semibold text-emerald-300">
              {VND(stats?.totalSpent ?? 0)}
            </span>
          </div>

          <div>
            <span className="opacity-70">Giá trị trung bình / đơn: </span>
            {VND(stats?.avgOrderValue ?? 0)}
          </div>

          <div>
            <span className="opacity-70">Đơn bị hủy: </span>
            {stats?.cancelledOrders ?? 0}
          </div>

          <div>
            <span className="opacity-70">Tổng SP đã mua: </span>
            {totalProductsBought}
          </div>

          <div>
            <span className="opacity-70">Đơn gần nhất: </span>
            {stats?.lastOrderCode ? (
              <span>
                {stats.lastOrderCode} —{" "}
                {new Date(stats.lastOrderAt).toLocaleString("vi-VN")}
              </span>
            ) : (
              "Chưa có đơn"
            )}
          </div>
        </div>
      </div>

      {/* BLOCK 3 — PHÂN LOẠI KHÁCH */}
      <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-lg text-sm">
        <div className="text-lg font-semibold mb-2">Nhóm khách hàng</div>

        {(() => {
          const spent = stats?.totalSpent ?? 0;
          const ordersCount = stats?.totalOrders ?? 0;

          let label = "Khách mới";
          let color = "bg-white/10";

          if (spent >= 50000000) {
            label = "VIP Platinum";
            color = "bg-purple-500/20 text-purple-300";
          } else if (spent >= 20000000) {
            label = "VIP Gold";
            color = "bg-yellow-500/20 text-yellow-300";
          } else if (ordersCount >= 5) {
            label = "Khách trung thành";
            color = "bg-emerald-500/20 text-emerald-300";
          } else if (ordersCount >= 2) {
            label = "Khách tiềm năng";
            color = "bg-blue-500/20 text-blue-300";
          }

          return (
            <>
              <div>
                Nhóm hiện tại:{" "}
                <span className={`px-2 py-1 rounded-lg ${color}`}>{label}</span>
              </div>
              <p className="opacity-70 text-xs mt-2 leading-relaxed">
                Bạn có thể dùng nhóm khách để gửi ưu đãi, voucher hoặc chiến
                dịch marketing phù hợp.
              </p>
            </>
          );
        })()}
      </div>
    </div>

    {/* ĐƠN HÀNG */}
    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="text-lg font-semibold">Lịch sử đơn hàng</div>
        <Link
          to="/admin/orders"
          className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition"
        >
          Xem tất cả đơn
        </Link>
      </div>

      <div className="overflow-auto rounded-xl">
        <table className="min-w-full text-[15px]">
          <thead className="text-left opacity-80 border-b border-white/10">
            <tr>
              <th className="py-2 px-3">Mã đơn</th>
              <th className="py-2 px-3">Ngày</th>
              <th className="py-2 px-3">Trạng thái</th>
              <th className="py-2 px-3">Phương thức</th>
              <th className="py-2 px-3 text-right">Tổng tiền</th>
              <th className="py-2 px-3 text-right"></th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            {orders.map((o) => (
              <tr key={o._id} className="hover:bg-white/10 transition">
                <td className="py-2 px-3">{o.code}</td>
                <td className="py-2 px-3">
                  {new Date(o.createdAt).toLocaleString("vi-VN")}
                </td>
                <td className="py-2 px-3">
                  <span className="px-2 py-1 rounded-lg bg-white/10 text-xs">
                    {o.status}
                  </span>
                </td>
                <td className="py-2 px-3">{o.paymentMethod}</td>
                <td className="py-2 px-3 text-right">
                  {VND(o.grandTotal ?? o.amount)}
                </td>
                <td className="py-2 px-3 text-right">
                  <Link
                    to={`/admin/orders?code=${o.code}`}
                    className="text-xs underline hover:opacity-70"
                  >
                    Xem
                  </Link>
                </td>
              </tr>
            ))}

            {!orders.length && (
              <tr>
                <td colSpan={6} className="py-10 text-center opacity-60">
                  Khách hàng chưa có đơn hàng.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  </section>
);

}
