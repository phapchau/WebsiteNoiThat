





// // src/pages/account/Address.jsx
// import { useEffect, useMemo, useState } from "react";
// import axiosClient from "../../services/axiosClient";

// function Blank() {
//   return (
//     <div className="text-center py-10 text-gray-500">
//       <div className="text-5xl mb-2">📦</div>
//       <div>Chưa có địa chỉ nào</div>
//     </div>
//   );
// }

// const emptyForm = { name: "", phone: "", email: "", line1: "", isDefault: false };

// export default function Address() {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // modal state
//   const [open, setOpen] = useState(false);
//   const [editing, setEditing] = useState(null); // addr object
//   const [f, setF] = useState(emptyForm);
//   const [busy, setBusy] = useState(false);
//   const [msg, setMsg] = useState("");

//   // Lấy từ /api/users/me (trả về addresses)
//   async function load() {
//     setLoading(true);
//     try {
//       const { data } = await axiosClient.get("/api/users/me");
//       setItems(data?.user?.addresses || data?.addresses || []);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => { load(); }, []);

//   const hasDefault = useMemo(() => items.some(a => a.isDefault), [items]);

//   function openCreate() {
//     setEditing(null);
//     setF({ ...emptyForm, isDefault: !hasDefault }); // địa chỉ đầu tiên tự set default
//     setMsg("");
//     setOpen(true);
//   }

//   function openEdit(a) {
//     setEditing(a);
//     setF({ name: a.name || "", phone: a.phone || "", email: a.email || "", line1: a.line1 || "", isDefault: !!a.isDefault });
//     setMsg("");
//     setOpen(true);
//   }

//   async function save(e) {
//     e.preventDefault();
//     setBusy(true);
//     setMsg("");
//     try {
//       if (editing?._id) {
//         // update
//         const { data } = await axiosClient.patch(`/api/users/addresses/${editing._id}`, f);
//         setItems(list => list.map(x => (x._id === data._id ? data : x)));
//       } else {
//         // create
//         const { data } = await axiosClient.post("/api/users/addresses", f);
//         setItems(list => [data, ...list]);
//       }
//       setOpen(false);
//     } catch (err) {
//       setMsg("❌ " + (err?.response?.data?.message || err.message));
//     } finally {
//       setBusy(false);
//     }
//   }

//   async function setDefault(a) {
//     try {
//       const { data } = await axiosClient.patch(`/api/users/addresses/${a._id}/default`);
//       setItems(list => list.map(x => ({ ...x, isDefault: x._id === data._id })));
//     } catch (err) {
//       alert(err?.response?.data?.message || err.message);
//     }
//   }

//   async function remove(a) {
//     if (!confirm("Xoá địa chỉ này?")) return;
//     try {
//       await axiosClient.delete(`/api/users/addresses/${a._id}`);
//       setItems(list => list.filter(x => x._id !== a._id));
//     } catch (err) {
//       alert(err?.response?.data?.message || err.message);
//     }
//   }

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center justify-between">
//         <h2 className="text-xl font-semibold">Địa chỉ của tôi</h2>
//         <button onClick={openCreate} className="px-4 py-2 rounded-xl bg-black text-white">+ Thêm địa chỉ</button>
//       </div>

