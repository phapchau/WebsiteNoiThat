









// // src/pages/Home.jsx
// import { useEffect, useMemo, useState } from "react";
// import { Link } from "react-router-dom";
// import { useCart } from "../context/CartContext.jsx";
// import { vnd } from "../utils/format";
// import ImgSafe from "../components/ImgSafe";

// const API = import.meta.env.VITE_API_URL || "http://localhost:8081/api";
// const SLIDES = [
//   { id: 1, image: "/anh1.jpg", kicker: "NỘI THẤT MOHO", title1: "Bảo Hành Dài Nhất", title2: "Ngành Nội Thất Việt", desc: "5 Năm An Tâm, Đồng Hành Cùng Bạn", cta: { label: "Xem Chi Tiết", to: "/products" }, caption: "bảo hành 5 năm" },
//   { id: 2, image: "/anh2.jpg", kicker: "BỘ SƯU TẬP MỚI", title1: "Sang Trọng &", title2: "Tinh Tế", desc: "Chất liệu bền bỉ, thân thiện môi trường", cta: { label: "Khám phá", to: "/products" }, caption: "ưu đãi theo mùa" },
//   { id: 3, image: "/anh3.jpg", kicker: "GÓC PHÒNG KHÁCH", title1: "Cảm Hứng", title2: "Scandinavian", desc: "Tối giản – Ấm áp – Tự nhiên", cta: { label: "Mua ngay", to: "/products" }, caption: "giao nhanh 24–48h" },
// ];

// const CATEGORIES = [
//   { id: "sofa", name: "Sofa", image: "/sofaden.jpg" },
//   { id: "ban-tra", name: "Bàn Trà", image: "/ban1.jpg" },
//   { id: "giuong", name: "Giường", image: "/giuong.jpg" },
//   { id: "tu-ke", name: "Tủ – Kệ", image: "/ke.jpg" },
// ];

// const FULL = "w-full px-6 md:px-12 xl:px-16";
// const FULL_BLEED = "w-screen ml-[calc(50%-50vw)] mr-[calc(50%-50vw)]";

// export default function Home() {
//   const [idx, setIdx] = useState(0);
//   const cur = SLIDES[idx];
//   const next = () => setIdx((i) => (i + 1) % SLIDES.length);
//   const prev = () => setIdx((i) => (i - 1 + SLIDES.length) % SLIDES.length);

//   useEffect(() => {
//     const t = setInterval(next, 5000);
//     return () => clearInterval(t);
//   }, []);

//   const [newItems, setNewItems] = useState([]);
//   const [bestItems, setBestItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");

//   useEffect(() => {
//     let stop = false;
//     (async () => {
//       try {
//         setLoading(true);
//         setErr("");
//         const r1 = await fetch(`${API}/products?limit=8&page=1`);
//         const d1 = await (r1.ok ? r1.json() : r1.json().then(Promise.reject));
//         const r2 = await fetch(`${API}/products?limit=8&page=2`);
//         const d2 = await (r2.ok ? r2.json() : r2.json().then(Promise.reject));
//         if (!stop) {
//           setNewItems(d1.items || []);
//           setBestItems(d2.items || []);
//         }
//       } catch (e) {
//         if (!stop) setErr(e?.message || "Không tải được sản phẩm");
//       } finally {
//         if (!stop) setLoading(false);
//       }
//     })();
//     return () => { stop = true; };
//   }, []);

//   return (
//     <div className="space-y-20">
//       {/* HERO */}
//       <section className={`${FULL_BLEED} relative overflow-hidden`}>
//         <img src={cur.image} alt="Hero" className="w-full h-[78vh] min-h-[520px] object-cover" onError={(e)=>e.currentTarget.src="/react.svg"} />
//         <div className={`${FULL} h-full flex items-center`}>
//           <div className="max-w-3xl bg-white/40 p-8 rounded-2xl shadow-lg" style={{ backdropFilter: "blur(4px)" }}>
//             <p className="uppercase tracking-wide text-base md:text-lg text-[#7A5C2E] font-semibold">{cur.kicker}</p>
//             <h1 className="mt-3 text-4xl md:text-6xl font-extrabold leading-tight text-[#6E4E25]">{cur.title1}<br/>{cur.title2}</h1>
//             <p className="mt-4 text-lg text-gray-800">{cur.desc}</p>
//             <Link to={cur.cta.to} className="inline-block mt-6 rounded-2xl border-2 border-[#F0DFA3] bg-[#FFDFA0] px-6 py-3 text-lg hover:opacity-95 transition">
//               {cur.cta.label}
//             </Link>
//           </div>
//         </div>

