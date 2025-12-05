import { useEffect, useMemo, useState } from "react";
import axiosClient from "../../services/axiosClient";
import { Link } from "react-router-dom";
import { Select, Modal, notification, Tag } from "antd";
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CarOutlined,
  CloseCircleOutlined,
  DollarCircleOutlined,
} from "@ant-design/icons";

const VND = (n) => (Number(n || 0)).toLocaleString("vi-VN") + " đ";
const STATUS = ["pending", "paid", "shipping", "completed", "cancelled"];
const STATUS_LABEL = {
  pending: "Chờ xử lý",
  paid: "Đã thanh toán",
  shipping: "Đang giao",
  completed: "Hoàn tất",
  cancelled: "Đã huỷ",
};
const PM_LIST = ["all", "COD", "VNPAY"];

/* BADGE PRO */
function StatusBadge({ s }) {
  const map = {
    pending: { color: "gold", icon: <ClockCircleOutlined /> },
    paid: { color: "green", icon: <DollarCircleOutlined /> },
    shipping: { color: "blue", icon: <CarOutlined /> },
    completed: { color: "cyan", icon: <CheckCircleOutlined /> },
    cancelled: { color: "red", icon: <CloseCircleOutlined /> },
  };

  const v = map[s] || map.pending;
  return (
    <Tag
      icon={v.icon}
      color={v.color}
      style={{
        paddingInline: 10,
        borderRadius: 8,
        textTransform: "capitalize",
      }}
    >
      {STATUS_LABEL[s]}
    </Tag>
  );
}

