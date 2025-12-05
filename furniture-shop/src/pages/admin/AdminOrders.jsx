// import { useEffect, useMemo, useState } from "react";
// import axiosClient from "../../services/axiosClient";
// import { Link } from "react-router-dom";

// const VND = (n) => (Number(n || 0)).toLocaleString("vi-VN") + " đ";
// const STATUS = ["all","pending","paid","shipping","completed","cancelled"];
// const PM_LIST = ["all","COD","VNPAY"];

// function Badge({ s }) {
//   const tone =
//     s === "pending"   ? "bg-yellow-500/15 text-yellow-300" :
//     s === "paid"      ? "bg-green-500/15 text-green-300"  :
//     s === "shipping"  ? "bg-blue-500/15 text-blue-300"    :
//     s === "completed" ? "bg-emerald-500/15 text-emerald-300" :
//     s === "cancelled" ? "bg-red-500/15 text-red-300"      :
//                         "bg-white/10 text-white/80";
//   return <span className={`px-2 py-1 rounded-md text-xs ${tone}`}>{s}</span>;
// }

// export default function AdminOrders() {
//   const [rows, setRows] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [page, setPage]   = useState(1);
//   const [limit, setLimit] = useState(20);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");
//   const [busyId, setBusyId] = useState("");

//   // filters
//   const [statusFilter, setStatusFilter] = useState("all");
//   const [codeInput, setCodeInput] = useState("");       // input gõ tay
//   const [codeQuery, setCodeQuery] = useState("");       // giá trị đã debounce
//   const [pm, setPm] = useState("all");
//   const [from, setFrom] = useState("");  // YYYY-MM-DD
//   const [to, setTo] = useState("");      // YYYY-MM-DD
//   const [minTotal, setMinTotal] = useState("");
//   const [maxTotal, setMaxTotal] = useState("");
//   const [sort, setSort] = useState("-createdAt");

//   // debounce mã đơn (300ms)
//   useEffect(() => {
//     const t = setTimeout(() => setCodeQuery(codeInput.trim()), 300);
//     return () => clearTimeout(t);
//   }, [codeInput]);

//   async function load() {
//     try {
//       setLoading(true); setErr("");
//       const params = { page, limit, sort };
//       if (statusFilter && statusFilter !== "all") params.status = statusFilter;
//       if (pm && pm !== "all") params.paymentMethod = pm;
//       if (codeQuery) params.code = codeQuery;
//       if (from) params.from = from; // YYYY-MM-DD
//       if (to)   params.to   = to;   // YYYY-MM-DD
//       if (minTotal) params.minTotal = Number(minTotal) || 0;
//       if (maxTotal) params.maxTotal = Number(maxTotal) || 0;

//       const { data } = await axiosClient.get("/api/orders", { params });
//       setRows(Array.isArray(data?.items) ? data.items : []);
//       setTotal(Number(data?.total || 0));
//     } catch (e) {
//       setErr(e?.response?.data?.message || "Không tải được đơn hàng");
//     } finally {
//       setLoading(false);
//     }
//   }

//   // mỗi khi bộ lọc / phân trang đổi → load lại
//   useEffect(() => { load(); /* eslint-disable-next-line */}, [page, limit, statusFilter, pm, codeQuery, from, to, minTotal, maxTotal, sort]);

//   // đổi trạng thái
//   async function updateStatus(id, status) {
//     if (!id) return;
//     try {
//       setBusyId(id);
//       await axiosClient.patch(`/api/orders/${id}/status`, { status });
//       setRows((ls)=>ls.map(r=> r._id === id ? { ...r, status } : r));
//     } catch (e) {
//       alert(e?.response?.data?.message || "Cập nhật trạng thái thất bại");
//     } finally {
//       setBusyId("");
//     }
//   }

//   const pages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

//   function resetFilters() {
//     setStatusFilter("all");
//     setCodeInput("");
//     setCodeQuery("");
//     setPm("all");
//     setFrom("");
//     setTo("");
//     setMinTotal("");
//     setMaxTotal("");
//     setSort("-createdAt");
//     setPage(1);
//   }

//   return (
//     <section className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-xl lg:text-2xl font-semibold">Orders</h1>
//         <div className="text-sm opacity-70">{total} đơn</div>
//       </div>