//       <div className="rounded-xl border">
//         {loading ? (
//           <div className="p-6 text-gray-500">Đang tải…</div>
//         ) : items.length === 0 ? (
//           <Blank />
//         ) : (
//           <ul className="divide-y">
//             {items.map((a) => (
//               <li key={a._id} className="p-4 md:p-5 flex flex-col md:flex-row md:items-center gap-3 md:gap-6">
//                 <div className="flex-1">
//                   <div className="font-medium">
//                     {a.name} {a.isDefault && <span className="text-xs ml-2 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">Mặc định</span>}
//                   </div>
//                   <div className="text-gray-600 text-sm">
//                     {a.phone && <span className="mr-4">📞 {a.phone}</span>}
//                     {a.email && <span>✉️ {a.email}</span>}
//                   </div>
//                   <div className="text-gray-700 mt-1">{a.line1}</div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   {!a.isDefault && (
//                     <button onClick={() => setDefault(a)} className="text-sm px-3 py-1.5 rounded border hover:bg-gray-50">
//                       Đặt mặc định
//                     </button>
//                   )}
//                   <button onClick={() => openEdit(a)} className="text-sm px-3 py-1.5 rounded border hover:bg-gray-50">Sửa</button>
//                   <button onClick={() => remove(a)} className="text-sm px-3 py-1.5 rounded border bg-red-50 text-red-700 hover:bg-red-100">
//                     Xoá
//                   </button>
//                 </div>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       {/* Modal thêm/sửa */}
//       {open && (
//         <div className="fixed inset-0 z-50 grid place-items-center bg-black/30 p-4" onMouseDown={() => !busy && setOpen(false)}>
//           <div className="w-full max-w-lg rounded-2xl bg-white p-5" onMouseDown={(e) => e.stopPropagation()}>
//             <div className="flex items-center justify-between mb-3">
//               <h3 className="text-lg font-semibold">{editing ? "Sửa địa chỉ" : "Thêm địa chỉ"}</h3>
//               <button className="text-gray-500 hover:text-black" onClick={() => !busy && setOpen(false)}>✕</button>
//             </div>

//             {msg && <div className="mb-3 px-3 py-2 rounded bg-red-50 text-red-700 text-sm">{msg}</div>}

//             <form onSubmit={save} className="grid md:grid-cols-2 gap-3">
//               <div className="md:col-span-1">
//                 <label className="text-sm text-gray-600">Họ tên</label>
//                 <input className="w-full border rounded-xl p-2.5" value={f.name} onChange={(e)=>setF(s=>({...s, name:e.target.value}))} required />
//               </div>
//               <div className="md:col-span-1">
//                 <label className="text-sm text-gray-600">Số điện thoại</label>
//                 <input className="w-full border rounded-xl p-2.5" value={f.phone} onChange={(e)=>setF(s=>({...s, phone:e.target.value}))} />
//               </div>
//               <div className="md:col-span-1">
//                 <label className="text-sm text-gray-600">Email</label>
//                 <input type="email" className="w-full border rounded-xl p-2.5" value={f.email} onChange={(e)=>setF(s=>({...s, email:e.target.value}))} />
//               </div>
//               <div className="md:col-span-2">
//                 <label className="text-sm text-gray-600">Địa chỉ</label>
//                 <input className="w-full border rounded-xl p-2.5" value={f.line1} onChange={(e)=>setF(s=>({...s, line1:e.target.value}))} required />
//               </div>
//               <label className="md:col-span-2 inline-flex items-center gap-2 text-sm">
//                 <input type="checkbox" checked={f.isDefault} onChange={(e)=>setF(s=>({...s, isDefault: e.target.checked}))}/>
//                 <span>Đặt làm địa chỉ mặc định</span>
//               </label>

//               <div className="md:col-span-2 flex items-center gap-2 pt-1">
//                 <button disabled={busy} className="px-4 py-2 rounded-xl bg-black text-white disabled:opacity-50">
//                   {busy ? "Đang lưu…" : "Lưu"}
//                 </button>
//                 <button type="button" disabled={busy} onClick={()=>setOpen(false)} className="px-4 py-2 rounded-xl border">
//                   Huỷ
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }2/12









// src/pages/account/Address.jsx
import { useEffect, useMemo, useState } from "react";
import axiosClient from "../../services/axiosClient";

import {
  Card,
  Button,
  Modal,
  Form,
  Input,
  List,
  Tag,
  Space,
  message,
} from "antd";

const emptyForm = {
  name: "",
  phone: "",
  email: "",
  line1: "",
  isDefault: false
};

