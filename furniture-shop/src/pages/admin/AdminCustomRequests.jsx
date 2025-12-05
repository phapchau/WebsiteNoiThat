



// // src/pages/admin/AdminCustomRequests.jsx
// import { useEffect, useState } from "react";
// import axios from "../../services/axiosClient";
// import { vnd } from "../../utils/format";

// const ORIGIN = import.meta.env.VITE_API_ORIGIN || "http://localhost:8081";
// const fileUrl = (u = "") => (/^https?:/i.test(u) ? u : `${ORIGIN}${u.startsWith("/") ? u : "/" + u}`);

// /** Nhãn tiếng Việt cho status (dùng code chuẩn UPPERCASE làm key) */
// const STATUS_LABELS_VI = {
//   SUBMITTED:    "Khách đã gửi yêu cầu",
//   REVIEWING:    "Đang xem xét",
//   QUOTED:       "Đã báo giá",
//   ACCEPTED:     "Khách chấp nhận",
//   REJECTED:     "Khách từ chối",
//   CANCELED:     "Khách hủy yêu cầu",
//   IN_PROGRESS:  "Đang thi công",
//   DONE:         "Hoàn thành",
// };

// /** Helper: chuẩn hoá mã trạng thái bất kể BE trả về hoa/thường */
// function viStatus(status) {
//   const code = (status || "").toString().trim().toUpperCase();
//   return STATUS_LABELS_VI[code] || "Không rõ";
// }

// export default function AdminCustomRequests() {
//   const [rows, setRows] = useState([]);
//   const [status, setStatus] = useState("all");
//   const [busy, setBusy] = useState("");
//   const [err, setErr] = useState("");

//   async function load() {
//     try {
//       setErr("");
//       const params = {};
//       if (status && status !== "all") params.status = status; // giữ nguyên code UPPERCASE để BE lọc
//       const { data } = await axios.get("/api/custom-requests", { params });
//       const list = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
//       setRows(list);
//     } catch (e) {
//       setErr(e?.response?.data?.message || "Không tải được danh sách yêu cầu.");
//       setRows([]);
//     }
//   }

//   useEffect(() => {
//     load(); // eslint-disable-next-line
//   }, [status]);

//   async function setStatusReq(id, s) {
//     if (!id) return;
//     setBusy(id);
//     try {
//       await axios.patch(`/api/custom-requests/${id}/status`, { status: s });
//       await load();
//     } finally {
//       setBusy("");
//     }
//   }

//   async function setQuote(id) {
//     const price = Number(prompt("Nhập giá báo (VNĐ):") || "0");
//     const lead = Number(prompt("Thời gian thực hiện (ngày):") || "0");
//     const note = prompt("Ghi chú thêm (tuỳ chọn)") || "";
//     if (!price || !lead) return;
//     setBusy(id);
//     try {
//       await axios.patch(`/api/custom-requests/${id}/quote`, {
//         price,
//         leadTimeDays: lead,
//         note,
//       });
//       await load();
//     } finally {
//       setBusy("");
//     }
//   }

//   return (
//     <section className="space-y-4">
//       <div className="flex items-center justify-between">
//         <h1 className="text-xl lg:text-2xl font-semibold">Quản lý yêu cầu thiết kế</h1>

//         {/* Bộ lọc trạng thái: value là code UPPERCASE, hiển thị tiếng Việt */}
//         <select
//           value={status}
//           onChange={(e) => setStatus(e.target.value)}
//           className="border rounded-lg px-3 py-2 bg-white/10"
//         >
//           <option value="all" className="bg-[#0f172a]">Tất cả trạng thái</option>
//           {Object.entries(STATUS_LABELS_VI).map(([code, label]) => (
//             <option key={code} value={code} className="bg-[#0f172a]">
//               {label}
//             </option>
//           ))}
//         </select>
//       </div>

//       {err && (
//         <div className="text-sm px-3 py-2 rounded-lg bg-red-500/10 text-red-300 border border-red-500/20">
//           {err}
//         </div>
//       )}

//       <div className="space-y-3">
//         {rows.map((r) => (
//           <div key={r._id} className="border rounded-xl p-4 bg-white/5">
//             <div className="flex items-start justify-between gap-4">
//               <div className="min-w-0">
//                 <div className="font-medium text-[15px]">{r.brief?.title || "Không tiêu đề"}</div>
//                 <div className="text-xs opacity-70 mt-0.5">
//                   Mã yêu cầu: #{r.code || r._id?.slice(-6)} • {r.customer?.name || r.customer?.email || "Khách"} •{" "}
//                   {new Date(r.createdAt || r.updatedAt || Date.now()).toLocaleString("vi-VN")} •{" "}
//                   <span className="font-medium">{viStatus(r.status)}</span>
//                 </div>

//                 {r.brief?.description && (
//                   <div className="text-sm mt-2">{r.brief.description}</div>
//                 )}

//                 <div className="text-xs opacity-80 mt-2">
//                   Kích thước: {r.brief?.dimensions || "—"} • Chất liệu: {r.brief?.materials || "—"} • Màu sắc: {r.brief?.color || "—"} • Ngân sách: {r.brief?.budgetMax ? vnd(r.brief.budgetMax) : "—"}
//                 </div>

//                 {!!r.files?.length && (
//                   <div className="mt-3 flex gap-2 overflow-x-auto">
//                     {r.files.map((f, i) => (
//                       <img
//                         key={i}
//                         src={fileUrl(f.url)}
//                         alt=""
//                         className="w-16 h-16 object-cover rounded border bg-white"
//                       />
//                     ))}
//                   </div>
//                 )}
//               </div>

//               <div className="text-right min-w-44 shrink-0">
//                 {r.quote?.price && (
//                   <div className="font-semibold text-[15px]" style={{ color: "#B88E2F" }}>
//                     Báo giá: {vnd(r.quote.price)}
//                   </div>
//                 )}
//                 {r.quote?.leadTimeDays && (
//                   <div className="text-sm opacity-70">
//                     Thời gian dự kiến: {r.quote.leadTimeDays} ngày
//                   </div>
//                 )}

