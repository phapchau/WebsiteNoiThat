






// // src/pages/ProductDetail.jsx
// import { useEffect, useMemo, useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { vnd } from "../utils/format";
// import { useCart } from "../context/CartContext";
// import ImgSafe from "../components/ImgSafe";
// import ModelViewer from "../components/ModelViewer";
// import axiosClient from "../services/axiosClient";

// const API = import.meta.env.VITE_API_URL || "http://localhost:8081/api";
// const ORIGIN = import.meta.env.VITE_API_ORIGIN || "http://localhost:8081";

// // ================= Utils =================
// const normalize = (u) => {
//   if (u == null) return "";
//   const s = String(u).trim();
//   if (!s) return "";
//   if (/^https?:\/\//i.test(s)) return s;
//   const path = s.startsWith("/") ? s : "/" + s;
//   return `${ORIGIN}${path}`.replace(/([^:]\/)\/+/g, "$1");
// };
// const csvToList = (v) => {
//   if (!v) return [];
//   const raw = Array.isArray(v) ? v : String(v).split(",");
//   const uniq = new Map();
//   raw.map((s) => String(s).trim()).filter(Boolean).forEach((x) => {
//     const key = x.toLowerCase();
//     if (!uniq.has(key)) uniq.set(key, x);
//   });
//   return Array.from(uniq.values());
// };

// export default function ProductDetail() {
//   const { idOrSlug } = useParams();
//   const navigate = useNavigate();
//   const { addItem } = useCart();

//   const [p, setP] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");
//   const [show3D, setShow3D] = useState(false);
//   const [qty, setQty] = useState(1);
//   const [activeImg, setActiveImg] = useState("");
//   const [selectedColor, setSelectedColor] = useState("");
//   const [selectedSize, setSelectedSize] = useState("");

//   // similar products
//   const [similar, setSimilar] = useState([]);
//   const [simLoading, setSimLoading] = useState(false);

//   // reviews
//   const [reviews, setReviews] = useState([]);
//   const [revLoading, setRevLoading] = useState(false);
//   const [showAllReviews, setShowAllReviews] = useState(false);

//   // Load sản phẩm
//   useEffect(() => {
//     if (!idOrSlug) {
//       setErr("Thiếu tham số idOrSlug");
//       setLoading(false);
//       return;
//     }
//     let stop = false;
//     setLoading(true);

//     fetch(`${API}/products/${encodeURIComponent(idOrSlug)}`)
//       .then((r) => (r.ok ? r.json() : r.json().then((e) => Promise.reject(e))))
//       .then((data) => {
//         if (!stop) {
//           setP(data);
//           setErr("");
//           setShow3D(false);
//           const first = normalize(data.poster) || normalize(data.images?.[0]) || "";
//           setActiveImg(first);
//           setQty(1);
//           setSelectedColor("");
//           setSelectedSize("");
//         }
//       })
//       .catch((e) => setErr(e?.message || "Không tìm thấy sản phẩm"))
//       .finally(() => !stop && setLoading(false));

//     return () => { stop = true; };
//   }, [idOrSlug]);

//   // Load reviews
//   const loadReviews = async (productId) => {
//     if (!productId) return;
//     try {
//       setRevLoading(true);
//       const res = await axiosClient.get(`/api/products/${productId}/reviews`);
//       const data = res.data;
//       let list = [];
//       if (Array.isArray(data)) list = data;
//       else if (Array.isArray(data.reviews)) list = data.reviews;
//       else if (Array.isArray(data.items)) list = data.items;
//       else if (Array.isArray(data.data)) list = data.data;
//       setReviews(list);
//     } catch (err) {
//       console.error("ERROR loading reviews:", err);
//       setReviews([]);
//     } finally {
//       setRevLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!p?._id) return;
//     loadReviews(p._id);
//   }, [p]);

//   // Load similar products
//   useEffect(() => {
//     if (!p) {
//       setSimilar([]);
//       return;
//     }
//     let stop = false;
//     (async () => {
//       try {
//         setSimLoading(true);
//         const url = p.category
//           ? `${API}/products?category=${encodeURIComponent(p.category)}&limit=50`
//           : `${API}/products?limit=50`;
//         const res = await fetch(url);
//         const data = await res.json();
//         const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
//         const ranked = items
//           .filter((it) => String(it._id) !== String(p._id))
//           .slice(0, 8);
//         if (!stop) setSimilar(ranked);
//       } catch {
//         if (!stop) setSimilar([]);
//       } finally {
//         if (!stop) setSimLoading(false);
//       }
//     })();
//     return () => { stop = true; };
//   }, [p]);

//   const images = useMemo(() => {
//     if (!p) return [];
//     const arr = [p.poster ? normalize(p.poster) : "", ...(Array.isArray(p.images) ? p.images.map(normalize) : [])].filter(Boolean);
//     return Array.from(new Set(arr));
//   }, [p]);

//   const colorList = useMemo(() => {
//     if (!p) return [];
//     return csvToList(p.colors ?? p.colorOptions ?? p.colorsCSV ?? p.color ?? "");
//   }, [p]);
//   const sizeList = useMemo(() => {
//     if (!p) return [];
//     return csvToList(p.sizes ?? p.sizeOptions ?? p.sizesCSV ?? p.size ?? "");
//   }, [p]);

//   const inStockNum = Number(p?.stock ?? p?.inStock ?? 0);
//   const inStock = inStockNum > 0;
//   const modelUrl = normalize(p?.model3dUrl ?? p?.model3d ?? "");
//   const can3D = Boolean(modelUrl);