export default function Address() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [f, setF] = useState(emptyForm);
  const [busy, setBusy] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const { data } = await axiosClient.get("/api/users/me");
      setItems(data?.user?.addresses || data?.addresses || []);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  const hasDefault = useMemo(() => items.some(a => a.isDefault), [items]);

  function openCreate() {
    setEditing(null);
    setF({ ...emptyForm, isDefault: !hasDefault }); // auto set default nếu chưa có
    setOpen(true);
  }

  function openEdit(a) {
    setEditing(a);
    setF({
      name: a.name || "",
      phone: a.phone || "",
      email: a.email || "",
      line1: a.line1 || "",
      isDefault: !!a.isDefault
    });
    setOpen(true);
  }

  async function save() {
    setBusy(true);
    try {
      if (editing?._id) {
        // update
        const { data } = await axiosClient.patch(`/api/users/addresses/${editing._id}`, f);
        setItems(list => list.map(x => (x._id === data._id ? data : x)));
      } else {
        // create
        const { data } = await axiosClient.post("/api/users/addresses", f);
        setItems(list => [data, ...list]);
      }
      setOpen(false);
    } catch (err) {
      message.error(err?.response?.data?.message || err.message);
    } finally {
      setBusy(false);
    }
  }

  async function setDefault(a) {
    try {
      const { data } = await axiosClient.patch(`/api/users/addresses/${a._id}/default`);
      setItems(list => list.map(x => ({ ...x, isDefault: x._id === data._id })));
      message.success("Đã đặt làm mặc định");
    } catch (err) {
      message.error(err?.response?.data?.message || err.message);
    }
  }

  async function remove(a) {
    Modal.confirm({
      title: "Xoá địa chỉ?",
      content: "Bạn có chắc muốn xoá địa chỉ này?",
      okText: "Xoá",
      okType: "danger",
      cancelText: "Huỷ",
      async onOk() {
        try {
          await axiosClient.delete(`/api/users/addresses/${a._id}`);
          setItems(list => list.filter(x => x._id !== a._id));
          message.success("Đã xoá");
        } catch (err) {
          message.error(err?.response?.data?.message || err.message);
        }
      }
    });
  }

  return (
    <div className="max-w-2xl mx-auto">

      <Card
        title={
          <div className="flex items-center justify-between">
            <span>Địa chỉ của tôi</span>
            <Button type="primary" onClick={openCreate}>+ Thêm địa chỉ</Button>
          </div>
        }
        className="rounded-xl shadow-sm"
      >
        <List
          loading={loading}
          dataSource={items}
          locale={{ emptyText: "Chưa có địa chỉ nào" }}
          renderItem={(a) => (
            <List.Item
              actions={[
                !a.isDefault && (
                  <Button size="small" onClick={() => setDefault(a)}>
                    Đặt mặc định
                  </Button>
                ),
                <Button size="small" onClick={() => openEdit(a)}>
                  Sửa
                </Button>,
                <Button size="small" danger onClick={() => remove(a)}>
                  Xoá
                </Button>,
              ]}
            >
              <List.Item.Meta
                title={
                  <Space>
                    <strong>{a.name}</strong>
                    {a.isDefault && <Tag color="green">Mặc định</Tag>}
                  </Space>
                }
                description={
                  <div>
                    {a.phone && <div>📞 {a.phone}</div>}
                    {a.email && <div>✉️ {a.email}</div>}
                    <div style={{ marginTop: 4 }}>{a.line1}</div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      {/* ===== Modal thêm/sửa ===== */}
      <Modal
        title={editing ? "Sửa địa chỉ" : "Thêm địa chỉ"}
        open={open}
        onCancel={() => !busy && setOpen(false)}
        onOk={save}
        confirmLoading={busy}
        okText="Lưu"
        cancelText="Huỷ"
      >
        <Form layout="vertical">
          <Form.Item label="Họ tên" required>
            <Input
              value={f.name}
              onChange={(e) => setF((s) => ({ ...s, name: e.target.value }))}
            />
          </Form.Item>

          <Form.Item label="Số điện thoại">
            <Input
              value={f.phone}
              onChange={(e) => setF((s) => ({ ...s, phone: e.target.value }))}
            />
          </Form.Item>

          <Form.Item label="Email">
            <Input
              value={f.email}
              onChange={(e) => setF((s) => ({ ...s, email: e.target.value }))}
            />
          </Form.Item>

          <Form.Item label="Địa chỉ" required>
            <Input.TextArea
              rows={3}
              value={f.line1}
              onChange={(e) => setF((s) => ({ ...s, line1: e.target.value }))}
            />
          </Form.Item>

          <Form.Item>
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <input
                type="checkbox"
                checked={f.isDefault}
                onChange={(e) => setF((s) => ({ ...s, isDefault: e.target.checked }))}
              />
              Đặt làm mặc định
            </label>
          </Form.Item>
        </Form>
      </Modal>

    </div>
  );
}