//                 <div className="mt-3 flex flex-col gap-2">
//                   <button
//                     onClick={() => setStatusReq(r._id, "REVIEWING")}
//                     disabled={busy === r._id}
//                     className="px-3 py-1.5 rounded-lg border hover:bg-white/10 disabled:opacity-50"
//                   >
//                     Đánh giá yêu cầu
//                   </button>

//                   <button
//                     onClick={() => setQuote(r._id)}
//                     disabled={busy === r._id}
//                     className="px-3 py-1.5 rounded-lg text-white disabled:opacity-50"
//                     style={{ backgroundColor: "#B88E2F" }}
//                   >
//                     Báo giá cho khách
//                   </button>

//                   <button
//                     onClick={() => setStatusReq(r._id, "IN_PROGRESS")}
//                     disabled={busy === r._id}
//                     className="px-3 py-1.5 rounded-lg border hover:bg-white/10 disabled:opacity-50"
//                   >
//                     Bắt đầu thi công
//                   </button>

//                   <button
//                     onClick={() => setStatusReq(r._id, "DONE")}
//                     disabled={busy === r._id}
//                     className="px-3 py-1.5 rounded-lg border hover:bg-white/10 disabled:opacity-50"
//                   >
//                     Đánh dấu hoàn thành
//                   </button>
//                 </div>
//               </div>
//             </div>
//           </div>
//         ))}

//         {!rows.length && !err && <div className="opacity-70">Chưa có yêu cầu nào.</div>}
//       </div>
//     </section>
//   );
// }//4/11













// // src/pages/admin/AdminCustomRequests.jsx
// import { useEffect, useState } from "react";
// import axios from "../../services/axiosClient";
// import { vnd } from "../../utils/format";


// const ORIGIN = import.meta.env.VITE_API_ORIGIN || "http://localhost:8081";
// const fileUrl = (u = "") => (/^https?:/i.test(u) ? u : `${ORIGIN}${u.startsWith("/") ? u : "/" + u}`);

// /** Nhãn tiếng Việt cho status (dùng code chuẩn UPPERCASE làm key) */
// const STATUS_LABELS_VI = {
//   SUBMITTED:   "Khách đã gửi yêu cầu",
//   REVIEWING:   "Đang xem xét",
//   QUOTED:      "Đã báo giá",
//   ACCEPTED:    "Khách chấp nhận",
//   REJECTED:    "Khách từ chối",
//   CANCELED:    "Khách hủy yêu cầu",
//   IN_PROGRESS: "Đang thi công",
//   DONE:        "Hoàn thành",
// };

// /** Helper: chuẩn hoá mã trạng thái bất kể BE trả về hoa/thường */
// function viStatus(status) {
//   const code = (status || "").toString().trim().toUpperCase();
//   return STATUS_LABELS_VI[code] || "Không rõ";
// }

// /** Chỉ để style badge theo mã UPPERCASE (không ảnh hưởng logic) */
// const STATUS_TONE = {
//   SUBMITTED:   "bg-amber-100 text-amber-800",
//   REVIEWING:   "bg-sky-100 text-sky-800",
//   QUOTED:      "bg-indigo-100 text-indigo-800",
//   ACCEPTED:    "bg-emerald-100 text-emerald-800",
//   REJECTED:    "bg-rose-100 text-rose-800",
//   CANCELED:    "bg-rose-100 text-rose-800",
//   IN_PROGRESS: "bg-blue-100 text-blue-800",
//   DONE:        "bg-lime-100 text-lime-800",
// };
// const toneOf = (status) =>
//   STATUS_TONE[(status || "").toString().trim().toUpperCase()] || "bg-gray-100 text-gray-700";

// /** Helper hiển thị kích thước: KHÔNG đổi logic/API — chỉ ghép chuỗi để hiển thị */
// function dimText(brief = {}) {
//   // Nếu sau này bạn lưu chuỗi sẵn thì dùng luôn
//   const raw =
//     (typeof brief.dimensions === "string" && brief.dimensions.trim()) ||
//     (typeof brief.size === "string" && brief.size.trim()) ||
//     (typeof brief.sizeText === "string" && brief.sizeText.trim());
//   if (raw) return raw;

//   // Ghép từ length/width/height + unit (các tên khóa phổ biến)
//   const L = brief.length ?? brief.L;
//   const W = brief.width ?? brief.W;
//   const H = brief.height ?? brief.H;
//   const unit = brief.unit || "cm";

//   const parts = [
//     (L || L === 0) ? `D:${L}` : null, // Dài
//     (W || W === 0) ? `R:${W}` : null, // Rộng
//     (H || H === 0) ? `C:${H}` : null, // Cao
//   ].filter(Boolean);

//   return parts.length ? `${parts.join(" × ")} ${unit}` : "—";
// }

// export default function AdminCustomRequests() {
//   const [rows, setRows] = useState([]);
//   const [status, setStatus] = useState("all");
//   const [busy, setBusy] = useState("");
//   const [err, setErr] = useState("");

//   async function load() {
//     try {
//       setErr("");
//       const params = {};
//       if (status && status !== "all") params.status = status; // dùng UPPERCASE để BE lọc
//       const { data } = await axios.get("/api/custom-requests", { params });
//       const list = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
//       setRows(list);
//     } catch (e) {
//       setErr(e?.response?.data?.message || "Không tải được danh sách yêu cầu.");
//       setRows([]);
//     }
//   }

//   useEffect(() => {
//     load(); // eslint-disable-next-line
//   }, [status]);

//   async function setStatusReq(id, s) {
//     if (!id) return;
//     setBusy(id);
//     try {
//       await axios.patch(`/api/custom-requests/${id}/status`, { status: s });
//       await load();
//     } finally {
//       setBusy("");
//     }
//   }

