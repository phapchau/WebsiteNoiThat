
// import { useEffect, useMemo, useRef, useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useCart } from "../context/CartContext";
// import { vnd } from "../utils/format";
// import ImgSafe from "../components/ImgSafe";

// const API = import.meta.env.VITE_API_URL || "http://localhost:8081/api";

// // tiện ích đọc/ghi query string
// const useQuery = () => new URLSearchParams(useLocation().search);

// function toInt(v, def) {
//   const n = parseInt(v, 10);
//   return Number.isFinite(n) && n > 0 ? n : def;
// }

// export default function Products() {
//   const { addItem } = useCart();
//   const navigate = useNavigate();
//   const query = useQuery();

//   // --- state đọc từ URL (giữ được khi F5/chia sẻ link)
//   const [q, setQ] = useState(query.get("q") || "");
//   const [category, setCategory] = useState(query.get("category") || "");
//   const [minPrice, setMinPrice] = useState(query.get("min") || "");
//   const [maxPrice, setMaxPrice] = useState(query.get("max") || "");
//   const [sort, setSort] = useState(query.get("sort") || "newest"); // newest|price_asc|price_desc|name_asc
//   const [limit, setLimit] = useState(toInt(query.get("limit"), 12));
//   const [page, setPage] = useState(toInt(query.get("page"), 1));

//   // --- dữ liệu
//   const [items, setItems] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");

//   // --- debounce tìm kiếm
//   const typing = useRef();
//   useEffect(() => {
//     clearTimeout(typing.current);
//     typing.current = setTimeout(() => {
//       // khi thay đổi q, reset page về 1
//       setPage(1);
//       pushQueryToURL();
//     }, 350);
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [q]);

//   // --- mỗi khi filter/sort/limit/page đổi → cập nhật URL
//   useEffect(() => {
//     pushQueryToURL();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [category, minPrice, maxPrice, sort, limit, page]);

//   function pushQueryToURL() {
//     const p = new URLSearchParams();
//     if (q) p.set("q", q);
//     if (category) p.set("category", category);
//     if (minPrice) p.set("min", minPrice);
//     if (maxPrice) p.set("max", maxPrice);
//     if (sort && sort !== "newest") p.set("sort", sort);
//     if (limit !== 12) p.set("limit", String(limit));
//     if (page !== 1) p.set("page", String(page));
//     navigate({ search: p.toString() }, { replace: true });
//   }

//   // --- build URL gọi API (nếu BE bạn chưa hỗ trợ, backend sẽ bỏ qua các tham số này – không sao)
//   const apiUrl = useMemo(() => {
//     const p = new URLSearchParams();
//     p.set("page", String(page));
//     p.set("limit", String(limit));
//     if (q) p.set("q", q);
//     if (category) p.set("category", category);
//     if (minPrice) p.set("minPrice", minPrice);
//     if (maxPrice) p.set("maxPrice", maxPrice);
//     if (sort) p.set("sort", sort);
//     return `${API}/products?${p.toString()}`;
//   }, [q, category, minPrice, maxPrice, sort, page, limit]);

//   // --- fetch
//   useEffect(() => {
//     let stop = false;
//     setLoading(true);
//     fetch(apiUrl)
//       .then((r) => (r.ok ? r.json() : r.json().then((e) => Promise.reject(e))))
//       .then((data) => {
//         if (stop) return;
//         setItems(data.items || []);
//         setTotal(data.total || 0);
//         setErr("");
//       })
//       .catch((e) => setErr(e?.message || "Lỗi tải sản phẩm"))
//       .finally(() => !stop && setLoading(false));
//     return () => { stop = true; };
//   }, [apiUrl]);

//   // --- tính tổng số trang
//   const pages = Math.max(1, Math.ceil(total / limit));

//   // --- danh mục mock (tuỳ biến: có thể query từ /api/categories)
//   const categories = useMemo(() => [
//     { label: "Tất cả", value: "" },
//     { label: "Sofa", value: "sofa" },
//     { label: "Giường", value: "bed" },
//     { label: "Ghế", value: "chair" },
//     { label: "Bàn", value: "table" },
//     { label: "Tủ", value: "cabinet" }
//   ], []);