//         <button onClick={prev} className="absolute left-6 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-[#B88E2F] text-white grid place-items-center shadow-lg">←</button>
//         <button onClick={next} className="absolute right-6 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-[#B88E2F] text-white grid place-items-center shadow-lg">→</button>

//         <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3">
//           {SLIDES.map((s,i)=>(
//             <button key={s.id} onClick={()=>setIdx(i)} className={`h-3.5 w-3.5 rounded-full ${i===idx ? "bg-[#B88E2F]" : "bg-white/80 border"}`}/>
//           ))}
//         </div>
//       </section>

//       {/* USP */}
//       <section className={`${FULL} grid grid-cols-1 md:grid-cols-4 gap-6`}>
//         {[{icon:"🛡️",title:"Bảo hành 5 năm",sub:"An tâm sử dụng"},{icon:"🚚",title:"Giao nhanh 24–48h",sub:"TP.HCM & lân cận"},{icon:"🔄",title:"Đổi trả 7 ngày",sub:"Linh hoạt, dễ dàng"},{icon:"💳",title:"Trả góp 0%",sub:"Qua đối tác ngân hàng"}].map((u,i)=>(
//           <div key={i} className="rounded-2xl border-2 bg-white px-6 py-6 flex items-center gap-5 shadow-md">
//             <span className="text-3xl md:text-4xl">{u.icon}</span>
//             <div>
//               <div className="font-semibold text-lg md:text-xl">{u.title}</div>
//               <div className="text-sm md:text-base text-gray-600">{u.sub}</div>
//             </div>
//           </div>
//         ))}
//       </section>

//       {/* Danh mục */}
//       <section className={`${FULL} space-y-6`}>
//         <div className="flex items-center justify-between">
//           <h2 className="text-3xl md:text-4xl font-semibold">Danh mục nổi bật</h2>
//           <Link to="/products" className="text-[#B88E2F] hover:underline text-lg">Xem tất cả</Link>
//         </div>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//           {CATEGORIES.map(c=>(
//             <Link key={c.id} to={`/products?category=${c.id}`} className="group relative rounded-3xl border-2 overflow-hidden bg-white shadow-lg hover:scale-[1.01] transition">
//               <img src={c.image} alt={c.name} className="h-[360px] md:h-[420px] w-full object-cover" onError={(e)=>e.currentTarget.src="/react.svg"} />
//               <div className="absolute inset-x-0 bottom-0 p-5">
//                 <span className="rounded-xl bg-white/90 border px-5 py-2 text-lg">{c.name}</span>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </section>

//       {/* New items */}
//       <ProductsSection title="Mới về" items={newItems} loading={loading} err={err} toAll="/products" />

//       {/* Best sellers */}
//       <ProductsSection title="Bán chạy" items={bestItems} loading={loading} err={err} toAll="/products" />
//     </div>
//   );
// }

// /* ProductsSection & ProductCard: giữ nguyên logic, phóng to, dùng gold */
// function ProductsSection({ title, items, loading, err, toAll }) {
//   const { addItem } = useCart();
//   const content = useMemo(() => {
//     if (loading) {
//       return (
//         <div className="grid grid-cols-[repeat(auto-fill,minmax(560px,1fr))] gap-10">
//           {Array.from({ length: 4 }).map((_, i) => (
//             <div key={i} className="bg-white border-2 rounded-3xl overflow-hidden animate-pulse">
//               <div className="aspect-[4/3] md:aspect-[3/2] bg-gray-100" />
//               <div className="p-8 space-y-4">
//                 <div className="h-6 w-3/4 bg-gray-100 rounded" />
//                 <div className="h-6 w-1/2 bg-gray-100 rounded" />
//                 <div className="h-12 w-1/2 bg-gray-100 rounded" />
//               </div>
//             </div>
//           ))}
//         </div>
//       );
//     }
//     if (err) return <div className="text-red-600">⚠ {err}</div>;
//     if (!items?.length) return <div className="text-gray-600">Chưa có sản phẩm.</div>;

//     return (
//       <div className="grid grid-cols-[repeat(auto-fill,minmax(560px,1fr))] gap-10">
//         {items.map((p) => (
//           <ProductCard
//             key={p._id}
//             p={p}
//             onAdd={(n = 1) =>
//               addItem(
//                 { id: p._id, name: p.name, price: p.price, img: p.poster || p.images?.[0] || "", slug: p.slug || p._id },
//                 n
//               )
//             }
//           />
//         ))}
//       </div>
//     );
//   }, [items, loading, err, addItem]);