//   async function setQuote(id) {
//     const price = Number(prompt("Nhập giá báo (VNĐ):") || "0");
//     const lead = Number(prompt("Thời gian thực hiện (ngày):") || "0");
//     const note = prompt("Ghi chú thêm (tuỳ chọn)") || "";
//     if (!price || !lead) return;
//     setBusy(id);
//     try {
//       await axios.patch(`/api/custom-requests/${id}/quote`, {
//         price,
//         leadTimeDays: lead,
//         note,
//       });
//       await load();
//     } finally {
//       setBusy("");
//     }
//   }

//   return (
//     <section className="max-w-6xl mx-auto px-4 sm:px-6 py-6 md:py-8 space-y-5">
//       {/* Header */}
//       <div className="rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50 via-white to-amber-50 px-5 py-4 md:px-6 md:py-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
//         <div>
//           <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-gray-900">
//             Quản lý yêu cầu thiết kế
//           </h1>
//           <p className="text-sm text-gray-600 mt-0.5">Xem danh sách, báo giá và cập nhật trạng thái thi công.</p>
//         </div>

//         {/* Filter */}



//         {/* <div className="flex items-center gap-2">
//           <label className="text-sm text-gray-600">Trạng thái:</label>
//           <select
//             value={status}
//             onChange={(e) => setStatus(e.target.value)}
//             className="rounded-xl border px-3 py-2 bg-white text-sm shadow-sm hover:shadow focus:outline-none"
//           >
//             <option value="all">Tất cả</option>
//             {Object.entries(STATUS_LABELS_VI).map(([code, label]) => (
//               <option key={code} value={code}>{label}</option>
//             ))}
//           </select>
//         </div> */}

//         <div className="flex items-center gap-2">
//   <label className="text-sm text-gray-700 dark:text-gray-200">Trạng thái:</label>
//   <select
//     value={status}
//     onChange={(e) => setStatus(e.target.value)}
//     className="
//       rounded-xl px-3 py-2 text-sm shadow-sm
//       bg-slate-100 text-gray-900 border border-gray-300
//       hover:bg-slate-200 hover:border-gray-400
//       focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-500
//       dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600
//       dark:hover:bg-slate-700 dark:hover:border-slate-500
//       dark:focus:ring-white/10 dark:focus:border-slate-400
//     "
//   >
//     <option value="all">Tất cả</option>
//     {Object.entries(STATUS_LABELS_VI).map(([code, label]) => (
//       <option key={code} value={code}>{label}</option>
//     ))}
//   </select>
// </div>

//       </div>

//       {err && (
//         <div className="text-sm px-4 py-2 rounded-xl bg-red-50 text-red-700 border border-red-200">
//           {err}
//         </div>
//       )}

//       <div className="space-y-4">
//         {rows.map((r) => {
//           const statusCode = (r.status || "").toString().toUpperCase();

//           return (
//             <div
//               key={r._id}
//               className="rounded-2xl border bg-white p-5 md:p-6 shadow-sm hover:shadow-md transition text-black"
//             >
//               {/* Top row: title + badge + meta + quote summary */}
//               <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
//                 <div className="min-w-0">
//                   <div className="flex flex-wrap items-center gap-2">
//                     <div className="font-semibold text-lg text-black truncate">
//                       {r.brief?.title || "Không tiêu đề"}
//                     </div>
//                     <span
//                       className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-medium ${toneOf(
//                         statusCode
//                       )}`}
//                     >
//                       <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
//                       {viStatus(statusCode)}
//                     </span>
//                   </div>
//                   <div className="text-xs text-black mt-1">
//                     Mã yêu cầu:{" "}
//                     <span className="font-medium text-black">#{r.code || r._id?.slice(-6)}</span> •{" "}
//                     {r.customer?.name || r.customer?.email || "Khách"} •{" "}
//                     {new Date(r.createdAt || r.updatedAt || Date.now()).toLocaleString("vi-VN")}
//                   </div>
//                 </div>

//                 <div className="text-right md:min-w-[220px]">
//                   {r.quote?.price && (
//                     <>
//                       <div className="text-sm text-black">Báo giá</div>
//                       <div className="text-base font-semibold" style={{ color: "#B88E2F" }}>
//                         {vnd(r.quote.price)}
//                       </div>
//                     </>
//                   )}
//                   {r.quote?.leadTimeDays && (
//                     <div className="text-xs text-black mt-0.5">
//                       Thời gian dự kiến:{" "}
//                       <span className="font-medium text-black">{r.quote.leadTimeDays} ngày</span>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Description */}
//               {r.brief?.description && (
//                 <p className="mt-3 text-sm leading-relaxed text-black">{r.brief.description}</p>
//               )}

//               {/* Specs */}
//               <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-1.5 text-[15px] text-black">
//                 <div>
//                   Kích thước:{" "}
//                   <span className="font-medium text-black">{dimText(r.brief)}</span>
//                 </div>
//                 <div>
//                   Chất liệu:{" "}
//                   <span className="font-medium text-black">{r.brief?.materials || "—"}</span>
//                 </div>
//                 <div>
//                   Màu sắc:{" "}
//                   <span className="font-medium text-black">{r.brief?.color || "—"}</span>
//                 </div>
//                 {r.brief?.budgetMax ? (
//                   <div>
//                     Ngân sách:{" "}
//                     <span className="font-medium text-black">{vnd(r.brief.budgetMax)}</span>
//                   </div>
//                 ) : null}
//               </div>

//               {/* Files */}
//               {!!r.files?.length && (
//                 <div className="mt-4 flex flex-wrap gap-3">
//                   {r.files.map((f, i) => (
//                     <img
//                       key={i}
//                       src={fileUrl(f.url)}
//                       alt=""
//                       className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-xl border hover:scale-[1.02] transition"
//                     />
//                   ))}
//                 </div>
//               )}