//   const clampQty = (n) => Math.max(1, Math.min(inStockNum || 99, n));
//   const increase = () => setQty((n) => clampQty(Number(n || 1) + 1));
//   const decrease = () => setQty((n) => clampQty(Number(n || 1) - 1));
//   const onChangeQty = (e) => {
//     const n = Math.floor(Number(e.target.value));
//     setQty(clampQty(Number.isNaN(n) ? 1 : n));
//   };

//   const handleAddToCart = () => {
//     if (colorList.length && !selectedColor) {
//       alert("Vui lòng chọn màu sắc trước khi thêm vào giỏ hàng.");
//       return;
//     }
//     if (sizeList.length && !selectedSize) {
//       alert("Vui lòng chọn kích cỡ trước khi thêm vào giỏ hàng.");
//       return;
//     }
//     const img = activeImg || normalize(p.poster) || normalize(p.images?.[0]) || "";
//     addItem({ id: p._id, name: p.name, price: p.price, img, slug: p.slug || p._id, color: selectedColor || "", size: selectedSize || "" }, qty);
//   };
//   const handleBuyNow = () => { handleAddToCart(); navigate("/checkout"); };

//   // Hiển thị reviews
//   const visibleReviews = showAllReviews ? reviews : reviews.slice(0, 3);

//   // ==== RENDER ====
//   if (loading) return <div className="max-w-7xl mx-auto px-4 py-10 text-center">Đang tải...</div>;
//   if (err || !p) return <div className="max-w-7xl mx-auto px-4 py-10 text-center">⚠ {err || "Không tìm thấy sản phẩm."}</div>;

//   return (
//     <section className="max-w-7xl mx-auto px-4 py-8 md:py-10">
//       {/* Breadcrumb */}
//       <nav className="text-sm text-gray-500 mb-4 md:mb-6">
//         <Link className="hover:underline" to="/">Trang chủ</Link>
//         <span className="mx-2">/</span>
//         <Link className="hover:underline" to="/products">Sản phẩm</Link>
//         {p.category && <>
//           <span className="mx-2">/</span>
//           <Link className="hover:underline" to={`/products?category=${encodeURIComponent(p.category)}`}>{p.category}</Link>
//         </>}
//         <span className="mx-2">/</span>
//         <span className="text-gray-700">{p.name}</span>
//       </nav>

//       <div className="grid lg:grid-cols-2 gap-8">
//         {/* MEDIA */}
//         <div className="relative w-full rounded-2xl overflow-hidden bg-white shadow">
//           <div className="w-full h-[72vh] min-h-[540px]">
//             {show3D && can3D ? <ModelViewer url={modelUrl} className="w-full h-full" cameraControls autoRotate={false} /> :
//               <ImgSafe src={activeImg} alt={p.name} className="w-full h-full object-contain bg-gray-50" />}
//           </div>
//           {can3D && <button type="button" onClick={() => setShow3D(v => !v)} className="absolute top-3 right-3 rounded-xl border px-4 py-2 bg-white/90 backdrop-blur hover:bg-black hover:text-white transition">{show3D ? "Ảnh" : "Xem 3D"}</button>}
//         </div>

//         {/* INFO */}
//         <div className="lg:pl-2">
//           <h1 className="text-2xl md:text-3xl font-semibold">{p.name}</h1>
//           <div className="mt-2 flex items-center gap-3 text-sm text-gray-600">
//             <span className="inline-flex -ml-1">{"★★★★"}<span className="text-gray-300">★</span></span>
//             <span>{(p.avgRating && p.avgRating.toFixed ? p.avgRating.toFixed(1) : "4.5")} • {reviews.length} đánh giá</span>
//             <span className={inStock ? "text-emerald-600" : "text-red-600"}>{inStock ? `Còn hàng (${inStockNum})` : "Hết hàng"}</span>
//           </div>
//           <div className="text-2xl md:text-3xl mt-3">{vnd(p.price)}</div>

//           {p.desc && <p className="text-gray-700 mt-4 leading-relaxed whitespace-pre-line">{p.desc}</p>}

//           {/* Chọn màu & size */}
//           {(colorList.length || sizeList.length) > 0 && <div className="mt-6 space-y-4">
//             {colorList.length > 0 && <div>
//               <div className="text-sm text-gray-500 mb-1.5">Chọn màu sắc:</div>
//               <div className="flex flex-wrap gap-2">{colorList.map((c, i) => <button key={i} type="button" onClick={() => setSelectedColor(c)} className={`px-3 py-1.5 rounded-full border transition ${selectedColor === c ? "bg-black text-white border-black" : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"}`}>{c}</button>)}</div>
//             </div>}
//             {sizeList.length > 0 && <div>
//               <div className="text-sm text-gray-500 mb-1.5">Chọn kích cỡ:</div>
//               <div className="flex flex-wrap gap-2">{sizeList.map((s, i) => <button key={i} type="button" onClick={() => setSelectedSize(s)} className={`px-3 py-1.5 rounded-full border transition ${selectedSize === s ? "bg-black text-white border-black" : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"}`}>{s}</button>)}</div>
//             </div>}
//           </div>}

//           {/* Thumbnails */}
//           {images.length > 1 && !show3D && <div className="flex gap-2 mt-5 flex-wrap">{images.map((u, i) => <button key={i} type="button" className={`border rounded-xl p-1 transition ${activeImg === u ? "border-black" : "border-gray-200 hover:border-gray-400"}`} onClick={() => setActiveImg(u)}><ImgSafe src={u} alt="" className="w-20 h-20 object-cover rounded-lg bg-gray-100" /></button>)}</div>}

