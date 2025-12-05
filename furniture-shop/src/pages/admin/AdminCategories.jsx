// import { useEffect, useMemo, useState } from "react";
// import axiosClient from "../../services/axiosClient";

// const inputCls =
//   "bg-white/10 border border-white/20 text-white placeholder:text-white/60 caret-white " +
//   "rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40";
// const fileCls =
//   "block w-full text-sm file:mr-3 file:px-3 file:py-2 file:rounded-lg " +
//   "file:border-0 file:bg-white/10 file:text-white hover:file:bg-white/20 text-white/80";

// export default function AdminCategories() {
//   const [items, setItems] = useState([]);
//   const [parents, setParents] = useState([]);
//   const [q, setQ] = useState("");
//   const [busyId, setBusyId] = useState(null);
//   const [editId, setEditId] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const [form, setForm] = useState({
//     name: "",
//     slug: "",
//     parent: "",   // optional: 1 cấp cha
//     order: 0,
//     isActive: true,
//     image: "",
//     metaTitle: "",
//     metaDescription: "",
//   });

//   const reset = () => {
//     setEditId(null);
//     setForm({
//       name: "",
//       slug: "",
//       parent: "",
//       order: 0,
//       isActive: true,
//       image: "",
//       metaTitle: "",
//       metaDescription: "",
//     });
//   };

//   async function load() {
//     setLoading(true);
//     try {
//       const [listRes, parentRes] = await Promise.all([
//         axiosClient.get("/api/categories?limit=500&sort=order name"),
//         axiosClient.get("/api/categories?parent=root&limit=500&sort=order name"),
//       ]);
//       setItems(listRes.data?.items || []);
//       setParents(parentRes.data?.items || []);
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => { load(); }, []);

//   const filtered = useMemo(() => {
//     const key = q.trim().toLowerCase();
//     if (!key) return items;
//     return items.filter(c =>
//       (c.name || "").toLowerCase().includes(key) ||
//       (c.slug || "").toLowerCase().includes(key)
//     );
//   }, [items, q]);

//   async function onSubmit(e) {
//     e.preventDefault();
//     setBusyId("save");
//     try {
//       const payload = {
//         ...form,
//         order: Number(form.order) || 0,
//         parent: form.parent || null,
//       };
//       if (editId) await axiosClient.patch(`/api/categories/${editId}`, payload);
//       else await axiosClient.post("/api/categories", payload);
//       await load(); reset();
//     } catch (e) {
//       alert(e?.response?.data?.message || e.message || "Lưu thất bại");
//     } finally {
//       setBusyId(null);
//     }
//   }

//   function onEdit(c) {
//     setEditId(c._id);
//     setForm({
//       name: c.name || "",
//       slug: c.slug || "",
//       parent: c.parent || "",
//       order: c.order ?? 0,
//       isActive: !!c.isActive,
//       image: c.image || "",
//       metaTitle: c.metaTitle || "",
//       metaDescription: c.metaDescription || "",
//     });
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   }

//   async function onDelete(c) {
//     if (!confirm(`Xoá danh mục "${c.name}"?`)) return;
//     setBusyId(c._id);
//     try {
//       await axiosClient.delete(`/api/categories/${c._id}`);
//       setItems(arr => arr.filter(x => x._id !== c._id));
//     } catch (e) {
//       alert(e?.response?.data?.message || e.message || "Xoá thất bại");
//     } finally {
//       setBusyId(null);
//     }
//   }

//   // upload ảnh đại diện danh mục
//   async function onPickImage(e) {
//     const f = e.target.files?.[0];
//     if (!f) return;
//     setBusyId("img");
//     try {
//       const fd = new FormData();
//       fd.append("file", f);
//       const { data } = await axiosClient.post("/api/uploads/file", fd, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });
//       setForm(s => ({ ...s, image: data?.url || "" }));
//       e.target.value = "";
//     } catch (err) {
//       alert(err?.response?.data?.message || err?.message || "Upload ảnh lỗi");
//     } finally {
//       setBusyId(null);
//     }
//   }

//   return (
//     <section className="space-y-6">
//       <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
//         <h1 className="text-2xl lg:text-3xl font-semibold">Categories</h1>
//         <input
//           placeholder="Tìm kiếm danh mục…"
//           value={q}
//           onChange={(e)=>setQ(e.target.value)}
//           className={inputCls}
//         />
//       </div>