//               {/* Actions */}
//               <div className="mt-5 flex flex-wrap gap-2">
//                 <button
//                   onClick={() => setStatusReq(r._id, "REVIEWING")}
//                   disabled={busy === r._id}
//                   className="px-3.5 py-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 text-sm"
//                 >
//                   Đánh giá yêu cầu
//                 </button>

//                 <button
//                   onClick={() => setQuote(r._id)}
//                   disabled={busy === r._id}
//                   className="px-3.5 py-2 rounded-lg text-white disabled:opacity-50 text-sm"
//                   style={{ backgroundColor: "#B88E2F" }}
//                 >
//                   Báo giá cho khách
//                 </button>

//                 <button
//                   onClick={() => setStatusReq(r._id, "IN_PROGRESS")}
//                   disabled={busy === r._id}
//                   className="px-3.5 py-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 text-sm"
//                 >
//                   Bắt đầu thi công
//                 </button>

//                 <button
//                   onClick={() => setStatusReq(r._id, "DONE")}
//                   disabled={busy === r._id}
//                   className="px-3.5 py-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50 text-sm"
//                 >
//                   Đánh dấu hoàn thành
//                 </button>
//               </div>
//             </div>
//           );
//         })}

//         {!rows.length && !err && (
//           <div className="rounded-2xl border bg-white p-10 text-center shadow-sm text-black">
//             <div className="mx-auto mb-3 h-16 w-16 rounded-full bg-amber-100 flex items-center justify-center">
//               <span className="text-3xl">📝</span>
//             </div>
//             <div>Chưa có yêu cầu nào.</div>
//           </div>
//         )}
//       </div>
//     </section>
//   );
// }//9/11






// // src/pages/admin/AdminCustomRequests.jsx
// import { useEffect, useState } from "react";
// import axios from "../../services/axiosClient";
// import { vnd } from "../../utils/format";

// const ORIGIN = import.meta.env.VITE_API_ORIGIN || "http://localhost:8081";
// const fileUrl = (u = "") => (/^https?:/i.test(u) ? u : `${ORIGIN}${u.startsWith("/") ? u : "/" + u}`);

// /** Nhãn tiếng Việt cho status (dùng code chuẩn UPPERCASE làm key) */
// const STATUS_LABELS_VI = {
//   SUBMITTED:   "Khách đã gửi yêu cầu",
//   REVIEWING:   "Đang xem xét",
//   QUOTED:      "Đã báo giá",
//   ACCEPTED:    "Khách chấp nhận",
//   REJECTED:    "Khách từ chối",
//   CANCELED:    "Khách hủy yêu cầu",
//   IN_PROGRESS: "Đang thi công",
//   DONE:        "Hoàn thành",
// };

// function viStatus(status) {
//   const code = (status || "").toString().trim().toUpperCase();
//   return STATUS_LABELS_VI[code] || "Không rõ";
// }

// const STATUS_TONE = {
//   SUBMITTED:   "bg-amber-100 text-amber-800",
//   REVIEWING:   "bg-sky-100 text-sky-800",
//   QUOTED:      "bg-indigo-100 text-indigo-800",
//   ACCEPTED:    "bg-emerald-100 text-emerald-800",
//   REJECTED:    "bg-rose-100 text-rose-800",
//   CANCELED:    "bg-rose-100 text-rose-800",
//   IN_PROGRESS: "bg-blue-100 text-blue-800",
//   DONE:        "bg-lime-100 text-lime-800",
// };
// const toneOf = (status) =>
//   STATUS_TONE[(status || "").toString().trim().toUpperCase()] || "bg-gray-100 text-gray-700";

// function dimText(brief = {}) {
//   const raw =
//     (typeof brief.dimensions === "string" && brief.dimensions.trim()) ||
//     (typeof brief.size === "string" && brief.size.trim()) ||
//     (typeof brief.sizeText === "string" && brief.sizeText.trim());
//   if (raw) return raw;

//   const L = brief.length ?? brief.L;
//   const W = brief.width ?? brief.W;
//   const H = brief.height ?? brief.H;
//   const unit = brief.unit || "cm";

//   const parts = [
//     (L || L === 0) ? `D:${L}` : null,
//     (W || W === 0) ? `R:${W}` : null,
//     (H || H === 0) ? `C:${H}` : null,
//   ].filter(Boolean);

//   return parts.length ? `${parts.join(" × ")} ${unit}` : "—";
// }

// export default function AdminCustomRequests() {
//   const [rows, setRows] = useState([]);
//   const [status, setStatus] = useState("all");
//   const [busy, setBusy] = useState("");
//   const [err, setErr] = useState("");

//   // ===== Modal báo giá (UI mới, logic giữ nguyên) =====
//   const [quoteModal, setQuoteModal] = useState({
//     open: false,
//     id: null,
//     price: "",
//     leadTimeDays: "",
//     note: "",
//     submitting: false,
//     error: "",
//   });

//   async function load() {
//     try {
//       setErr("");
//       const params = {};
//       if (status && status !== "all") params.status = status;
//       const { data } = await axios.get("/api/custom-requests", { params });
//       const list = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
//       setRows(list);
//     } catch (e) {
//       setErr(e?.response?.data?.message || "Không tải được danh sách yêu cầu.");
//       setRows([]);
//     }
//   }

//   useEffect(() => {
//     load(); // eslint-disable-next-line
//   }, [status]);

//   async function setStatusReq(id, s) {
//     if (!id) return;
//     setBusy(id);
//     try {
//       await axios.patch(`/api/custom-requests/${id}/status`, { status: s });
//       await load();
//     } finally {
//       setBusy("");
//     }
//   }

