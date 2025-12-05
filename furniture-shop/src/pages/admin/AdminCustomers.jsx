




// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import axiosClient from "../../services/axiosClient";

// const VND = (n) => (Number(n || 0)).toLocaleString("vi-VN") + " đ";

// export default function AdminCustomers() {
//   const [customers, setCustomers] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [page, setPage] = useState(1);
//   const [pages, setPages] = useState(1);
//   const [q, setQ] = useState("");
//   const [loading, setLoading] = useState(false);

//   const limit = 20;

//   async function load() {
//     try {
//       setLoading(true);
//       const res = await axiosClient.get("/api/users", {
//         params: { q, page, limit, sort: "-createdAt" },
//       });
//       const data = res.data || {};

//       setCustomers(data.items || []);
//       setTotal(data.total || 0);
//       setPages(data.pages || 1);
//     } catch (e) {
//       console.error("[AdminCustomers]", e);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     load();
//   }, [q, page]);

//   /* ------------------------ HÀM API ACTIONS ------------------------ */

//   const changeRole = async (id, role) => {
//     if (!confirm(`Xác nhận đổi vai trò thành: ${role}?`)) return;

//     await axiosClient.patch(`/api/users/${id}/role`, { role });
//     load();
//   };

//   const toggleStatus = async (id, status) => {
//     const next = status === "active" ? "blocked" : "active";
//     if (!confirm(`Bạn có chắc muốn ${next === "blocked" ? "KHÓA" : "MỞ KHÓA"} tài khoản này?`)) return;

//     await axiosClient.patch(`/api/users/${id}/status`, { status: next });
//     load();
//   };

//   const deleteUser = async (id) => {
//     if (!confirm("XÓA tài khoản? Hành động này không thể hoàn tác.")) return;

//     await axiosClient.delete(`/api/users/${id}`);
//     load();
//   };

//   /* ------------------------ RENDER PAGE ------------------------ */

//   const canPrev = page > 1;
//   const canNext = page < pages;

//   return (
//     <section className="space-y-8 animate-fadeIn">
//       {/* Header */}
//       <div className="flex items-center justify-between flex-wrap gap-4">
//         <div>
//           <h1 className="text-2xl font-semibold tracking-tight">Khách hàng</h1>
//           <p className="text-sm opacity-70">
//             Quản lý tài khoản khách, nhân viên, trạng thái & phân quyền.
//           </p>
//         </div>
//       </div>

//       {/* Search */}
//       <div className="flex gap-3 items-center flex-wrap">
//         <div className="relative">
//           <input
//             value={q}
//             onChange={(e) => {
//               setPage(1);
//               setQ(e.target.value);
//             }}
//             placeholder=" Tìm theo tên hoặc email..."
//             className="bg-white/10 border border-white/20 text-white placeholder:text-white/60 caret-white
//               rounded-xl px-4 py-2 pl-10 text-sm outline-none focus:ring-2 focus:ring-white/30 min-w-[260px]"
//           />
//           <span className="absolute left-3 top-2.5 text-white/50 text-sm">🔍</span>
//         </div>

//         <span className="ml-auto text-xs opacity-70">
//           Tổng: <strong>{total}</strong> người dùng
//         </span>
//       </div>

//       {/* Table */}
//       <div className="bg-white/5 rounded-2xl p-6 shadow-xl backdrop-blur-sm">
//         <div className="overflow-auto rounded-xl">
//           <table className="min-w-full text-[15px] border-collapse">
//             <thead>
//               <tr className="opacity-80 text-left border-b border-white/10">
//                 <th className="py-3 px-4">Tên</th>
//                 <th className="py-3 px-4">Email</th>
//                 <th className="py-3 px-4">SĐT</th>
//                 <th className="py-3 px-4">Địa chỉ</th>
//                 <th className="py-3 px-4">Vai trò</th>
//                 <th className="py-3 px-4">Trạng thái</th>
//                 <th className="py-3 px-4">Ngày tạo</th>
//                 <th className="py-3 px-4 text-right">Hành động</th>
//               </tr>
//             </thead>

//             <tbody className="divide-y divide-white/10">
//               {customers.map((c) => (
//                 <tr key={c._id} className="hover:bg-white/10 transition">
//                   <td className="py-3 px-4 font-medium">{c.name || "—"}</td>
//                   <td className="py-3 px-4">{c.email}</td>
//                   <td className="py-3 px-4">{c.phone || "—"}</td>
//                   <td className="py-3 px-4 max-w-xs truncate">{c.address || "—"}</td>

//                   {/* ROLE DROPDOWN */}
//                   <td className="py-3 px-4 text-xs">
//                     <select
//                       value={c.role}
//                       onChange={(e) => changeRole(c._id, e.target.value)}
//                       className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded outline-none cursor-pointer"
//                     >
//                       <option value="user">User</option>
//                       <option value="staff">Staff</option>
//                       <option value="admin" disabled>Admin</option>
//                     </select>
//                   </td>

//                   {/* STATUS (active / blocked) */}
//                   <td className="py-3 px-4 text-xs">
//                     <button
//                       onClick={() => toggleStatus(c._id, c.status || "active")}
//                       className={`px-2 py-1 rounded-lg ${
//                         (c.status || "active") === "blocked"
//                           ? "bg-red-500/30 text-red-200"
//                           : "bg-emerald-500/20 text-emerald-300"
//                       }`}
//                     >
//                       {c.status || "active"}
//                     </button>
//                   </td>