//   return (
//     <section className={`${FULL} space-y-6`}>
//       <div className="flex items-baseline justify-between">
//         <h2 className="text-3xl md:text-4xl font-semibold">{title}</h2>
//         <Link to={toAll} className="text-[#B88E2F] hover:underline text-lg">Xem thêm</Link>
//       </div>
//       {content}
//     </section>
//   );
// }

// function ProductCard({ p, onAdd }) {
//   const slugOrId = p.slug || p._id;
//   const img = p.poster || p.images?.[0] || "";
//   const GOLD = "#B88E2F";
//   return (
//     <article className="group bg-white border-2 rounded-3xl overflow-hidden shadow-lg">
//       <div className="relative">
//         <Link to={`/products/${slugOrId}`} className="block">
//           <ImgSafe src={img} alt={p.name} className="w-full aspect-[4/3] md:aspect-[3/2] object-cover group-hover:scale-[1.02] transition" />
//         </Link>
//         {p.is3D && <span className="absolute right-4 top-4 rounded-md bg-black/70 text-white text-xs px-2 py-1">3D</span>}
//       </div>

//       <div className="p-8">
//         <h3 className="line-clamp-2 font-medium text-2xl md:text-3xl">{p.name}</h3>
//         <div className="mt-3 text-2xl md:text-3xl font-extrabold" style={{ color: GOLD }}>{vnd(p.price)}</div>

//         <div className="mt-6 flex items-center gap-4">
//           <Link to={`/products/${slugOrId}`} className="rounded-xl border px-6 py-3 text-base hover:bg-black hover:text-white transition">Xem chi tiết</Link>
//           <button className="rounded-xl border px-6 py-3 text-base hover:opacity-95" style={{ background: GOLD, borderColor: GOLD }} onClick={() => onAdd?.(1)}>Thêm giỏ hàng</button>
//         </div>
//       </div>
//     </article>
//   );
// }//////19/11












// // src/pages/Home.jsx
// import { useEffect, useMemo, useState } from "react";
// import { Link } from "react-router-dom";
// import { useCart } from "../context/CartContext.jsx";
// import { vnd } from "../utils/format";
// import ImgSafe from "../components/ImgSafe";

// const API = import.meta.env.VITE_API_URL || "http://localhost:8081/api";
// const SLIDES = [
//   { id: 1, image: "/anh4.jpg", kicker: "NỘI THẤT NATURAHOME", title1: "Bảo Hành Dài Nhất", title2: "Ngành Nội Thất Việt", desc: "5 Năm An Tâm, Đồng Hành Cùng Bạn", cta: { label: "Xem Chi Tiết", to: "/products" }, caption: "bảo hành 5 năm" },
//   { id: 2, image: "/anh5.jpg", kicker: "BỘ SƯU TẬP MỚI", title1: "Sang Trọng &", title2: "Tinh Tế", desc: "Chất liệu bền bỉ, thân thiện môi trường", cta: { label: "Khám phá", to: "/products" }, caption: "ưu đãi theo mùa" },
//   { id: 3, image: "/anh6.jpg", kicker: "GÓC PHÒNG KHÁCH", title1: "Cảm Hứng", title2: "Scandinavian", desc: "Tối giản – Ấm áp – Tự nhiên", cta: { label: "Mua ngay", to: "/products" }, caption: "giao nhanh 24–48h" },
// ];

// const CATEGORIES = [
//   { id: "sofa", name: "Sofa", image: "/sofaden.jpg" },
//   { id: "ban-tra", name: "Bàn Trà", image: "/ban1.jpg" },
//   { id: "giuong", name: "Giường", image: "/giuong.jpg" },
//   { id: "tu-ke", name: "Tủ – Kệ", image: "/ke.jpg" },
// ];

// const FULL = "w-full px-6 md:px-12 xl:px-16";
// const FULL_BLEED = "w-screen ml-[calc(50%-50vw)] mr-[calc(50%-50vw)]";

// export default function Home() {
//   const [idx, setIdx] = useState(0);
//   const cur = SLIDES[idx];
//   const next = () => setIdx((i) => (i + 1) % SLIDES.length);
//   const prev = () => setIdx((i) => (i - 1 + SLIDES.length) % SLIDES.length);

//   useEffect(() => {
//     const t = setInterval(next, 5000);
//     return () => clearInterval(t);
//   }, []);

//   const [newItems, setNewItems] = useState([]);
//   const [bestItems, setBestItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");