//   // MỞ modal báo giá (thay cho prompt) — không đổi API/luồng
//   function openQuote(id) {
//     setQuoteModal({
//       open: true,
//       id,
//       price: "",
//       leadTimeDays: "",
//       note: "",
//       submitting: false,
//       error: "",
//     });
//   }

//   function closeQuote() {
//     setQuoteModal((s) => ({ ...s, open: false, error: "", submitting: false }));
//   }

//   // async function submitQuote(e) {
//   //   e?.preventDefault?.();
//   //   const id = quoteModal.id;
//   //   const price = Number(String(quoteModal.price).replaceAll(",", "").trim() || "0");
//   //   const lead = Number(String(quoteModal.leadTimeDays).trim() || "0");
//   //   const note = String(quoteModal.note || "");

//   //   if (!id) return;
//   //   if (!price || !lead) {
//   //     setQuoteModal((s) => ({ ...s, error: "Vui lòng nhập giá báo và thời gian thực hiện hợp lệ." }));
//   //     return;
//   //   }

//   //   setQuoteModal((s) => ({ ...s, submitting: true, error: "" }));
//   //   try {
//   //     await axios.patch(`/api/custom-requests/${id}/quote`, {
//   //       price,
//   //       leadTimeDays: lead,
//   //       note,
//   //     });
//   //     closeQuote();
//   //     await load();
//   //   } catch (e) {
//   //     setQuoteModal((s) => ({
//   //       ...s,
//   //       submitting: false,
//   //       error: e?.response?.data?.message || "Gửi báo giá thất bại",
//   //     }));
//   //   }
//   // }



//   async function submitQuote(e) {
//     e?.preventDefault?.();
//     const id = quoteModal.id;
//     const price = Number(String(quoteModal.price).replaceAll(",", "").trim() || "0");
//     const lead = Number(String(quoteModal.leadTimeDays).trim() || "0");
//     const depositPercent = Number(quoteModal.depositPercent || 0);
//     const note = String(quoteModal.note || "");

//     if (!id) return;
//     if (!price || !lead) {
//       setQuoteModal((s) => ({ ...s, error: "Vui lòng nhập giá báo và thời gian thực hiện hợp lệ." }));
//       return;
//     }

//     setQuoteModal((s) => ({ ...s, submitting: true, error: "" }));
//     try {
//       await axios.patch(`/api/custom-requests/${id}/quote`, {
//         price,
//         leadTimeDays: lead,
//         note,
//         depositPercent, // <-- gửi depositPercent về backend
//       });
//       closeQuote();
//       await load();
//     } catch (e) {
//       setQuoteModal((s) => ({
//         ...s,
//         submitting: false,
//         error: e?.response?.data?.message || "Gửi báo giá thất bại",
//       }));
//     }
//   }



//   // ===================================================

//   return (
//     <section className="max-w-[1440px] mx-auto px-6 md:px-10 py-8 md:py-12 space-y-7">
//       {/* Header */}
//       <div className="rounded-3xl border border-amber-100 bg-gradient-to-r from-amber-50 via-white to-amber-50 px-6 md:px-8 py-5 md:py-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between shadow-sm">
//         <div>
//           <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-gray-900">
//             Quản lý yêu cầu thiết kế
//           </h1>
//           <p className="text-sm text-gray-600 mt-0.5">
//             Xem danh sách, báo giá và cập nhật trạng thái thi công.
//           </p>
//         </div>

//         {/* Filter */}
//         <div className="flex items-center gap-2">
//           <label className="text-sm text-gray-700 dark:text-gray-200">Trạng thái:</label>
//           <select
//             value={status}
//             onChange={(e) => setStatus(e.target.value)}
//             className="
//               rounded-xl px-3 py-2 text-sm shadow-sm
//               bg-slate-100 text-gray-900 border border-gray-300
//               hover:bg-slate-200 hover:border-gray-400
//               focus:outline-none focus:ring-2 focus:ring-black/10 focus:border-gray-500
//               dark:bg-slate-800 dark:text-slate-100 dark:border-slate-600
//               dark:hover:bg-slate-700 dark:hover:border-slate-500
//               dark:focus:ring-white/10 dark:focus:border-slate-400
//             "
//           >
//             <option value="all">Tất cả</option>
//             {Object.entries(STATUS_LABELS_VI).map(([code, label]) => (
//               <option key={code} value={code}>{label}</option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {err && (
//         <div className="text-sm px-4 py-2 rounded-xl bg-red-50 text-red-700 border border-red-200">
//           {err}
//         </div>
//       )}

//       {/* List */}
//       <div className="space-y-6 md:space-y-8">
//         {rows.map((r) => {
//           const statusCode = (r.status || "").toString().toUpperCase();

//           return (
//             <div
//               key={r._id}
//               className="rounded-3xl border-2 border-gray-100 bg-white p-6 sm:p-7 md:p-8 lg:p-9 shadow-sm hover:shadow-lg transition text-black"
//             >
//               {/* Top: title + badge + meta + quote */}
//               <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
//                 <div className="min-w-0">
//                   <div className="flex flex-wrap items-center gap-3">
//                     <div className="font-semibold text-xl md:text-2xl text-black truncate">
//                       {r.brief?.title || "Không tiêu đề"}
//                     </div>
//                     <span
//                       className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs md:text-sm font-medium ${toneOf(
//                         statusCode
//                       )}`}
//                     >
//                       <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
//                       {viStatus(statusCode)}
//                     </span>
//                   </div>
//                   <div className="text-sm md:text-[15px] text-black/80 mt-1.5">
//                     Mã yêu cầu:{" "}
//                     <span className="font-medium text-black">#{r.code || r._id?.slice(-6)}</span> •{" "}
//                     {r.customer?.name || r.customer?.email || "Khách"} •{" "}
//                     {new Date(r.createdAt || r.updatedAt || Date.now()).toLocaleString("vi-VN")}
//                   </div>
//                 </div>