//           {/* Actions */}
//           <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
//             <div className="flex items-center border rounded-xl overflow-hidden w-max">
//               <button onClick={decrease} className="px-3 py-2 hover:bg-gray-100">−</button>
//               <input type="number" className="w-16 text-center outline-none py-2" value={qty} min={1} max={inStockNum || 99} onChange={onChangeQty} />
//               <button onClick={increase} className="px-3 py-2 hover:bg-gray-100">+</button>
//             </div>
//             <div className="flex gap-3">
//               <button disabled={!inStock} onClick={handleAddToCart} className="rounded-xl border px-5 py-3 hover:bg-black hover:text-white transition disabled:opacity-40">Thêm vào giỏ</button>
//               <button disabled={!inStock} onClick={handleBuyNow} className="rounded-xl px-5 py-3 bg-black text-white hover:opacity-90 transition disabled:opacity-40">Mua ngay</button>
//             </div>
//           </div>
//         </div>
//       </div>
// {/* Review Section */}
// <div className="mt-10">
//   <div className="flex items-center justify-between mb-3">
//     <h2 className="text-xl font-semibold">Đánh giá từ người dùng</h2>
//   </div>

//   {revLoading ? (
//     <p className="text-gray-500 text-sm">Đang tải đánh giá…</p>
//   ) : reviews.length === 0 ? (
//     <p className="text-gray-500 text-sm">Chưa có đánh giá nào.</p>
//   ) : (
//     <>
//       <div className="space-y-4">
//         {visibleReviews.map((rv, i) => (
//           <div key={i} className="border rounded-xl p-4 bg-white shadow-sm">
//             <div className="flex items-center gap-2">
//               <span className="text-yellow-500">
//                 {"★".repeat(rv.rating)}{"☆".repeat(5 - rv.rating)}
//               </span>
//               <span className="text-sm text-gray-400">
//                 {rv.createdAt ? new Date(rv.createdAt).toLocaleDateString("vi-VN") : ""}
//               </span>
//             </div>

//             <p className="mt-2 text-gray-700">{rv.comment}</p>

//             {/* Carousel ảnh đánh giá */}
//             {Array.isArray(rv.images) && rv.images.length > 0 && (
//               <div className="flex gap-2 mt-2 overflow-x-auto">
//                 {rv.images.map((img, idx) => {
//                   const url = /^https?:\/\//i.test(img) ? img : `${ORIGIN}${img.startsWith("/") ? img : "/" + img}`;
//                   return (
//                     <img
//                       key={idx}
//                       src={url}
//                       alt={`review-${idx}`}
//                       className="w-24 h-24 object-cover rounded-xl border flex-shrink-0"
//                     />
//                   );
//                 })}
//               </div>
//             )}

//             {rv.user?.name && <p className="text-xs text-gray-500 mt-1">– {rv.user.name}</p>}
//           </div>
//         ))}
//       </div>

//       {reviews.length > 3 && (
//         <div className="mt-4 text-center">
//           <button
//             className="px-4 py-2 border rounded-xl hover:bg-gray-100 transition"
//             onClick={() => setShowAllReviews(!showAllReviews)}
//           >
//             {showAllReviews ? "Thu gọn" : "Xem thêm đánh giá"}
//           </button>
//         </div>
//       )}
//     </>
//   )}
// </div>


//       {/* Similar Products */}
//       {(simLoading || similar.length > 0) && <div className="mt-10">
//         <h2 className="text-xl font-semibold mb-4">Gợi ý sản phẩm tương tự</h2>
//         {simLoading ? <div className="text-gray-500 text-sm">Đang gợi ý…</div> :
//           <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//             {similar.map((sp) => {
//               const img = normalize(sp.poster || sp.images?.[0] || "");
//               return (
//                 <Link key={sp._id} to={`/products/${encodeURIComponent(sp.slug || sp._id)}`} className="group rounded-2xl border bg-white hover:shadow transition overflow-hidden">
//                   <div className="aspect-[4/3] bg-gray-50"><ImgSafe src={img} alt={sp.name} className="w-full h-full object-cover" /></div>
//                   <div className="p-3">
//                     <div className="font-medium line-clamp-1 group-hover:underline">{sp.name}</div>
//                     <div className="text-sm text-gray-600 mt-1">{vnd(sp.price)}</div>
//                   </div>
//                 </Link>
//               )
//             })}
//           </div>
//         }
//       </div>}

//     </section>
//   );
// }///16/11 new 2














// // src/pages/ProductDetail.jsx
// import { useEffect, useMemo, useState } from "react";
// import { Link, useNavigate, useParams } from "react-router-dom";
// import { vnd } from "../utils/format";
// import { useCart } from "../context/CartContext";
// import ImgSafe from "../components/ImgSafe";
// import ModelViewer from "../components/ModelViewer";
// import axiosClient from "../services/axiosClient";

// const API = import.meta.env.VITE_API_URL || "http://localhost:8081/api";
// const ORIGIN = import.meta.env.VITE_API_ORIGIN || "http://localhost:8081";

// const normalize = (u) => {
//   if (!u) return "";
//   const s = String(u).trim();
//   if (!s) return "";
//   if (/^https?:\/\//i.test(s)) return s;
//   const path = s.startsWith("/") ? s : "/" + s;
//   return `${ORIGIN}${path}`.replace(/([^:]\/)\/+/g, "$1");
// };