//       {/* Filters */}
//       <div className="bg-white/5 rounded-2xl p-4 flex flex-col gap-3">
//         <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-3">
//           <select
//             value={statusFilter}
//             onChange={(e)=>{ setPage(1); setStatusFilter(e.target.value); }}
//             className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm outline-none"
//           >
//             {STATUS.map(s => (
//               <option key={s} value={s} className="bg-[#0f172a]">
//                 {s === "all" ? "Tất cả trạng thái" : s}
//               </option>
//             ))}
//           </select>

//           <select
//             value={pm}
//             onChange={(e)=>{ setPage(1); setPm(e.target.value); }}
//             className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm outline-none"
//           >
//             {PM_LIST.map(p => (
//               <option key={p} value={p} className="bg-[#0f172a]">
//                 {p === "all" ? "Tất cả PTTT" : p}
//               </option>
//             ))}
//           </select>

//           <input
//             value={codeInput}
//             onChange={(e)=>{ setPage(1); setCodeInput(e.target.value); }}
//             placeholder="Mã đơn (ORD-...) hoặc _id"
//             className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm outline-none placeholder:text-white/60"
//           />

//           <input
//             type="date"
//             value={from}
//             onChange={(e)=>{ setPage(1); setFrom(e.target.value); }}
//             className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm outline-none"
//             placeholder="Từ ngày"
//           />

//           <input
//             type="date"
//             value={to}
//             onChange={(e)=>{ setPage(1); setTo(e.target.value); }}
//             className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm outline-none"
//             placeholder="Đến ngày"
//           />

//           <select
//             value={sort}
//             onChange={(e)=>{ setPage(1); setSort(e.target.value); }}
//             className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm outline-none"
//           >
//             <option value="-createdAt" className="bg-[#0f172a]">Mới → cũ</option>
//             <option value="createdAt" className="bg-[#0f172a]">Cũ → mới</option>
//             <option value="-grandTotal" className="bg-[#0f172a]">Tổng tiền: cao → thấp</option>
//             <option value="grandTotal" className="bg-[#0f172a]">Tổng tiền: thấp → cao</option>
//           </select>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-6 gap-3">
//           <input
//             type="number"
//             inputMode="numeric"
//             min={0}
//             value={minTotal}
//             onChange={(e)=>{ setPage(1); setMinTotal(e.target.value); }}
//             placeholder="Tổng tiền từ (đ)"
//             className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm outline-none"
//           />
//           <input
//             type="number"
//             inputMode="numeric"
//             min={0}
//             value={maxTotal}
//             onChange={(e)=>{ setPage(1); setMaxTotal(e.target.value); }}
//             placeholder="Tổng tiền đến (đ)"
//             className="bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-sm outline-none"
//           />

//           <div className="flex items-center gap-2 md:col-span-1 xl:col-span-2">
//             <select
//               value={limit}
//               onChange={(e)=>{ setPage(1); setLimit(Number(e.target.value)); }}
//               className="bg-white/10 border border-white/20 rounded-lg px-2 py-2 text-sm"
//             >
//               {[10,20,50,100].map(n=><option key={n} value={n} className="bg-[#0f172a]">{n}/trang</option>)}
//             </select>
//             <button
//               onClick={resetFilters}
//               className="px-3 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-sm"
//             >
//               Xoá lọc
//             </button>
//           </div>
//         </div>
//       </div>

//       {err && <div className="bg-red-500/10 text-red-300 px-4 py-2 rounded-lg text-sm">{err}</div>}

