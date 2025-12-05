







// // src/pages/admin/AdminNewProduct.jsx
// // (giữ nguyên các import và comment của bạn)
// import { useState } from "react";
// import {
//   Card,
//   Form,
//   Input,
//   InputNumber,
//   Upload,
//   Button,
//   message,
//   Switch,
//   Typography,
//   Row,
//   Col,
// } from "antd";
// import { UploadOutlined } from "@ant-design/icons";

// const API = import.meta.env.VITE_API_URL || "http://localhost:8081/api";

// /** Upload 1 file (form-data key "file"). Trả về URL file trên server. */
// async function uploadFile(file, token) {
//   const fd = new FormData();
//   fd.append("file", file);

//   const res = await fetch(`${API}/uploads/file`, {
//     method: "POST",
//     headers: { Authorization: `Bearer ${token}` }, // KHÔNG tự set Content-Type
//     body: fd,
//   });

//   const ct = res.headers.get("content-type") || "";
//   const raw = await res.text();
//   let data = null;
//   if (ct.includes("application/json")) {
//     try { data = JSON.parse(raw); } catch {}
//   }
//   if (!res.ok) {
//     const msg = (data && (data.message || data.error)) || `${res.status} ${raw.slice(0, 160)}`;
//     throw new Error(msg);
//   }
//   if (!data?.url) throw new Error("Response không có url");
//   return data.url;
// }

// export default function AdminNewProduct() {
//   const [token, setToken] = useState(localStorage.getItem("token") || "");
//   const [posterPreview, setPosterPreview] = useState("");

//   const [form, setForm] = useState({
//     name: "",
//     price: "",
//     inStock: 0,            // ✅ dùng inStock thay vì stock
//     description: "",       // ✅ dùng description thay vì desc
//     category: "",
//     tags: "",
//     images: [],
//     poster: "",
//     model3dUrl: "",        // URL glb/gltf
//     is3D: false,

//     // ====== THÊM MỚI (chỉ UI, không đụng logic khác) ======
//     colorsCSV: "",         // nhập CSV -> mảng colors khi submit
//     sizesCSV: "",          // nhập CSV -> mảng sizes khi submit
//   });

//   const [busy, setBusy] = useState(false);
//   const [msg, setMsg] = useState("");

//   const handleUploadImages = async (e) => {
//     try {
//       setBusy(true);
//       const files = Array.from(e.target.files || []);
//       const urls = [];
//       for (const f of files) {
//         const u = await uploadFile(f, token);
//         urls.push(u);
//       }
//       setForm((s) => ({ ...s, images: [...s.images, ...urls] }));
//       setMsg(`Đã upload ${urls.length} ảnh`);
//     } catch (err) {
//       setMsg("Upload ảnh lỗi: " + err.message);
//     } finally {
//       setBusy(false);
//       e.target.value = "";
//     }
//   };

//   const handleUploadPoster = async (e) => {
//     const f = e.target.files?.[0];
//     if (!f) return;
//     const localUrl = URL.createObjectURL(f);
//     setPosterPreview(localUrl);
//     try {
//       setBusy(true);
//       const url = await uploadFile(f, token);
//       setForm((s) => ({ ...s, poster: url }));
//       setMsg("Đã upload poster");
//     } catch (err) {
//       setPosterPreview("");
//       setMsg("Upload poster lỗi: " + err.message);
//     } finally {
//       setBusy(false);
//       e.target.value = "";
//     }
//   };

//   const handleUploadModel = async (e) => {
//     const f = e.target.files?.[0];
//     if (!f) return;
//     try {
//       setBusy(true);
//       const url = await uploadFile(f, token);
//       // ✅ khi có model => bật is3D và gán URL
//       setForm((s) => ({ ...s, model3dUrl: url, is3D: true }));
//       setMsg("Đã upload model 3D");
//     } catch (err) {
//       setMsg("Upload 3D lỗi: " + err.message);
//     } finally {
//       setBusy(false);
//       e.target.value = "";
//     }
//   };

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setMsg("");
//     try {
//       setBusy(true);

//       const modelUrl = form.model3dUrl || "";

//       // ====== CHUYỂN CSV -> MẢNG (chỉ thêm 2 dòng khối này) ======
//       const colors = form.colorsCSV
//         ? form.colorsCSV.split(",").map(s => s.trim()).filter(Boolean)
//         : [];
//       const sizes = form.sizesCSV
//         ? form.sizesCSV.split(",").map(s => s.trim()).filter(Boolean)
//         : [];
//       // ===========================================================