// const csvToList = (v) => {
//   if (!v) return [];
//   const raw = Array.isArray(v) ? v : String(v).split(",");
//   const uniq = new Map();
//   raw.map((s) => String(s).trim()).filter(Boolean).forEach((x) => {
//     const key = x.toLowerCase();
//     if (!uniq.has(key)) uniq.set(key, x);
//   });
//   return Array.from(uniq.values());
// };

// export default function ProductDetail() {
//   const { idOrSlug } = useParams();
//   const navigate = useNavigate();
//   const { addItem } = useCart();

//   const [p, setP] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");
//   const [show3D, setShow3D] = useState(false);
//   const [qty, setQty] = useState(1);
//   const [activeImg, setActiveImg] = useState("");
//   const [selectedColor, setSelectedColor] = useState("");
//   const [selectedSize, setSelectedSize] = useState("");

//   const [reviews, setReviews] = useState([]);
//   const [revLoading, setRevLoading] = useState(false);
//   const [showAllReviews, setShowAllReviews] = useState(false);
//   const [similar, setSimilar] = useState([]);
//   const [simLoading, setSimLoading] = useState(false);

//   useEffect(() => {
//     if (!idOrSlug) return setErr("Thiếu tham số idOrSlug");
//     let stop = false;
//     setLoading(true);

//     fetch(`${API}/products/${encodeURIComponent(idOrSlug)}`)
//       .then((r) => (r.ok ? r.json() : r.json().then((e) => Promise.reject(e))))
//       .then((data) => {
//         if (stop) return;
//         setP(data);
//         setErr("");
//         setShow3D(false);
//         const first = normalize(data.poster) || normalize(data.images?.[0]) || "";
//         setActiveImg(first);
//         setQty(1);
//         setSelectedColor("");
//         setSelectedSize("");
//       })
//       .catch((e) => setErr(e?.message || "Không tìm thấy sản phẩm"))
//       .finally(() => !stop && setLoading(false));

//     return () => { stop = true; };
//   }, [idOrSlug]);

//   const loadReviews = async (productId) => {
//     setRevLoading(true);
//     try {
//       const res = await axiosClient.get(`/api/products/${productId}/reviews`);
//       setReviews(res.data?.reviews || []);
//     } catch {
//       setReviews([]);
//     } finally {
//       setRevLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!p?._id) return;
//     loadReviews(p._id);
//   }, [p]);

//   useEffect(() => {
//     if (!p?._id) return;
//     const refresh = localStorage.getItem("refresh-product");
//     if (refresh === p._id) {
//       loadReviews(p._id);
//       localStorage.removeItem("refresh-product");
//     }
//   }, [p]);

//   useEffect(() => {
//     if (!p) return setSimilar([]);
//     let stop = false;
//     (async () => {
//       try {
//         setSimLoading(true);
//         const url = p.category
//           ? `${API}/products?category=${encodeURIComponent(p.category)}&limit=50`
//           : `${API}/products?limit=50`;
//         const res = await fetch(url);
//         const data = await res.json();
//         const items = Array.isArray(data?.items) ? data.items : Array.isArray(data) ? data : [];
//         if (!stop) setSimilar(items.filter((i) => String(i._id) !== String(p._id)).slice(0, 8));
//       } catch {
//         if (!stop) setSimilar([]);
//       } finally {
//         if (!stop) setSimLoading(false);
//       }
//     })();
//     return () => { stop = true; };
//   }, [p]);

//   const images = useMemo(() => {
//     if (!p) return [];
//     const arr = [p.poster ? normalize(p.poster) : "", ...(Array.isArray(p.images) ? p.images.map(normalize) : [])].filter(Boolean);
//     return Array.from(new Set(arr));
//   }, [p]);

//   const colorList = useMemo(() => csvToList(p?.colors ?? p?.colorOptions ?? p?.colorsCSV ?? p?.color ?? ""), [p]);
//   const sizeList = useMemo(() => csvToList(p?.sizes ?? p?.sizeOptions ?? p?.sizesCSV ?? p?.size ?? ""), [p]);

//   const inStockNum = Number(p?.stock ?? p?.inStock ?? 0);
//   const inStock = inStockNum > 0;
//   const modelUrl = normalize(p?.model3dUrl ?? p?.model3d ?? "");
//   const can3D = Boolean(modelUrl);

//   const clampQty = (n) => Math.max(1, Math.min(inStockNum || 99, n));
//   const increase = () => setQty((n) => clampQty(Number(n || 1) + 1));
//   const decrease = () => setQty((n) => clampQty(Number(n || 1) - 1));
//   const onChangeQty = (e) => setQty(clampQty(Math.floor(Number(e.target.value)) || 1));

//   const handleAddToCart = () => {
//     if (colorList.length && !selectedColor) return alert("Vui lòng chọn màu sắc trước khi thêm vào giỏ hàng.");
//     if (sizeList.length && !selectedSize) return alert("Vui lòng chọn kích cỡ trước khi thêm vào giỏ hàng.");
//     const img = activeImg || normalize(p.poster) || normalize(p.images?.[0]) || "";
//     addItem({ id: p._id, name: p.name, price: p.price, img, slug: p.slug || p._id, color: selectedColor, size: selectedSize }, qty);
//   };
//   const handleBuyNow = () => { handleAddToCart(); navigate("/checkout"); };

//   if (loading) return <div className="max-w-7xl mx-auto px-4 py-10 text-center">Đang tải...</div>;
//   if (err || !p) return <div className="max-w-7xl mx-auto px-4 py-10 text-center">⚠ {err || "Không tìm thấy sản phẩm."}</div>;