//       <div className="bg-white/5 rounded-2xl p-4 overflow-auto">
//         <table className="min-w-full text-[15px]">
//           <thead className="text-left opacity-80">
//             <tr>
//               <th className="py-3 pr-4">Mã đơn</th>
//               <th className="py-3 pr-4">Khách</th>
//               <th className="py-3 pr-4">Ngày</th>
//               <th className="py-3 pr-4">PTTT</th>
//               <th className="py-3 pr-4">Trạng thái</th>
//               <th className="py-3 pr-4 text-right">Tổng</th>
//               <th className="py-3 pr-4 text-right">Thao tác</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-white/10">
//             {loading ? (
//               <tr><td colSpan={7} className="py-10 text-center opacity-60">Đang tải…</td></tr>
//             ) : rows.length ? rows.map((r) => {
//               const created = r.createdAt ? new Date(r.createdAt).toLocaleString() : "—";
//               const total = r.grandTotal ?? r.amount ?? 0;
//               return (
//                 <tr key={r._id} className="align-middle">
//                   <td className="py-3 pr-4 font-medium">
//                     <Link to={`/orders/${r._id}`} className="underline">{r.code || r._id?.slice(-8)}</Link>
//                   </td>
//                   <td className="py-3 pr-4">
//                     <div className="leading-tight">
//                       <div>{r.customer?.name || "—"}</div>
//                       <div className="text-xs opacity-70">{r.customer?.phone || ""}</div>
//                     </div>
//                   </td>
//                   <td className="py-3 pr-4">{created}</td>
//                   <td className="py-3 pr-4">{r.paymentMethod || "—"}</td>
//                   <td className="py-3 pr-4">
//                     <div className="flex items-center gap-2">
//                       <Badge s={r.status || "pending"} />
//                       <select
//                         disabled={busyId === r._id}
//                         value={r.status || "pending"}
//                         onChange={(e) => updateStatus(r._id, e.target.value)}
//                         className="bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-sm outline-none"
//                       >
//                         {STATUS.filter(s=>s!=="all").map(s => (
//                           <option key={s} value={s} className="bg-[#0f172a]">{s}</option>
//                         ))}
//                       </select>
//                     </div>
//                   </td>
//                   <td className="py-3 pr-4 text-right">{VND(total)}</td>
//                   <td className="py-3 pr-0 text-right">
//                     <Link to={`/orders/${r._id}`} className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg">
//                       Xem
//                     </Link>
//                   </td>
//                 </tr>
//               );
//             }) : (
//               <tr><td colSpan={7} className="py-10 text-center opacity-60">Không tìm thấy đơn phù hợp</td></tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* phân trang */}
//       <div className="flex items-center justify-between">
//         <div className="text-sm opacity-70">
//           Trang {page}/{Math.max(1, Math.ceil(total / limit))}
//         </div>
//         <div className="flex items-center gap-2">
//           <button
//             onClick={()=>setPage(p=>Math.max(1, p-1))}
//             disabled={page<=1}
//             className="px-3 py-1.5 rounded-lg bg-white/10 disabled:opacity-50"
//           >
//             ← Trước
//           </button>
//           <button
//             onClick={()=>setPage(p=>p+1)}
//             disabled={page >= Math.max(1, Math.ceil(total / limit))}
//             className="px-3 py-1.5 rounded-lg bg-white/10 disabled:opacity-50"
//           >
//             Sau →
//           </button>
//         </div>
//       </div>
//     </section>
//   );
// }
//28/11








import { useEffect, useMemo, useState } from "react";
import axiosClient from "../../services/axiosClient";
import { Link } from "react-router-dom";

// Ant Design
import {
  Table,
  Tag,
  Select,
  Input,
  Button,
  DatePicker,
  Space,
  message,
} from "antd";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;
const { Option } = Select;

const VND = (n) => (Number(n || 0)).toLocaleString("vi-VN") + " đ";

const STATUS = ["pending", "paid", "shipping", "completed", "cancelled"];
const PM_LIST = ["COD", "VNPAY"];

function StatusTag(status) {
  const colors = {
    pending: "gold",
    paid: "green",
    shipping: "blue",
    completed: "cyan",
    cancelled: "red",
  };
  return <Tag color={colors[status] || "default"}>{status}</Tag>;
}