//   useEffect(() => {
//     let stop = false;
//     (async () => {
//       try {
//         setLoading(true);
//         setErr("");
//         const r1 = await fetch(`${API}/products?limit=8&page=1`);
//         const d1 = await (r1.ok ? r1.json() : r1.json().then(Promise.reject));
//         const r2 = await fetch(`${API}/products?limit=8&page=2`);
//         const d2 = await (r2.ok ? r2.json() : r2.json().then(Promise.reject));
//         if (!stop) {
//           setNewItems(d1.items || []);
//           setBestItems(d2.items || []);
//         }
//       } catch (e) {
//         if (!stop) setErr(e?.message || "Không tải được sản phẩm");
//       } finally {
//         if (!stop) setLoading(false);
//       }
//     })();
//     return () => { stop = true; };
//   }, []);

//   return (
//     <div className="space-y-20">

//       {/* HERO */}
//       <section className={`${FULL_BLEED} relative overflow-hidden`}>
//         <img src={cur.image} alt="Hero" className="w-full h-[78vh] min-h-[520px] object-cover" onError={(e) => e.currentTarget.src="/react.svg"} />
//         <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/40"></div>

//         <div className={`${FULL} h-full flex items-center`}>
//           <div className="max-w-3xl bg-white/60 p-10 rounded-3xl shadow-xl backdrop-blur-md">
//             <p className="uppercase tracking-widest text-lg md:text-xl text-[#B88E2F] font-semibold">{cur.kicker}</p>
//             <h1 className="mt-4 text-4xl md:text-6xl font-extrabold leading-tight text-[#3E2E1A]">{cur.title1}<br/>{cur.title2}</h1>
//             <p className="mt-4 text-lg text-gray-700">{cur.desc}</p>
//             <Link to={cur.cta.to} className="inline-block mt-6 rounded-2xl border-2 border-[#B88E2F] bg-[#FFDFA0] px-6 py-3 text-lg font-semibold shadow hover:scale-105 transition">{cur.cta.label}</Link>
//           </div>
//         </div>

//         <button onClick={prev} className="absolute left-6 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-[#B88E2F] text-white grid place-items-center shadow-lg text-2xl hover:scale-110 transition">←</button>
//         <button onClick={next} className="absolute right-6 top-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-[#B88E2F] text-white grid place-items-center shadow-lg text-2xl hover:scale-110 transition">→</button>

//         <div className="absolute bottom-8 left-0 right-0 flex justify-center gap-3">
//           {SLIDES.map((s,i)=>(
//             <button key={s.id} onClick={()=>setIdx(i)} className={`h-3.5 w-3.5 rounded-full ${i===idx ? "bg-[#B88E2F]" : "bg-white/80 border"}`}/>
//           ))}
//         </div>
//       </section>

//       {/* USP */}
//       <section className={`${FULL} grid grid-cols-1 md:grid-cols-4 gap-6`}>
//         {[{icon:"🛡️",title:"Bảo hành 5 năm",sub:"An tâm sử dụng"},{icon:"🚚",title:"Giao nhanh 24–48h",sub:"TP.HCM & lân cận"},{icon:"🔄",title:"Đổi trả 7 ngày",sub:"Linh hoạt, dễ dàng"},{icon:"💳",title:"Trả góp 0%",sub:"Qua đối tác ngân hàng"}].map((u,i)=>(
//           <div key={i} className="rounded-2xl border-2 bg-white px-6 py-6 flex items-center gap-5 shadow-lg hover:shadow-xl transition">
//             <span className="text-4xl md:text-5xl">{u.icon}</span>
//             <div>
//               <div className="font-semibold text-xl md:text-2xl">{u.title}</div>
//               <div className="text-sm md:text-base text-gray-600">{u.sub}</div>
//             </div>
//           </div>
//         ))}
//       </section>

//       {/* Danh mục */}
//       <section className={`${FULL} space-y-6`}>
//         <div className="flex items-center justify-between">
//           <h2 className="text-3xl md:text-4xl font-semibold">Danh mục nổi bật</h2>
//           <Link to="/products" className="text-[#B88E2F] hover:underline text-lg">Xem tất cả</Link>
//         </div>
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
//           {CATEGORIES.map(c=>(
//             <Link key={c.id} to={`/products?category=${c.id}`} className="group relative rounded-3xl border-2 overflow-hidden bg-white shadow-lg hover:scale-105 transition">
//               <img src={c.image} alt={c.name} className="h-[360px] md:h-[420px] w-full object-cover group-hover:scale-105 transition" onError={(e)=>e.currentTarget.src="/react.svg"} />
//               <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/30 to-transparent">
//                 <span className="rounded-xl bg-white/90 border px-5 py-2 text-lg font-semibold">{c.name}</span>
//               </div>
//             </Link>
//           ))}
//         </div>
//       </section>