//   return (
//     <section className="max-w-7xl mx-auto px-4 py-8 md:py-10">
//       {/* Breadcrumb */}
//       <nav className="text-sm text-gray-500 mb-4 md:mb-6">
//         <Link to="/" className="hover:underline text-yellow-600">Trang chủ</Link>
//         <span className="mx-2">/</span>
//         <Link to="/products" className="hover:underline text-yellow-600">Sản phẩm</Link>
//         {p.category && <>
//           <span className="mx-2">/</span>
//           <Link to={`/products?category=${encodeURIComponent(p.category)}`} className="hover:underline text-yellow-600">{p.category}</Link>
//         </>}
//         <span className="mx-2">/</span>
//         <span className="text-gray-800 font-semibold">{p.name}</span>
//       </nav>

//       <div className="grid lg:grid-cols-2 gap-8">
//         {/* Media */}
//         <div className="relative w-full rounded-3xl overflow-hidden bg-white shadow-lg">
//           <div className="w-full h-[72vh] min-h-[540px] bg-gray-50 flex items-center justify-center">
//             {show3D && can3D
//               ? <ModelViewer url={modelUrl} className="w-full h-full" cameraControls autoRotate={false} />
//               : <ImgSafe src={activeImg} alt={p.name} className="w-full h-full object-contain" />}
//           </div>
//           {can3D &&
//             <button type="button" onClick={() => setShow3D(v => !v)}
//               className={`absolute top-4 right-4 rounded-xl border px-4 py-2 font-medium text-yellow-600 bg-white/90 hover:bg-yellow-600 hover:text-white transition`}>
//               {show3D ? "Ảnh" : "Xem 3D"}
//             </button>}
//         </div>

//         {/* Info */}
//         <div className="lg:pl-4">
//           <h1 className="text-3xl font-bold text-gray-900">{p.name}</h1>
//           <div className="mt-3 flex items-center gap-3 text-sm text-gray-600">
//             <span className="inline-flex -ml-1 text-yellow-500">{"★★★★"}<span className="text-gray-300">★</span></span>
//             <span>{(p.avgRating?.toFixed?.(1) ?? "4.5")} • {reviews.length} đánh giá</span>
//             <span className={inStock ? "text-emerald-600" : "text-red-600"}>{inStock ? `Còn hàng (${inStockNum})` : "Hết hàng"}</span>
//           </div>
//           <div className="text-3xl font-semibold text-yellow-600 mt-2">{vnd(p.price)}</div>
//           {p.desc && <p className="text-gray-700 mt-4 leading-relaxed whitespace-pre-line">{p.desc}</p>}

//           {/* Chọn màu & size */}
//           {(colorList.length || sizeList.length) > 0 && <div className="mt-6 space-y-4">
//             {colorList.length > 0 &&
//               <div>
//                 <div className="text-sm text-gray-500 mb-2">Chọn màu sắc:</div>
//                 <div className="flex flex-wrap gap-2">{colorList.map((c, i) =>
//                   <button key={i} type="button" onClick={() => setSelectedColor(c)}
//                     className={`px-3 py-1.5 rounded-full border transition font-medium ${selectedColor === c ? "bg-yellow-500 text-white border-yellow-500" : "bg-white text-gray-700 hover:bg-yellow-50 border-gray-300"}`}>
//                     {c}
//                   </button>)}
//                 </div>
//               </div>}
//             {sizeList.length > 0 &&
//               <div>
//                 <div className="text-sm text-gray-500 mb-2">Chọn kích cỡ:</div>
//                 <div className="flex flex-wrap gap-2">{sizeList.map((s, i) =>
//                   <button key={i} type="button" onClick={() => setSelectedSize(s)}
//                     className={`px-3 py-1.5 rounded-full border transition font-medium ${selectedSize === s ? "bg-yellow-500 text-white border-yellow-500" : "bg-white text-gray-700 hover:bg-yellow-50 border-gray-300"}`}>
//                     {s}
//                   </button>)}
//                 </div>
//               </div>}
//           </div>}

//           {/* Thumbnails */}
//           {images.length > 1 && !show3D && <div className="flex gap-2 mt-5 flex-wrap">{images.map((u, i) =>
//             <button key={i} type="button" className={`border rounded-xl p-1 transition ${activeImg === u ? "border-yellow-500" : "border-gray-200 hover:border-yellow-400"}`} onClick={() => setActiveImg(u)}>
//               <ImgSafe src={u} alt="" className="w-20 h-20 object-cover rounded-lg bg-gray-100" />
//             </button>)}
//           </div>}

//           {/* Actions */}
//           <div className="mt-6 flex flex-col sm:flex-row sm:items-center gap-4">
//             <div className="flex items-center border rounded-xl overflow-hidden w-max">
//               <button onClick={decrease} className="px-3 py-2 hover:bg-yellow-50">−</button>
//               <input type="number" className="w-16 text-center outline-none py-2" value={qty} min={1} max={inStockNum || 99} onChange={onChangeQty} />
//               <button onClick={increase} className="px-3 py-2 hover:bg-yellow-50">+</button>
//             </div>
//             <div className="flex gap-3">
//               <button disabled={!inStock} onClick={handleAddToCart} className="rounded-xl border px-5 py-3 font-medium hover:bg-yellow-500 hover:text-white transition disabled:opacity-40">Thêm vào giỏ</button>
//               <button disabled={!inStock} onClick={handleBuyNow} className="rounded-xl px-5 py-3 font-medium bg-yellow-500 text-white hover:opacity-90 transition disabled:opacity-40">Mua ngay</button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Reviews */}
//       <div className="mt-10 space-y-4">
//         {revLoading ? <div>Đang tải đánh giá…</div> :
//           reviews.length > 0 ? (showAllReviews ? reviews : reviews.slice(0, 3)).map((rv, i) =>
//             <div key={i} className="border rounded-xl p-4 bg-white shadow-md hover:shadow-lg transition">
//               <div className="flex items-center gap-2">
//                 <span className="text-yellow-500 font-medium">{"★".repeat(rv.rating)}{"☆".repeat(5 - rv.rating)}</span>
//                 <span className="text-sm text-gray-400">{rv.createdAt ? new Date(rv.createdAt).toLocaleDateString("vi-VN") : ""}</span>
//               </div>
//               <p className="mt-2 text-gray-700">{rv.comment}</p>