export default function StaffOrders() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("all");
  const [pm, setPm] = useState("all");
  const [sort, setSort] = useState("-createdAt");

  const [codeInput, setCodeInput] = useState("");
  const [codeQuery, setCodeQuery] = useState("");

  const [busyId, setBusyId] = useState("");

  // debounce tìm mã đơn
  useEffect(() => {
    const t = setTimeout(() => setCodeQuery(codeInput.trim()), 300);
    return () => clearTimeout(t);
  }, [codeInput]);

  // Load dữ liệu
  async function load() {
    try {
      setLoading(true);
      const params = { page, limit, sort };
      if (statusFilter !== "all") params.status = statusFilter;
      if (pm !== "all") params.paymentMethod = pm;
      if (codeQuery) params.code = codeQuery;

      const { data } = await axiosClient.get("/api/orders", { params });

      setRows(data.items || []);
      setTotal(data.total || 0);
    } catch (e) {
      notification.error({
        message: "Lỗi tải đơn hàng",
        description: e?.response?.data?.message || "Không tải được dữ liệu",
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(
    () => {
      load();
    },
    [page, limit, statusFilter, pm, codeQuery, sort]
  );

  const pages = useMemo(
    () => Math.max(1, Math.ceil(total / limit)),
    [total, limit]
  );

  // Update status
  async function updateStatus(id, newStatus) {
    Modal.confirm({
      title: "Xác nhận cập nhật trạng thái?",
      content: `Bạn có chắc muốn chuyển đơn hàng sang trạng thái: "${STATUS_LABEL[newStatus]}"?`,
      okText: "Xác nhận",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          setBusyId(id);
          await axiosClient.patch(`/api/orders/${id}/status`, {
            status: newStatus,
          });

          setRows((ls) =>
            ls.map((r) => (r._id === id ? { ...r, status: newStatus } : r))
          );

          notification.success({
            message: "Cập nhật thành công",
            description: `Đơn hàng đã chuyển sang trạng thái: ${STATUS_LABEL[newStatus]}`,
          });
        } catch (e) {
          notification.error({
            message: "Lỗi",
            description:
              e?.response?.data?.message || "Không cập nhật trạng thái",
          });
        } finally {
          setBusyId("");
        }
      },
    });
  }

  return (
    <section className="space-y-6 animate-fadeIn">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Đơn hàng</h1>
        <div className="text-sm opacity-60">{total} đơn</div>
      </div>

      {/* FILTERS */}
      <div className="bg-white/5 rounded-2xl p-4 grid gap-3">
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-3">
          {/* STATUS */}
          <Select
            value={statusFilter}
            onChange={(v) => {
              setPage(1);
              setStatusFilter(v);
            }}
            className="w-full"
            styles={{ popup: { root: { background: "#0f172a" } } }}
          >
            <Select.Option value="all">Tất cả trạng thái</Select.Option>
            {STATUS.map((s) => (
              <Select.Option key={s} value={s}>
                {STATUS_LABEL[s]}
              </Select.Option>
            ))}
          </Select>

          {/* PM */}
          <Select
            value={pm}
            onChange={(v) => {
              setPage(1);
              setPm(v);
            }}
            className="w-full"
            styles={{ popup: { root: { background: "#0f172a" } } }}
          >
            <Select.Option value="all">Tất cả PTTT</Select.Option>
            <Select.Option value="COD">COD</Select.Option>
            <Select.Option value="VNPAY">VNPay</Select.Option>
          </Select>

          {/* Mã đơn */}
          <input
            value={codeInput}
            onChange={(e) => setCodeInput(e.target.value)}
            placeholder="Tìm mã đơn..."
            className="bg-white/10 border border-white/20 px-3 py-2 rounded-lg outline-none placeholder:text-white/50"
          />

          {/* Sort */}
          <Select
            value={sort}
            onChange={(v) => {
              setPage(1);
              setSort(v);
            }}
            className="w-full"
            styles={{ popup: { root: { background: "#0f172a" } } }}
          >
            <Select.Option value="-createdAt">Mới → cũ</Select.Option>
            <Select.Option value="createdAt">Cũ → mới</Select.Option>
            <Select.Option value="-grandTotal">Tổng cao → thấp</Select.Option>
            <Select.Option value="grandTotal">Tổng thấp → cao</Select.Option>
          </Select>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white/5 rounded-2xl p-4 overflow-auto shadow-lg">
        <table className="min-w-full text-[15px]">
          <thead className="opacity-70">
            <tr>
              <th className="py-3">Mã đơn</th>
              <th className="py-3">Khách</th>
              <th className="py-3">Ngày</th>
              <th className="py-3">PTTT</th>
              <th className="py-3">Trạng thái</th>
              <th className="py-3 text-right">Tổng</th>
              <th className="py-3 text-right">Thao tác</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            {loading ? (
              <tr>
                <td colSpan={7} className="text-center py-10">
                  Đang tải...
                </td>
              </tr>
            ) : rows.length ? (
              rows.map((r) => {
                const created = new Date(r.createdAt).toLocaleString();
                const total = r.grandTotal ?? 0;
                return (
                  <tr key={r._id} className="hover:bg-white/10">
                    <td className="py-3">
                      <Link className="underline" to={`/orders/${r._id}`}>
                        {r.code}
                      </Link>
                    </td>

                    <td>{r.customer?.name}</td>

                    <td>{created}</td>

                    <td>{r.paymentMethod}</td>

                    <td>
                      <div className="flex items-center gap-2">
                        <StatusBadge s={r.status} />

                        <Select
                          size="small"
                          value={r.status}
                          disabled={busyId === r._id}
                          onChange={(v) => updateStatus(r._id, v)}
                          styles={{
                            popup: {
                              root: {
                                background: "#0f172a",
                              },
                            },
                          }}
                        >
                          {STATUS.map((s) => (
                            <Select.Option key={s} value={s}>
                              {STATUS_LABEL[s]}
                            </Select.Option>
                          ))}
                        </Select>
                      </div>
                    </td>

                    <td className="text-right">{VND(total)}</td>

                    <td className="text-right">
                      <Link
                        to={`/orders/${r._id}`}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs"
                      >
                        Xem
                      </Link>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={7} className="text-center py-10 opacity-60">
                  Không có đơn nào
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      <div className="flex justify-between">
        <div className="opacity-60 text-sm">
          Trang {page}/{pages}
        </div>

        <div className="flex gap-2">
          <button
            className="px-3 py-2 bg-white/10 rounded-lg disabled:opacity-30"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            ← Trước
          </button>
          <button
            className="px-3 py-2 bg-white/10 rounded-lg disabled:opacity-30"
            disabled={page >= pages}
            onClick={() => setPage((p) => p + 1)}
          >
            Sau →
          </button>
        </div>
      </div>
    </section>
  );
}