//       {/* Form */}
//       <form onSubmit={onSubmit} className="admin-dark-form bg-white/5 rounded-2xl p-6 lg:p-8 space-y-4">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div>
//             <label className="block text-sm mb-1 text-white/80">Tên</label>
//             <input className={inputCls} value={form.name}
//               onChange={(e)=>setForm(s=>({...s, name: e.target.value}))}
//               placeholder="VD: Sofa" required />
//           </div>
//           <div>
//             <label className="block text-sm mb-1 text-white/80">Slug (tuỳ chọn)</label>
//             <input className={inputCls} value={form.slug}
//               onChange={(e)=>setForm(s=>({...s, slug: e.target.value}))}
//               placeholder="sofa" />
//           </div>
//           <div>
//             <label className="block text-sm mb-1 text-white/80">Cấp cha (tuỳ chọn)</label>
//             <select className={inputCls} value={form.parent}
//               onChange={(e)=>setForm(s=>({...s, parent: e.target.value}))}>
//               <option value="">— Không —</option>
//               {parents.map(p => (
//                 <option key={p._id} value={p._id} className="bg-[#0f172a]">{p.name}</option>
//               ))}
//             </select>
//           </div>
//           <div>
//             <label className="block text-sm mb-1 text-white/80">Thứ tự</label>
//             <input type="number" className={inputCls} value={form.order}
//               onChange={(e)=>setForm(s=>({...s, order: e.target.value}))} />
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div className="md:col-span-2">
//             <label className="block text-sm mb-1 text-white/80">Meta title (SEO)</label>
//             <input className={inputCls} value={form.metaTitle}
//               onChange={(e)=>setForm(s=>({...s, metaTitle: e.target.value}))} />
//           </div>
//           <div className="md:col-span-2">
//             <label className="block text-sm mb-1 text-white/80">Meta description (SEO)</label>
//             <input className={inputCls} value={form.metaDescription}
//               onChange={(e)=>setForm(s=>({...s, metaDescription: e.target.value}))} />
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//           <div className="md:col-span-2">
//             <label className="block text-sm mb-1 text-white/80">Ảnh đại diện</label>
//             <input type="file" accept="image/*" className={fileCls} onChange={onPickImage} />
//             {form.image && (
//               <img src={form.image.startsWith("/") ? import.meta.env.VITE_API_ORIGIN + form.image : form.image}
//                    className="mt-2 w-40 h-40 object-cover rounded-xl border border-white/20 bg-white/5" />
//             )}
//           </div>
//           <div className="flex items-end">
//             <label className="inline-flex items-center gap-2 text-sm">
//               <input type="checkbox" checked={form.isActive}
//                 onChange={(e)=>setForm(s=>({...s, isActive: e.target.checked}))} />
//               <span>Hiển thị</span>
//             </label>
//           </div>
//         </div>

//         <div className="pt-2 flex items-center gap-3">
//           <button disabled={busyId==="save"}
//             className="rounded-xl bg-white/10 hover:bg-white/20 px-5 py-2 text-white disabled:opacity-60">
//             {busyId==="save" ? "Đang lưu…" : (editId ? "Lưu thay đổi" : "Thêm danh mục")}
//           </button>
//           {editId && (
//             <button type="button" onClick={reset} className="text-sm underline opacity-80">
//               Hủy
//             </button>
//           )}
//         </div>
//       </form>