//               {/* Review images */}
//               {Array.isArray(rv.images) && rv.images.length > 0 &&
//                 <div className="flex gap-2 mt-2 flex-wrap">
//                   {rv.images.map((img, idx) =>
//                     <a key={idx} href={img} target="_blank" rel="noopener noreferrer">
//                       <img src={img} alt={`review-${idx}`} className="w-24 h-24 object-cover rounded-xl border cursor-pointer hover:scale-105 transition-transform" />
//                     </a>
//                   )}
//                 </div>
//               }
//             </div>
//           ) : <div className="text-gray-500">Chưa có đánh giá nào</div>
//         }
//         {reviews.length > 3 && <div className="mt-4 text-center">
//           <button className="px-4 py-2 border rounded-xl font-medium text-yellow-600 hover:bg-yellow-50 transition" onClick={() => setShowAllReviews(!showAllReviews)}>
//             {showAllReviews ? "Thu gọn" : "Xem thêm đánh giá"}
//           </button>
//         </div>}
//       </div>

//       {/* Similar */}
//       {(simLoading || similar.length > 0) && <div className="mt-10">
//         <h2 className="text-2xl font-semibold mb-4 text-yellow-600">Gợi ý sản phẩm tương tự</h2>
//         {simLoading ? <div className="text-gray-500 text-sm">Đang gợi ý…</div> :
//           <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
//             {similar.map(sp => {
//               const img = normalize(sp.poster || sp.images?.[0] || "");
//               return (
//                 <Link key={sp._id} to={`/products/${encodeURIComponent(sp.slug || sp._id)}`} className="group rounded-2xl border bg-white hover:shadow-lg transition overflow-hidden">
//                   <div className="aspect-[4/3] bg-gray-50"><ImgSafe src={img} alt={sp.name} className="w-full h-full object-cover" /></div>
//                   <div className="p-3">
//                     <div className="font-medium line-clamp-1 group-hover:underline">{sp.name}</div>
//                     <div className="text-sm text-gray-600 mt-1">{vnd(sp.price)}</div>
//                   </div>
//                 </Link>
//               )
//             })}
//           </div>
//         }
//       </div>}
//     </section>
//   );
// }//21/11










// src/pages/ProductDetail.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { vnd } from "../utils/format";
import { useCart } from "../context/CartContext";
import ImgSafe from "../components/ImgSafe";
import ModelViewer from "../components/ModelViewer";
import axiosClient from "../services/axiosClient";

/* ====== CONFIG ====== */
const API = import.meta.env.VITE_API_URL || "http://localhost:8081/api";
const ORIGIN = import.meta.env.VITE_API_ORIGIN || "http://localhost:8081";

