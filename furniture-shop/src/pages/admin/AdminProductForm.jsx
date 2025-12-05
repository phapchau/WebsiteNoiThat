



// // src/pages/admin/AdminProductForm.jsx
// import { useEffect, useMemo, useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import axiosClient from "../../services/axiosClient";

// const ORIGIN = import.meta.env.VITE_API_ORIGIN || "http://localhost:8081";

// const labelCls = "block text-sm lg:text-base mb-1.5 text-white/80";
// const inputCls =
//   "!text-white !bg-white/10 !border-white/20 " +
//   "w-full rounded-xl placeholder:text-white/60 caret-white px-3 py-2 outline-none " +
//   "focus:ring-2 focus:ring-white/30 focus:!border-white/40";
// const textAreaCls =
//   "!text-white !bg-white/10 !border-white/20 " +
//   "w-full min-h-[140px] rounded-xl placeholder:text-white/60 caret-white px-3 py-2 outline-none " +
//   "focus:ring-2 focus:ring-white/30 focus:!border-white/40";
// const fileCls =
//   "block w-full text-sm file:mr-3 file:px-3 file:py-2 file:rounded-lg " +
//   "file:border-0 file:bg-white/10 file:text-white hover:file:bg-white/20 text-white/80";

// function toAbs(url) {
//   if (!url) return "";
//   if (url.startsWith("http")) return url;
//   if (url.startsWith("/")) return ORIGIN + url;
//   return url;
// }

// export default function AdminProductForm() {
//   const { id } = useParams();             // có id => đang sửa
//   const isEdit = !!id;
//   const nav = useNavigate();
//   const [busy, setBusy] = useState(false);
//   const [msg, setMsg] = useState("");

//   // ✅ Danh mục
//   const [cats, setCats] = useState([]);

//   const [form, setForm] = useState({
//     name: "",
//     price: "",
//     inStock: "",
//     category: "",     // lưu slug của category
//     description: "",
//     tags: "",
//     poster: "",       // url tương đối /uploads/xxx.jpg
//     model3d: "",      // url tương đối /uploads/xxx.glb
//     images: [],       // mảng url tương đối
//   });

//   // tải danh mục để render dropdown
//   useEffect(() => {
//     let alive = true;
//     (async () => {
//       try {
//         const { data } = await axiosClient.get(
//           "/api/categories?active=true&limit=500&sort=order name"
//         );
//         if (!alive) return;
//         setCats(data?.items || []);
//       } catch (e) {
//         // im lặng – không làm vỡ form nếu API tạm lỗi
//         console.error("[categories] load:", e?.response?.data || e.message);
//       }
//     })();
//     return () => { alive = false; };
//   }, []);

//   // tải sản phẩm khi edit
//   useEffect(() => {
//     if (!isEdit) return;
//     let alive = true;
//     (async () => {
//       try {
//         const { data } = await axiosClient.get(`/api/products/${id}`);
//         if (!alive) return;
//         setForm({
//           name: data?.name || "",
//           price: data?.price ?? "",
//           inStock: data?.inStock ?? data?.stock ?? data?.quantity ?? "",
//           // BE lưu category theo slug → gắn thẳng vào select
//           category: data?.category || "",
//           description: data?.description || "",
//           tags: Array.isArray(data?.tags) ? data.tags.join(", ") : data?.tags || "",
//           poster: data?.poster || "",
//           model3d: data?.model3d || "",
//           images: Array.isArray(data?.images) ? data.images : [],
//         });
//       } catch (e) {
//         console.error("[edit] load product:", e?.response?.data || e.message);
//         setMsg("Không tải được dữ liệu sản phẩm.");
//       }
//     })();
//     return () => { alive = false; };
//   }, [id, isEdit]);

//   const posterPreview = useMemo(() => toAbs(form.poster), [form.poster]);

//   // --- upload helpers ---
//   async function uploadOne(file) {
//     const fd = new FormData();
//     fd.append("file", file);
//     // BE của bạn là /api/uploads/file
//     const { data } = await axiosClient.post("/api/uploads/file", fd, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });
//     return data?.url; // đường dẫn tương đối
//   }