//                 <div className="text-right md:min-w-[260px]">
//                   {r.quote?.price && (
//                     <>
//                       <div className="text-sm text-black/70">Báo giá</div>
//                       <div className="text-xl md:text-2xl font-semibold" style={{ color: "#B88E2F" }}>
//                         {vnd(r.quote.price)}
//                       </div>
//                     </>
//                   )}
//                   {r.quote?.leadTimeDays && (
//                     <div className="text-xs md:text-sm text-black mt-1">
//                       Thời gian dự kiến:{" "}
//                       <span className="font-medium text-black">{r.quote.leadTimeDays} ngày</span>
//                     </div>
//                   )}
//                 </div>
//               </div>

//               {/* Description */}
//               {r.brief?.description && (
//                 <p className="mt-4 text-[15px] md:text-base leading-relaxed text-black/90">
//                   {r.brief.description}
//                 </p>
//               )}

//               {/* Specs */}
//               <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-8 gap-y-2 text-[15px] md:text-base text-black">
//                 <div>
//                   Kích thước: <span className="font-medium text-black">{dimText(r.brief)}</span>
//                 </div>
//                 <div>
//                   Chất liệu: <span className="font-medium text-black">{r.brief?.materials || "—"}</span>
//                 </div>
//                 <div>
//                   Màu sắc: <span className="font-medium text-black">{r.brief?.color || "—"}</span>
//                 </div>
//                 {r.brief?.budgetMax ? (
//                   <div>
//                     Ngân sách: <span className="font-medium text-black">{vnd(r.brief.budgetMax)}</span>
//                   </div>
//                 ) : null}
//               </div>

//               {/* Files */}
//               {!!r.files?.length && (
//                 <div className="mt-5 flex flex-wrap gap-4">
//                   {r.files.map((f, i) => (
//                     <img
//                       key={i}
//                       src={fileUrl(f.url)}
//                       alt=""
//                       className="w-28 h-28 md:w-32 md:h-32 object-cover rounded-2xl border hover:scale-[1.02] transition"
//                     />
//                   ))}
//                 </div>
//               )}

//               {/* Actions */}
//               <div className="mt-6 flex flex-wrap gap-3">
//                 <button
//                   onClick={() => setStatusReq(r._id, "REVIEWING")}
//                   disabled={busy === r._id}
//                   className="px-4 py-2.5 rounded-xl border hover:bg-gray-50 disabled:opacity-50 text-sm md:text-[15px]"
//                 >
//                   Đánh giá yêu cầu
//                 </button>

//                 <button
//                   onClick={() => openQuote(r._id)}
//                   disabled={busy === r._id}
//                   className="px-4 py-2.5 rounded-xl text-white disabled:opacity-50 text-sm md:text-[15px]"
//                   style={{ backgroundColor: "#B88E2F" }}
//                 >
//                   Báo giá cho khách
//                 </button>

//                 <button
//                   onClick={() => setStatusReq(r._id, "IN_PROGRESS")}
//                   disabled={busy === r._id}
//                   className="px-4 py-2.5 rounded-xl border hover:bg-gray-50 disabled:opacity-50 text-sm md:text-[15px]"
//                 >
//                   Bắt đầu thi công
//                 </button>

//                 <button
//                   onClick={() => setStatusReq(r._id, "DONE")}
//                   disabled={busy === r._id}
//                   className="px-4 py-2.5 rounded-xl border hover:bg-gray-50 disabled:opacity-50 text-sm md:text-[15px]"
//                 >
//                   Đánh dấu hoàn thành
//                 </button>
//               </div>
//             </div>
//           );
//         })}

//         {!rows.length && !err && (
//           <div className="rounded-3xl border bg-white p-14 text-center shadow-sm text-black">
//             <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-amber-100 flex items-center justify-center">
//               <span className="text-4xl">📝</span>
//             </div>
//             <div className="text-[15px] md:text-base">Chưa có yêu cầu nào.</div>
//           </div>
//         )}
//       </div>

//       {/* ===== Quote Modal ===== */}
//       {quoteModal.open && (
//         <div className="fixed inset-0 z-[60] flex items-center justify-center">
//           {/* backdrop */}
//           <div
//             className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
//             onClick={closeQuote}
//           />
//           {/* dialog */}
//           <div className="relative w-[92vw] sm:w-[560px] md:w-[680px] lg:w-[760px] bg-white rounded-2xl shadow-2xl border border-gray-100 p-6 md:p-8">
//             <div className="flex items-start justify-between mb-4">
//               <h3 className="text-lg md:text-xl font-semibold">Báo giá cho khách</h3>
//               <button
//                 onClick={closeQuote}
//                 className="h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center"
//                 aria-label="Close"
//               >
//                 ✕
//               </button>
//             </div>

//            {/* <form onSubmit={submitQuote} className="space-y-4">
//   <div className="space-y-1">
//     <label className="text-sm text-black">Giá báo (VNĐ)</label>
//     <input
//       inputMode="numeric"
//       className="w-full border rounded-xl px-3 py-2 text-black placeholder:text-gray-400"
//       placeholder="Ví dụ: 3,500,000"
//       value={quoteModal.price}
//       onChange={(e) => setQuoteModal((s) => ({ ...s, price: e.target.value }))}
//       autoFocus
//     />
//   </div>

//   <div className="space-y-1">
//     <label className="text-sm text-black">Thời gian thực hiện (ngày)</label>
//     <input
//       type="number"
//       min={1}
//       className="w-full border rounded-xl px-3 py-2 text-black placeholder:text-gray-400"
//       placeholder="Ví dụ: 7"
//       value={quoteModal.leadTimeDays}
//       onChange={(e) => setQuoteModal((s) => ({ ...s, leadTimeDays: e.target.value }))}
//     />
//   </div>