//   // --- sắp xếp hiển thị
//   const sorts = [
//     { label: "Mới nhất", value: "newest" },
//     { label: "Giá tăng dần", value: "price_asc" },
//     { label: "Giá giảm dần", value: "price_desc" },
//     { label: "Tên A→Z", value: "name_asc" }
//   ];

//   // --- skeleton card
//   const SkeletonCard = () => (
//     <div className="border rounded-2xl overflow-hidden bg-white animate-pulse">
//       <div className="w-full h-56 bg-gray-100" />
//       <div className="p-4 space-y-3">
//         <div className="h-4 bg-gray-200 rounded w-3/4" />
//         <div className="h-4 bg-gray-200 rounded w-1/3" />
//         <div className="h-8 bg-gray-100 rounded w-1/2" />
//       </div>
//     </div>
//   );

//   return (
//     <section>
//       {/* HEADER */}
//       <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-3 mb-4">
//         <h2 className="text-2xl font-semibold">Tất cả sản phẩm</h2>
//         <div className="text-sm text-gray-600">
//           {total ? `${total} sản phẩm` : (loading ? "Đang tải..." : "0 sản phẩm")}
//         </div>
//       </div>

//       {/* TOOLBAR: search + filters */}
//       <div className="grid grid-cols-1 md:grid-cols-12 gap-3 mb-5">
//         <div className="md:col-span-4">
//           <input
//             className="w-full border rounded-xl px-3 py-2"
//             placeholder="Tìm kiếm sản phẩm..."
//             value={q}
//             onChange={(e) => setQ(e.target.value)}
//           />
//         </div>

//         <div className="md:col-span-3">
//           <select
//             className="w-full border rounded-xl px-3 py-2 bg-white"
//             value={category}
//             onChange={(e) => { setCategory(e.target.value); setPage(1); }}
//           >
//             {categories.map((c) => (
//               <option key={c.value} value={c.value}>{c.label}</option>
//             ))}
//           </select>
//         </div>

//         <div className="md:col-span-3 flex gap-2">
//           <input
//             type="number"
//             className="w-full border rounded-xl px-3 py-2"
//             placeholder="Giá từ"
//             min={0}
//             value={minPrice}
//             onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
//           />
//           <input
//             type="number"
//             className="w-full border rounded-xl px-3 py-2"
//             placeholder="đến"
//             min={0}
//             value={maxPrice}
//             onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
//           />
//         </div>

//         <div className="md:col-span-2 flex gap-2">
//           <select
//             className="w-full border rounded-xl px-3 py-2 bg-white"
//             value={sort}
//             onChange={(e) => { setSort(e.target.value); setPage(1); }}
//           >
//             {sorts.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
//           </select>
//           <select
//             className="w-28 border rounded-xl px-3 py-2 bg-white"
//             value={limit}
//             onChange={(e) => { setLimit(toInt(e.target.value, 12)); setPage(1); }}
//           >
//             {[6, 12, 18, 24].map(sz => <option key={sz} value={sz}>{sz}/trang</option>)}
//           </select>
//         </div>
//       </div>