//   const onPickPoster = async (e) => {
//     const f = e.target.files?.[0];
//     if (!f) return;
//     setBusy(true); setMsg("");
//     try {
//       const url = await uploadOne(f);
//       setForm(s => ({ ...s, poster: url }));
//       e.target.value = "";
//       setMsg("Đã upload poster");
//     } catch (err) {
//       setMsg("Upload poster lỗi: " + (err?.response?.data?.message || err?.message));
//     } finally {
//       setBusy(false);
//     }
//   };

//   const onPickImages = async (e) => {
//     const files = Array.from(e.target.files || []);
//     if (!files.length) return;
//     setBusy(true); setMsg("");
//     try {
//       const uploaded = [];
//       for (const f of files) uploaded.push(await uploadOne(f));
//       setForm(s => ({ ...s, images: [...(s.images || []), ...uploaded] }));
//       e.target.value = "";
//       setMsg("Đã upload ảnh chi tiết");
//     } catch (err) {
//       setMsg("Upload ảnh lỗi: " + (err?.response?.data?.message || err?.message));
//     } finally {
//       setBusy(false);
//     }
//   };

//   const onPickModel = async (e) => {
//     const f = e.target.files?.[0];
//     if (!f) return;
//     setBusy(true); setMsg("");
//     try {
//       const url = await uploadOne(f);
//       setForm(s => ({ ...s, model3d: url }));
//       e.target.value = "";
//       setMsg("Đã upload model 3D");
//     } catch (err) {
//       setMsg("Upload model lỗi: " + (err?.response?.data?.message || err?.message));
//     } finally {
//       setBusy(false);
//     }
//   };

//   // --- submit create / update ---
//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setBusy(true); setMsg("");
//     try {
//       const payload = {
//         name: form.name.trim(),
//         price: Number(form.price) || 0,
//         inStock: Number(form.inStock) || 0,
//         category: form.category.trim(), // slug của category
//         description: form.description.trim(),
//         tags: form.tags ? form.tags.split(",").map(t => t.trim()).filter(Boolean) : [],
//         poster: form.poster,
//         model3d: form.model3d,
//         images: form.images,
//       };
//       if (isEdit) {
//         await axiosClient.patch(`/api/products/${id}`, payload);
//         setMsg("✅ Đã cập nhật sản phẩm");
//       } else {
//         await axiosClient.post("/api/products", payload);
//         setMsg("✅ Đã tạo sản phẩm");
//         setForm(s => ({ ...s, name: "", price: "", inStock: "", category: "", description: "", tags: "" }));
//       }
//       setTimeout(() => nav("/admin/products", { replace: true }), 500);
//     } catch (err) {
//       setMsg("❌ " + (err?.response?.data?.message || err?.message || "Lỗi lưu sản phẩm"));
//     } finally {
//       setBusy(false);
//     }
//   };

//   return (
//     <section className="space-y-6">
//       <div className="flex items-center justify-between">
//         <h1 className="text-2xl lg:text-3xl font-semibold">Admin • {isEdit ? "Sửa" : "Tạo"} sản phẩm</h1>
//         <Link to="/admin/products" className="text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg">
//           ← Danh sách
//         </Link>
//       </div>

//       {msg && (
//         <div className={`px-4 py-3 rounded-xl text-sm ${msg.startsWith("✅") ? "bg-green-500/10 text-green-300" : "bg-red-500/10 text-red-300"}`}>
//           {msg}
//         </div>
//       )}

//       <form onSubmit={onSubmit} className="admin-dark-form bg-white/5 rounded-2xl p-6 lg:p-8">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className={labelCls}>Tên</label>
//             <input
//               className={inputCls}
//               value={form.name}
//               onChange={(e)=>setForm(s=>({...s, name: e.target.value}))}
//               placeholder="Nhập tên sản phẩm"
//               required
//             />
//           </div>
//           <div>
//             <label className={labelCls}>Giá (đ)</label>
//             <input
//               type="number"
//               className={inputCls}
//               value={form.price}
//               onChange={(e)=>setForm(s=>({...s, price: e.target.value}))}
//               placeholder="VD: 2390000"
//               min={0}
//               required
//             />
//           </div>
//           <div>
//             <label className={labelCls}>Tồn kho</label>
//             <input
//               type="number"
//               className={inputCls}
//               value={form.inStock}
//               onChange={(e)=>setForm(s=>({...s, inStock: e.target.value}))}
//               placeholder="VD: 10"
//               min={0}
//             />
//           </div>