//                   <td className="py-3 px-4">
//                     {c.createdAt
//                       ? new Date(c.createdAt).toLocaleDateString("vi-VN")
//                       : "—"}
//                   </td>

//                   {/* ACTION BUTTONS */}
//                   <td className="py-3 px-4 text-right space-x-2">

//                     {/* Xem chi tiết */}
//                     <Link
//                       to={`/admin/customers/${c._id}`}
//                       className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition"
//                     >
//                       Xem
//                     </Link>

//                     {/* Xóa */}
//                     <button
//                       onClick={() => deleteUser(c._id)}
//                       className="text-xs bg-red-500/20 hover:bg-red-500/30 px-3 py-1.5 rounded-lg text-red-300"
//                     >
//                       Xóa
//                     </button>
//                   </td>
//                 </tr>
//               ))}

//               {!customers.length && (
//                 <tr>
//                   <td colSpan="8" className="py-8 text-center text-sm opacity-60">
//                     {loading ? "Đang tải..." : "Không có người dùng nào"}
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>

//         {/* Pagination */}
//         {pages > 1 && (
//           <div className="flex justify-between items-center mt-4 text-xs">
//             <span>Trang {page}/{pages}</span>

//             <div className="flex gap-2">
//               <button
//                 disabled={!canPrev}
//                 onClick={() => canPrev && setPage(page - 1)}
//                 className={`px-3 py-1.5 rounded-lg border border-white/20 ${
//                   canPrev ? "hover:bg-white/10" : "opacity-40 cursor-not-allowed"
//                 }`}
//               >
//                 ← Trước
//               </button>

//               <button
//                 disabled={!canNext}
//                 onClick={() => canNext && setPage(page + 1)}
//                 className={`px-3 py-1.5 rounded-lg border border-white/20 ${
//                   canNext ? "hover:bg-white/10" : "opacity-40 cursor-not-allowed"
//                 }`}
//               >
//                 Sau →
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }//28/11





import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../services/axiosClient";

// Ant Design
import {
  Table,
  Input,
  Tag,
  Select,
  Button,
  Space,
  Popconfirm,
  message,
} from "antd";

const { Option } = Select;

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(false);

  const limit = 20;

  async function load() {
    try {
      setLoading(true);
      const res = await axiosClient.get("/api/users", {
        params: { q, page, limit, sort: "-createdAt" },
      });

      const data = res.data || {};
      setCustomers(data.items || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
    } catch (e) {
      console.error("[AdminCustomers]", e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [q, page]);

  /* ------------------------ ACTIONS ------------------------ */

  const changeRole = async (id, role) => {
    await axiosClient.patch(`/api/users/${id}/role`, { role });
    message.success("Đổi vai trò thành công");
    load();
  };

  const toggleStatus = async (id, status) => {
    const next = status === "active" ? "blocked" : "active";
    await axiosClient.patch(`/api/users/${id}/status`, { status: next });
    message.success("Cập nhật trạng thái thành công");
    load();
  };

  const deleteUser = async (id) => {
    await axiosClient.delete(`/api/users/${id}`);
    message.success("Đã xoá tài khoản");
    load();
  };

  /* ---------------------- TABLE COLUMNS ---------------------- */

  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      render: (text) => text || "—",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "SĐT",
      dataIndex: "phone",
      render: (t) => t || "—",
    },
    {
      title: "Địa chỉ",
      dataIndex: "address",
      ellipsis: true,
      render: (t) => t || "—",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      render: (role, row) => (
        <Select
          value={role}
          onChange={(v) => changeRole(row._id, v)}
          size="small"
          style={{ width: 100 }}
        >
          <Option value="user">User</Option>
          <Option value="staff">Staff</Option>
          <Option value="admin" disabled>
            Admin
          </Option>
        </Select>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status, row) => (
        <Popconfirm
          title={`Bạn có chắc muốn ${
            status === "active" ? "KHÓA" : "MỞ"
          } tài khoản này?`}
          onConfirm={() => toggleStatus(row._id, status)}
        >
          <Tag
            color={status === "blocked" ? "red" : "green"}
            style={{ cursor: "pointer" }}
          >
            {status || "active"}
          </Tag>
        </Popconfirm>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (d) =>
        d ? new Date(d).toLocaleDateString("vi-VN") : "—",
    },
    {
      title: "Hành động",
      dataIndex: "_id",
      render: (id) => (
        <Space>
          <Link
            to={`/admin/customers/${id}`}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded text-xs"
          >
            Xem
          </Link>

          <Popconfirm
            title="Xóa tài khoản này?"
            okText="Xóa"
            cancelText="Hủy"
            onConfirm={() => deleteUser(id)}
          >
            <Button danger size="small">
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  /* --------------------------- UI --------------------------- */

  return (
    <section className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Người dùng</h1>
        <p className="opacity-70">Quản lý khách hàng & nhân viên</p>
      </div>

      {/* Search */}
      <Space style={{ marginBottom: 12 }}>
        <Input
          value={q}
          onChange={(e) => {
            setPage(1);
            setQ(e.target.value);
          }}
          placeholder="Tìm theo tên hoặc email..."
          style={{ width: 260 }}
        />
        <span className="text-xs opacity-70">
          Tổng: <b>{total}</b> người dùng
        </span>
      </Space>

      <Table
        rowKey="_id"
        columns={columns}
        dataSource={customers}
        loading={loading}
        pagination={{
          current: page,
          pageSize: limit,
          total: total,
          onChange: (p) => setPage(p),
        }}
        className="bg-white/5 rounded-xl p-4"
      />
    </section>
  );
}