//       const payload = {
//         name: form.name.trim(),
//         price: Number(form.price || 0),
//         inStock: Number(form.inStock || 0),            // ✅
//         description: form.description?.trim() || "",   // ✅
//         category: form.category,
//         tags: form.tags ? form.tags.split(",").map((s) => s.trim()).filter(Boolean) : [],
//         images: form.images,
//         poster: form.poster || form.images[0] || "",
//         // 🔥 gửi cả 2 trường để BE nào cũng nhận:
//         model3dUrl: modelUrl,
//         model3d: modelUrl,
//         is3D: Boolean(modelUrl), // tự quyết theo URL
//         isActive: true,

//         // ====== THÊM VÀO PAYLOAD (tùy chọn – BE không dùng thì cũng không sao) ======
//         colors,
//         sizes,
//       };

//       const res = await fetch(`${API}/products`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });
//       const data = await res.json();
//       if (!res.ok) throw new Error(data.message || "Tạo sản phẩm thất bại");

//       setMsg("✅ Đã tạo: " + data.name);

//       // 👉 Điều hướng đi xem ngay để test 3D (ưu tiên slug)
//       const idOrSlug = data.slug || data._id || data.id;
//       if (idOrSlug) {
//         window.location.href = `/products/${encodeURIComponent(idOrSlug)}`;
//         return;
//       }

//       // Nếu không có id/slug trả về thì reset form
//       setForm({
//         name: "",
//         price: "",
//         inStock: 0,
//         description: "",
//         category: "",
//         tags: "",
//         images: [],
//         poster: "",
//         model3dUrl: "",
//         is3D: false,

//         // reset thêm hai trường mới
//         colorsCSV: "",
//         sizesCSV: "",
//       });
//       setPosterPreview("");

//     } catch (err) {
//       setMsg("❌ " + err.message);
//     } finally {
//       setBusy(false);
//     }
//   };

//   return (
//     <section className="max-w-3xl mx-auto px-4 py-8">
//       <h2 className="text-2xl font-semibold mb-4">Admin • Tạo sản phẩm</h2>

//       <form onSubmit={onSubmit} className="admin-dark-form bg-white/5 rounded-2xl p-5">
//         <div className="grid grid-cols-2 gap-3">
//           <div>
//             <label className="block text-sm">Tên</label>
//             <input
//               className="w-full border rounded p-2"
//               value={form.name}
//               onChange={(e) => setForm({ ...form, name: e.target.value })}
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm">Giá (đ)</label>
//             <input
//               type="number"
//               className="w-full border rounded p-2"
//               value={form.price}
//               onChange={(e) => setForm({ ...form, price: e.target.value })}
//               required
//             />
//           </div>
//           <div>
//             <label className="block text-sm">Tồn kho</label>
//             <input
//               type="number"
//               className="w-full border rounded p-2"
//               value={form.inStock}
//               onChange={(e) => setForm({ ...form, inStock: e.target.value })}
//             />
//           </div>
//           <div>
//             <label className="block text-sm">Danh mục</label>
//             <input
//               className="w-full border rounded p-2"
//               value={form.category}
//               onChange={(e) => setForm({ ...form, category: e.target.value })}
//             />
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm">Mô tả</label>
//           <textarea
//             className="w-full border rounded p-2"
//             value={form.description}
//             onChange={(e) => setForm({ ...form, description: e.target.value })}
//             rows={3}
//           />
//         </div>

//         <div>
//           <label className="block text-sm">Tags (phân tách bằng dấu phẩy)</label>
//           <input
//             className="w-full border rounded p-2"
//             placeholder="sofa, scandi, brown"
//             value={form.tags}
//             onChange={(e) => setForm({ ...form, tags: e.target.value })}
//           />
//         </div>

//         {/* ====== UI mới: Màu sắc & Kích cỡ (CSV) – KHÔNG đổi layout cũ ====== */}
//         <div className="grid grid-cols-2 gap-3">
//           <div>
//             <label className="block text-sm">Màu sắc (CSV)</label>
//             <input
//               className="w-full border rounded p-2"
//               placeholder="Đen, Trắng, Nâu"
//               value={form.colorsCSV}
//               onChange={(e) => setForm({ ...form, colorsCSV: e.target.value })}
//             />
//             <p className="text-xs text-gray-500 mt-1">Ví dụ: Đen, Trắng, Nâu</p>
//           </div>
//           <div>
//             <label className="block text-sm">Kích cỡ / Kích thước (CSV)</label>
//             <input
//               className="w-full border rounded p-2"
//               placeholder="S, M, L hoặc 120x60, 180x80"
//               value={form.sizesCSV}
//               onChange={(e) => setForm({ ...form, sizesCSV: e.target.value })}
//             />
//             <p className="text-xs text-gray-500 mt-1">Ví dụ: S, M, L hoặc 120x60, 180x80</p>
//           </div>
//         </div>
//         {/* ================================================================ */}