//           {/* ✅ Danh mục → dropdown */}
//           <div>
//             <label className={labelCls}>Danh mục</label>
//             <select
//               className={inputCls}
//               value={form.category}
//               onChange={(e)=>setForm(s=>({...s, category: e.target.value}))}
//             >
//               <option value="">— Chọn danh mục —</option>
//               {cats.map((c) => (
//                 <option key={c._id} value={c.slug} className="bg-[#0f172a]">
//                   {c.name}
//                 </option>
//               ))}
//             </select>
//             <div className="text-xs opacity-70 mt-1">
//               * Lưu theo <b>slug</b> để đồng bộ với backend
//             </div>
//             <div className="text-xs opacity-70 mt-1">
//               Chưa có danh mục? <Link to="/admin/categories" className="underline">Thêm tại đây</Link>
//             </div>
//           </div>
//         </div>

//         <div className="mt-6">
//           <label className={labelCls}>Mô tả</label>
//           <textarea
//             className={textAreaCls}
//             value={form.description}
//             onChange={(e)=>setForm(s=>({...s, description: e.target.value}))}
//             placeholder="Mô tả ngắn về sản phẩm…"
//           />
//         </div>

//         <div className="mt-6">
//           <label className={labelCls}>Tags (phân tách bằng dấu phẩy)</label>
//           <input
//             className={inputCls}
//             value={form.tags}
//             onChange={(e)=>setForm(s=>({...s, tags: e.target.value}))}
//             placeholder="sofa, scandi, brown"
//           />
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
//           <div>
//             <label className={labelCls}>Poster (ảnh đại diện)</label>
//             <input type="file" accept="image/*" className={fileCls} onChange={onPickPoster} />
//             {posterPreview && (
//               <img
//                 src={posterPreview}
//                 alt="poster"
//                 className="mt-3 w-44 h-44 object-cover rounded-xl border border-white/20 bg-white/5"
//               />
//             )}
//           </div>
//           <div>
//             <label className={labelCls}>Ảnh (có thể chọn nhiều)</label>
//             <input type="file" multiple accept="image/*" className={fileCls} onChange={onPickImages} />
//             {!!form.images?.length && (
//               <div className="flex gap-2 mt-3 flex-wrap">
//                 {form.images.map((u) => (
//                   <img key={u} src={toAbs(u)} className="w-16 h-16 object-cover rounded-lg border border-white/10" />
//                 ))}
//               </div>
//             )}
//           </div>
//           <div>
//             <label className={labelCls}>Model 3D (glb/gltf) – tuỳ chọn</label>
//             <input type="file" accept=".glb,.gltf" className={fileCls} onChange={onPickModel} />
//             {form.model3d && <div className="text-xs opacity-70 mt-2 break-all">{form.model3d}</div>}
//           </div>
//         </div>

//         <div className="mt-8">
//           <button
//             disabled={busy}
//             className="rounded-xl bg-white/10 hover:bg-white/20 px-6 py-2.5 text-white disabled:opacity-60"
//           >
//             {busy ? "Đang lưu…" : (isEdit ? "Lưu thay đổi" : "Tạo sản phẩm")}
//           </button>
//         </div>
//       </form>
//     </section>
//   );
// }///7/11









// src/pages/admin/AdminProductForm.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL || "http://localhost:8081/api";