//       {/* New items */}
//       <ProductsSection title="Mới về" items={newItems} loading={loading} err={err} toAll="/products" />

//       {/* Best sellers */}
//       <ProductsSection title="Bán chạy" items={bestItems} loading={loading} err={err} toAll="/products" />
//     </div>
//   );
// }

// /* ProductsSection & ProductCard: giữ nguyên logic, nâng cấp giao diện */
// function ProductsSection({ title, items, loading, err, toAll }) {
//   const { addItem } = useCart();
//   const content = useMemo(() => {
//     if (loading) {
//       return (
//         <div className="grid grid-cols-[repeat(auto-fill,minmax(560px,1fr))] gap-10">
//           {Array.from({ length: 4 }).map((_, i) => (
//             <div key={i} className="bg-white border-2 rounded-3xl overflow-hidden animate-pulse">
//               <div className="aspect-[4/3] md:aspect-[3/2] bg-gray-100" />
//               <div className="p-8 space-y-4">
//                 <div className="h-6 w-3/4 bg-gray-100 rounded" />
//                 <div className="h-6 w-1/2 bg-gray-100 rounded" />
//                 <div className="h-12 w-1/2 bg-gray-100 rounded" />
//               </div>
//             </div>
//           ))}
//         </div>
//       );
//     }
//     if (err) return <div className="text-red-600">⚠ {err}</div>;
//     if (!items?.length) return <div className="text-gray-600">Chưa có sản phẩm.</div>;

//     return (
//       <div className="grid grid-cols-[repeat(auto-fill,minmax(560px,1fr))] gap-10">
//         {items.map((p) => (
//           <ProductCard
//             key={p._id}
//             p={p}
//             onAdd={(n = 1) =>
//               addItem(
//                 { id: p._id, name: p.name, price: p.price, img: p.poster || p.images?.[0] || "", slug: p.slug || p._id },
//                 n
//               )
//             }
//           />
//         ))}
//       </div>
//     );
//   }, [items, loading, err, addItem]);

//   return (
//     <section className={`${FULL} space-y-6`}>
//       <div className="flex items-baseline justify-between">
//         <h2 className="text-3xl md:text-4xl font-semibold">{title}</h2>
//         <Link to={toAll} className="text-[#B88E2F] hover:underline text-lg">Xem thêm</Link>
//       </div>
//       {content}
//     </section>
//   );
// }

// function ProductCard({ p, onAdd }) {
//   const slugOrId = p.slug || p._id;
//   const img = p.poster || p.images?.[0] || "";
//   const GOLD = "#B88E2F";
//   return (
//     <article className="group bg-white border-2 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition">
//       <div className="relative">
//         <Link to={`/products/${slugOrId}`} className="block">
//           <ImgSafe src={img} alt={p.name} className="w-full aspect-[4/3] md:aspect-[3/2] object-cover group-hover:scale-[1.03] transition" />
//         </Link>
//         {p.is3D && <span className="absolute right-4 top-4 rounded-md bg-black/70 text-white text-xs px-2 py-1">3D</span>}
//       </div>

//       <div className="p-8">
//         <h3 className="line-clamp-2 font-medium text-2xl md:text-3xl">{p.name}</h3>
//         <div className="mt-3 text-2xl md:text-3xl font-extrabold" style={{ color: GOLD }}>{vnd(p.price)}</div>

//         <div className="mt-6 flex items-center gap-4">
//           <Link to={`/products/${slugOrId}`} className="rounded-xl border px-6 py-3 text-base hover:bg-black hover:text-white transition">Xem chi tiết</Link>
//           <button className="rounded-xl border px-6 py-3 text-base hover:opacity-95" style={{ background: GOLD, borderColor: GOLD }} onClick={() => onAdd?.(1)}>Thêm giỏ hàng</button>
//         </div>
//       </div>
//     </article>
//   );
// }





// src/pages/Home.jsx
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { vnd } from "../utils/format";
import ImgSafe from "../components/ImgSafe";

const API = import.meta.env.VITE_API_URL || "http://localhost:8081/api";