//         <div className="grid md:grid-cols-3 gap-4 items-start">
//           {/* Poster */}
//           <div>
//             <label className="block text-sm">Poster (ảnh đại diện)</label>
//             <input type="file" accept="image/*" onChange={handleUploadPoster} />
//             <div className="mt-2 w-40 h-28 border rounded overflow-hidden bg-white">
//               <img
//                 src={posterPreview || form.poster || "/react.svg"}
//                 alt="poster"
//                 className="w-full h-full object-cover"
//                 onError={(e) => { e.currentTarget.src = "/react.svg"; }}
//               />
//             </div>
//           </div>

//           {/* Ảnh thường */}
//           <div>
//             <label className="block text-sm">Ảnh (có thể chọn nhiều)</label>
//             <input type="file" accept="image/*" multiple onChange={handleUploadImages} />
//             {!!form.images.length && (
//               <div className="flex gap-2 mt-2 flex-wrap">
//                 {form.images.map((u, i) => (
//                   <img key={i} src={u} className="w-16 h-16 object-cover border rounded" />
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Model 3D */}
//           <div>
//             <label className="block text-sm">Model 3D (.glb/.gltf) – tùy chọn</label>
//             <input type="file" accept=".glb,.gltf" onChange={handleUploadModel} />
//             {form.model3dUrl && <p className="text-xs mt-2 break-all">{form.model3dUrl}</p>}
//           </div>
//         </div>

//         <label className="inline-flex items-center gap-2">
//           <input
//             type="checkbox"
//             checked={form.is3D}
//             onChange={(e) => setForm({ ...form, is3D: e.target.checked })}
//           />
//           <span>Có model 3D</span>
//         </label>

//         <div className="flex items-center gap-3">
//           <button
//             disabled={busy || !token}
//             className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
//           >
//             {busy ? "Đang xử lý..." : "Tạo sản phẩm"}
//           </button>
//           {msg && <span className="text-sm">{msg}</span>}
//         </div>
//       </form>
//     </section>
//   );
// }//30//11




























