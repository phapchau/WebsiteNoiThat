


// import { useEffect, useMemo, useState } from "react";
// import axiosClient from "../../services/axiosClient";
// import { Link } from "react-router-dom";

// const VND = (n) => (Number(n || 0)).toLocaleString("vi-VN") + " đ";

// function stockOf(p) {
//   const direct =
//     p?.inStock ?? p?.stock ?? p?.quantity ?? p?.qty ?? p?.countInStock ?? p?.inventory;
//   if (Number.isFinite(direct)) return Number(direct);
//   const sumFrom = (arr) =>
//     Array.isArray(arr)
//       ? arr.reduce((s, v) => {
//           const n = v?.inStock ?? v?.stock ?? v?.quantity ?? v?.qty ?? v?.countInStock ?? 0;
//           return s + (Number.isFinite(n) ? Number(n) : 0);
//         }, 0)
//       : 0;
//   return (sumFrom(p?.variants) + sumFrom(p?.options?.variants) + sumFrom(p?.options?.sizes)) || 0;
// }

// export default function AdminProducts() {
//   const [items, setItems] = useState([]);
//   const [q, setQ] = useState("");
//   const [loading, setLoading] = useState(true);
//   const [busyId, setBusyId] = useState(null);

//   async function load() {
//     setLoading(true);
//     try {
//       const { data } = await axiosClient.get("/api/products");
//       const list = Array.isArray(data) ? data : data?.items || [];
//       setItems(list);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => { load(); }, []);

//   const filtered = useMemo(() => {
//     const key = q.trim().toLowerCase();
//     if (!key) return items;
//     return items.filter((p) =>
//       (p?.name || "").toLowerCase().includes(key) ||
//       (p?.slug || "").toLowerCase().includes(key)
//     );
//   }, [items, q]);

//   async function onDelete(p) {
//     if (!confirm(`Xoá sản phẩm "${p.name}"?`)) return;
//     try {
//       setBusyId(p._id);
//       await axiosClient.delete(`/api/products/${p._id}`);
//       setItems((arr) => arr.filter((x) => x._id !== p._id));
//     } catch (e) {
//       alert(e?.response?.data?.message || e.message || "Xoá thất bại");
//     } finally {
//       setBusyId(null);
//     }
//   }

//   return (
//     <section className="space-y-6">
//       {/* Header: to/thoáng + search rõ chữ */}
//       <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
//         <div className="text-2xl font-semibold">Products</div>
//         <div className="flex items-center gap-3">
//           <input
//             placeholder="Tìm kiếm sản phẩm…"
//             value={q}
//             onChange={(e) => setQ(e.target.value)}
//             className="bg-white/10 border border-white/20 text-white placeholder:text-white/60 caret-white
//                        px-4 py-2 rounded-xl text-sm outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40"
//           />
//           <Link
//             to="/admin/product/new"
//             className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl text-sm"
//           >
//             + Thêm sản phẩm
//           </Link>
//         </div>
//       </div>

//       {/* Bảng: padding lớn, font lớn hơn */}
//       <div className="bg-white/5 rounded-2xl p-6 lg:p-8 overflow-auto">
//         <table className="min-w-full text-[15px]">
//           <thead className="text-left opacity-80">
//             <tr>
//               <th className="py-3 pr-4">Poster</th>
//               <th className="py-3 pr-4">Tên</th>
//               <th className="py-3 pr-4">Slug</th>
//               <th className="py-3 pr-4 text-right">Giá</th>
//               <th className="py-3 pr-4 text-right">Tồn</th>
//               <th className="py-3 pr-0 text-right">Thao tác</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-white/10">
//             {filtered.map((p) => {
//               const stock = stockOf(p);
//               return (
//                 <tr key={p._id} className="align-middle">
//                   <td className="py-3 pr-4">
//                     {p.poster ? (
//                       <img
//                         src={p.poster}
//                         alt={p.name}
//                         className="w-14 h-14 object-cover rounded-lg border border-white/10"
//                         onError={(e) => (e.currentTarget.style.visibility = "hidden")}
//                       />
//                     ) : (
//                       <div className="w-14 h-14 rounded-lg bg-white/10 grid place-items-center">—</div>
//                     )}
//                   </td>
//                   <td className="py-3 pr-4">
//                     <span className="hover:underline">{p.name}</span>
//                   </td>
//                   <td className="py-3 pr-4 opacity-70">{p.slug || "—"}</td>
//                   <td className="py-3 pr-4 text-right">{VND(p.price)}</td>
//                   <td className="py-3 pr-4 text-right">{stock}</td>
//                   <td className="py-3 pr-0 text-right">
//                     <div className="flex items-center gap-2 justify-end">
//                       <Link
//                         to={`/admin/product/${p._id}/edit`}
//                         className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded"
//                       >
//                         Sửa
//                       </Link>
//                       <button
//                         onClick={() => onDelete(p)}
//                         disabled={busyId === p._id}
//                         className="text-xs bg-red-500/20 hover:bg-red-500/30 px-3 py-1.5 rounded disabled:opacity-60"
//                       >
//                         {busyId === p._id ? "Đang xoá..." : "Xoá"}
//                       </button>
//                       <Link to={`/products/${p.slug || p._id}`} className="text-xs underline">
//                         Xem
//                       </Link>
//                     </div>
//                   </td>
//                 </tr>
//               );
//             })}
//             {!filtered.length && (
//               <tr>
//                 <td colSpan="6" className="py-10 text-center opacity-60">
//                   {loading ? "Đang tải…" : "Không có sản phẩm"}
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </section>
//   );
// }
//28/11