const HERO_SCENES = [
  {
    id: 1,
    image: "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg",
    label: "PHÒNG KHÁCH CAO CẤP",
    title: "Cinematic Living Space",
    subtitle: "Không gian mở – Ánh sáng tự nhiên – Gỗ ấm áp",
    tag: "Showroom Signature",
  },
  {
    id: 2,
    image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
    label: "BỘ SƯU TẬP MỚI",
    title: "Luxury Modern Interior",
    subtitle: "Đường nét tối giản – Chất liệu cao cấp",
    tag: "New Collection 2025",
  },
  {
    id: 3,
    image: "https://images.pexels.com/photos/1866149/pexels-photo-1866149.jpeg",
    label: "PHÒNG NGỦ NGHỆ THUẬT",
    title: "Art of Resting",
    subtitle: "Gam màu trầm – Ánh sáng dịu – Cảm hứng resort",
    tag: "Premium Suite",
  },
];

const CATEGORIES = [
  { id: "sofa", name: "Sofa", image: "/sofaden.jpg" },
  { id: "ban-tra", name: "Bàn Trà", image: "/ban1.jpg" },
  { id: "giuong", name: "Giường", image: "/giuong.jpg" },
  { id: "tu-ke", name: "Tủ – Kệ", image: "/ke.jpg" },
];

const FULL = "w-full px-6 md:px-12 xl:px-16";
const FULL_BLEED = "w-screen ml-[calc(50%-50vw)] mr-[calc(50%-50vw)]";