/** Upload 1 file (form-data key "file"). Trả về URL file trên server. */
async function uploadFile(file, token) {
  const fd = new FormData();
  fd.append("file", file);

  const res = await fetch(`${API}/uploads/file`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` }, // KHÔNG tự set Content-Type
    body: fd,
  });

  const ct = res.headers.get("content-type") || "";
  const raw = await res.text();
  let data = null;
  if (ct.includes("application/json")) {
    try { data = JSON.parse(raw); } catch {}
  }
  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || `${res.status} ${raw.slice(0, 160)}`;
    throw new Error(msg);
  }
  if (!data?.url) throw new Error("Response không có url");
  return data.url;
}

export default function AdminProductForm() {
  const { id } = useParams();
  const nav = useNavigate();
  const [token] = useState(localStorage.getItem("token") || "");

  const [posterPreview, setPosterPreview] = useState("");

  const [form, setForm] = useState({
    name: "",
    price: "",
    inStock: 0,
    description: "",
    category: "",
    tags: "",
    images: [],
    poster: "",
    model3dUrl: "",
    // ✅ NEW: hiển thị CSV để không đổi logic cũ
    colorsText: "",
    sizesText: "",
  });

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  // ---------- LOAD PRODUCT ----------
  useEffect(() => {
    let stop = false;
    async function load() {
      setMsg("");
      try {
        const res = await fetch(`${API}/products/${encodeURIComponent(id)}`);
        const data = await (res.ok ? res.json() : Promise.reject(await res.json()));
        if (stop) return;
        setForm((s) => ({
          ...s,
          name: data.name || "",
          price: data.price ?? "",
          inStock: data.inStock ?? 0,
          description: data.desc || data.description || "",
          category: data.category || "",
          tags: Array.isArray(data.tags) ? data.tags.join(", ") : (data.tags || ""),
          images: Array.isArray(data.images) ? data.images : [],
          poster: data.poster || "",
          model3dUrl: data.model3dUrl || data.model3d || "",
          // ✅ convert mảng -> CSV để hiển thị
          colorsText: Array.isArray(data.colors) ? data.colors.join(", ") : (data.colors || ""),
          sizesText: Array.isArray(data.sizes) ? data.sizes.join(", ") : (data.sizes || ""),
        }));
        setPosterPreview(data.poster || "");
      } catch (e) {
        setMsg(e?.message || "Không tải được sản phẩm");
      }
    }
    if (id) load();
    return () => { stop = true; };
  }, [id]);

  // ---------- UPLOAD HANDLERS (GIỮ NGUYÊN LOGIC CŨ) ----------
  const handleUploadImages = async (e) => {
    try {
      setBusy(true);
      const files = Array.from(e.target.files || []);
      const urls = [];
      for (const f of files) {
        const u = await uploadFile(f, token);
        urls.push(u);
      }
      setForm((s) => ({ ...s, images: [...s.images, ...urls] }));
      setMsg(`Đã upload ${urls.length} ảnh`);
    } catch (err) {
      setMsg("Upload ảnh lỗi: " + err.message);
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  };

  const handleUploadPoster = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    const localUrl = URL.createObjectURL(f);
    setPosterPreview(localUrl);
    try {
      setBusy(true);
      const url = await uploadFile(f, token);
      setForm((s) => ({ ...s, poster: url }));
      setMsg("Đã upload poster");
    } catch (err) {
      setPosterPreview("");
      setMsg("Upload poster lỗi: " + err.message);
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  };

  const handleUploadModel = async (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    try {
      setBusy(true);
      const url = await uploadFile(f, token);
      setForm((s) => ({ ...s, model3dUrl: url })); // có URL → BE tự set is3D
      setMsg("Đã upload model 3D");
    } catch (err) {
      setMsg("Upload 3D lỗi: " + err.message);
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  };

  // ---------- SUBMIT (PATCH) ----------
  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      setBusy(true);

      const payload = {
        name: form.name.trim(),
        price: Number(form.price || 0),
        inStock: Number(form.inStock || 0),
        description: form.description?.trim() || "",
        category: form.category,
        tags: form.tags,               // CSV hay mảng → BE tự xử lý
        images: form.images,
        poster: form.poster,
        model3dUrl: form.model3dUrl,
        // ✅ NEW: gửi CSV để BE parse thành mảng
        colors: form.colorsText,
        sizes: form.sizesText,
      };

      const res = await fetch(`${API}/products/${encodeURIComponent(id)}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await (res.ok ? res.json() : Promise.reject(await res.json()));
      setMsg("✅ Đã lưu thay đổi");

      // cập nhật lại state theo server để đồng bộ
      setForm((s) => ({
        ...s,
        name: data.name || s.name,
        price: data.price ?? s.price,
        inStock: data.inStock ?? s.inStock,
        description: data.desc || data.description || s.description,
        category: data.category ?? s.category,
        tags: Array.isArray(data.tags) ? data.tags.join(", ") : (s.tags || ""),
        images: Array.isArray(data.images) ? data.images : s.images,
        poster: data.poster || s.poster,
        model3dUrl: data.model3dUrl || data.model3d || s.model3dUrl,
        colorsText: Array.isArray(data.colors) ? data.colors.join(", ") : (s.colorsText || ""),
        sizesText: Array.isArray(data.sizes) ? data.sizes.join(", ") : (s.sizesText || ""),
      }));
      if (data.poster) setPosterPreview(data.poster);
    } catch (err) {
      setMsg("❌ " + (err?.message || "Lưu thất bại"));
    } finally {
      setBusy(false);
    }
  };

  const canSave = useMemo(() => !!token && !!form.name && form.price !== "", [token, form.name, form.price]);

  return (
    <section className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">Admin • Sửa sản phẩm</h2>
        <Link to="/admin/products" className="px-3 py-2 rounded-lg border hover:bg-gray-100">
          ← Danh sách
        </Link>
      </div>

      <form onSubmit={onSubmit} className="admin-dark-form bg-white/5 rounded-2xl p-5 space-y-5">
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Tên</label>
            <input
              className="w-full border rounded p-2 bg-transparent"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Giá (đ)</label>
            <input
              type="number"
              className="w-full border rounded p-2 bg-transparent"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Tồn kho</label>
            <input
              type="number"
              className="w-full border rounded p-2 bg-transparent"
              value={form.inStock}
              onChange={(e) => setForm({ ...form, inStock: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Danh mục</label>
            <input
              className="w-full border rounded p-2 bg-transparent"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
            <p className="text-xs opacity-70 mt-1">
              * Lưu theo slug để đồng bộ với backend
            </p>
          </div>
        </div>

        <div>
          <label className="block text-sm mb-1">Mô tả</label>
          <textarea
            className="w-full border rounded p-2 bg-transparent"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={5}
            placeholder="Mô tả ngắn về sản phẩm..."
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Tags (phân tách bằng dấu phẩy)</label>
          <input
            className="w-full border rounded p-2 bg-transparent"
            placeholder="sofa, scandi, brown"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
        </div>

        {/* ✅ NEW: Màu sắc & Kích cỡ (CSV) */}
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm mb-1">Màu sắc (CSV)</label>
            <input
              className="w-full border rounded p-2 bg-transparent"
              placeholder="Đen, Trắng, Gỗ sồi"
              value={form.colorsText}
              onChange={(e) => setForm({ ...form, colorsText: e.target.value })}
            />
            <p className="text-xs opacity-70 mt-1">Ví dụ: <i>Đen, Trắng, Vàng cát</i></p>
          </div>
          <div>
            <label className="block text-sm mb-1">Kích cỡ (CSV)</label>
            <input
              className="w-full border rounded p-2 bg-transparent"
              placeholder="S, M, L hoặc 200x40x50 cm"
              value={form.sizesText}
              onChange={(e) => setForm({ ...form, sizesText: e.target.value })}
            />
            <p className="text-xs opacity-70 mt-1">Có thể nhập nhiều: <i>S, M, L</i> hoặc các quy ước khác.</p>
          </div>
        </div>

        {/* Upload khu vực – GIỮ NGUYÊN LOGIC CŨ */}
        <div className="grid md:grid-cols-3 gap-4 items-start">
          {/* Poster */}
          <div>
            <label className="block text-sm mb-1">Poster (ảnh đại diện)</label>
            <input type="file" accept="image/*" onChange={handleUploadPoster} />
            <div className="mt-2 w-44 h-28 border rounded overflow-hidden bg-white">
              <img
                src={posterPreview || form.poster || "/react.svg"}
                alt="poster"
                className="w-full h-full object-cover"
                onError={(e) => { e.currentTarget.src = "/react.svg"; }}
              />
            </div>
          </div>

          {/* Ảnh thường */}
          <div>
            <label className="block text-sm mb-1">Ảnh (có thể chọn nhiều)</label>
            <input type="file" accept="image/*" multiple onChange={handleUploadImages} />
            {!!form.images.length && (
              <div className="flex gap-2 mt-2 flex-wrap">
                {form.images.map((u, i) => (
                  <img key={i} src={u} className="w-16 h-16 object-cover border rounded" />
                ))}
              </div>
            )}
          </div>

          {/* Model 3D */}
          <div>
            <label className="block text-sm mb-1">Model 3D (.glb/.gltf) – tùy chọn</label>
            <input type="file" accept=".glb,.gltf" onChange={handleUploadModel} />
            {form.model3dUrl && <p className="text-xs mt-2 break-all">{form.model3dUrl}</p>}
          </div>
        </div>

        <div className="pt-2">
          <button
            disabled={busy || !canSave}
            className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
          >
            {busy ? "Đang lưu..." : "Lưu thay đổi"}
          </button>
          {msg && <span className="ml-3 text-sm">{msg}</span>}
        </div>
      </form>
    </section>
  );
}