// src/pages/admin/AdminNewProduct.jsx
// (giữ nguyên các import và comment của bạn)
import { useState } from "react";
import {
  Card,
  Form,
  Input,
  InputNumber,
  Upload,
  Button,
  message,
  Switch,
  Typography,
  Row,
  Col,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";

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

export default function AdminNewProduct() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [posterPreview, setPosterPreview] = useState("");

  const [form, setForm] = useState({
    name: "",
    price: "",
    inStock: 0,            // ✅ dùng inStock thay vì stock
    description: "",       // ✅ dùng description thay vì desc
    category: "",
    tags: "",
    images: [],
    poster: "",
    model3dUrl: "",        // URL glb/gltf
    is3D: false,

    // ====== THÊM MỚI (chỉ UI, không đụng logic khác) ======
    colorsCSV: "",         // nhập CSV -> mảng colors khi submit
    sizesCSV: "",          // nhập CSV -> mảng sizes khi submit
  });

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

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
      // ✅ khi có model => bật is3D và gán URL
      setForm((s) => ({ ...s, model3dUrl: url, is3D: true }));
      setMsg("Đã upload model 3D");
    } catch (err) {
      setMsg("Upload 3D lỗi: " + err.message);
    } finally {
      setBusy(false);
      e.target.value = "";
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      setBusy(true);

      const modelUrl = form.model3dUrl || "";

      // ====== CHUYỂN CSV -> MẢNG (chỉ thêm 2 dòng khối này) ======
      const colors = form.colorsCSV
        ? form.colorsCSV.split(",").map(s => s.trim()).filter(Boolean)
        : [];
      const sizes = form.sizesCSV
        ? form.sizesCSV.split(",").map(s => s.trim()).filter(Boolean)
        : [];
      // ===========================================================

      const payload = {
        name: form.name.trim(),
        price: Number(form.price || 0),
        inStock: Number(form.inStock || 0),            // ✅
        description: form.description?.trim() || "",   // ✅
        category: form.category,
        tags: form.tags ? form.tags.split(",").map((s) => s.trim()).filter(Boolean) : [],
        images: form.images,
        poster: form.poster || form.images[0] || "",
        // 🔥 gửi cả 2 trường để BE nào cũng nhận:
        model3dUrl: modelUrl,
        model3d: modelUrl,
        is3D: Boolean(modelUrl), // tự quyết theo URL
        isActive: true,

        // ====== THÊM VÀO PAYLOAD (tùy chọn – BE không dùng thì cũng không sao) ======
        colors,
        sizes,
      };

      const res = await fetch(`${API}/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Tạo sản phẩm thất bại");

      // setMsg("✅ Đã tạo: " + data.name);

      // // 👉 Điều hướng đi xem ngay để test 3D (ưu tiên slug)
      // const idOrSlug = data.slug || data._id || data.id;
      // if (idOrSlug) {
      //   window.location.href = `/products/${encodeURIComponent(idOrSlug)}`;
      //   return;
      // }

      // // Nếu không có id/slug trả về thì reset form
      // setForm({
      //   name: "",
      //   price: "",
      //   inStock: 0,
      //   description: "",
      //   category: "",
      //   tags: "",
      //   images: [],
      //   poster: "",
      //   model3dUrl: "",
      //   is3D: false,

      //   // reset thêm hai trường mới
      //   colorsCSV: "",
      //   sizesCSV: "",
      // });
      // setPosterPreview("");

      message.success("Đã tạo sản phẩm: " + data.name);

      // ⭐ Chuyển về trang admin/products
      navigate("/admin/products");


    } catch (err) {
      setMsg("❌ " + err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4">Admin • Tạo sản phẩm</h2>

      <form onSubmit={onSubmit} className="admin-dark-form bg-white/5 rounded-2xl p-5">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm">Tên</label>
            <input
              className="w-full border rounded p-2"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm">Giá (đ)</label>
            <input
              type="number"
              className="w-full border rounded p-2"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm">Tồn kho</label>
            <input
              type="number"
              className="w-full border rounded p-2"
              value={form.inStock}
              onChange={(e) => setForm({ ...form, inStock: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm">Danh mục</label>
            <input
              className="w-full border rounded p-2"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm">Mô tả</label>
          <textarea
            className="w-full border rounded p-2"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm">Tags (phân tách bằng dấu phẩy)</label>
          <input
            className="w-full border rounded p-2"
            placeholder="sofa, scandi, brown"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
          />
        </div>

        {/* ====== UI mới: Màu sắc & Kích cỡ (CSV) – KHÔNG đổi layout cũ ====== */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm">Màu sắc (CSV)</label>
            <input
              className="w-full border rounded p-2"
              placeholder="Đen, Trắng, Nâu"
              value={form.colorsCSV}
              onChange={(e) => setForm({ ...form, colorsCSV: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-1">Ví dụ: Đen, Trắng, Nâu</p>
          </div>
          <div>
            <label className="block text-sm">Kích cỡ / Kích thước (CSV)</label>
            <input
              className="w-full border rounded p-2"
              placeholder="S, M, L hoặc 120x60, 180x80"
              value={form.sizesCSV}
              onChange={(e) => setForm({ ...form, sizesCSV: e.target.value })}
            />
            <p className="text-xs text-gray-500 mt-1">Ví dụ: S, M, L hoặc 120x60, 180x80</p>
          </div>
        </div>
        {/* ================================================================ */}

        <div className="grid md:grid-cols-3 gap-4 items-start">
          {/* Poster */}
          <div>
            <label className="block text-sm">Poster (ảnh đại diện)</label>
            <input type="file" accept="image/*" onChange={handleUploadPoster} />
            <div className="mt-2 w-40 h-28 border rounded overflow-hidden bg-white">
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
            <label className="block text-sm">Ảnh (có thể chọn nhiều)</label>
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
            <label className="block text-sm">Model 3D (.glb/.gltf) – tùy chọn</label>
            <input type="file" accept=".glb,.gltf" onChange={handleUploadModel} />
            {form.model3dUrl && <p className="text-xs mt-2 break-all">{form.model3dUrl}</p>}
          </div>
        </div>

        <label className="inline-flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.is3D}
            onChange={(e) => setForm({ ...form, is3D: e.target.checked })}
          />
          <span>Có model 3D</span>
        </label>

        <div className="flex items-center gap-3">
          <button
            disabled={busy || !token}
            className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
          >
            {busy ? "Đang xử lý..." : "Tạo sản phẩm"}
          </button>
          {msg && <span className="text-sm">{msg}</span>}
        </div>
      </form>
    </section>
  );
}