/* ====== HELPERS ====== */
const normalize = (u) => {
  if (!u) return "";
  const s = String(u).trim();
  if (!s) return "";
  if (/^https?:\/\//i.test(s)) return s;
  const path = s.startsWith("/") ? s : "/" + s;
  return `${ORIGIN}${path}`.replace(/([^:]\/)\/+/g, "$1");
};

const csvToList = (v) => {
  if (!v) return [];
  const raw = Array.isArray(v) ? v : String(v).split(",");
  const uniq = new Map();
  raw.map((s)=>String(s).trim()).filter(Boolean).forEach((x)=>{
    const key = x.toLowerCase();
    if (!uniq.has(key)) uniq.set(key, x);
  });
  return Array.from(uniq.values());
};

/* ============================================================
                      PRODUCT DETAIL PAGE
============================================================ */
export default function ProductDetail() {
  const { idOrSlug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const [p, setP] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [show3D, setShow3D] = useState(false);
  const [qty, setQty] = useState(1);

  const [activeImg, setActiveImg] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  /* ------------------- REVIEWS ------------------- */
  const [reviews, setReviews] = useState([]);
  const [revLoading, setRevLoading] = useState(false);

  /* ------------------- SIMILAR ------------------- */
  const [similar, setSimilar] = useState([]);
  const [simLoading, setSimLoading] = useState(false);

  /* ------------------- TABS ------------------- */
  const TABS = ["Mô tả", "Thông số", "Đánh giá", "Gợi ý tương tự"];
  const [tab, setTab] = useState("Mô tả");

  /* ------------------- LOAD PRODUCT ------------------- */
  useEffect(() => {
    if (!idOrSlug) return;
    let stop = false;

    setLoading(true);
    fetch(`${API}/products/${encodeURIComponent(idOrSlug)}`)
      .then((r)=>r.ok ? r.json() : r.json().then(Promise.reject))
      .then((data)=>{
        if (stop) return;
        setP(data);
        setErr("");
        setShow3D(false);

        const first = normalize(data.poster) || normalize(data.images?.[0]);
        setActiveImg(first || "");
      })
      .catch((e)=>setErr(e?.message || "Không tìm thấy sản phẩm"))
      .finally(()=>!stop && setLoading(false));

    return ()=>{ stop = true };
  }, [idOrSlug]);

  /* ------------------- LOAD REVIEWS ------------------- */
  const loadReviews = async (pid) => {
    setRevLoading(true);
    try {
      const res = await axiosClient.get(`/api/products/${pid}/reviews`);
      setReviews(res.data?.reviews || []);
    } finally {
      setRevLoading(false);
    }
  };

  useEffect(() => {
    if (p?._id) loadReviews(p._id);
  }, [p]);

  /* ------------------- LOAD SIMILAR ------------------- */
  useEffect(() => {
    if (!p) return;
    let stop = false;

    (async () => {
      try {
        setSimLoading(true);
        const url = p.category
          ? `${API}/products?category=${p.category}&limit=50`
          : `${API}/products?limit=50`;

        const r = await fetch(url);
        const d = await r.json();
        const items = d.items || [];

        if (!stop)
          setSimilar(items.filter((x)=>String(x._id)!==String(p._id)).slice(0,12));
      } catch {
        if (!stop) setSimilar([]);
      } finally {
        if (!stop) setSimLoading(false);
      }
    })();

    return ()=>{ stop = true };
  }, [p]);

  /* ------------------- IMAGE + VARIANT ------------------- */
  const images = useMemo(() => {
    if (!p) return [];
    const arr = [
      normalize(p.poster),
      ...(Array.isArray(p.images) ? p.images.map(normalize) : [])
    ].filter(Boolean);
    return Array.from(new Set(arr));
  }, [p]);

  const colorList = csvToList(p?.colors);
  const sizeList = csvToList(p?.sizes);

  const inStock = Number(p?.inStock ?? 0) > 0;
  const inStockNum = Number(p?.inStock ?? 0);

  const clampQty = (n)=>Math.max(1, Math.min(inStockNum || 99, n));
  const changeQty = (v)=>setQty(clampQty(Number(v)||1));

  const modelUrl = normalize(p?.model3dUrl);
  const can3D = Boolean(modelUrl);

  /* ------------------- CART ACTION ------------------- */
  const addToCart = () => {
    if (colorList.length && !selectedColor)
      return alert("Vui lòng chọn màu sắc.");
    if (sizeList.length && !selectedSize)
      return alert("Vui lòng chọn kích thước.");

    addItem(
      {
        id: p._id,
        name: p.name,
        price: p.price,
        img: activeImg,
        slug: p.slug || p._id,
        color: selectedColor,
        size: selectedSize,
        requireColor: colorList.length > 0,
        requireSize: sizeList.length > 0,
      },
      qty
    );
  };

  const buyNow = () => {
    addToCart();
    navigate("/checkout");
  };

  /* ------------------- LOADING / ERROR ------------------- */
  if (loading)
    return <div className="max-w-7xl mx-auto px-4 py-10 text-center">Đang tải...</div>;
  if (err || !p)
    return <div className="max-w-7xl mx-auto px-4 py-10 text-center">{err}</div>;

  /* ============================================================
                             UI RENDER
  ============================================================= */
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">

      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-4">
        <Link to="/" className="hover:underline text-yellow-600">Trang chủ</Link>
        <span className="mx-2">/</span>
        <Link to="/products" className="hover:underline text-yellow-600">Sản phẩm</Link>
        <span className="mx-2">/</span>
        <span className="font-semibold">{p.name}</span>
      </nav>

      {/* ================= MAIN TOP GRID ================= */}
      <div className="grid lg:grid-cols-2 gap-8">

        {/* LEFT: IMAGE / 3D */}
        <div className="bg-white rounded-3xl shadow p-4 relative">

          <div className="w-full h-[72vh] bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden">
            {show3D && can3D ? (
              <ModelViewer url={modelUrl} className="w-full h-full" cameraControls autoRotate={false} />
            ) : (
              <ImgSafe src={activeImg} alt={p.name} className="w-full h-full object-contain" />
            )}
          </div>

          {can3D && (
            <button
              className="absolute top-4 right-4 bg-white px-4 py-2 rounded-xl border text-yellow-600 hover:bg-yellow-600 hover:text-white transition"
              onClick={()=>setShow3D(!show3D)}
            >
              {show3D ? "Ảnh" : "Xem 3D"}
            </button>
          )}

          {/* Thumbnails */}
          {!show3D && images.length > 1 && (
            <div className="flex gap-2 mt-4 flex-wrap">
              {images.map((u,i)=>(
                <button
                  key={i}
                  onClick={()=>setActiveImg(u)}
                  className={`border rounded-xl p-1 ${activeImg===u ? "border-yellow-500" : "border-gray-200 hover:border-yellow-400"}`}
                >
                  <ImgSafe src={u} className="w-20 h-20 object-cover rounded-lg" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT: INFO */}
        <div>
          <h1 className="text-3xl font-bold">{p.name}</h1>

          {/* Rating */}
          <div className="mt-3 text-sm text-gray-600 flex items-center gap-3">
            <span className="text-yellow-500">★★★★☆</span>
            <span>{reviews.length} đánh giá</span>
            <span className={inStock ? "text-emerald-600" : "text-red-600"}>
              {inStock ? `Còn hàng (${inStockNum})` : "Hết hàng"}
            </span>
          </div>

          {/* Price */}
          <div className="text-4xl font-semibold text-yellow-600 mt-3">{vnd(p.price)}</div>

          {/* Variants */}
          <div className="mt-6 space-y-4">
            {colorList.length > 0 && (
              <div>
                <div className="text-sm text-gray-500 mb-1">Màu sắc:</div>
                <div className="flex flex-wrap gap-2">
                  {colorList.map((c,i)=>(
                    <button
                      key={i}
                      onClick={()=>setSelectedColor(c)}
                      className={`px-3 py-1.5 rounded-full border ${selectedColor===c?"bg-yellow-500 text-white border-yellow-500":"border-gray-300 bg-white hover:bg-yellow-50"}`}
                    >{c}</button>
                  ))}
                </div>
              </div>
            )}

            {sizeList.length > 0 && (
              <div>
                <div className="text-sm text-gray-500 mb-1">Kích thước:</div>
                <div className="flex flex-wrap gap-2">
                  {sizeList.map((s,i)=>(
                    <button
                      key={i}
                      onClick={()=>setSelectedSize(s)}
                      className={`px-3 py-1.5 rounded-full border ${selectedSize===s?"bg-yellow-500 text-white border-yellow-500":"border-gray-300 bg-white hover:bg-yellow-50"}`}
                    >{s}</button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Quantity + Buy */}
          <div className="mt-6 flex flex-wrap gap-4 items-center">
            <div className="flex items-center border rounded-xl overflow-hidden">
              <button onClick={()=>changeQty(qty-1)} className="px-3 py-2">−</button>
              <input className="w-16 text-center" type="number" min={1} max={99} value={qty} onChange={(e)=>changeQty(e.target.value)} />
              <button onClick={()=>changeQty(qty+1)} className="px-3 py-2">+</button>
            </div>

            <button disabled={!inStock} onClick={addToCart} className="px-6 py-3 border rounded-xl hover:bg-yellow-500 hover:text-white transition">
              Thêm giỏ
            </button>
            <button disabled={!inStock} onClick={buyNow} className="px-6 py-3 rounded-xl bg-yellow-500 text-white hover:opacity-90 transition">
              Mua ngay
            </button>
          </div>
        </div>
      </div>

      {/* ============================================================
                              TABS LIKE SHOPEE
      ============================================================= */}
      <div className="mt-12 bg-white rounded-2xl shadow p-6">

        {/* TAB HEADER */}
        <div className="flex border-b">
          {TABS.map((t)=>(
            <button
              key={t}
              className={`px-6 py-3 font-medium text-sm border-b-2 transition ${
                tab===t ? "border-yellow-600 text-yellow-600" : "border-transparent text-gray-600 hover:text-black"
              }`}
              onClick={()=>setTab(t)}
            >{t}</button>
          ))}
        </div>

        {/* TAB CONTENT */}
        <div className="pt-6">

          {/* --- TAB 1: MÔ TẢ --- */}
          {tab==="Mô tả" && (
            <div className="leading-relaxed whitespace-pre-line text-gray-700">
              {p.desc || "Không có mô tả sản phẩm."}
            </div>
          )}

          {/* --- TAB 2: THÔNG SỐ --- */}
          {tab==="Thông số" && (
            <div className="text-gray-700 space-y-2">
              <p><b>Màu sắc:</b> {colorList.join(", ") || "—"}</p>
              <p><b>Kích cỡ:</b> {sizeList.join(", ") || "—"}</p>
              <p><b>Danh mục:</b> {p.category}</p>
              <p><b>Tên sản phẩm:</b> {p.name}</p>
              <p><b>Mã SP:</b> {p.slug}</p>
            </div>
          )}

          {/* --- TAB 3: ĐÁNH GIÁ --- */}
          {tab==="Đánh giá" && (
            <div className="space-y-4">
              {revLoading ? "Đang tải..." : reviews.length===0 ? (
                <p className="text-gray-500">Chưa có đánh giá.</p>
              ) : (
                reviews.map((rv,i)=>(
                  <div key={i} className="border rounded-xl p-4 bg-white shadow">
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-500">{"★".repeat(rv.rating)}{"☆".repeat(5-rv.rating)}</span>
                      <span className="text-sm text-gray-400">
                        {rv.createdAt ? new Date(rv.createdAt).toLocaleDateString("vi-VN") : ""}
                      </span>
                    </div>

                    <p className="mt-2 text-gray-700">{rv.comment}</p>

                    {Array.isArray(rv.images) && rv.images.length>0 && (
                      <div className="flex gap-2 mt-2 flex-wrap">
                        {rv.images.map((img,idx)=>(
                          <img
                            key={idx}
                            src={img}
                            className="w-24 h-24 object-cover rounded-xl border"
                            alt=""
                          />
                        ))}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}

          {/* --- TAB 4: GỢI Ý TƯƠNG TỰ --- */}
          {tab==="Gợi ý tương tự" && (
            <div>
              {simLoading ? (
                <p className="text-gray-500">Đang tải...</p>
              ) : similar.length===0 ? (
                <p className="text-gray-500">Không có sản phẩm tương tự.</p>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {similar.map((sp)=>(
                    <Link key={sp._id} to={`/products/${sp.slug || sp._id}`}
                      className="border rounded-2xl bg-white shadow hover:shadow-lg transition">
                      <div className="aspect-[4/3] bg-gray-50">
                        <ImgSafe src={normalize(sp.poster || sp.images?.[0])} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-3">
                        <div className="font-medium text-gray-700 line-clamp-1">{sp.name}</div>
                        <div className="text-sm text-yellow-600 mt-1">{vnd(sp.price)}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

        </div>
      </div>
    </section>
  );
}