//       {/* Bảng */}
//       <div className="bg-white/5 rounded-2xl p-6 lg:p-8 overflow-auto">
//         <table className="min-w-full text-[15px]">
//           <thead className="text-left opacity-80">
//             <tr>
//               <th className="py-3 pr-4">Ảnh</th>
//               <th className="py-3 pr-4">Tên</th>
//               <th className="py-3 pr-4">Slug</th>
//               <th className="py-3 pr-4">Cha</th>
//               <th className="py-3 pr-4">Thứ tự</th>
//               <th className="py-3 pr-4">Trạng thái</th>
//               <th className="py-3 pr-0 text-right">Thao tác</th>
//             </tr>
//           </thead>
//           <tbody className="divide-y divide-white/10">
//             {filtered.map((c) => {
//               const parentName = items.find(x => String(x._id) === String(c.parent))?.name || "—";
//               const img = c.image?.startsWith("/") ? import.meta.env.VITE_API_ORIGIN + c.image : c.image;
//               return (
//                 <tr key={c._id} className="align-middle">
//                   <td className="py-3 pr-4">
//                     {img ? (
//                       <img src={img} alt={c.name} className="w-10 h-10 rounded-lg object-cover border border-white/10" />
//                     ) : <div className="w-10 h-10 rounded-lg bg-white/10 grid place-items-center">—</div>}
//                   </td>
//                   <td className="py-3 pr-4">{c.name}</td>
//                   <td className="py-3 pr-4 opacity-80">{c.slug}</td>
//                   <td className="py-3 pr-4">{parentName}</td>
//                   <td className="py-3 pr-4">{c.order ?? 0}</td>
//                   <td className="py-3 pr-4">{c.isActive ? "Hiển thị" : "Ẩn"}</td>
//                   <td className="py-3 pr-0 text-right">
//                     <div className="flex gap-2 justify-end">
//                       <button onClick={() => onEdit(c)}
//                         className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded">
//                         Sửa
//                       </button>
//                       <button onClick={() => onDelete(c)} disabled={busyId === c._id}
//                         className="text-xs bg-red-500/20 hover:bg-red-500/30 px-3 py-1.5 rounded disabled:opacity-60">
//                         {busyId === c._id ? "Đang xoá..." : "Xoá"}
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               );
//             })}
//             {!filtered.length && (
//               <tr><td colSpan="7" className="py-10 text-center opacity-60">
//                 {loading ? "Đang tải…" : "Không có danh mục"}
//               </td></tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </section>
//   );
// }//28/11












import { useEffect, useMemo, useState } from "react";
import axiosClient from "../../services/axiosClient";

// Ant Design
import {
  Card,
  Input,
  Select,
  Button,
  Table,
  Image,
  Tag,
  Space,
  Popconfirm,
  message,
  Form,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UploadOutlined,
} from "@ant-design/icons";