export default function StaffOrders() {
  const [rows, setRows] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [loading, setLoading] = useState(true);

  const [statusFilter, setStatusFilter] = useState("");
  const [pm, setPm] = useState("");
  const [code, setCode] = useState("");
  const [dateRange, setDateRange] = useState(null);
  const [sort, setSort] = useState("-createdAt");

  const [busyId, setBusyId] = useState("");

  async function load() {
    try {
      setLoading(true);
      const params = { page, limit, sort };
      if (statusFilter) params.status = statusFilter;
      if (pm) params.paymentMethod = pm;
      if (code.trim()) params.code = code.trim();
      if (dateRange) {
        params.from = dateRange[0].format("YYYY-MM-DD");
        params.to = dateRange[1].format("YYYY-MM-DD");
      }

      const { data } = await axiosClient.get("/api/orders", { params });
      setRows(data.items || []);
      setTotal(data.total || 0);
    } catch (e) {
      message.error("Không tải được dữ liệu");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [page, limit, statusFilter, pm, code, dateRange, sort]);

  async function updateStatus(id, status) {
    try {
      setBusyId(id);
      await axiosClient.patch(`/api/orders/${id}/status`, { status });
      setRows((r) => r.map((o) => (o._id === id ? { ...o, status } : o)));
      message.success("Cập nhật trạng thái thành công!");
    } catch {
      message.error("Cập nhật thất bại");
    } finally {
      setBusyId("");
    }
  }

  const columns = [
    {
      title: "Mã đơn",
      dataIndex: "code",
      render: (_, r) => (
        <Link to={`/orders/${r._id}`} style={{ textDecoration: "underline" }}>
          {r.code || r._id.slice(-8)}
        </Link>
      ),
    },
    {
      title: "Khách",
      dataIndex: "customer",
      render: (c) => (
        <>
          <b>{c?.name}</b>
          <br />
          <span style={{ opacity: 0.7, fontSize: 12 }}>{c?.phone}</span>
        </>
      ),
    },
    {
      title: "Ngày",
      render: (r) =>
        r.createdAt ? dayjs(r.createdAt).format("DD/MM/YYYY HH:mm") : "—",
    },
    {
      title: "PTTT",
      dataIndex: "paymentMethod",
    },
    {
      title: "Trạng thái",
      render: (r) => (
        <Space>
          {StatusTag(r.status)}
          <Select
            size="small"
            value={r.status}
            disabled={busyId === r._id}
            onChange={(v) => updateStatus(r._id, v)}
            style={{ width: 120 }}
          >
            {STATUS.map((s) => (
              <Option key={s} value={s}>
                {s}
              </Option>
            ))}
          </Select>
        </Space>
      ),
    },
    {
      title: "Tổng",
      render: (r) => <b>{VND(r.grandTotal)}</b>,
      align: "right",
    },
    {
      title: "Chi tiết",
      render: (r) => (
        <Link
          to={`/orders/${r._id}`}
          className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded"
        >
          Xem
        </Link>
      ),
      align: "right",
    },
  ];

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-white">Quản lý đơn hàng</h1>
        <div className="text-white/70">{total} đơn</div>
      </div>

      {/* FILTERS */}
      <div className="bg-white/5 p-4 rounded-2xl space-y-3">
        <Space wrap size="middle">
          <Select
            placeholder="Trạng thái"
            allowClear
            value={statusFilter || undefined}
            onChange={(v) => {
              setPage(1);
              setStatusFilter(v || "");
            }}
            style={{ width: 150 }}
          >
            {STATUS.map((s) => (
              <Option key={s} value={s}>
                {s}
              </Option>
            ))}
          </Select>

          <Select
            placeholder="PT thanh toán"
            allowClear
            value={pm || undefined}
            onChange={(v) => {
              setPage(1);
              setPm(v || "");
            }}
            style={{ width: 150 }}
          >
            {PM_LIST.map((p) => (
              <Option key={p} value={p}>
                {p}
              </Option>
            ))}
          </Select>

          <Input
            placeholder="Mã đơn"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            style={{ width: 160 }}
          />

          <RangePicker
            onChange={(v) => setDateRange(v)}
            placeholder={["Từ ngày", "Đến ngày"]}
          />

          <Select
            value={sort}
            onChange={(v) => setSort(v)}
            style={{ width: 180 }}
          >
            <Option value="-createdAt">Mới → cũ</Option>
            <Option value="createdAt">Cũ → mới</Option>
            <Option value="-grandTotal">Tổng cao → thấp</Option>
            <Option value="grandTotal">Tổng thấp → cao</Option>
          </Select>

          <Button onClick={() => window.location.reload()}>Xóa lọc</Button>
        </Space>
      </div>

      {/* TABLE */}
      <Table
        columns={columns}
        dataSource={rows}
        rowKey="_id"
        pagination={{
          current: page,
          pageSize: limit,
          total,
          onChange: (p) => setPage(p),
        }}
        loading={loading}
        className="bg-white/5 rounded-2xl p-4"
      />
    </section>
  );
}