//   <div className="space-y-1">
//     <label className="text-sm text-black">Ghi chú</label>
//     <textarea
//       rows={4}
//       className="w-full border rounded-xl px-3 py-2 text-black placeholder:text-gray-400"
//       placeholder="Thông tin bổ sung cho khách (tuỳ chọn)"
//       value={quoteModal.note}
//       onChange={(e) => setQuoteModal((s) => ({ ...s, note: e.target.value }))}
//     />
//   </div>

//   {quoteModal.error && (
//     <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
//       {quoteModal.error}
//     </div>
//   )}

//   <div className="flex items-center justify-end gap-3 pt-2">
//     <button
//       type="button"
//       onClick={closeQuote}
//       className="px-4 py-2 rounded-xl border hover:bg-gray-50 text-black"
//     >
//       Hủy
//     </button>
//     <button
//       type="submit"
//       disabled={quoteModal.submitting}
//       className="px-4 py-2 rounded-xl text-white disabled:opacity-50"
//       style={{ backgroundColor: "#B88E2F" }}
//     >
//       {quoteModal.submitting ? "Đang gửi…" : "Gửi báo giá"}
//     </button>
//   </div>
// </form> */}




// <form onSubmit={submitQuote} className="space-y-4">
//   <div className="grid grid-cols-2 gap-4">
//     <div className="space-y-1">
//       <label className="text-sm text-black">Giá báo (VNĐ)</label>
//       <input
//         inputMode="numeric"
//         className="w-full border rounded-xl px-3 py-2 text-black placeholder:text-gray-400"
//         placeholder="Ví dụ: 3,500,000"
//         value={quoteModal.price}
//         onChange={(e) => setQuoteModal((s) => ({ ...s, price: e.target.value }))}
//         autoFocus
//       />
//     </div>

//     {/* <div className="space-y-1">
//       <label className="text-sm text-black">Cọc (phần trăm)</label>
//       <select
//         value={quoteModal.depositPercent ?? ""}
//         onChange={(e) => setQuoteModal((s) => ({ ...s, depositPercent: Number(e.target.value) }))}
//         className="w-full border rounded-xl px-3 py-2 text-black"
//       >
//         <option value={0}>0% (Không đặt cọc)</option>
//         <option value={30}>30% (Đề xuất)</option>
//       </select>
//     </div> */}
//   </div>

//   <div className="space-y-1">
//     <label className="text-sm text-black">Thời gian thực hiện (ngày)</label>
//     <input
//       type="number"
//       min={1}
//       className="w-full border rounded-xl px-3 py-2 text-black placeholder:text-gray-400"
//       placeholder="Ví dụ: 7"
//       value={quoteModal.leadTimeDays}
//       onChange={(e) => setQuoteModal((s) => ({ ...s, leadTimeDays: e.target.value }))}
//     />
//   </div>

//   <div className="space-y-1">
//     <label className="text-sm text-black">Ghi chú</label>
//     <textarea
//       rows={4}
//       className="w-full border rounded-xl px-3 py-2 text-black placeholder:text-gray-400"
//       placeholder="Thông tin bổ sung cho khách (tuỳ chọn)"
//       value={quoteModal.note}
//       onChange={(e) => setQuoteModal((s) => ({ ...s, note: e.target.value }))}
//     />
//   </div>

//   {quoteModal.error && (
//     <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">
//       {quoteModal.error}
//     </div>
//   )}

//   <div className="flex items-center justify-end gap-3 pt-2">
//     <button
//       type="button"
//       onClick={closeQuote}
//       className="px-4 py-2 rounded-xl border hover:bg-gray-50 text-black"
//     >
//       Hủy
//     </button>
//     <button
//       type="submit"
//       disabled={quoteModal.submitting}
//       className="px-4 py-2 rounded-xl text-white disabled:opacity-50"
//       style={{ backgroundColor: "#B88E2F" }}
//     >
//       {quoteModal.submitting ? "Đang gửi…" : "Gửi báo giá"}
//     </button>
//   </div>
// </form>



//           </div>
//         </div>
//       )}
//       {/* ===== End Quote Modal ===== */}
//     </section>
//   );
// }//28/11












// src/pages/admin/AdminCustomRequests.jsx
import { useEffect, useState } from "react";
import axios from "../../services/axiosClient";
import { vnd } from "../../utils/format";
import {
  Button,
  Tag,
  Modal,
  Input,
  InputNumber,
  Form,
  message,
  Select,
  Divider,
  Card,
} from "antd";
import {
  EditOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  ToolOutlined,
} from "@ant-design/icons";

const { TextArea } = Input;
const ORIGIN = import.meta.env.VITE_API_ORIGIN || "http://localhost:8081";
const fileUrl = (u = "") => (/^https?:/i.test(u) ? u : `${ORIGIN}${u.startsWith("/") ? u : "/" + u}`);

const STATUS_LABELS_VI = {
  SUBMITTED: "Khách đã gửi yêu cầu",
  REVIEWING: "Đang xem xét",
  QUOTED: "Đã báo giá",
  ACCEPTED: "Khách chấp nhận",
  REJECTED: "Khách từ chối",
  CANCELED: "Khách hủy yêu cầu",
  IN_PROGRESS: "Đang thi công",
  DONE: "Hoàn thành",
};

const STATUS_COLORS = {
  SUBMITTED: "gold",
  REVIEWING: "blue",
  QUOTED: "purple",
  ACCEPTED: "green",
  REJECTED: "red",
  CANCELED: "red",
  IN_PROGRESS: "geekblue",
  DONE: "lime",
};

const dimText = (brief = {}) => {
  const L = brief.length ?? brief.L;
  const W = brief.width ?? brief.W;
  const H = brief.height ?? brief.H;
  const unit = brief.unit || "cm";
  const parts = [
    (L || L === 0) && `D:${L}`,
    (W || W === 0) && `R:${W}`,
    (H || H === 0) && `C:${H}`,
  ].filter(Boolean);

  return parts.length ? `${parts.join(" × ")} ${unit}` : "—";
};