export default function AdminCategories() {
  const [items, setItems] = useState([]);
  const [parents, setParents] = useState([]);
  const [q, setQ] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [form] = Form.useForm();

  const reset = () => {
    setEditId(null);
    form.resetFields();
  };

  async function load() {
    setLoading(true);
    try {
      const [listRes, parentRes] = await Promise.all([
        axiosClient.get("/api/categories?limit=500&sort=order name"),
        axiosClient.get("/api/categories?parent=root&limit=500&sort=order name"),
      ]);
      setItems(listRes.data?.items || []);
      setParents(parentRes.data?.items || []);
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
      (c) =>
        (c.name || "").toLowerCase().includes(key) ||
        (c.slug || "").toLowerCase().includes(key)
    );
  }, [items, q]);

  /* ------------------------ SUBMIT FORM ------------------------ */
  async function onSubmit(values) {
    try {
      setBusyId("save");
      const payload = {
        ...values,
        order: Number(values.order) || 0,
        parent: values.parent || null,
      };

      if (editId) {
        await axiosClient.patch(`/api/categories/${editId}`, payload);
        message.success("Cập nhật danh mục thành công");
      } else {
        await axiosClient.post("/api/categories", payload);
        message.success("Thêm danh mục thành công");
      }

      await load();
      reset();
    } catch (e) {
      message.error(e?.response?.data?.message || "Lưu thất bại");
    } finally {
      setBusyId(null);
    }
  }

  /* ------------------------ EDIT ------------------------ */
  function onEdit(c) {
    setEditId(c._id);
    form.setFieldsValue({
      name: c.name,
      slug: c.slug,
      parent: c.parent || "",
      order: c.order ?? 0,
      isActive: c.isActive,
      image: c.image,
      metaTitle: c.metaTitle,
      metaDescription: c.metaDescription,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ------------------------ DELETE ------------------------ */
  async function onDelete(c) {
    try {
      setBusyId(c._id);
      await axiosClient.delete(`/api/categories/${c._id}`);
      message.success("Đã xoá danh mục");
      setItems((arr) => arr.filter((x) => x._id !== c._id));
    } catch (e) {
      message.error(e?.response?.data?.message || "Xoá thất bại");
    } finally {
      setBusyId(null);
    }
  }

  /* ------------------------ UPLOAD IMAGE ------------------------ */
  async function uploadImage(e) {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      setBusyId("img");
      const fd = new FormData();
      fd.append("file", f);
      const { data } = await axiosClient.post("/api/uploads/file", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      form.setFieldValue("image", data.url);
    } catch (err) {
      message.error("Upload ảnh thất bại");
    } finally {
      setBusyId(null);
    }
  }

  /* ------------------------ TABLE COLUMNS ------------------------ */
  const columns = [
    {
      title: "Ảnh",
      dataIndex: "image",
      render: (img) =>
        img ? <Image width={50} height={50} src={img} style={{ objectFit: "cover" }} /> : "—",
    },
    {
      title: "Tên",
      dataIndex: "name",
      render: (t) => <b>{t}</b>,
    },
    {
      title: "Slug",
      dataIndex: "slug",
      render: (s) => <span style={{ opacity: 0.7 }}>{s}</span>,
    },
    {
      title: "Cha",
      dataIndex: "parent",
      render: (pid) => {
        const p = items.find((i) => i._id === pid);
        return p ? p.name : "—";
      },
    },
    {
      title: "Thứ tự",
      dataIndex: "order",
      width: 100,
    },
    {
      title: "Trạng thái",
      dataIndex: "isActive",
      render: (v) =>
        v ? <Tag color="green">Hiển thị</Tag> : <Tag color="red">Ẩn</Tag>,
    },
    {
      title: "Thao tác",
      align: "right",
      render: (_, c) => (
        <Space>
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => onEdit(c)}
          >
            Sửa
          </Button>

          <Popconfirm
            title="Xoá danh mục này?"
            onConfirm={() => onDelete(c)}
          >
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              loading={busyId === c._id}
            >
              Xoá
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  /* ------------------------ RENDER UI ------------------------ */
  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold text-white">Categories</h2>
        <Input.Search
          placeholder="Tìm kiếm danh mục…"
          allowClear
          style={{ width: 260 }}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
      </div>

      {/* FORM */}
      <Card title={editId ? "Sửa danh mục" : "Thêm danh mục"} bordered={false}>
        <Form form={form} layout="vertical" onFinish={onSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Form.Item name="name" label="Tên danh mục" rules={[{ required: true }]}>
              <Input placeholder="VD: Sofa" />
            </Form.Item>

            <Form.Item name="slug" label="Slug">
              <Input placeholder="sofa" />
            </Form.Item>

            <Form.Item name="parent" label="Danh mục cha">
              <Select allowClear placeholder="Không có">
                {parents.map((p) => (
                  <Select.Option key={p._id} value={p._id}>
                    {p.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="order" label="Thứ tự">
              <Input type="number" />
            </Form.Item>

            <Form.Item name="isActive" label="Hiển thị" initialValue={true}>
              <Select>
                <Select.Option value={true}>Hiển thị</Select.Option>
                <Select.Option value={false}>Ẩn</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item name="image" label="Ảnh đại diện">
              <div>
                <Input
                  placeholder="URL ảnh hoặc tải ảnh lên"
                  style={{ marginBottom: 8 }}
                />
                <input type="file" accept="image/*" onChange={uploadImage} />

                {form.getFieldValue("image") && (
                  <Image
                    src={form.getFieldValue("image")}
                    width={120}
                    height={120}
                    style={{
                      marginTop: 10,
                      objectFit: "cover",
                      borderRadius: 10,
                    }}
                  />
                )}
              </div>
            </Form.Item>
          </div>

          <Form.Item>
            <Space>
              <Button
                type="primary"
                htmlType="submit"
                loading={busyId === "save"}
                icon={<PlusOutlined />}
              >
                {editId ? "Lưu thay đổi" : "Thêm danh mục"}
              </Button>

              {editId && (
                <Button type="text" onClick={reset}>
                  Hủy
                </Button>
              )}
            </Space>
          </Form.Item>
        </Form>
      </Card>

      {/* TABLE */}
      <Card bordered={false}>
        <Table
          rowKey="_id"
          loading={loading}
          columns={columns}
          dataSource={filtered}
          pagination={{ pageSize: 20 }}
        />
      </Card>
    </section>
  );
}