/* ================== CINEMATIC HERO ================== */
function CinematicHero() {
  const [active, setActive] = useState(0);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  // auto change scene
  useEffect(() => {
    const id = setInterval(
      () => setActive((i) => (i + 1) % HERO_SCENES.length),
      7000
    );
    return () => clearInterval(id);
  }, []);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / rect.width; // -0.5 → 0.5
    const dy = (e.clientY - cy) / rect.height;

    // giới hạn một chút cho đỡ “chóng mặt”
    setParallax({
      x: dx * 20, // px
      y: dy * 14,
    });
  };

  const handleMouseLeave = () => {
    setParallax({ x: 0, y: 0 });
  };

  const current = HERO_SCENES[active];

  return (
    <>
      {/* keyframes riêng cho hero (chỉ dùng ở đây) */}
      <style>{`
        @keyframes lightSweep {
          0%   { transform: translateX(-150%); opacity: 0; }
          20%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { transform: translateX(150%); opacity: 0; }
        }
        @keyframes floatSoft {
          0%   { transform: translateY(0);    }
          100% { transform: translateY(-10px);}
        }
      `}</style>

      <section
        className={`${FULL_BLEED} relative flex items-center justify-center overflow-hidden bg-black`}
        style={{ height: "98vh", minHeight: 520 ,position: "relative",
  top: "-120px"}}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
      >
        {/* BACKGROUND LAYERS */}
        <div className="absolute inset-0">
          {HERO_SCENES.map((scene, index) => {
            const isActive = index === active;
            const isPrev =
              index === (active - 1 + HERO_SCENES.length) % HERO_SCENES.length;

            // nhẹ nhàng pan + zoom
            const baseScale = isActive ? 1.07 : isPrev ? 1.03 : 1.02;
            const opacity = isActive ? 1 : isPrev ? 0.0 : 0;
            const zIndex = isActive ? 30 : isPrev ? 20 : 10;

            return (
              <div
                key={scene.id}
                className="absolute inset-0 transition-all duration-[1600ms] ease-[cubic-bezier(0.22,0.61,0.36,1)]"
                style={{
                  backgroundImage: `url(${scene.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  filter: "brightness(0.85) contrast(1.12)",
                  opacity,
                  zIndex,
                  transform: `scale(${baseScale}) translate3d(${
                    parallax.x
                  }px, ${parallax.y}px, 0)`,
                }}
              />
            );
          })}

          {/* LAYER: vignette + gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.16),transparent_55%),radial-gradient(circle_at_bottom,rgba(0,0,0,0.75),#050509)] mix-blend-multiply" />

          {/* LAYER: cinematic bars */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-black/70 to-transparent" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/80 to-transparent" />
        </div>

        {/* LIGHT SWEEP */}
        <div
          className="pointer-events-none absolute inset-0 mix-blend-screen"
          style={{
            background:
              "linear-gradient(115deg, transparent 40%, rgba(255,220,180,0.45) 50%, transparent 60%)",
            animation: "lightSweep 6s ease-in-out infinite",
          }}
        />

        {/* FLOATING GLASS CARD */}
        <div className={`${FULL} relative z-40`}>
          <div className="max-w-4xl">
            <div
              className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-4 py-2 text-xs md:text-sm text-white/80 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.7)]"
              style={{ animation: "floatSoft 4s ease-in-out infinite alternate" }}
            >
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="uppercase tracking-[0.22em] text-[0.7rem] md:text-[0.75rem]">
                {current.label}
              </span>
              <span className="opacity-60">•</span>
              <span className="text-[0.7rem] md:text-[0.8rem] opacity-80">
                Naturahome Signature Interior
              </span>
            </div>

            <div className="mt-5 md:mt-7 rounded-3xl bg-black/45 border border-white/15 px-6 py-7 md:px-9 md:py-9 backdrop-blur-[14px] shadow-[0_36px_80px_rgba(0,0,0,0.75)]">
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-[0_12px_30px_rgba(0,0,0,0.85)]">
                {current.title}
              </h1>
              <p className="mt-3 md:mt-4 text-sm md:text-lg text-white/80 max-w-2xl leading-relaxed">
                {current.subtitle}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-4">
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center rounded-2xl bg-[#B88E2F] px-5 py-3 md:px-6 md:py-3.5 text-sm md:text-base font-semibold text-black shadow-[0_14px_40px_rgba(184,142,47,0.65)] hover:shadow-[0_18px_55px_rgba(184,142,47,0.9)] hover:-translate-y-[1px] transition-all"
                >
                  Khám phá bộ sưu tập
                  <span className="ml-2">→</span>
                </Link>

                <Link
                  // to="/products?is3D=true"
                  to= "/models"
                  className="inline-flex items-center justify-center rounded-2xl border border-white/30 bg-black/40 px-4 py-2.5 md:px-5 md:py-3 text-xs md:text-sm text-white/85 hover:bg-white/10 transition-all"
                >
                  Xem phòng mẫu 3D
                </Link>

                <div className="hidden md:flex flex-col text-[0.75rem] text-white/70 ml-auto">
                  <span className="uppercase tracking-[0.18em] text-[0.65rem] text-white/50">
                    Collection
                  </span>
                  <span className="font-medium">{current.tag}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SMALL SCENE INDICATORS (BOTTOM CENTER) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 z-50">
          {HERO_SCENES.map((scene, index) => {
            const isActive = index === active;
            return (
              <button
                key={scene.id}
                onClick={() => setActive(index)}
                className="group relative"
              >
                <div
                  className={`h-[3px] w-10 md:w-14 rounded-full transition-all ${
                    isActive
                      ? "bg-[#F5D08A] shadow-[0_0_18px_rgba(245,208,138,0.9)]"
                      : "bg-white/35 group-hover:bg-white/70"
                  }`}
                />
                <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 text-[0.6rem] text-white/70 hidden md:block">
                  0{index + 1}
                </span>
              </button>
            );
          })}
        </div>
      </section>
    </>
  );
}

/* ================== HOME PAGE ================== */
export default function Home() {
  const [newItems, setNewItems] = useState([]);
  const [bestItems, setBestItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let stop = false;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const r1 = await fetch(`${API}/products?limit=8&page=1`);
        const d1 = await (r1.ok ? r1.json() : r1.json().then(Promise.reject));
        const r2 = await fetch(`${API}/products?limit=8&page=2`);
        const d2 = await (r2.ok ? r2.json() : r2.json().then(Promise.reject));
        if (!stop) {
          setNewItems(d1.items || []);
          setBestItems(d2.items || []);
        }
      } catch (e) {
        if (!stop) setErr(e?.message || "Không tải được sản phẩm");
      } finally {
        if (!stop) setLoading(false);
      }
    })();
    return () => {
      stop = true;
    };
  }, []);

  return (
    <div className="space-y-20">
      {/* HERO CINEMATIC 3D */}
      <CinematicHero />

      {/* USP */}
      <section className={`${FULL} grid grid-cols-1 md:grid-cols-4 gap-6`}>
        {[
          { icon: "🛡️", title: "Bảo hành 5 năm", sub: "An tâm sử dụng" },
          { icon: "🚚", title: "Giao nhanh 24–48h", sub: "TP.HCM & lân cận" },
          { icon: "🔄", title: "Đổi trả 7 ngày", sub: "Linh hoạt, dễ dàng" },
          { icon: "💳", title: "Trả góp 0%", sub: "Qua đối tác ngân hàng" },
        ].map((u, i) => (
          <div
            key={i}
            className="rounded-2xl border-2 bg-white px-6 py-6 flex items-center gap-5 shadow-lg hover:shadow-xl transition"
          >
            <span className="text-4xl md:text-5xl">{u.icon}</span>
            <div>
              <div className="font-semibold text-xl md:text-2xl">
                {u.title}
              </div>
              <div className="text-sm md:text-base text-gray-600">
                {u.sub}
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Danh mục */}
      <section className={`${FULL} space-y-6`}>
        <div className="flex items-center justify-between">
          <h2 className="text-3xl md:text-4xl font-semibold">Danh mục nổi bật</h2>
          <Link
            to="/products"
            className="text-[#B88E2F] hover:underline text-lg"
          >
            Xem tất cả
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              to={`/products?category=${c.id}`}
              className="group relative rounded-3xl border-2 overflow-hidden bg-white shadow-lg hover:scale-105 transition"
            >
              <img
                src={c.image}
                alt={c.name}
                className="h-[360px] md:h-[420px] w-full object-cover group-hover:scale-105 transition"
                onError={(e) => (e.currentTarget.src = "/react.svg")}
              />
              <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/30 to-transparent">
                <span className="rounded-xl bg-white/90 border px-5 py-2 text-lg font-semibold">
                  {c.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* New items */}
      <ProductsSection
        title="Mới về"
        items={newItems}
        loading={loading}
        err={err}
        toAll="/products"
      />

      {/* Best sellers */}
      <ProductsSection
        title="Bán chạy"
        items={bestItems}
        loading={loading}
        err={err}
        toAll="/products"
      />
    </div>
  );
}

/* ProductsSection & ProductCard: giữ nguyên logic, chỉ thay đổi UI nhẹ */
function ProductsSection({ title, items, loading, err, toAll }) {
  const { addItem } = useCart();
  const content = useMemo(() => {
    if (loading) {
      return (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(560px,1fr))] gap-10">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="bg-white border-2 rounded-3xl overflow-hidden animate-pulse"
            >
              <div className="aspect-[4/3] md:aspect-[3/2] bg-gray-100" />
              <div className="p-8 space-y-4">
                <div className="h-6 w-3/4 bg-gray-100 rounded" />
                <div className="h-6 w-1/2 bg-gray-100 rounded" />
                <div className="h-12 w-1/2 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      );
    }
    if (err) return <div className="text-red-600">⚠ {err}</div>;
    if (!items?.length)
      return <div className="text-gray-600">Chưa có sản phẩm.</div>;

    return (
      <div className="grid grid-cols-[repeat(auto-fill,minmax(560px,1fr))] gap-10">
        {items.map((p) => (
          <ProductCard
            key={p._id}
            p={p}
            onAdd={(n = 1) =>
              addItem(
                {
                  id: p._id,
                  name: p.name,
                  price: p.price,
                  img: p.poster || p.images?.[0] || "",
                  slug: p.slug || p._id,
                },
                n
              )
            }
          />
        ))}
      </div>
    );
  }, [items, loading, err, addItem]);

  return (
    <section className={`${FULL} space-y-6`}>
      <div className="flex items-baseline justify-between">
        <h2 className="text-3xl md:text-4xl font-semibold">{title}</h2>
        <Link
          to={toAll}
          className="text-[#B88E2F] hover:underline text-lg"
        >
          Xem thêm
        </Link>
      </div>
      {content}
    </section>
  );
}

function ProductCard({ p, onAdd }) {
  const slugOrId = p.slug || p._id;
  const img = p.poster || p.images?.[0] || "";
  const GOLD = "#B88E2F";
  return (
    <article className="group bg-white border-2 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition">
      <div className="relative">
        <Link to={`/products/${slugOrId}`} className="block">
          <ImgSafe
            src={img}
            alt={p.name}
            className="w-full aspect-[4/3] md:aspect-[3/2] object-cover group-hover:scale-[1.03] transition"
          />
        </Link>
        {p.is3D && (
          <span className="absolute right-4 top-4 rounded-md bg-black/70 text-white text-xs px-2 py-1">
            3D
          </span>
        )}
      </div>

      <div className="p-8">
        <h3 className="line-clamp-2 font-medium text-2xl md:text-3xl">
          {p.name}
        </h3>
        <div
          className="mt-3 text-2xl md:text-3xl font-extrabold"
          style={{ color: GOLD }}
        >
          {vnd(p.price)}
        </div>

        <div className="mt-6 flex items-center gap-4 fx-push">
          <Link
            to={`/products/${slugOrId}`}
            className="rounded-xl border px-6 py-3 text-base hover:bg-black hover:text-white transition"
          >
            Xem chi tiết
          </Link>
          <button
          
            className="rounded-xl border px-6 py-3 text-base hover:opacity-95 fx-push"
            style={{ background: GOLD, borderColor: GOLD }}
            onClick={() => onAdd?.(1)}
          >
            Thêm giỏ hàng
          </button>
        </div>
      </div>
    </article>
  );
}
