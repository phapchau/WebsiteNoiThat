import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../services/axiosClient";
import { Tag, Modal, notification } from "antd";

const VND = (n) => (Number(n || 0)).toLocaleString("vi-VN") + " đ";

function stockOf(p) {
  const direct =
    p?.inStock ??
    p?.stock ??
    p?.quantity ??
    p?.qty ??
    p?.countInStock ??
    p?.inventory;

  if (Number.isFinite(direct)) return Number(direct);

  const sumFrom = (arr) =>
    Array.isArray(arr)
      ? arr.reduce((s, v) => {
          const n =
            v?.inStock ??
            v?.stock ??
            v?.quantity ??
            v?.qty ??
            v?.countInStock ??
            0;
          return s + (Number.isFinite(n) ? Number(n) : 0);
        }, 0)
      : 0;

  return (
    sumFrom(p?.variants) +
      sumFrom(p?.options?.variants) +
      sumFrom(p?.options?.sizes) ||
    0
  );
}

export default function StaffProducts() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const { data } = await axiosClient.get("/api/products");
      const list = Array.isArray(data) ? data : data?.items || [];
      setItems(list);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  // SEARCH
  const filtered = useMemo(() => {
    const key = q.trim().toLowerCase();
    if (!key) return items;
    return items.filter(
      (p) =>
        (p?.name || "").toLowerCase().includes(key) ||
        (p?.slug || "").toLowerCase().includes(key)
    );
  }, [items, q]);

  // DELETE PRODUCT
  async function onDelete(p) {
    Modal.confirm({
      title: "Xóa sản phẩm?",
      content: `Bạn có chắc chắn muốn xoá "${p.name}"?`,
      okText: "Xóa",
      okButtonProps: { danger: true },
      cancelText: "Hủy",
      onOk: async () => {
        try {
          setBusyId(p._id);
          await axiosClient.delete(`/api/products/${p._id}`);
          setItems((arr) => arr.filter((x) => x._id !== p._id));

          notification.success({
            message: "Đã xoá",
            description: "Sản phẩm đã được xoá thành công.",
          });
        } catch (e) {
          notification.error({
            message: "Lỗi",
            description: e?.response?.data?.message || "Xoá thất bại",
          });
        } finally {
          setBusyId(null);
        }
      },
    });
  }

  return (
    <section className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="text-2xl font-semibold text-white">
          Quản lý sản phẩm
        </div>

        <div className="flex items-center gap-3">
          <input
            placeholder="Tìm sản phẩm…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            className="bg-white/10 border border-white/20 text-white placeholder:text-white/60 caret-white
                       px-4 py-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40"
          />
          <Link
            to="/staff/product/new"
            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm"
          >
            + Thêm sản phẩm
          </Link>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/5 rounded-2xl p-6 lg:p-8 overflow-auto shadow-lg">
        <table className="min-w-full text-[15px] text-white">
          <thead className="text-left opacity-80">
            <tr>
              <th className="py-3 pr-4">Ảnh</th>
              <th className="py-3 pr-4">Tên</th>
              <th className="py-3 pr-4">Slug</th>
              <th className="py-3 pr-4 text-right">Giá</th>
              <th className="py-3 pr-4 text-right">Tồn</th>
              <th className="py-3 pr-0 text-right">Thao tác</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            {filtered.map((p) => {
              const stock = stockOf(p);
              return (
                <tr key={p._id} className="hover:bg-white/10">
                  <td className="py-3 pr-4">
                    {p.poster ? (
                      <img
                        src={p.poster}
                        className="w-16 h-16 rounded-lg object-cover border border-white/20"
                        onError={(e) => (e.currentTarget.style.display = "none")}
                      />
                    ) : (
                      <div className="w-16 h-16 bg-white/10 rounded-lg grid place-items-center">
                        —
                      </div>
                    )}
                  </td>

                  <td className="py-3 pr-4">
                    <span className="hover:underline">{p.name}</span>
                  </td>

                  <td className="py-3 pr-4 opacity-70">{p.slug || "—"}</td>

                  <td className="py-3 pr-4 text-right">{VND(p.price)}</td>

                  <td className="py-3 pr-4 text-right">
                    <Tag
                      color={stock > 10 ? "green" : stock > 0 ? "orange" : "red"}
                      style={{ borderRadius: 6 }}
                    >
                      {stock}
                    </Tag>
                  </td>

                  <td className="py-3 pr-0 text-right">
                    <div className="flex items-center gap-2 justify-end">

                      {/* Sửa */}
                      <Link
                        to={`/staff/product/${p._id}/edit`}
                        className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded"
                      >
                        Sửa
                      </Link>

                      {/* Xóa */}
                      <button
                        onClick={() => onDelete(p)}
                        disabled={busyId === p._id}
                        className="text-xs bg-red-500/20 hover:bg-red-500/30 px-3 py-1.5 rounded disabled:opacity-60"
                      >
                        {busyId === p._id ? "Đang xoá..." : "Xoá"}
                      </button>

                      {/* Xem ngoài website */}
                      <Link
                        to={`/products/${p.slug || p._id}`}
                        className="text-xs underline opacity-80 hover:opacity-100"
                      >
                        Xem
                      </Link>
                    </div>
                  </td>
                </tr>
              );
            })}

            {!filtered.length && (
              <tr>
                <td colSpan="6" className="py-10 text-center opacity-60">
                  {loading ? "Đang tải…" : "Không có sản phẩm"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
