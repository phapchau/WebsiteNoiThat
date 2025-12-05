import { useEffect, useState } from "react";
import { vnd } from "../utils/format";

const API = import.meta.env.VITE_API_URL || "http://localhost:8081/api";
const STATUSES = ["pending","paid","shipping","completed","cancelled"];

export default function AdminOrders() {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const limit = 20;

  async function load() {
    try {
      setLoading(true); setErr("");
      const token = localStorage.getItem("token") || "";
      const res = await fetch(`${API}/orders?page=${page}&limit=${limit}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Không lấy được đơn");
      setItems(data.items || []); setTotal(data.total || 0);
    } catch (e) { setErr(e.message || "Lỗi"); }
    finally { setLoading(false); }
  }

  useEffect(()=>{ load(); /* eslint-disable-next-line */ }, [page]);

  async function updateStatus(id, status) {
    try {
      const token = localStorage.getItem("token") || "";
      const res = await fetch(`${API}/orders/${id}/status`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Cập nhật thất bại");
      // cập nhật tại chỗ
      setItems(prev => prev.map(o => o._id === id ? data : o));
    } catch (e) {
      alert(e.message);
    }
  }

  const pages = Math.max(1, Math.ceil(total / limit));

  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Quản trị • Đơn hàng</h1>

      {loading ? <div>Đang tải…</div> :
       err ? <div className="text-red-600">⚠ {err}</div> :
      (
        <div className="space-y-4">
          {items.map(o => (
            <div key={o._id} className="border rounded-2xl bg-white p-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="font-medium">#{o.code || o._id}</div>
                  <div className="text-sm text-gray-600">{new Date(o.createdAt).toLocaleString()}</div>
                  <div className="text-sm text-gray-600">KH: {o.customer?.name} • {o.customer?.phone}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{vnd(o.grandTotal ?? (o.amount + (o.shippingFee||0) - (o.discount||0)))}</div>
                  <select
                    value={o.status}
                    onChange={(e) => updateStatus(o._id, e.target.value)}
                    className="mt-2 border rounded px-2 py-1"
                  >
                    {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
          ))}

          <div className="flex gap-2">
            {Array.from({ length: pages }, (_, i) => i+1).map(n => (
              <button key={n}
                onClick={()=>setPage(n)}
                className={`px-3 py-1 rounded ${n===page ? "bg-black text-white" : "bg-gray-200"}`}>
                {n}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