//       {/* LIST */}
//       {loading ? (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {Array.from({ length: limit }).map((_, i) => <SkeletonCard key={i} />)}
//         </div>
//       ) : items.length === 0 ? (
//         <div className="text-center py-16 border rounded-2xl bg-white">
//           <div className="text-5xl mb-3">🪑</div>
//           <div className="text-lg font-medium">Không tìm thấy sản phẩm phù hợp</div>
//           <div className="text-gray-600 mt-1">Hãy thử xoá bộ lọc hoặc đổi từ khoá tìm kiếm.</div>
//           <button
//             className="mt-4 px-4 py-2 rounded-xl border hover:bg-black hover:text-white transition"
//             onClick={() => {
//               setQ(""); setCategory(""); setMinPrice(""); setMaxPrice(""); setSort("newest"); setPage(1);
//             }}
//           >
//             Xoá bộ lọc
//           </button>
//         </div>
//       ) : (
//         <>
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             {items.map((p) => {
//               const img = p.poster || p.images?.[0] || "";
//               const slugOrId = p.slug || p._id;
//               return (
//                 <div key={p._id} className="border rounded-2xl overflow-hidden bg-white group">
//                   <Link to={`/products/${slugOrId}`} className="block">
//                     <ImgSafe
//                       src={img}
//                       alt={p.name}
//                       className="w-full h-56 object-cover bg-gray-100"
//                     />
//                   </Link>

//                   <div className="p-4">
//                     <Link to={`/products/${slugOrId}`} className="block">
//                       <h3 className="font-medium line-clamp-1 group-hover:underline">{p.name}</h3>
//                     </Link>
//                     <div className="text-gray-700 mt-1">{vnd(p.price)}</div>

//                     {/* mini-meta: còn hàng / tag 3D */}
//                     <div className="mt-1 text-xs text-gray-500 flex items-center gap-2">
//                       {typeof p.stock === "number" && (
//                         <span className={p.stock > 0 ? "text-emerald-600" : "text-red-600"}>
//                           {p.stock > 0 ? `Còn ${p.stock}` : "Hết hàng"}
//                         </span>
//                       )}
//                       {p.is3D && <span className="px-2 py-0.5 rounded-full border">3D</span>}
//                     </div>

//                     <div className="flex items-center gap-3 mt-4">
//                       <Link
//                         to={`/products/${slugOrId}`}
//                         className="rounded-xl border px-3 py-1 text-sm hover:bg-black hover:text-white transition"
//                       >
//                         Xem chi tiết
//                       </Link>
//                       <button
//                         className="rounded-xl border px-3 py-1 text-sm hover:bg-black hover:text-white transition"
//                         onClick={() =>
//                           addItem({ id: p._id, name: p.name, price: p.price, img, slug: slugOrId }, 1)
//                         }
//                       >
//                         Thêm giỏ
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* PAGINATION */}
//           <div className="flex items-center justify-center gap-2 mt-6">
//             <button
//               className="px-3 py-1 rounded border disabled:opacity-40"
//               disabled={page <= 1}
//               onClick={() => setPage((p) => Math.max(1, p - 1))}
//             >
//               ← Trước
//             </button>

//             {Array.from({ length: Math.min(pages, 7) }, (_, i) => {
//               // simple windowing: hiển thị tối đa 7 nút; có thể nâng cấp thành ellipsis
//               let start = Math.max(1, page - 3);
//               let end = Math.min(pages, start + 6);
//               start = Math.max(1, end - 6);
//               const n = start + i;
//               if (n > end) return null;
//               return (
//                 <button
//                   key={n}
//                   onClick={() => setPage(n)}
//                   className={`px-3 py-1 rounded ${n === page ? "bg-black text-white" : "bg-gray-200"}`}
//                 >
//                   {n}
//                 </button>
//               );
//             })}

//             <button
//               className="px-3 py-1 rounded border disabled:opacity-40"
//               disabled={page >= pages}
//               onClick={() => setPage((p) => Math.min(pages, p + 1))}
//             >
//               Sau →
//             </button>
//           </div>
//         </>
//       )}
//     </section>
//   );
// }12/11










// src/pages/Products.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { vnd } from "../utils/format";
import ImgSafe from "../components/ImgSafe";

const API = import.meta.env.VITE_API_URL || "http://localhost:8081/api";

// tiện ích đọc/ghi query string
const useQuery = () => new URLSearchParams(useLocation().search);

function toInt(v, def) {
  const n = parseInt(v, 10);
  return Number.isFinite(n) && n > 0 ? n : def;
}

export default function Products() {
  const { addItem } = useCart();
  const navigate = useNavigate();
  const query = useQuery();

  // --- state đọc từ URL (giữ được khi F5/chia sẻ link)
  const [q, setQ] = useState(query.get("q") || "");
  const [category, setCategory] = useState(query.get("category") || "");
  const [minPrice, setMinPrice] = useState(query.get("min") || "");
  const [maxPrice, setMaxPrice] = useState(query.get("max") || "");
  const [sort, setSort] = useState(query.get("sort") || "newest"); // newest|price_asc|price_desc|name_asc
  const [limit, setLimit] = useState(toInt(query.get("limit"), 12));
  const [page, setPage] = useState(toInt(query.get("page"), 1));

  // --- dữ liệu
  const [items, setItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // --- debounce tìm kiếm
  const typing = useRef();
  useEffect(() => {
    clearTimeout(typing.current);
    typing.current = setTimeout(() => {
      setPage(1);
      pushQueryToURL();
    }, 350);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  // --- mỗi khi filter/sort/limit/page đổi → cập nhật URL
  useEffect(() => {
    pushQueryToURL();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, minPrice, maxPrice, sort, limit, page]);

  function pushQueryToURL() {
    const p = new URLSearchParams();
    if (q) p.set("q", q);
    if (category) p.set("category", category);
    if (minPrice) p.set("min", minPrice);
    if (maxPrice) p.set("max", maxPrice);
    if (sort && sort !== "newest") p.set("sort", sort);
    if (limit !== 12) p.set("limit", String(limit));
    if (page !== 1) p.set("page", String(page));
    navigate({ search: p.toString() }, { replace: true });
  }

  // --- build URL gọi API (không thay đổi)
  const apiUrl = useMemo(() => {
    const p = new URLSearchParams();
    p.set("page", String(page));
    p.set("limit", String(limit));
    if (q) p.set("q", q);
    if (category) p.set("category", category);
    if (minPrice) p.set("minPrice", minPrice);
    if (maxPrice) p.set("maxPrice", maxPrice);
    if (sort) p.set("sort", sort);
    return `${API}/products?${p.toString()}`;
  }, [q, category, minPrice, maxPrice, sort, page, limit]);

  // --- fetch
  useEffect(() => {
    let stop = false;
    setLoading(true);
    fetch(apiUrl)
      .then((r) => (r.ok ? r.json() : r.json().then((e) => Promise.reject(e))))
      .then((data) => {
        if (stop) return;
        setItems(data.items || []);
        setTotal(data.total || 0);
        setErr("");
      })
      .catch((e) => setErr(e?.message || "Lỗi tải sản phẩm"))
      .finally(() => !stop && setLoading(false));
    return () => { stop = true; };
  }, [apiUrl]);

  // --- pages
  const pages = Math.max(1, Math.ceil(total / limit));

  // --- danh mục (giữ same)
  const categories = useMemo(() => [
    { label: "Tất cả", value: "" },
    { label: "Sofa", value: "sofa" },
    { label: "Giường", value: "giuong" },
    { label: "Ghế", value: "gh" },
    { label: "Bàn", value: "bn" },
    { label: "Đèn", value: "n" },
    { label: "Tủ", value: "tu" }
  ], []);

  const sorts = [
    { label: "Mới nhất", value: "newest" },
    { label: "Giá tăng dần", value: "price_asc" },
    { label: "Giá giảm dần", value: "price_desc" },
    { label: "Tên A→Z", value: "name_asc" }
  ];

  const GOLD = "#B88E2F";
  const GOLD_DARK = "#7f5f1d";
  const DARK = "#222";

  // Skeleton card (bigger)
  const SkeletonCard = () => (
    <div className="border rounded-2xl overflow-hidden bg-white animate-pulse shadow-sm">
      <div className="w-full h-80 bg-gray-100" />
      <div className="p-6 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
        <div className="h-10 bg-gray-100 rounded w-1/2" />
      </div>
    </div>
  );

  return (
    <section className="max-w-8xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
        <div>
          <h2 className="text-4xl font-extrabold" style={{ color: DARK }}>Sản phẩm</h2>
          <div className="text-base text-gray-600 mt-1">{total ? `${total} sản phẩm` : (loading ? "Đang tải..." : "0 sản phẩm")}</div>
        </div>

        <div className="flex items-center gap-3">
          {/* <div style={{
            background: "#fff",
            borderRadius: 12,
            padding: "8px 12px",
            boxShadow: "0 8px 24px rgba(11,11,11,0.06)"
          }}>
            <input
              className="w-96 border-0 outline-0"
              placeholder="Tìm kiếm sản phẩm..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
              style={{ fontSize: 16 }}
            />
          </div> */}

          <select
            className="border rounded-xl px-4 py-3"
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            style={{ minWidth: 180 }}
          >
            {sorts.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>

          <select
            className="border rounded-xl px-4 py-3"
            value={limit}
            onChange={(e) => { setLimit(toInt(e.target.value, 12)); setPage(1); }}
            style={{ minWidth: 120 }}
          >
            {[6, 12, 18, 24].map(sz => <option key={sz} value={sz}>{sz}/trang</option>)}
          </select>
        </div>
      </div>

      {/* Layout: sidebar left + grid right */}
      <div className="grid grid-cols-12 gap-8">
        {/* Sidebar (categories + filters) */}
        <aside className="col-span-12 lg:col-span-3">
          <div className="sticky top-24 space-y-5">
            <div className="bg-white rounded-2xl p-6 shadow-md" style={{ border: `1px solid ${GOLD}10` }}>
              <h3 className="font-semibold text-xl" style={{ color: GOLD_DARK }}>Danh mục</h3>
              <div className="mt-4 space-y-2">
                {categories.map(c => (
                  <button
                    key={c.value}
                    onClick={() => { setCategory(c.value); setPage(1); }}
                    className={`w-full text-left px-4 py-3 rounded-lg text-lg transition flex items-center justify-between ${category === c.value ? "shadow-inner" : "hover:bg-gray-50"}`}
                    style={{
                      background: category === c.value ? "linear-gradient(90deg,#fff8ea,#fff4df)" : "transparent",
                      border: category === c.value ? `1px solid ${GOLD}` : `1px solid transparent`,
                      fontWeight: category === c.value ? 700 : 500,
                    }}
                  >
                    <span>{c.label}</span>
                    {category === c.value && <span style={{ color: GOLD_DARK, fontSize: 13 }}>Đang chọn</span>}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md" style={{ border: `1px solid ${GOLD}10` }}>
              <h3 className="font-semibold text-xl" style={{ color: GOLD_DARK }}>Bộ lọc</h3>
              <div className="mt-4 space-y-3">
                <div>
                  <label className="text-sm text-gray-600 block mb-2">Giá từ (VNĐ)</label>
                  <input type="number" min={0} value={minPrice}
                    onChange={(e) => { setMinPrice(e.target.value); setPage(1); }}
                    className="w-full mt-1 border rounded-lg px-3 py-2" />
                </div>
                <div>
                  <label className="text-sm text-gray-600 block mb-2">đến</label>
                  <input type="number" min={0} value={maxPrice}
                    onChange={(e) => { setMaxPrice(e.target.value); setPage(1); }}
                    className="w-full mt-1 border rounded-lg px-3 py-2" />
                </div>
                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => { setMinPrice(""); setMaxPrice(""); setPage(1); }}
                    className="px-4 py-2 rounded-lg border"
                  >
                    Xoá
                  </button>
                  <button
                    onClick={() => setPage(1)}
                    className="px-4 py-2 rounded-lg text-white"
                    style={{ background: GOLD, borderColor: GOLD }}
                  >
                    Áp dụng
                  </button>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-md" style={{ border: `1px solid ${GOLD}10` }}>
              <h3 className="font-semibold text-lg" style={{ color: GOLD_DARK }}>Gợi ý</h3>
              <p className="text-sm text-gray-600">Chọn danh mục để xem nhanh, hoặc tìm kiếm trực tiếp theo tên sản phẩm.</p>
            </div>
          </div>
        </aside>

        {/* Main grid */}
        <main className="col-span-12 lg:col-span-9">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: limit }).map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-28 border rounded-2xl bg-white shadow-md">
              <div className="text-7xl mb-4">🪑</div>
              <div className="text-2xl font-semibold">Không tìm thấy sản phẩm phù hợp</div>
              <div className="text-gray-600 mt-2">Hãy thử bỏ bộ lọc hoặc đổi từ khoá tìm kiếm.</div>
              <div className="mt-6">
                <button
                  className="mt-4 px-6 py-3 rounded-xl border hover:bg-black hover:text-white transition"
                  onClick={() => {
                    setQ(""); setCategory(""); setMinPrice(""); setMaxPrice(""); setSort("newest"); setPage(1);
                  }}
                >
                  Xoá bộ lọc
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {items.map((p) => {
                  const img = p.poster || p.images?.[0] || "";
                  const slugOrId = p.slug || p._id;
                  return (
                    <div
                      key={p._id}
                      className="rounded-2xl overflow-hidden bg-white group shadow-xl transform hover:-translate-y-1 transition"
                      style={{ border: `1px solid #eee` }}
                    >
                      <Link to={`/products/${slugOrId}`} className="block">
                        <div className="w-full h-96 overflow-hidden bg-gray-100">
                          <ImgSafe
                            src={img}
                            alt={p.name}
                            className="w-full h-full object-cover transform group-hover:scale-105 transition"
                          />
                        </div>
                      </Link>

                      <div className="p-6">
                        <Link to={`/products/${slugOrId}`} className="block">
                          <h3 className="font-semibold line-clamp-2 text-2xl" style={{ color: DARK }}>{p.name}</h3>
                        </Link>
                        <div className="text-lg mt-3 font-extrabold" style={{ color: GOLD }}>
                          {vnd(p.price)}
                        </div>

                        <div className="mt-3 text-sm text-gray-500 flex items-center gap-3">
                          {typeof p.stock === "number" && (
                            <span className={p.stock > 0 ? "text-emerald-600" : "text-red-600"}>
                              {p.stock > 0 ? `Còn ${p.stock}` : "Hết hàng"}
                            </span>
                          )}
                          {p.is3D && <span className="px-2 py-0.5 rounded-full border text-xs">3D</span>}
                        </div>

                        <div className="flex items-center gap-4 mt-6 fx-push">
                          <Link
                            to={`/products/${slugOrId}`}
                            className="rounded-xl border px-5 py-3 text-sm hover:bg-black hover:text-white transition"
                            style={{ borderColor: "#eee" }}
                          >
                            Xem chi tiết
                          </Link>
                          <button
                            className="rounded-xl px-5 py-3 text-sm text-white fx-push"
                            style={{ background: GOLD, borderColor: GOLD }}
                            onClick={() =>
                              addItem({ id: p._id, name: p.name, price: p.price, img, slug: slugOrId }, 1)
                            }
                          >
                            Thêm giỏ
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-center gap-3 mt-10">
                <button
                  className="px-5 py-3 rounded-full border disabled:opacity-40"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                >
                  ← Trước
                </button>

                {/* windowed page buttons */}
                {(() => {
                  const maxButtons = 7;
                  let start = Math.max(1, page - 3);
                  let end = Math.min(pages, start + maxButtons - 1);
                  start = Math.max(1, end - maxButtons + 1);
                  const arr = [];
                  for (let n = start; n <= end; n += 1) arr.push(n);
                  return arr.map((n) => (
                    <button
                      key={n}
                      onClick={() => setPage(n)}
                      className={`px-5 py-3 rounded-full ${n === page ? "bg-black text-white" : "bg-gray-100"}`}
                      style={{ minWidth: 46 }}
                    >
                      {n}
                    </button>
                  ));
                })()}

                <button
                  className="px-5 py-3 rounded-full border disabled:opacity-40"
                  disabled={page >= pages}
                  onClick={() => setPage((p) => Math.min(pages, p + 1))}
                >
                  Sau →
                </button>
              </div>
            </>
          )}
        </main>
      </div>
    </section>
  );
}///16//11














// // src/pages/Products.jsx
// import { useEffect, useMemo, useRef, useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useCart } from "../context/CartContext";
// import { vnd } from "../utils/format";
// import ImgSafe from "../components/ImgSafe";
// import { Modal, Select, InputNumber, message } from "antd";

// const { Option } = Select;

// const API = import.meta.env.VITE_API_URL || "http://localhost:8081/api";

// // tiện ích đọc/ghi query string
// const useQuery = () => new URLSearchParams(useLocation().search);

// function toInt(v, def) {
//   const n = parseInt(v, 10);
//   return Number.isFinite(n) && n > 0 ? n : def;
// }

// export default function Products() {
//   const { addItem } = useCart();
//   const navigate = useNavigate();
//   const query = useQuery();

//   // --- state đọc từ URL
//   const [q, setQ] = useState(query.get("q") || "");
//   const [category, setCategory] = useState(query.get("category") || "");
//   const [minPrice, setMinPrice] = useState(query.get("min") || "");
//   const [maxPrice, setMaxPrice] = useState(query.get("max") || "");
//   const [sort, setSort] = useState(query.get("sort") || "newest");
//   const [limit, setLimit] = useState(toInt(query.get("limit"), 12));
//   const [page, setPage] = useState(toInt(query.get("page"), 1));

//   // --- dữ liệu
//   const [items, setItems] = useState([]);
//   const [total, setTotal] = useState(0);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");

//   // --- Modal chọn thuộc tính
//   const [modalVisible, setModalVisible] = useState(false);
//   const [modalProduct, setModalProduct] = useState(null);
//   const [selectedColor, setSelectedColor] = useState("");
//   const [selectedSize, setSelectedSize] = useState("");
//   const [quantity, setQuantity] = useState(1);

//   // --- debounce tìm kiếm
//   const typing = useRef();
//   useEffect(() => {
//     clearTimeout(typing.current);
//     typing.current = setTimeout(() => {
//       setPage(1);
//       pushQueryToURL();
//     }, 350);
//   }, [q]);

//   // --- mỗi khi filter/sort/limit/page đổi → cập nhật URL
//   useEffect(() => {
//     pushQueryToURL();
//   }, [category, minPrice, maxPrice, sort, limit, page]);

//   function pushQueryToURL() {
//     const p = new URLSearchParams();
//     if (q) p.set("q", q);
//     if (category) p.set("category", category);
//     if (minPrice) p.set("min", minPrice);
//     if (maxPrice) p.set("max", maxPrice);
//     if (sort && sort !== "newest") p.set("sort", sort);
//     if (limit !== 12) p.set("limit", String(limit));
//     if (page !== 1) p.set("page", String(page));
//     navigate({ search: p.toString() }, { replace: true });
//   }

//   const apiUrl = useMemo(() => {
//     const p = new URLSearchParams();
//     p.set("page", String(page));
//     p.set("limit", String(limit));
//     if (q) p.set("q", q);
//     if (category) p.set("category", category);
//     if (minPrice) p.set("minPrice", minPrice);
//     if (maxPrice) p.set("maxPrice", maxPrice);
//     if (sort) p.set("sort", sort);
//     return `${API}/products?${p.toString()}`;
//   }, [q, category, minPrice, maxPrice, sort, page, limit]);

//   useEffect(() => {
//     let stop = false;
//     setLoading(true);
//     fetch(apiUrl)
//       .then((r) => (r.ok ? r.json() : r.json().then((e) => Promise.reject(e))))
//       .then((data) => {
//         if (stop) return;
//         setItems(data.items || []);
//         setTotal(data.total || 0);
//         setErr("");
//       })
//       .catch((e) => setErr(e?.message || "Lỗi tải sản phẩm"))
//       .finally(() => !stop && setLoading(false));
//     return () => { stop = true; };
//   }, [apiUrl]);

//   const pages = Math.max(1, Math.ceil(total / limit));

//   const categories = useMemo(() => [
//     { label: "Tất cả", value: "" },
//     { label: "Sofa", value: "sofa" },
//     { label: "Giường", value: "giuong" },
//     { label: "Ghế", value: "gh" },
//     { label: "Đèn", value: "n" },
//     { label: "Tủ", value: "tu" }
//   ], []);

//   const sorts = [
//     { label: "Mới nhất", value: "newest" },
//     { label: "Giá tăng dần", value: "price_asc" },
//     { label: "Giá giảm dần", value: "price_desc" },
//     { label: "Tên A→Z", value: "name_asc" }
//   ];

//   const GOLD = "#B88E2F";
//   const GOLD_DARK = "#7f5f1d";
//   const DARK = "#222";

//   const SkeletonCard = () => (
//     <div className="border rounded-2xl overflow-hidden bg-white animate-pulse shadow-sm">
//       <div className="w-full h-80 bg-gray-100" />
//       <div className="p-6 space-y-3">
//         <div className="h-5 bg-gray-200 rounded w-3/4" />
//         <div className="h-4 bg-gray-200 rounded w-1/3" />
//         <div className="h-10 bg-gray-100 rounded w-1/2" />
//       </div>
//     </div>
//   );

//   // --- Thêm vào giỏ (check thuộc tính)
//   function handleAddToCart(p) {
//     if ((p.colors?.length > 0) || (p.sizes?.length > 0)) {
//       setModalProduct(p);
//       setSelectedColor("");
//       setSelectedSize("");
//       setQuantity(1);
//       setModalVisible(true);
//     } else {
//       addItem({
//         id: p._id,
//         name: p.name,
//         price: p.price,
//         img: p.poster || p.images?.[0],
//         slug: p.slug || p._id
//       }, 1);
//       message.success("Đã thêm vào giỏ");
//     }
//   }

//   return (
//     <section className="max-w-8xl mx-auto px-6 py-12">
//       {/* Header & Filters */}
//       <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
//         <div>
//           <h2 className="text-4xl font-extrabold" style={{ color: DARK }}>Sản phẩm</h2>
//           <div className="text-base text-gray-600 mt-1">{total ? `${total} sản phẩm` : (loading ? "Đang tải..." : "0 sản phẩm")}</div>
//         </div>
//         <div className="flex items-center gap-3">
//           <select className="border rounded-xl px-4 py-3" value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }} style={{ minWidth: 180 }}>
//             {sorts.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
//           </select>
//           <select className="border rounded-xl px-4 py-3" value={limit} onChange={(e) => { setLimit(toInt(e.target.value, 12)); setPage(1); }} style={{ minWidth: 120 }}>
//             {[6, 12, 18, 24].map(sz => <option key={sz} value={sz}>{sz}/trang</option>)}
//           </select>
//         </div>
//       </div>

//       {/* Grid sản phẩm */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
//         {loading ? Array.from({ length: limit }).map((_, i) => <SkeletonCard key={i} />)
//           : items.map(p => {
//             const img = p.poster || p.images?.[0] || "";
//             const slugOrId = p.slug || p._id;
//             return (
//               <div key={p._id} className="rounded-2xl overflow-hidden bg-white group shadow-xl transform hover:-translate-y-1 transition" style={{ border: `1px solid #eee` }}>
//                 <Link to={`/products/${slugOrId}`} className="block">
//                   <div className="w-full h-96 overflow-hidden bg-gray-100">
//                     <ImgSafe src={img} alt={p.name} className="w-full h-full object-cover transform group-hover:scale-105 transition" />
//                   </div>
//                 </Link>
//                 <div className="p-6">
//                   <Link to={`/products/${slugOrId}`} className="block">
//                     <h3 className="font-semibold line-clamp-2 text-2xl" style={{ color: DARK }}>{p.name}</h3>
//                   </Link>
//                   <div className="text-lg mt-3 font-extrabold" style={{ color: GOLD }}>{vnd(p.price)}</div>
//                   <div className="flex items-center gap-4 mt-6">
//                     <button className="rounded-xl px-5 py-3 text-sm text-white" style={{ background: GOLD, borderColor: GOLD }} onClick={() => handleAddToCart(p)}>
//                       Thêm giỏ
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//       </div>

//       {/* Modal chọn thuộc tính */}
//       {modalProduct && (
//         <Modal
//           title={`Chọn thuộc tính - ${modalProduct.name}`}
//           open={modalVisible}
//           onCancel={() => setModalVisible(false)}
//           onOk={() => {
//             if ((modalProduct.colors?.length > 0 && !selectedColor) ||
//                 (modalProduct.sizes?.length > 0 && !selectedSize)) {
//               message.error("Vui lòng chọn đầy đủ màu sắc và kích thước");
//               return;
//             }
//             addItem({
//               id: modalProduct._id,
//               name: modalProduct.name,
//               price: modalProduct.price,
//               img: modalProduct.poster || modalProduct.images?.[0],
//               slug: modalProduct.slug || modalProduct._id,
//               color: selectedColor,
//               size: selectedSize
//             }, quantity);
//             message.success("Đã thêm vào giỏ");
//             setModalVisible(false);
//           }}
//         >
//           {modalProduct.colors?.length > 0 && (
//             <div className="mb-4">
//               <label>Màu sắc</label>
//               <Select value={selectedColor} style={{ width: "100%" }} onChange={setSelectedColor}>
//                 {modalProduct.colors.map(c => <Option key={c} value={c}>{c}</Option>)}
//               </Select>
//             </div>
//           )}
//           {modalProduct.sizes?.length > 0 && (
//             <div className="mb-4">
//               <label>Kích thước</label>
//               <Select value={selectedSize} style={{ width: "100%" }} onChange={setSelectedSize}>
//                 {modalProduct.sizes.map(s => <Option key={s} value={s}>{s}</Option>)}
//               </Select>
//             </div>
//           )}
//           <div className="mb-2">
//             <label>Số lượng</label>
//             <InputNumber min={1} value={quantity} onChange={setQuantity} style={{ width: "100%" }} />
//           </div>
//         </Modal>
//       )}
//     </section>
//   );
// }