export default function AdminCustomRequests() {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("all");
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");

  // Quote modal state
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quoteTarget, setQuoteTarget] = useState(null);

  const [form] = Form.useForm();

  async function load() {
    try {
      setErr("");
      const params = {};
      if (status !== "all") params.status = status;

      const { data } = await axios.get("/api/custom-requests", { params });
      setRows(Array.isArray(data) ? data : data.items || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Không tải được danh sách yêu cầu");
    }
  }

  useEffect(() => {
    load();
  }, [status]);

  async function setStatusReq(id, s) {
    setBusy(id);
    try {
      await axios.patch(`/api/custom-requests/${id}/status`, { status: s });
      await load();
      message.success("Đã cập nhật trạng thái");
    } finally {
      setBusy("");
    }
  }

  function openQuote(id) {
    setQuoteTarget(id);
    setQuoteOpen(true);
    form.resetFields();
  }

  async function submitQuote() {
    const id = quoteTarget;
    const values = form.getFieldsValue();

    const price = Number(values.price || 0);
    const lead = Number(values.leadTimeDays || 0);

    if (!price || !lead) {
      message.error("Vui lòng nhập giá và thời gian hợp lệ");
      return;
    }

    try {
      await axios.patch(`/api/custom-requests/${id}/quote`, values);
      message.success("Gửi báo giá thành công");
      setQuoteOpen(false);
      await load();
    } catch (e) {
      message.error(e?.response?.data?.message || "Gửi báo giá thất bại");
    }
  }

  return (
    <section className="max-w-[1400px] mx-auto px-6 py-8 space-y-6">

      {/* HEADER */}
      <Card bordered className="shadow-sm">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="font-semibold text-xl">Quản lý yêu cầu thiết kế</h1>
            <p className="text-gray-600 text-sm mt-1">
              Xem, báo giá và cập nhật trạng thái thi công.
            </p>
          </div>

          <Select
            value={status}
            onChange={(v) => setStatus(v)}
            style={{ width: 240 }}
            options={[
              { label: "Tất cả", value: "all" },
              ...Object.entries(STATUS_LABELS_VI).map(([k, v]) => ({
                label: v,
                value: k,
              })),
            ]}
          />
        </div>
      </Card>

      {err && (
        <Card>
          <div className="text-red-600">{err}</div>
        </Card>
      )}

      {/* LIST */}
      <div className="space-y-6">
        {rows.map((r) => (
          <Card
            key={r._id}
            className="shadow-sm"
            style={{ borderRadius: 16 }}
          >
            {/* TITLE */}
            <div className="flex justify-between items-start flex-wrap gap-3">
              <div>
                <h2 className="font-semibold text-lg">{r.brief?.title || "Yêu cầu không tên"}</h2>
                <div className="text-gray-500 text-sm">
                  #{r.code} • {r.customer?.name} •{" "}
                  {new Date(r.createdAt).toLocaleString("vi-VN")}
                </div>
              </div>

              <Tag color={STATUS_COLORS[r.status] || "default"} style={{ padding: "6px 12px" }}>
                {STATUS_LABELS_VI[r.status] || "Không rõ"}
              </Tag>
            </div>

            <Divider />

            <p className="text-gray-700">{r.brief?.description}</p>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
              <div>Kích thước: <b>{dimText(r.brief)}</b></div>
              <div>Chất liệu: <b>{r.brief?.materials || "—"}</b></div>
              <div>Màu sắc: <b>{r.brief?.color || "—"}</b></div>
            </div>

            {/* Images */}
            {!!r.files?.length && (
              <div className="mt-4 flex flex-wrap gap-3">
                {r.files.map((f, i) => (
                  <img
                    key={i}
                    src={fileUrl(f.url)}
                    className="w-28 h-28 object-cover rounded-lg border"
                  />
                ))}
              </div>
            )}

            <Divider />

            {/* ACTIONS */}
            <div className="flex flex-wrap gap-3">
              <Button
                icon={<ClockCircleOutlined />}
                onClick={() => setStatusReq(r._id, "REVIEWING")}
                loading={busy === r._id}
              >
                Đánh giá yêu cầu
              </Button>

              <Button
                type="primary"
                icon={<DollarOutlined />}
                onClick={() => openQuote(r._id)}
                style={{ background: "#B88E2F" }}
              >
                Báo giá
              </Button>

              <Button
                icon={<ToolOutlined />}
                onClick={() => setStatusReq(r._id, "IN_PROGRESS")}
                loading={busy === r._id}
              >
                Bắt đầu thi công
              </Button>

              <Button
                icon={<CheckCircleOutlined />}
                onClick={() => setStatusReq(r._id, "DONE")}
                loading={busy === r._id}
              >
                Hoàn thành
              </Button>
            </div>
          </Card>
        ))}

        {!rows.length && !err && (
          <Card className="text-center py-10">
            <p className="text-gray-500">Không có yêu cầu nào</p>
          </Card>
        )}
      </div>

      {/* QUOTE MODAL */}
      <Modal
        open={quoteOpen}
        onCancel={() => setQuoteOpen(false)}
        title="Báo giá cho khách"
        okText="Gửi báo giá"
        onOk={submitQuote}
        okButtonProps={{ style: { background: "#B88E2F" } }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="price" label="Giá báo (VNĐ)" rules={[{ required: true }]}>
            <InputNumber
              min={1000}
              className="w-full"
              placeholder="Ví dụ: 3,500,000"
              formatter={(v) => `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            />
          </Form.Item>

          <Form.Item
            name="leadTimeDays"
            label="Thời gian thực hiện (ngày)"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} className="w-full" />
          </Form.Item>

          <Form.Item name="note" label="Ghi chú">
            <TextArea rows={4} placeholder="Thông tin bổ sung (tuỳ chọn)" />
          </Form.Item>
        </Form>
      </Modal>
    </section>
  );
}