import { useEffect, useMemo, useState } from "react";
import axiosClient from "../../services/axiosClient";
import { Link, useNavigate } from "react-router-dom";

// AntD
import {
  Table,
  Input,
  Button,
  Tag,
  Space,
  Popconfirm,
  Image,
  message,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
} from "@ant-design/icons";

const VND = (n) => (Number(n || 0)).toLocaleString("vi-VN") + " đ";

function stockOf(p) {
  const direct =
    p?.inStock ?? p?.stock ?? p?.quantity ?? p?.qty ?? p?.countInStock ?? p?.inventory;
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
      sumFrom(p?.options?.sizes) || 0
  );
}

export default function AdminProducts() {
  const [items, setItems] = useState([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);

  const nav = useNavigate();

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

  const filtered = useMemo(() => {
    const key = q.trim().toLowerCase();
    if (!key) return items;
    return items.filter(
      (p) =>
        (p?.name || "").toLowerCase().includes(key) ||
        (p?.slug || "").toLowerCase().includes(key)
    );
  }, [items, q]);

  async function onDelete(p) {
    try {
      setBusyId(p._id);
      await axiosClient.delete(`/api/products/${p._id}`);
      message.success("Đã xoá sản phẩm");
      setItems((arr) => arr.filter((x) => x._id !== p._id));
    } catch (e) {
      message.error(e?.response?.data?.message || "Xoá thất bại");
    } finally {
      setBusyId(null);
    }
  }

  /* -------------------------------- TABLE -------------------------------- */

  const columns = [
    {
      title: "Poster",
      dataIndex: "poster",
      render: (poster, row) =>
        poster ? (
          <Image
            src={poster}
            width={60}
            height={60}
            style={{ borderRadius: 8, objectFit: "cover" }}
            preview={false}
          />
        ) : (
          <div
            style={{
              width: 60,
              height: 60,
              borderRadius: 8,
              background: "rgba(255,255,255,0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#aaa",
            }}
          >
            —
          </div>
        ),
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      render: (t) => <span className="font-medium">{t}</span>,
    },
    {
      title: "Slug",
      dataIndex: "slug",
      render: (s) => <span style={{ opacity: 0.7 }}>{s || "—"}</span>,
    },
    {
      title: "Giá",
      dataIndex: "price",
      align: "right",
      render: (v) => <b>{VND(v)}</b>,
    },
    {
      title: "Tồn kho",
      dataIndex: "_id",
      align: "right",
      render: (_, row) => stockOf(row),
    },
    {
      title: "Thao tác",
      dataIndex: "_id",
      align: "right",
      render: (_, row) => (
        <Space>
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => nav(`/admin/product/${row._id}/edit`)}
          >
            Sửa
          </Button>

          <Popconfirm
            title="Bạn có chắc muốn xóa sản phẩm này?"
            onConfirm={() => onDelete(row)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
              loading={busyId === row._id}
            >
              Xóa
            </Button>
          </Popconfirm>

          <Button
            icon={<EyeOutlined />}
            size="small"
            onClick={() => nav(`/products/${row.slug || row._id}`)}
          >
            Xem
          </Button>
        </Space>
      ),
    },
  ];

  /* -------------------------------- RENDER -------------------------------- */

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-center gap-4">
        <h1 className="text-2xl font-semibold text-white">Products</h1>

        <div className="flex items-center gap-3">
          <Input.Search
            allowClear
            placeholder="Tìm kiếm sản phẩm…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            style={{ width: 260 }}
          />

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => nav("/admin/product/new")}
          >
            Thêm sản phẩm
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white/5 rounded-2xl p-6 lg:p-8 backdrop-blur-sm">
        <Table
          rowKey="_id"
          loading={loading}
          columns={columns}
          dataSource={filtered}
          pagination={{
            pageSize: 20,
            showSizeChanger: false,
          }}
        />
      </div>
    </section>
  );
}

