




// // src/pages/MyRequests.jsx
// import { useEffect, useState } from "react";
// import { Modal, notification } from "antd";
// import axiosClient from "../../services/axiosClient";
// import { fileUrl } from "../../utils/fileUrl";

// const VND = (n) => (Number(n || 0)).toLocaleString("vi-VN") + " đ";

// // trạng thái -> lớp tailwind (hiển thị)
// const STATUS_STYLE = {
//   pending: "bg-amber-100 text-amber-800",
//   quoted: "bg-sky-100 text-sky-800",
//   approved: "bg-emerald-100 text-emerald-800",
//   rejected: "bg-rose-100 text-rose-800",
//   created: "bg-gray-100 text-gray-700",
//   submitted: "bg-amber-100 text-amber-800",
//   reviewing: "bg-sky-100 text-sky-800",
//   awaiting_customer: "bg-amber-100 text-amber-800",
//   canceled: "bg-rose-100 text-rose-800",
//   in_progress: "bg-indigo-100 text-indigo-800",
//   done: "bg-lime-100 text-lime-800",
// };

// function askConfirm(message, { okText = "Đồng ý", cancelText = "Hủy", title = "Xác nhận" } = {}) {
//   return new Promise((resolve) => {
//     Modal.confirm({
//       centered: true,
//       title,
//       content: message,
//       okText,
//       cancelText,
//       onOk: () => resolve(true),
//       onCancel: () => resolve(false),
//     });
//   });
// }

// /** Hiển thị kích thước (giữ nguyên logic) */
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

// export default function MyRequests() {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [busyId, setBusyId] = useState(null);
//   const [msg, setMsg] = useState("");

//   async function load() {
//     setLoading(true);
//     try {
//       const { data } = await axiosClient.get("/api/custom-requests/me");
//       const list = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
//       setItems(list);
//       setMsg("");
//     } catch (e) {
//       setMsg("Không tải được danh sách: " + (e?.response?.data?.message || e.message));
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     load();
//   }, []);

//   // async function accept(id) {
//   //   const ok = await askConfirm("Bạn xác nhận ĐỒNG Ý báo giá này?");
//   //   if (!ok) return;
//   //   try {
//   //     setBusyId(id);
//   //     setMsg("");
//   //     await axiosClient.post(`/api/custom-requests/${id}/accept`);
//   //     notification.success({ message: "Đã đồng ý", description: "Bạn đã đồng ý báo giá.", placement: "topRight" });
//   //     await load();
//   //   } catch (e) {
//   //     const serverMsg = e?.response?.data?.message || e.message || "Lỗi";
//   //     setMsg("❌ " + serverMsg);
//   //     notification.error({ message: "Không thành công", description: serverMsg, placement: "topRight" });
//   //   } finally {
//   //     setBusyId(null);
//   //   }
//   // }



//   async function accept(id) {
//     // hỏi khách: cọc 30% (OK) hoặc 0% (Cancel)
//     const wantDeposit = await new Promise((resolve) => {
//       Modal.confirm({
//         centered: true,
//         title: "Xác nhận đồng ý báo giá",
//         content: "Bạn muốn đặt cọc 30% ngay bây giờ? (OK = 30% → chuyển sang VNPay, Cancel = 0% → không đặt cọc)",
//         okText: "Đặt cọc 30%",
//         cancelText: "Không cọc (0%)",
//         onOk: () => resolve(30),
//         onCancel: () => resolve(0),
//       });
//     });

//     if (wantDeposit === null) return;

//     try {
//       setBusyId(id);
//       setMsg("");

//       // Gọi accept trên backend, truyền depositPercent để backend lưu
//       await axiosClient.post(`/api/custom-requests/${id}/accept`, { depositPercent: wantDeposit });

//       // Nếu muốn deposit > 0 => tạo payment deposit và redirect tới VNPay
//       if (Number(wantDeposit) > 0) {
//         // backend endpoint tạo payment deposit
//         const { data } = await axiosClient.post("/api/pay/vnpay/create-deposit", { customRequestId: id });
//         if (data?.payUrl) {
//           // chuyển hướng người dùng tới VNPay
//           window.location.href = data.payUrl;
//           return; // không load lại ở đây vì user sẽ quay về FE qua VNP_RETURN_FE
//         } else {
//           // Nếu backend chỉ ghi order và không trả payUrl, vẫn reload danh sách
//           notification.success({ message: "Đã đồng ý", description: "Bạn đã đồng ý báo giá (không cần cọc)." , placement: "topRight" });
//           await load();
//         }
//       } else {
//         // không đặt cọc: chỉ mark accepted
//         notification.success({ message: "Đã đồng ý", description: "Bạn đã đồng ý báo giá (không đặt cọc).", placement: "topRight" });
//         await load();
//       }
//     } catch (e) {
//       const serverMsg = e?.response?.data?.message || e.message || "Lỗi";
//       setMsg("❌ " + serverMsg);
//       notification.error({ message: "Không thành công", description: serverMsg, placement: "topRight" });
//     } finally {
//       setBusyId(null);
//     }
//   }




//   async function reject(id) {
//     const ok = await askConfirm("Bạn muốn TỪ CHỐI báo giá này?");
//     if (!ok) return;
//     try {
//       setBusyId(id);
//       setMsg("");
//       await axiosClient.post(`/api/custom-requests/${id}/reject`);
//       notification.success({ message: "Đã từ chối", description: "Bạn đã từ chối báo giá.", placement: "topRight" });
//       await load();
//     } catch (e) {
//       const serverMsg = e?.response?.data?.message || e.message || "Lỗi";
//       setMsg("❌ " + serverMsg);
//       notification.error({ message: "Không thành công", description: serverMsg, placement: "topRight" });
//     } finally {
//       setBusyId(null);
//     }
//   }




//     async function payFinal(id) {
//   try {
//     setBusyId(id);
//     setMsg("");
//     const { data } = await axiosClient.post("/api/pay/vnpay/create-final", { customRequestId: id });
//     if (data?.payUrl) {
//       // Optional: confirm with user the amount that will be charged
//       // if (confirm(`Bạn sắp thanh toán ${VND(data.remaining)}. Tiếp tục?`)) {
//         window.location.href = data.payUrl;
//         return;
//       // }
//     }
//     notification.info({ message: "Thanh toán", description: "Không thể tạo link thanh toán. Vui lòng thử lại sau.", placement: "topRight" });
//   } catch (e) {
//     const serverMsg = e?.response?.data?.message || e.message || "Lỗi tạo payment";
//     setMsg("❌ " + serverMsg);
//     notification.error({ message: "Không thành công", description: serverMsg, placement: "topRight" });
//   } finally {
//     setBusyId(null);
//   }
// }






//   // NOTE: giữ logic gọi endpoint cancel dành cho khách hàng (POST /cancel)
//   async function cancelReq(id) {
//     const ok = await askConfirm("Bạn có chắc muốn hủy yêu cầu này?");
//     if (!ok) return;

//     try {
//       setBusyId(id);
//       setMsg("");

//       // trực tiếp gọi endpoint dành cho khách
//       await axiosClient.post(`/api/custom-requests/${id}/cancel`);
//       setMsg("✅ Đã hủy yêu cầu.");
//       notification.success({
//         message: "Đã huỷ yêu cầu",
//         description: "Yêu cầu đã được huỷ thành công.",
//         placement: "topRight",
//       });
//       await load();
//     } catch (err) {
//       const code = err?.response?.status;
//       const serverMsg = err?.response?.data?.message || err.message || "Không xác định";
//       // hiển thị thông tin rõ ràng cho user
//       notification.error({
//         message: `Không huỷ được ${code ? `(${code})` : ""}`,
//         description: serverMsg,
//         placement: "topRight",
//       });
//       setMsg("❌ " + serverMsg);
//     } finally {
//       setBusyId(null);
//     }
//   }

//   // canonical & timeline helpers (giữ nguyên)
//   const canonical = (k) => {
//     const s = (k || "created").toString().trim().replace(/-+/g, "_").toLowerCase();
//     if (s === "created") return "submitted";
//     if (s === "pending" || s === "awaiting_customer") return "quoted";
//     if (s === "accepted") return "approved";
//     return s;
//   };

//   const TIMELINE_STEPS = [
//     { key: "submitted", label: "Đã gửi" },
//     { key: "reviewing", label: "Đang xem xét" },
//     { key: "quoted", label: "Đã báo giá" },
//     { key: "approved", label: "Đã đồng ý" },
//     { key: "in_progress", label: "Thi công" },
//     { key: "done", label: "Hoàn thành" },
//   ];

//   const Chip = ({ className = "", children }) => (
//     <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${className}`}>
//       <span className="inline-block h-2 w-2 rounded-full bg-current opacity-80" />
//       {children}
//     </span>
//   );

//   const Timeline = ({ statusKey }) => {
//     const k = canonical(statusKey);
//     const activeIdx = (() => {
//       const i = TIMELINE_STEPS.findIndex((s) => s.key === k);
//       if (i >= 0) return i;
//       if (["rejected", "canceled"].includes(k)) return TIMELINE_STEPS.findIndex((s) => s.key === "quoted");
//       return 0;
//     })();
//     const isTerminated = ["rejected", "canceled"].includes(k);

//     return (
//       <div className="mt-4">
//         <div className="flex items-center gap-3">
//           {TIMELINE_STEPS.map((s, idx) => {
//             const isCurrent = idx === activeIdx && !isTerminated;
//             const isPast = idx < activeIdx && !isTerminated;
//             const dotBase = "h-7 w-7 rounded-full border flex items-center justify-center text-[12px] shrink-0";
//             const dotCls = isCurrent
//               ? "bg-emerald-600 border-emerald-600 text-white"
//               : isPast
//               ? "bg-emerald-200 border-emerald-300 text-emerald-700"
//               : "bg-white border-gray-300 text-gray-400";
//             const barCls =
//               idx < TIMELINE_STEPS.length - 1
//                 ? isCurrent
//                   ? "bg-emerald-600"
//                   : isPast
//                   ? "bg-emerald-200"
//                   : "bg-gray-200"
//                 : "";
//             return (
//               <div key={s.key} className="flex items-center gap-3 min-w-0 flex-1">
//                 <div className={`${dotBase} ${dotCls}`}>{idx + 1}</div>
//                 {idx < TIMELINE_STEPS.length - 1 && <div className={`h-1 flex-1 ${barCls}`} />}
//               </div>
//             );
//           })}
//         </div>

//         <div className="mt-3 grid grid-cols-6 gap-2 text-sm">
//           {TIMELINE_STEPS.map((s, idx) => {
//             const isCurrent = idx === activeIdx && !isTerminated;
//             const isPast = idx < activeIdx && !isTerminated;
//             const labelCls = isCurrent
//               ? "text-sm font-semibold text-emerald-700"
//               : isPast
//               ? "text-sm font-medium text-emerald-600"
//               : "text-sm text-gray-500";
//             return (
//               <div key={s.key} className={`truncate ${labelCls}`}>
//                 {s.label}
//               </div>
//             );
//           })}
//         </div>

//         {isTerminated && <div className="mt-3 text-sm text-rose-700 font-medium">Quy trình đã kết thúc.</div>}
//       </div>
//     );
//   };

//   return (
//     <section className="max-w-7xl mx-auto px-6 py-8">
//       {/* Header */}
//       <div className="mb-6 rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50 via-white to-amber-50 px-8 py-6">
//         <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900">Yêu cầu thiết kế của tôi</h1>
//         <p className="mt-2 text-gray-600 text-base">Theo dõi tiến độ, xem báo giá và phản hồi — thao tác nhanh chóng.</p>
//       </div>

//       {msg && (
//         <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-6 py-3 text-amber-900 text-sm">
//           {msg}
//         </div>
//       )}

//       {loading ? (
//         <div className="text-gray-600 italic">Đang tải…</div>
//       ) : !items.length ? (
//         <div className="rounded-2xl border bg-white p-12 text-center shadow-sm">
//           <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-amber-100 flex items-center justify-center">
//             <span className="text-4xl">📝</span>
//           </div>
//           <h3 className="text-2xl font-medium">Chưa có yêu cầu nào</h3>
//           <p className="mt-2 text-gray-600 text-base">
//             Hãy bắt đầu bằng cách gửi mô tả & hình ảnh sản phẩm bạn muốn thiết kế.
//           </p>
//           <a
//             href="/custom/new"
//             className="mt-6 inline-flex items-center gap-3 rounded-xl bg-black px-6 py-3 text-white hover:bg-black/90 transition"
//           >
//             Tạo yêu cầu mới
//             <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
//               <path d="M5 12h14M12 5l7 7-7 7" />
//             </svg>
//           </a>
//         </div>
//       ) : (
//         <div className="space-y-6">
//           {items.map((it) => {
//             const statusKey = (it.status || "created").toString().trim().replace(/-+/g, "_").toLowerCase();
//             const tagCls = "text-sm font-medium px-3 py-1.5 rounded-full " + (STATUS_STYLE[statusKey] || STATUS_STYLE.created);
//             const canRespondQuote = !!it.quote?.price && ["quoted", "pending", "awaiting_customer"].includes(statusKey);
//             const canCancel = ["created", "submitted", "reviewing", "quoted", "pending", "awaiting_customer"].includes(statusKey);

//             return (
//               <article key={it._id} className="rounded-2xl border bg-white p-8 shadow-sm hover:shadow-md transition">
//                 {/* Header */}
//                 <div className="flex items-start justify-between gap-6">
//                   <div className="min-w-0">
//                     <div className="flex items-center gap-3 flex-wrap">
//                       <div className="text-xl md:text-2xl font-semibold text-gray-900 truncate">
//                         #{it.code || it._id.slice(-6)} • {it.brief?.title || "Không tiêu đề"}
//                       </div>
//                       <Chip className={tagCls}>{it.status}</Chip>
//                     </div>
//                     {it.createdAt && (
//                       <div className="text-sm text-gray-500 mt-2">
//                         Tạo lúc: {new Date(it.createdAt).toLocaleString("vi-VN")}
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Timeline */}
//                 <Timeline statusKey={statusKey} />

//                 {/* Mô tả */}
//                 {it.brief?.description && (
//                   <p className="text-gray-700 mt-5 leading-relaxed text-base">{it.brief.description}</p>
//                 )}

//                 {/* Chi tiết nhỏ */}
//                 <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-[16px] text-gray-700">
//                   <div>
//                     Kích thước: <span className="font-medium text-gray-900">{dimText(it.brief)}</span>
//                   </div>
//                   <div>
//                     Chất liệu: <span className="font-medium text-gray-900">{it.brief?.materials || "—"}</span>
//                   </div>
//                   <div>
//                     Màu sắc: <span className="font-medium text-gray-900">{it.brief?.color || "—"}</span>
//                   </div>
//                   {it.brief?.budgetMax ? (
//                     <div>
//                       Ngân sách tối đa: <span className="font-medium text-gray-900">{VND(it.brief.budgetMax)}</span>
//                     </div>
//                   ) : null}
//                 </div>

//                 {/* Ảnh đính kèm */}
//                 {!!it.files?.length && (
//                   <div className="mt-5 flex flex-wrap gap-4">
//                     {it.files.map((f, i) => (
//                       <img
//                         key={i + (f.url || "")}
//                         src={fileUrl(f.url)}
//                         className="w-28 h-28 object-cover rounded-lg border hover:scale-[1.02] transition"
//                         alt=""
//                       />
//                     ))}
//                   </div>
//                 )}

//                 {/* Báo giá */}
//                 {it.quote?.price ? (
//                   <div className="mt-6 rounded-xl border p-5 bg-gradient-to-br from-gray-50 to-white">
//                     <div className="flex flex-wrap items-center gap-6 text-[16px] text-gray-800">
//                       <div className="inline-flex items-center gap-3">
//                         <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#B88E2F]/10 text-lg">
//                           💰
//                         </span>
//                         <div>
//                           <div className="text-sm">Báo giá</div>
//                           <div className="text-xl font-bold text-[#B88E2F]">{VND(it.quote.price)}</div>
//                         </div>
//                       </div>

//                       <div>
//                         <div className="text-sm">Thời gian</div>
//                         <div className="font-medium">{it.quote.leadTimeDays} ngày</div>
//                       </div>
//                     </div>

//                     {it.quote?.note && <div className="mt-3 text-sm text-gray-600">Ghi chú: <i>{it.quote.note}</i></div>}
//                   </div>
//                 ) : (
//                   <div className="mt-5 text-sm text-gray-500">Chưa có báo giá từ cửa hàng.</div>
//                 )}

//                 {/* Hành động */}
//                 {/* <div className="mt-6 flex flex-wrap gap-3">
//                   {canRespondQuote && (
//                     <>
//                       <button
//                         onClick={() => accept(it._id)}
//                         disabled={busyId === it._id}
//                         className="px-5 py-3 rounded-lg border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition text-sm"
//                       >
//                         {busyId === it._id ? "Đang xử lý…" : "Đồng ý báo giá"}
//                       </button>

//                       <button
//                         onClick={() => reject(it._id)}
//                         disabled={busyId === it._id}
//                         className="px-5 py-3 rounded-lg border text-gray-700 hover:bg-gray-100 transition text-sm"
//                       >
//                         Từ chối
//                       </button>
//                     </>
//                   )}

//                   {canCancel && (
//                     <button
//                       onClick={() => cancelReq(it._id)}
//                       disabled={busyId === it._id}
//                       className="px-5 py-3 rounded-lg border text-rose-600 hover:bg-rose-50 transition text-sm"
//                     >
//                       {busyId === it._id ? "Đang hủy…" : "Hủy yêu cầu"}
//                     </button>
//                   )}
//                 </div> */}

//                 {/* Hành động */}
//                 <div className="mt-6 flex flex-wrap gap-3">
//                   {canRespondQuote && (
//                     <>
//                       <button
//                         onClick={() => accept(it._id)}
//                         disabled={busyId === it._id}
//                         className="px-5 py-3 rounded-lg border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition text-sm"
//                       >
//                         {busyId === it._id ? "Đang xử lý…" : "Đồng ý báo giá"}
//                       </button>

//                       <button
//                         onClick={() => reject(it._id)}
//                         disabled={busyId === it._id}
//                         className="px-5 py-3 rounded-lg border text-gray-700 hover:bg-gray-100 transition text-sm"
//                       >
//                         Từ chối
//                       </button>
//                     </>
//                   )}

//                   {canCancel && (
//                     <button
//                       onClick={() => cancelReq(it._id)}
//                       disabled={busyId === it._id}
//                       className="px-5 py-3 rounded-lg border text-rose-600 hover:bg-rose-50 transition text-sm"
//                     >
//                       {busyId === it._id ? "Đang hủy…" : "Hủy yêu cầu"}
//                     </button>
//                   )}

//                   {/* Nút: Thanh toán phần còn lại (hiển thị điều kiện) */}
//                   {(() => {
//                     const quotePrice = Number(it.quote?.price || 0);
//                     const depositPercent = Number(it.quote?.depositPercent || 0);
//                     const depositPaid = !!it.depositPaid;
//                     const depositAmountPaid = Number(it.depositAmountPaid || 0);
//                     const finalPaid = !!it.finalPaid;

//                     // depositAmount based on percent (rounded)
//                     const depositAmountByPercent = Math.round((quotePrice * depositPercent) / 100);

//                     // Chính xác: remaining = tổng giá - số tiền cọc đã nộp (nếu có)
//                     // Nếu depositPercent === 0 => remaining = quotePrice (khách phải trả toàn bộ)
//                     const remaining = (() => {
//                       if (!quotePrice) return 0;
//                       if (!depositPercent) return quotePrice;
//                       // nếu deposit đã nộp, dùng depositAmountPaid (nếu backend lưu), else 0
//                       const paid = depositPaid ? (depositAmountPaid || depositAmountByPercent) : 0;
//                       // remaining = price - paid
//                       return Math.max(0, Math.round(quotePrice) - Math.round(paid));
//                     })();

//                     const normalizedStatus = (it.status || "created").toString().trim().replace(/-+/g, "_").toLowerCase();
//                     const statusAllowed = ["approved", "in_progress", "done"];
//                     const showPayFinal = quotePrice > 0 && !finalPaid && remaining > 0 && statusAllowed.includes(normalizedStatus);

//                     if (!showPayFinal) return null;

//                     return (
//                       <button
//                         onClick={() => payFinal(it._id)}
//                         disabled={busyId === it._id}
//                         className="px-5 py-3 rounded-lg border text-white"
//                         style={{ backgroundColor: "#B88E2F" }}
//                       >
//                         {busyId === it._id ? "Đang chuyển..." : `Thanh toán phần còn lại — ${VND(remaining)}`}
//                       </button>
//                     );
//                   })()}
//                 </div>




//                 {/* Badge trạng thái cuối */}
//                 <div className="mt-4">
//                   {statusKey === "approved" && <div className="text-sm text-emerald-700 font-medium">✅ Bạn đã đồng ý báo giá. Cửa hàng sẽ tiến hành sản xuất.</div>}
//                   {statusKey === "rejected" && <div className="text-sm text-rose-700 font-medium">❌ Bạn đã từ chối báo giá này.</div>}
//                   {statusKey === "canceled" && <div className="text-sm text-rose-700 font-medium">🚫 Bạn đã hủy yêu cầu này.</div>}
//                 </div>
//               </article>
//             );
//           })}
//         </div>
//       )}
//     </section>
//   );
// }//15/11














// // src/pages/MyRequests.jsx
// import { useEffect, useState } from "react";
// import { Modal, notification } from "antd";
// import axiosClient from "../../services/axiosClient";
// import { fileUrl } from "../../utils/fileUrl";

// const VND = (n) => (Number(n || 0)).toLocaleString("vi-VN") + " đ";

// // trạng thái -> lớp tailwind (hiển thị)
// const STATUS_STYLE = {
//   pending: "bg-amber-100 text-amber-800",
//   quoted: "bg-sky-100 text-sky-800",
//   approved: "bg-emerald-100 text-emerald-800",
//   rejected: "bg-rose-100 text-rose-800",
//   created: "bg-gray-100 text-gray-700",
//   submitted: "bg-amber-100 text-amber-800",
//   reviewing: "bg-sky-100 text-sky-800",
//   awaiting_customer: "bg-amber-100 text-amber-800",
//   canceled: "bg-rose-100 text-rose-800",
//   in_progress: "bg-indigo-100 text-indigo-800",
//   done: "bg-lime-100 text-lime-800",
// };

// function askConfirm(message, { okText = "Đồng ý", cancelText = "Hủy", title = "Xác nhận" } = {}) {
//   return new Promise((resolve) => {
//     Modal.confirm({
//       centered: true,
//       title,
//       content: message,
//       okText,
//       cancelText,
//       onOk: () => resolve(true),
//       onCancel: () => resolve(false),
//     });
//   });
// }

// /** Hiển thị kích thước (giữ nguyên logic) */
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

// export default function MyRequests() {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [busyId, setBusyId] = useState(null);
//   const [msg, setMsg] = useState("");

//   async function load() {
//     setLoading(true);
//     try {
//       const { data } = await axiosClient.get("/api/custom-requests/me");
//       const list = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
//       setItems(list);
//       setMsg("");
//     } catch (e) {
//       setMsg("Không tải được danh sách: " + (e?.response?.data?.message || e.message));
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     load();
//   }, []);

//   // async function accept(id) {
//   //   const ok = await askConfirm("Bạn xác nhận ĐỒNG Ý báo giá này?");
//   //   if (!ok) return;
//   //   try {
//   //     setBusyId(id);
//   //     setMsg("");
//   //     await axiosClient.post(`/api/custom-requests/${id}/accept`);
//   //     notification.success({ message: "Đã đồng ý", description: "Bạn đã đồng ý báo giá.", placement: "topRight" });
//   //     await load();
//   //   } catch (e) {
//   //     const serverMsg = e?.response?.data?.message || e.message || "Lỗi";
//   //     setMsg("❌ " + serverMsg);
//   //     notification.error({ message: "Không thành công", description: serverMsg, placement: "topRight" });
//   //   } finally {
//   //     setBusyId(null);
//   //   }
//   // }



//   async function accept(id) {
//     // hỏi khách: cọc 30% (OK) hoặc 0% (Cancel)
//     const wantDeposit = await new Promise((resolve) => {
//       Modal.confirm({
//         centered: true,
//         title: "Xác nhận đồng ý báo giá",
//         content: "Bạn muốn đặt cọc 30% ngay bây giờ? (OK = 30% → chuyển sang VNPay, Cancel = 0% → không đặt cọc)",
//         okText: "Đặt cọc 30%",
//         cancelText: "Không cọc (0%)",
//         onOk: () => resolve(30),
//         onCancel: () => resolve(0),
//       });
//     });

//     if (wantDeposit === null) return;

//     try {
//       setBusyId(id);
//       setMsg("");

//       // Gọi accept trên backend, truyền depositPercent để backend lưu
//       await axiosClient.post(`/api/custom-requests/${id}/accept`, { depositPercent: wantDeposit });

//       // Nếu muốn deposit > 0 => tạo payment deposit và redirect tới VNPay
//       if (Number(wantDeposit) > 0) {
//         // backend endpoint tạo payment deposit
//         const { data } = await axiosClient.post("/api/pay/vnpay/create-deposit", { customRequestId: id });
//         if (data?.payUrl) {
//           // chuyển hướng người dùng tới VNPay
//           window.location.href = data.payUrl;
//           return; // không load lại ở đây vì user sẽ quay về FE qua VNP_RETURN_FE
//         } else {
//           // Nếu backend chỉ ghi order và không trả payUrl, vẫn reload danh sách
//           notification.success({ message: "Đã đồng ý", description: "Bạn đã đồng ý báo giá (không cần cọc)." , placement: "topRight" });
//           await load();
//         }
//       } else {
//         // không đặt cọc: chỉ mark accepted
//         notification.success({ message: "Đã đồng ý", description: "Bạn đã đồng ý báo giá (không đặt cọc).", placement: "topRight" });
//         await load();
//       }
//     } catch (e) {
//       const serverMsg = e?.response?.data?.message || e.message || "Lỗi";
//       setMsg("❌ " + serverMsg);
//       notification.error({ message: "Không thành công", description: serverMsg, placement: "topRight" });
//     } finally {
//       setBusyId(null);
//     }
//   }




//   async function reject(id) {
//     const ok = await askConfirm("Bạn muốn TỪ CHỐI báo giá này?");
//     if (!ok) return;
//     try {
//       setBusyId(id);
//       setMsg("");
//       await axiosClient.post(`/api/custom-requests/${id}/reject`);
//       notification.success({ message: "Đã từ chối", description: "Bạn đã từ chối báo giá.", placement: "topRight" });
//       await load();
//     } catch (e) {
//       const serverMsg = e?.response?.data?.message || e.message || "Lỗi";
//       setMsg("❌ " + serverMsg);
//       notification.error({ message: "Không thành công", description: serverMsg, placement: "topRight" });
//     } finally {
//       setBusyId(null);
//     }
//   }




//     async function payFinal(id) {
//   try {
//     setBusyId(id);
//     setMsg("");
//     const { data } = await axiosClient.post("/api/pay/vnpay/create-final", { customRequestId: id });
//     if (data?.payUrl) {
//       // Optional: confirm with user the amount that will be charged
//       // if (confirm(`Bạn sắp thanh toán ${VND(data.remaining)}. Tiếp tục?`)) {
//         window.location.href = data.payUrl;
//         return;
//       // }
//     }
//     notification.info({ message: "Thanh toán", description: "Không thể tạo link thanh toán. Vui lòng thử lại sau.", placement: "topRight" });
//   } catch (e) {
//     const serverMsg = e?.response?.data?.message || e.message || "Lỗi tạo payment";
//     setMsg("❌ " + serverMsg);
//     notification.error({ message: "Không thành công", description: serverMsg, placement: "topRight" });
//   } finally {
//     setBusyId(null);
//   }
// }






//   // NOTE: giữ logic gọi endpoint cancel dành cho khách hàng (POST /cancel)
//   async function cancelReq(id) {
//     const ok = await askConfirm("Bạn có chắc muốn hủy yêu cầu này?");
//     if (!ok) return;

//     try {
//       setBusyId(id);
//       setMsg("");

//       // trực tiếp gọi endpoint dành cho khách
//       await axiosClient.post(`/api/custom-requests/${id}/cancel`);
//       setMsg("✅ Đã hủy yêu cầu.");
//       notification.success({
//         message: "Đã huỷ yêu cầu",
//         description: "Yêu cầu đã được huỷ thành công.",
//         placement: "topRight",
//       });
//       await load();
//     } catch (err) {
//       const code = err?.response?.status;
//       const serverMsg = err?.response?.data?.message || err.message || "Không xác định";
//       // hiển thị thông tin rõ ràng cho user
//       notification.error({
//         message: `Không huỷ được ${code ? `(${code})` : ""}`,
//         description: serverMsg,
//         placement: "topRight",
//       });
//       setMsg("❌ " + serverMsg);
//     } finally {
//       setBusyId(null);
//     }
//   }

//   // canonical & timeline helpers (giữ nguyên)
//   const canonical = (k) => {
//     const s = (k || "created").toString().trim().replace(/-+/g, "_").toLowerCase();
//     if (s === "created") return "submitted";
//     if (s === "pending" || s === "awaiting_customer") return "quoted";
//     if (s === "accepted") return "approved";
//     return s;
//   };

//   const TIMELINE_STEPS = [
//     { key: "submitted", label: "Đã gửi" },
//     { key: "reviewing", label: "Đang xem xét" },
//     { key: "quoted", label: "Đã báo giá" },
//     { key: "approved", label: "Đã đồng ý" },
//     { key: "in_progress", label: "Thi công" },
//     { key: "done", label: "Hoàn thành" },
//   ];

//   const Chip = ({ className = "", children }) => (
//     <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${className}`}>
//       <span className="inline-block h-2 w-2 rounded-full bg-current opacity-80" />
//       {children}
//     </span>
//   );

//   const Timeline = ({ statusKey }) => {
//     const k = canonical(statusKey);
//     const activeIdx = (() => {
//       const i = TIMELINE_STEPS.findIndex((s) => s.key === k);
//       if (i >= 0) return i;
//       if (["rejected", "canceled"].includes(k)) return TIMELINE_STEPS.findIndex((s) => s.key === "quoted");
//       return 0;
//     })();
//     const isTerminated = ["rejected", "canceled"].includes(k);

//     return (
//       <div className="mt-4">
//         <div className="flex items-center gap-3">
//           {TIMELINE_STEPS.map((s, idx) => {
//             const isCurrent = idx === activeIdx && !isTerminated;
//             const isPast = idx < activeIdx && !isTerminated;
//             const dotBase = "h-7 w-7 rounded-full border flex items-center justify-center text-[12px] shrink-0";
//             const dotCls = isCurrent
//               ? "bg-emerald-600 border-emerald-600 text-white"
//               : isPast
//               ? "bg-emerald-200 border-emerald-300 text-emerald-700"
//               : "bg-white border-gray-300 text-gray-400";
//             const barCls =
//               idx < TIMELINE_STEPS.length - 1
//                 ? isCurrent
//                   ? "bg-emerald-600"
//                   : isPast
//                   ? "bg-emerald-200"
//                   : "bg-gray-200"
//                 : "";
//             return (
//               <div key={s.key} className="flex items-center gap-3 min-w-0 flex-1">
//                 <div className={`${dotBase} ${dotCls}`}>{idx + 1}</div>
//                 {idx < TIMELINE_STEPS.length - 1 && <div className={`h-1 flex-1 ${barCls}`} />}
//               </div>
//             );
//           })}
//         </div>

//         <div className="mt-3 grid grid-cols-6 gap-2 text-sm">
//           {TIMELINE_STEPS.map((s, idx) => {
//             const isCurrent = idx === activeIdx && !isTerminated;
//             const isPast = idx < activeIdx && !isTerminated;
//             const labelCls = isCurrent
//               ? "text-sm font-semibold text-emerald-700"
//               : isPast
//               ? "text-sm font-medium text-emerald-600"
//               : "text-sm text-gray-500";
//             return (
//               <div key={s.key} className={`truncate ${labelCls}`}>
//                 {s.label}
//               </div>
//             );
//           })}
//         </div>

//         {isTerminated && <div className="mt-3 text-sm text-rose-700 font-medium">Quy trình đã kết thúc.</div>}
//       </div>
//     );
//   };

//   return (
//     <section className="max-w-7xl mx-auto px-6 py-8">
//       {/* Header */}
//       <div className="mb-6 rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50 via-white to-amber-50 px-8 py-6">
//         <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900">Yêu cầu thiết kế của tôi</h1>
//         <p className="mt-2 text-gray-600 text-base">Theo dõi tiến độ, xem báo giá và phản hồi — thao tác nhanh chóng.</p>
//       </div>

//       {msg && (
//         <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-6 py-3 text-amber-900 text-sm">
//           {msg}
//         </div>
//       )}

//       {loading ? (
//         <div className="text-gray-600 italic">Đang tải…</div>
//       ) : !items.length ? (
//         <div className="rounded-2xl border bg-white p-12 text-center shadow-sm">
//           <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-amber-100 flex items-center justify-center">
//             <span className="text-4xl">📝</span>
//           </div>
//           <h3 className="text-2xl font-medium">Chưa có yêu cầu nào</h3>
//           <p className="mt-2 text-gray-600 text-base">
//             Hãy bắt đầu bằng cách gửi mô tả & hình ảnh sản phẩm bạn muốn thiết kế.
//           </p>
//           <a
//             href="/custom/new"
//             className="mt-6 inline-flex items-center gap-3 rounded-xl bg-black px-6 py-3 text-white hover:bg-black/90 transition"
//           >
//             Tạo yêu cầu mới
//             <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
//               <path d="M5 12h14M12 5l7 7-7 7" />
//             </svg>
//           </a>
//         </div>
//       ) : (
//         <div className="space-y-6">
//           {items.map((it) => {
//             const statusKey = (it.status || "created").toString().trim().replace(/-+/g, "_").toLowerCase();
//             const tagCls = "text-sm font-medium px-3 py-1.5 rounded-full " + (STATUS_STYLE[statusKey] || STATUS_STYLE.created);
//             const canRespondQuote = !!it.quote?.price && ["quoted", "pending", "awaiting_customer"].includes(statusKey);
//             const canCancel = ["created", "submitted", "reviewing", "quoted", "pending", "awaiting_customer"].includes(statusKey);

//             return (
//               <article key={it._id} className="rounded-2xl border bg-white p-8 shadow-sm hover:shadow-md transition">
//                 {/* Header */}
//                 <div className="flex items-start justify-between gap-6">
//                   <div className="min-w-0">
//                     <div className="flex items-center gap-3 flex-wrap">
//                       <div className="text-xl md:text-2xl font-semibold text-gray-900 truncate">
//                         #{it.code || it._id.slice(-6)} • {it.brief?.title || "Không tiêu đề"}
//                       </div>
//                       <Chip className={tagCls}>{it.status}</Chip>
//                     </div>
//                     {it.createdAt && (
//                       <div className="text-sm text-gray-500 mt-2">
//                         Tạo lúc: {new Date(it.createdAt).toLocaleString("vi-VN")}
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 {/* Timeline */}
//                 <Timeline statusKey={statusKey} />

//                 {/* Mô tả */}
//                 {it.brief?.description && (
//                   <p className="text-gray-700 mt-5 leading-relaxed text-base">{it.brief.description}</p>
//                 )}

//                 {/* Chi tiết nhỏ */}
//                 <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-[16px] text-gray-700">
//                   <div>
//                     Kích thước: <span className="font-medium text-gray-900">{dimText(it.brief)}</span>
//                   </div>
//                   <div>
//                     Chất liệu: <span className="font-medium text-gray-900">{it.brief?.materials || "—"}</span>
//                   </div>
//                   <div>
//                     Màu sắc: <span className="font-medium text-gray-900">{it.brief?.color || "—"}</span>
//                   </div>
//                   {it.brief?.budgetMax ? (
//                     <div>
//                       Ngân sách tối đa: <span className="font-medium text-gray-900">{VND(it.brief.budgetMax)}</span>
//                     </div>
//                   ) : null}
//                 </div>

//                 {/* Ảnh đính kèm */}
//                 {!!it.files?.length && (
//                   <div className="mt-5 flex flex-wrap gap-4">
//                     {it.files.map((f, i) => (
//                       <img
//                         key={i + (f.url || "")}
//                         src={fileUrl(f.url)}
//                         className="w-28 h-28 object-cover rounded-lg border hover:scale-[1.02] transition"
//                         alt=""
//                       />
//                     ))}
//                   </div>
//                 )}

//                 {/* Báo giá */}
//                 {it.quote?.price ? (
//                   <div className="mt-6 rounded-xl border p-5 bg-gradient-to-br from-gray-50 to-white">
//                     <div className="flex flex-wrap items-center gap-6 text-[16px] text-gray-800">
//                       <div className="inline-flex items-center gap-3">
//                         <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#B88E2F]/10 text-lg">
//                           💰
//                         </span>
//                         <div>
//                           <div className="text-sm">Báo giá</div>
//                           <div className="text-xl font-bold text-[#B88E2F]">{VND(it.quote.price)}</div>
//                         </div>
//                       </div>

//                       <div>
//                         <div className="text-sm">Thời gian</div>
//                         <div className="font-medium">{it.quote.leadTimeDays} ngày</div>
//                       </div>
//                     </div>

//                     {it.quote?.note && <div className="mt-3 text-sm text-gray-600">Ghi chú: <i>{it.quote.note}</i></div>}
//                   </div>
//                 ) : (
//                   <div className="mt-5 text-sm text-gray-500">Chưa có báo giá từ cửa hàng.</div>
//                 )}

//                 {/* Hành động */}
//                 {/* <div className="mt-6 flex flex-wrap gap-3">
//                   {canRespondQuote && (
//                     <>
//                       <button
//                         onClick={() => accept(it._id)}
//                         disabled={busyId === it._id}
//                         className="px-5 py-3 rounded-lg border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition text-sm"
//                       >
//                         {busyId === it._id ? "Đang xử lý…" : "Đồng ý báo giá"}
//                       </button>

//                       <button
//                         onClick={() => reject(it._id)}
//                         disabled={busyId === it._id}
//                         className="px-5 py-3 rounded-lg border text-gray-700 hover:bg-gray-100 transition text-sm"
//                       >
//                         Từ chối
//                       </button>
//                     </>
//                   )}

//                   {canCancel && (
//                     <button
//                       onClick={() => cancelReq(it._id)}
//                       disabled={busyId === it._id}
//                       className="px-5 py-3 rounded-lg border text-rose-600 hover:bg-rose-50 transition text-sm"
//                     >
//                       {busyId === it._id ? "Đang hủy…" : "Hủy yêu cầu"}
//                     </button>
//                   )}
//                 </div> */}
// {/* Hành động */}
// <div className="mt-6 flex flex-wrap gap-3">
//   {canRespondQuote && (
//     <>
//       <button
//         onClick={() => accept(it._id)}
//         disabled={busyId === it._id}
//         className="px-5 py-3 rounded-lg border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition text-sm"
//       >
//         {busyId === it._id ? "Đang xử lý…" : "Đồng ý báo giá"}
//       </button>

//       <button
//         onClick={() => reject(it._id)}
//         disabled={busyId === it._id}
//         className="px-5 py-3 rounded-lg border text-gray-700 hover:bg-gray-100 transition text-sm"
//       >
//         Từ chối
//       </button>
//     </>
//   )}

//   {canCancel && (
//     <button
//       onClick={() => cancelReq(it._id)}
//       disabled={busyId === it._id}
//       className="px-5 py-3 rounded-lg border text-rose-600 hover:bg-rose-50 transition text-sm"
//     >
//       {busyId === it._id ? "Đang hủy…" : "Hủy yêu cầu"}
//     </button>
//   )}

//   {/* Nút thanh toán phần còn lại */}
//   {(() => {
//     const quotePrice = Number(it.quote?.price || 0);
//     const depositPercent = Number(it.quote?.depositPercent || 0);
//     const depositPaid = !!it.depositPaid;
//     // const depositAmountPaid = Number(it.depositAmountPaid || 0);
//     const depositAmountPaid = Number(it.depositPayment?.amount || 0);
//     const finalPaid = !!it.finalPaid;


// // ✅ Thêm console.log ngay đây
//   console.log({
//     quotePrice,
//     depositPercent,
//     depositPaid,
//     depositAmountPaid
//   });


//     // Tính số tiền cọc dựa trên phần trăm (làm tròn)
//     const depositAmountByPercent = Math.round((quotePrice * depositPercent) / 100);

//     // Tính số tiền còn lại cần thanh toán
//     const remaining = (() => {
//       if (!quotePrice) return 0;

//       if (depositPercent === 0) {
//         // Không đặt cọc, phải trả toàn bộ
//         return quotePrice;
//       } else {
//         // Có cọc
//         const paid = depositPaid ? depositAmountPaid || depositAmountByPercent : 0;
//         return Math.max(0, quotePrice - paid);
//       }
//     })();

//     const normalizedStatus = (it.status || "created").toString().trim().replace(/-+/g, "_").toLowerCase();
//     const statusAllowed = ["approved", "in_progress", "done"];
//     const showPayFinal = quotePrice > 0 && !finalPaid && remaining > 0 && statusAllowed.includes(normalizedStatus);

//     if (!showPayFinal) return null;

//     return (
//       <button
//         onClick={() => payFinal(it._id)}
//         disabled={busyId === it._id}
//         className="px-5 py-3 rounded-lg border text-white"
//         style={{ backgroundColor: "#B88E2F" }}
//       >
//         {busyId === it._id ? "Đang chuyển..." : `Thanh toán phần còn lại — ${VND(remaining)}`}
//       </button>
//     );
//   })()}
// </div>





//                 {/* Badge trạng thái cuối */}
//                 <div className="mt-4">
//                   {statusKey === "approved" && <div className="text-sm text-emerald-700 font-medium">✅ Bạn đã đồng ý báo giá. Cửa hàng sẽ tiến hành sản xuất.</div>}
//                   {statusKey === "rejected" && <div className="text-sm text-rose-700 font-medium">❌ Bạn đã từ chối báo giá này.</div>}
//                   {statusKey === "canceled" && <div className="text-sm text-rose-700 font-medium">🚫 Bạn đã hủy yêu cầu này.</div>}
//                 </div>
//               </article>
//             );
//           })}
//         </div>
//       )}
//     </section>
//   );
// }//16/11









// // src/pages/MyRequests.jsx
// import { useEffect, useState } from "react";
// import { Modal, notification } from "antd";
// import axiosClient from "../../services/axiosClient";
// import { fileUrl } from "../../utils/fileUrl";

// const VND = (n) => (Number(n || 0)).toLocaleString("vi-VN") + " đ";

// const STATUS_STYLE = {
//   pending: "bg-amber-100 text-amber-800",
//   quoted: "bg-sky-100 text-sky-800",
//   approved: "bg-emerald-100 text-emerald-800",
//   rejected: "bg-rose-100 text-rose-800",
//   created: "bg-gray-100 text-gray-700",
//   submitted: "bg-amber-100 text-amber-800",
//   reviewing: "bg-sky-100 text-sky-800",
//   awaiting_customer: "bg-amber-100 text-amber-800",
//   canceled: "bg-rose-100 text-rose-800",
//   in_progress: "bg-indigo-100 text-indigo-800",
//   done: "bg-lime-100 text-lime-800",
// };

// function askConfirm(message, { okText = "Đồng ý", cancelText = "Hủy", title = "Xác nhận" } = {}) {
//   return new Promise((resolve) => {
//     Modal.confirm({
//       centered: true,
//       title,
//       content: message,
//       okText,
//       cancelText,
//       onOk: () => resolve(true),
//       onCancel: () => resolve(false),
//     });
//   });
// }

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

// export default function MyRequests() {
//   const [items, setItems] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [busyId, setBusyId] = useState(null);
//   const [msg, setMsg] = useState("");

//   async function load() {
//     setLoading(true);
//     try {
//       const { data } = await axiosClient.get("/api/custom-requests/me");
//       const list = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
//       setItems(list);
//       setMsg("");
//     } catch (e) {
//       setMsg("Không tải được danh sách: " + (e?.response?.data?.message || e.message));
//     } finally {
//       setLoading(false);
//     }
//   }

//   useEffect(() => {
//     load();
//   }, []);

//   async function accept(id) {
//     const item = items.find(i => i._id === id);
//     if (!item?.quote?.price) return;

//     const depositPercent = item.quote.depositPercent || 30;
//     const depositAmount = Math.round((item.quote.price * depositPercent) / 100);

//     const wantDeposit = await new Promise((resolve) => {
//       Modal.confirm({
//         centered: true,
//         title: "Xác nhận đồng ý báo giá",
//         content: (
//           <div>
//             <p>Bạn đồng ý với báo giá <strong>{VND(item.quote.price)}</strong></p>
//             {depositPercent > 0 && (
//               <p className="mt-2">
//                 Đặt cọc <strong>{depositPercent}%</strong> ({VND(depositAmount)}) ngay?
//               </p>
//             )}
//           </div>
//         ),
//         okText: depositPercent > 0 ? `Cọc ${VND(depositAmount)}` : "Đồng ý",
//         cancelText: depositPercent > 0 ? "Không cọc" : "Hủy",
//         onOk: () => resolve(depositPercent),
//         onCancel: () => resolve(0),
//       });
//     });

//     if (wantDeposit === null) return;

//     try {
//       setBusyId(id);
//       setMsg("");

//       await axiosClient.post(`/api/custom-requests/${id}/accept`, { depositPercent: wantDeposit });

//       if (wantDeposit > 0) {
//         const { data } = await axiosClient.post("/api/pay/vnpay/create-deposit", { customRequestId: id });
//         if (data?.payUrl) {
//           window.location.href = data.payUrl;
//           return;
//         }
//       }

//       notification.success({ message: "Đã đồng ý báo giá!" });
//       await load();
//     } catch (e) {
//       const serverMsg = e?.response?.data?.message || e.message || "Lỗi";
//       setMsg("Lỗi: " + serverMsg);
//       notification.error({ message: "Không thành công", description: serverMsg, placement: "topRight" });
//     } finally {
//       setBusyId(null);
//     }
//   }

//   async function reject(id) {
//     const ok = await askConfirm("Bạn muốn TỪ CHỐI báo giá này?");
//     if (!ok) return;
//     try {
//       setBusyId(id);
//       setMsg("");
//       await axiosClient.post(`/api/custom-requests/${id}/reject`);
//       notification.success({ message: "Đã từ chối", description: "Bạn đã từ chối báo giá.", placement: "topRight" });
//       await load();
//     } catch (e) {
//       const serverMsg = e?.response?.data?.message || e.message || "Lỗi";
//       setMsg("Lỗi: " + serverMsg);
//       notification.error({ message: "Không thành công", description: serverMsg, placement: "topRight" });
//     } finally {
//       setBusyId(null);
//     }
//   }

//   async function payFinal(id) {
//     try {
//       setBusyId(id);
//       setMsg("");
//       const { data } = await axiosClient.post("/api/pay/vnpay/create-final", { customRequestId: id });
//       if (data?.payUrl) {
//         window.location.href = data.payUrl;
//         return;
//       }
//       notification.info({ message: "Thanh toán", description: "Không thể tạo link thanh toán. Vui lòng thử lại sau.", placement: "topRight" });
//     } catch (e) {
//       const serverMsg = e?.response?.data?.message || e.message || "Lỗi tạo payment";
//       setMsg("Lỗi: " + serverMsg);
//       notification.error({ message: "Không thành công", description: serverMsg, placement: "topRight" });
//     } finally {
//       setBusyId(null);
//     }
//   }

//   async function cancelReq(id) {
//     const ok = await askConfirm("Bạn có chắc muốn hủy yêu cầu này?");
//     if (!ok) return;

//     try {
//       setBusyId(id);
//       setMsg("");
//       await axiosClient.post(`/api/custom-requests/${id}/cancel`);
//       notification.success({
//         message: "Đã huỷ yêu cầu",
//         description: "Yêu cầu đã được huỷ thành công.",
//         placement: "topRight",
//       });
//       await load();
//     } catch (err) {
//       const serverMsg = err?.response?.data?.message || err.message || "Không xác định";
//       notification.error({
//         message: `Không huỷ được`,
//         description: serverMsg,
//         placement: "topRight",
//       });
//       setMsg("Lỗi: " + serverMsg);
//     } finally {
//       setBusyId(null);
//     }
//   }

//   const canonical = (k) => {
//     const s = (k || "created").toString().trim().replace(/-+/g, "_").toLowerCase();
//     if (s === "created") return "submitted";
//     if (s === "pending" || s === "awaiting_customer") return "quoted";
//     if (s === "accepted") return "approved";
//     return s;
//   };

//   const TIMELINE_STEPS = [
//     { key: "submitted", label: "Đã gửi" },
//     { key: "reviewing", label: "Đang xem xét" },
//     { key: "quoted", label: "Đã báo giá" },
//     { key: "approved", label: "Đã đồng ý" },
//     { key: "in_progress", label: "Thi công" },
//     { key: "done", label: "Hoàn thành" },
//   ];

//   const Chip = ({ className = "", children }) => (
//     <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${className}`}>
//       <span className="inline-block h-2 w-2 rounded-full bg-current opacity-80" />
//       {children}
//     </span>
//   );

//   const Timeline = ({ statusKey }) => {
//     const k = canonical(statusKey);
//     const activeIdx = (() => {
//       const i = TIMELINE_STEPS.findIndex((s) => s.key === k);
//       if (i >= 0) return i;
//       if (["rejected", "canceled"].includes(k)) return TIMELINE_STEPS.findIndex((s) => s.key === "quoted");
//       return 0;
//     })();
//     const isTerminated = ["rejected", "canceled"].includes(k);

//     return (
//       <div className="mt-4">
//         <div className="flex items-center gap-3">
//           {TIMELINE_STEPS.map((s, idx) => {
//             const isCurrent = idx === activeIdx && !isTerminated;
//             const isPast = idx < activeIdx && !isTerminated;
//             const dotBase = "h-7 w-7 rounded-full border flex items-center justify-center text-[12px] shrink-0";
//             const dotCls = isCurrent
//               ? "bg-emerald-600 border-emerald-600 text-white"
//               : isPast
//               ? "bg-emerald-200 border-emerald-300 text-emerald-700"
//               : "bg-white border-gray-300 text-gray-400";
//             const barCls =
//               idx < TIMELINE_STEPS.length - 1
//                 ? isCurrent
//                   ? "bg-emerald-600"
//                   : isPast
//                   ? "bg-emerald-200"
//                   : "bg-gray-200"
//                 : "";
//             return (
//               <div key={s.key} className="flex items-center gap-3 min-w-0 flex-1">
//                 <div className={`${dotBase} ${dotCls}`}>{idx + 1}</div>
//                 {idx < TIMELINE_STEPS.length - 1 && <div className={`h-1 flex-1 ${barCls}`} />}
//               </div>
//             );
//           })}
//         </div>

//         <div className="mt-3 grid grid-cols-6 gap-2 text-sm">
//           {TIMELINE_STEPS.map((s, idx) => {
//             const isCurrent = idx === activeIdx && !isTerminated;
//             const isPast = idx < activeIdx && !isTerminated;
//             const labelCls = isCurrent
//               ? "text-sm font-semibold text-emerald-700"
//               : isPast
//               ? "text-sm font-medium text-emerald-600"
//               : "text-sm text-gray-500";
//             return (
//               <div key={s.key} className={`truncate ${labelCls}`}>
//                 {s.label}
//               </div>
//             );
//           })}
//         </div>

//         {isTerminated && <div className="mt-3 text-sm text-rose-700 font-medium">Quy trình đã kết thúc.</div>}
//       </div>
//     );
//   };

//   return (
//     <section className="max-w-7xl mx-auto px-6 py-8">
//       <div className="mb-6 rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50 via-white to-amber-50 px-8 py-6">
//         <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900">Yêu cầu thiết kế của tôi</h1>
//         <p className="mt-2 text-gray-600 text-base">Theo dõi tiến độ, xem báo giá và phản hồi — thao tác nhanh chóng.</p>
//       </div>

//       {msg && (
//         <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-6 py-3 text-amber-900 text-sm">
//           {msg}
//         </div>
//       )}

//       {loading ? (
//         <div className="text-gray-600 italic">Đang tải…</div>
//       ) : !items.length ? (
//         <div className="rounded-2xl border bg-white p-12 text-center shadow-sm">
//           <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-amber-100 flex items-center justify-center">
//             <span className="text-4xl">Form</span>
//           </div>
//           <h3 className="text-2xl font-medium">Chưa có yêu cầu nào</h3>
//           <p className="mt-2 text-gray-600 text-base">
//             Hãy bắt đầu bằng cách gửi mô tả & hình ảnh sản phẩm bạn muốn thiết kế.
//           </p>
//           <a
//             href="/custom/new"
//             className="mt-6 inline-flex items-center gap-3 rounded-xl bg-black px-6 py-3 text-white hover:bg-black/90 transition"
//           >
//             Tạo yêu cầu mới
//             <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
//               <path d="M5 12h14M12 5l7 7-7 7" />
//             </svg>
//           </a>
//         </div>
//       ) : (
//         <div className="space-y-6">
//           {items.map((it) => {
//             const statusKey = canonical(it.status);
//             const tagCls = "text-sm font-medium px-3 py-1.5 rounded-full " + (STATUS_STYLE[statusKey] || STATUS_STYLE.created);
//             const canRespondQuote = !!it.quote?.price && ["quoted", "pending", "awaiting_customer"].includes(statusKey);
//             const canCancel = ["created", "submitted", "reviewing", "quoted", "pending", "awaiting_customer"].includes(statusKey);

//             // TÍNH TOÁN CHÍNH XÁC SỐ TIỀN CÒN LẠI
//             const quotePrice = Number(it.quote?.price || 0);
//             const depositPercent = Number(it.quote?.depositPercent || 0);
//             const depositPaid = !!it.depositPayment;
//             const depositAmountPaid = Number(it.depositPayment?.amount || it.quote?.depositAmount || 0); // SỬA TẠI ĐÂY
//             const finalPaid = !!it.finalPayment;

//             const depositAmountByPercent = Math.round((quotePrice * depositPercent) / 100);
//             const remaining = (() => {
//               if (!quotePrice) return 0;
//               if (depositPercent === 0) return quotePrice;
//               const paid = depositPaid ? depositAmountPaid : 0;
//               return Math.max(0, quotePrice - paid);
//             })();

//             const statusAllowed = ["in_progress", "done"];
//             const showPayFinal = quotePrice > 0 && !finalPaid && remaining > 0 && statusAllowed.includes(statusKey);

//             return (
//               <article key={it._id} className="rounded-2xl border bg-white p-8 shadow-sm hover:shadow-md transition">
//                 <div className="flex items-start justify-between gap-6">
//                   <div className="min-w-0">
//                     <div className="flex items-center gap-3 flex-wrap">
//                       <div className="text-xl md:text-2xl font-semibold text-gray-900 truncate">
//                         #{it.code || it._id.slice(-6)} • {it.brief?.title || "Không tiêu đề"}
//                       </div>
//                       <Chip className={tagCls}>{it.status}</Chip>
//                     </div>
//                     {it.createdAt && (
//                       <div className="text-sm text-gray-500 mt-2">
//                         Tạo lúc: {new Date(it.createdAt).toLocaleString("vi-VN")}
//                       </div>
//                     )}
//                   </div>
//                 </div>

//                 <Timeline statusKey={statusKey} />

//                 {it.brief?.description && (
//                   <p className="text-gray-700 mt-5 leading-relaxed text-base">{it.brief.description}</p>
//                 )}

//                 <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-[16px] text-gray-700">
//                   <div>
//                     Kích thước: <span className="font-medium text-gray-900">{dimText(it.brief)}</span>
//                   </div>
//                   <div>
//                     Chất liệu: <span className="font-medium text-gray-900">{it.brief?.materials || "—"}</span>
//                   </div>
//                   <div>
//                     Màu sắc: <span className="font-medium text-gray-900">{it.brief?.color || "—"}</span>
//                   </div>
//                   {it.brief?.budgetMax ? (
//                     <div>
//                       Ngân sách tối đa: <span className="font-medium text-gray-900">{VND(it.brief.budgetMax)}</span>
//                     </div>
//                   ) : null}
//                 </div>

//                 {!!it.files?.length && (
//                   <div className="mt-5 flex flex-wrap gap-4">
//                     {it.files.map((f, i) => (
//                       <img
//                         key={i + (f.url || "")}
//                         src={fileUrl(f.url)}
//                         className="w-28 h-28 object-cover rounded-lg border hover:scale-[1.02] transition"
//                         alt=""
//                       />
//                     ))}
//                   </div>
//                 )}

//                 {it.quote?.price ? (
//                   <div className="mt-6 rounded-xl border p-5 bg-gradient-to-br from-gray-50 to-white">
//                     <div className="flex flex-wrap items-center gap-6 text-[16px] text-gray-800">
//                       <div className="inline-flex items-center gap-3">
//                         <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#B88E2F]/10 text-lg">
//                           Money
//                         </span>
//                         <div>
//                           <div className="text-sm">Báo giá</div>
//                           <div className="text-xl font-bold text-[#B88E2F]">{VND(it.quote.price)}</div>
//                         </div>
//                       </div>

//                       <div>
//                         <div className="text-sm">Thời gian</div>
//                         <div className="font-medium">{it.quote.leadTimeDays} ngày</div>
//                       </div>

//                       {/* HIỂN THỊ ĐÃ CỌC */}
//                       {depositPaid && (
//                         <div>
//                           <div className="text-sm text-emerald-700">Đã cọc</div>
//                           <div className="font-medium text-emerald-700">
//                             {VND(depositAmountPaid)} ({depositPercent}%)
//                           </div>
//                         </div>
//                       )}
//                     </div>

//                     {it.quote?.note && <div className="mt-3 text-sm text-gray-600">Ghi chú: <i>{it.quote.note}</i></div>}
//                   </div>
//                 ) : (
//                   <div className="mt-5 text-sm text-gray-500">Chưa có báo giá từ cửa hàng.</div>
//                 )}

//                 <div className="mt-6 flex flex-wrap gap-3">
//                   {canRespondQuote && (
//                     <>
//                       <button
//                         onClick={() => accept(it._id)}
//                         disabled={busyId === it._id}
//                         className="px-5 py-3 rounded-lg border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition text-sm"
//                       >
//                         {busyId === it._id ? "Đang xử lý…" : "Đồng ý báo giá"}
//                       </button>

//                       <button
//                         onClick={() => reject(it._id)}
//                         disabled={busyId === it._id}
//                         className="px-5 py-3 rounded-lg border text-gray-700 hover:bg-gray-100 transition text-sm"
//                       >
//                         Từ chối
//                       </button>
//                     </>
//                   )}

//                   {canCancel && (
//                     <button
//                       onClick={() => cancelReq(it._id)}
//                       disabled={busyId === it._id}
//                       className="px-5 py-3 rounded-lg border text-rose-600 hover:bg-rose-50 transition text-sm"
//                     >
//                       {busyId === it._id ? "Đang hủy…" : "Hủy yêu cầu"}
//                     </button>
//                   )}

//                   {/* NÚT THANH TOÁN CÒN LẠI */}
//                   {showPayFinal && (
//                     <button
//                       onClick={() => payFinal(it._id)}
//                       disabled={busyId === it._id}
//                       className="px-5 py-3 rounded-lg border text-white"
//                       style={{ backgroundColor: "#B88E2F" }}
//                     >
//                       {busyId === it._id ? "Đang chuyển..." : `Thanh toán còn lại — ${VND(remaining)}`}
//                     </button>
//                   )}
//                 </div>

//                 <div className="mt-4">
//                   {statusKey === "approved" && <div className="text-sm text-emerald-700 font-medium">Bạn đã đồng ý báo giá. Cửa hàng sẽ tiến hành sản xuất.</div>}
//                   {statusKey === "rejected" && <div className="text-sm text-rose-700 font-medium">Bạn đã từ chối báo giá này.</div>}
//                   {statusKey === "canceled" && <div className="text-sm text-rose-700 font-medium">Bạn đã hủy yêu cầu này.</div>}
//                 </div>
//               </article>
//             );
//           })}
//         </div>
//       )}
//     </section>
//   );
// }//24/11









// src/pages/MyRequests.jsx
import { useEffect, useState } from "react";
import { Modal, notification } from "antd";
import axiosClient from "../../services/axiosClient";
import { fileUrl } from "../../utils/fileUrl";
import ModalCustomCheckout from "../../components/ModalCustomCheckout";

const VND = (n) => (Number(n || 0)).toLocaleString("vi-VN") + " đ";

const STATUS_STYLE = {
  pending: "bg-amber-100 text-amber-800",
  quoted: "bg-sky-100 text-sky-800",
  approved: "bg-emerald-100 text-emerald-800",
  rejected: "bg-rose-100 text-rose-800",
  created: "bg-gray-100 text-gray-700",
  submitted: "bg-amber-100 text-amber-800",
  reviewing: "bg-sky-100 text-sky-800",
  awaiting_customer: "bg-amber-100 text-amber-800",
  canceled: "bg-rose-100 text-rose-800",
  in_progress: "bg-indigo-100 text-indigo-800",
  done: "bg-lime-100 text-lime-800",
};

function askConfirm(message, { okText = "Đồng ý", cancelText = "Hủy", title = "Xác nhận" } = {}) {
  return new Promise((resolve) => {
    Modal.confirm({
      centered: true,
      title,
      content: message,
      okText,
      cancelText,
      onOk: () => resolve(true),
      onCancel: () => resolve(false),
    });
  });
}

function dimText(brief = {}) {
  const raw =
    (typeof brief.dimensions === "string" && brief.dimensions.trim()) ||
    (typeof brief.size === "string" && brief.size.trim()) ||
    (typeof brief.sizeText === "string" && brief.sizeText.trim());
  if (raw) return raw;

  const L = brief.length ?? brief.L;
  const W = brief.width ?? brief.W;
  const H = brief.height ?? brief.H;
  const unit = brief.unit || "cm";

  const parts = [
    (L || L === 0) ? `D:${L}` : null,
    (W || W === 0) ? `R:${W}` : null,
    (H || H === 0) ? `C:${H}` : null,
  ].filter(Boolean);

  return parts.length ? `${parts.join(" × ")} ${unit}` : "—";
}

export default function MyRequests() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState(null);
  const [msg, setMsg] = useState("");

  // Modal checkout
  const [checkoutReq, setCheckoutReq] = useState(null);

  async function load() {
    setLoading(true);
    try {
      const { data } = await axiosClient.get("/api/custom-requests/me");
      const list = Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [];
      setItems(list);
      setMsg("");
    } catch (e) {
      setMsg("Không tải được danh sách: " + (e?.response?.data?.message || e.message));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  /** ĐỒNG Ý BÁO GIÁ — KHÔNG CÒN CỌC */
  async function accept(id) {
    try {
      setBusyId(id);
      await axiosClient.post(`/api/custom-requests/${id}/accept`);
      notification.success({ message: "Đã đồng ý báo giá!" });
      await load();
    } catch (e) {
      notification.error({
        message: "Không thành công",
        description: e?.response?.data?.message || e.message,
      });
    } finally {
      setBusyId(null);
    }
  }

  async function reject(id) {
    const ok = await askConfirm("Bạn muốn TỪ CHỐI báo giá này?");
    if (!ok) return;

    try {
      setBusyId(id);
      await axiosClient.post(`/api/custom-requests/${id}/reject`);
      notification.success({ message: "Đã từ chối báo giá." });
      await load();
    } catch (e) {
      notification.error({
        message: "Không thành công",
        description: e?.response?.data?.message || e.message,
      });
    } finally {
      setBusyId(null);
    }
  }

  async function cancelReq(id) {
    const ok = await askConfirm("Bạn có chắc muốn hủy yêu cầu này?");
    if (!ok) return;

    try {
      setBusyId(id);
      await axiosClient.post(`/api/custom-requests/${id}/cancel`);
      notification.success({
        message: "Đã huỷ yêu cầu",
        description: "Yêu cầu đã được huỷ thành công.",
      });
      await load();
    } catch (err) {
      notification.error({
        message: "Không huỷ được",
        description: err?.response?.data?.message || err.message,
      });
    } finally {
      setBusyId(null);
    }
  }

  const canonical = (k) => {
    const s = (k || "created").toString().trim().replace(/-+/g, "_").toLowerCase();
    if (s === "created") return "submitted";
    if (s === "pending" || s === "awaiting_customer") return "quoted";
    if (s === "accepted") return "approved";
    return s;
  };

  const TIMELINE_STEPS = [
    { key: "submitted", label: "Đã gửi" },
    { key: "reviewing", label: "Đang xem xét" },
    { key: "quoted", label: "Đã báo giá" },
    { key: "approved", label: "Đã đồng ý" },
    { key: "in_progress", label: "Thi công" },
    { key: "done", label: "Hoàn thành" },
  ];

  const Chip = ({ className = "", children }) => (
    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${className}`}>
      <span className="inline-block h-2 w-2 rounded-full bg-current opacity-80" />
      {children}
    </span>
  );

  const Timeline = ({ statusKey }) => {
    const k = canonical(statusKey);
    const activeIdx = (() => {
      const i = TIMELINE_STEPS.findIndex((s) => s.key === k);
      if (i >= 0) return i;
      if (["rejected", "canceled"].includes(k)) return TIMELINE_STEPS.findIndex((s) => s.key === "quoted");
      return 0;
    })();
    const isTerminated = ["rejected", "canceled"].includes(k);

    return (
      <div className="mt-4">
        <div className="flex items-center gap-3">
          {TIMELINE_STEPS.map((s, idx) => {
            const isCurrent = idx === activeIdx && !isTerminated;
            const isPast = idx < activeIdx && !isTerminated;
            const dotBase = "h-7 w-7 rounded-full border flex items-center justify-center text-[12px] shrink-0";
            const dotCls = isCurrent
              ? "bg-emerald-600 border-emerald-600 text-white"
              : isPast
              ? "bg-emerald-200 border-emerald-300 text-emerald-700"
              : "bg-white border-gray-300 text-gray-400";
            const barCls =
              idx < TIMELINE_STEPS.length - 1
                ? isPast
                  ? "bg-emerald-200"
                  : isCurrent
                  ? "bg-emerald-600"
                  : "bg-gray-200"
                : "";
            return (
              <div key={s.key} className="flex items-center gap-3 min-w-0 flex-1">
                <div className={`${dotBase} ${dotCls}`}>{idx + 1}</div>
                {idx < TIMELINE_STEPS.length - 1 && <div className={`h-1 flex-1 ${barCls}`} />}
              </div>
            );
          })}
        </div>

        <div className="mt-3 grid grid-cols-6 gap-2 text-sm">
          {TIMELINE_STEPS.map((s, idx) => {
            const isCurrent = idx === activeIdx && !isTerminated;
            const isPast = idx < activeIdx && !isTerminated;
            const labelCls = isCurrent
              ? "text-emerald-700 font-semibold"
              : isPast
              ? "text-emerald-600 font-medium"
              : "text-gray-500";
            return (
              <div key={s.key} className={`truncate ${labelCls}`}>
                {s.label}
              </div>
            );
          })}
        </div>

        {isTerminated && (
          <div className="mt-3 text-sm text-rose-700 font-medium">Quy trình đã kết thúc.</div>
        )}
      </div>
    );
  };

  return (
    <section className="max-w-7xl mx-auto px-6 py-8">
      <div className="mb-6 rounded-2xl border border-amber-100 bg-gradient-to-r from-amber-50 via-white to-amber-50 px-8 py-6">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight text-gray-900">
          Yêu cầu thiết kế của tôi
        </h1>
        <p className="mt-2 text-gray-600 text-base">
          Theo dõi tiến độ, xem báo giá và phản hồi — thao tác nhanh chóng.
        </p>
      </div>

      {msg && (
        <div className="mb-6 rounded-xl border border-amber-200 bg-amber-50 px-6 py-3 text-amber-900 text-sm">
          {msg}
        </div>
      )}

      {loading ? (
        <div className="text-gray-600 italic">Đang tải…</div>
      ) : !items.length ? (
        <div className="rounded-2xl border bg-white p-12 text-center shadow-sm">
          <div className="mx-auto mb-4 h-20 w-20 rounded-full bg-amber-100 flex items-center justify-center">
            <span className="text-4xl">📝</span>
          </div>
          <h3 className="text-2xl font-medium">Chưa có yêu cầu nào</h3>
          <p className="mt-2 text-gray-600 text-base">Hãy gửi mô tả & hình ảnh sản phẩm bạn muốn thiết kế.</p>
          <a
            href="/custom/new"
            className="mt-6 inline-flex items-center gap-3 rounded-xl bg-black px-6 py-3 text-white hover:bg-black/90 transition"
          >
            Tạo yêu cầu mới
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          {items.map((it) => {
            const statusKey = canonical(it.status);
            const tagCls =
              "text-sm font-medium px-3 py-1.5 rounded-full " +
              (STATUS_STYLE[statusKey] || STATUS_STYLE.created);

            const canRespondQuote =
              !!it.quote?.price &&
              ["quoted", "pending", "awaiting_customer"].includes(statusKey);

            const canCancel =
              ["created", "submitted", "reviewing", "quoted", "pending", "awaiting_customer"].includes(
                statusKey
              );

            const showPay =
              statusKey === "done" && !it.paid;

            return (
              <article key={it._id} className="rounded-2xl border bg-white p-8 shadow-sm hover:shadow-md transition">
                <div className="flex items-start justify-between gap-6">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3 flex-wrap">
                      <div className="text-xl md:text-2xl font-semibold text-gray-900 truncate">
                        #{it.code || it._id.slice(-6)} • {it.brief?.title || "Không tiêu đề"}
                      </div>
                      <Chip className={tagCls}>{it.status}</Chip>
                    </div>

                    {it.createdAt && (
                      <div className="text-sm text-gray-500 mt-2">
                        Tạo lúc: {new Date(it.createdAt).toLocaleString("vi-VN")}
                      </div>
                    )}
                  </div>
                </div>

                <Timeline statusKey={statusKey} />

                {it.brief?.description && (
                  <p className="mt-5 text-gray-700 leading-relaxed">{it.brief.description}</p>
                )}

                {/* Chi tiết */}
                <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-[16px] text-gray-700">
                  <div>Kích thước: <span className="font-medium">{dimText(it.brief)}</span></div>
                  <div>Chất liệu: <span className="font-medium">{it.brief?.materials || "—"}</span></div>
                  <div>Màu sắc: <span className="font-medium">{it.brief?.color || "—"}</span></div>
                  {it.brief?.budgetMax && (
                    <div>Ngân sách tối đa: <span className="font-medium">{VND(it.brief.budgetMax)}</span></div>
                  )}
                </div>

                {/* Ảnh */}
                {!!it.files?.length && (
                  <div className="mt-5 flex flex-wrap gap-4">
                    {it.files.map((f, i) => (
                      <img
                        key={i}
                        src={fileUrl(f.url)}
                        className="w-28 h-28 object-cover rounded-lg border hover:scale-[1.02] transition"
                        alt=""
                      />
                    ))}
                  </div>
                )}

                {/* Báo giá */}
                {it.quote?.price ? (
                  <div className="mt-6 rounded-xl border p-5 bg-gradient-to-br from-gray-50 to-white">
                    <div className="flex items-center gap-6 flex-wrap text-gray-800">
                      <div className="inline-flex items-center gap-3">
                        <span className="h-10 w-10 rounded-full flex items-center justify-center bg-[#B88E2F]/10 text-lg">💰</span>
                        <div>
                          <div className="text-sm">Báo giá</div>
                          <div className="text-xl font-bold text-[#B88E2F]">{VND(it.quote.price)}</div>
                        </div>
                      </div>

                      <div>
                        <div className="text-sm">Thời gian</div>
                        <div className="font-medium">{it.quote.leadTimeDays} ngày</div>
                      </div>
                    </div>

                    {it.quote?.note && (
                      <div className="mt-3 text-sm text-gray-600">
                        Ghi chú: <i>{it.quote.note}</i>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-5 text-sm text-gray-500">Chưa có báo giá từ cửa hàng.</div>
                )}

                {/* Nút hành động */}
                <div className="mt-6 flex flex-wrap gap-3">
                  {canRespondQuote && (
                    <>
                      <button
                        onClick={() => accept(it._id)}
                        disabled={busyId === it._id}
                        className="px-5 py-3 rounded-lg border border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white transition text-sm"
                      >
                        {busyId === it._id ? "Đang xử lý…" : "Đồng ý báo giá"}
                      </button>

                      <button
                        onClick={() => reject(it._id)}
                        disabled={busyId === it._id}
                        className="px-5 py-3 rounded-lg border text-gray-700 hover:bg-gray-100 transition text-sm"
                      >
                        Từ chối
                      </button>
                    </>
                  )}

                  {canCancel && (
                    <button
                      onClick={() => cancelReq(it._id)}
                      disabled={busyId === it._id}
                      className="px-5 py-3 rounded-lg border text-rose-600 hover:bg-rose-50 transition text-sm"
                    >
                      {busyId === it._id ? "Đang hủy…" : "Hủy yêu cầu"}
                    </button>
                  )}

                  {/* THANH TOÁN SAU KHI DONE */}
                  {showPay && (
                    <button
                      onClick={() => setCheckoutReq(it)}
                      className="px-5 py-3 rounded-lg text-white"
                      style={{ backgroundColor: "#B88E2F" }}
                    >
                      Thanh toán thiết kế
                    </button>
                  )}

                  {/* NÚT IN BIÊN LAI — chỉ xuất hiện khi DONE + đã trả tiền */}
  {statusKey === "done" && it.paid && (
  <button
    onClick={async () => {
      try {
        const res = await axiosClient.get(
          `/api/custom-requests/${it._id}/receipt`,
          { responseType: "blob" }  // bắt buộc để nhận PDF
        );

        const fileURL = URL.createObjectURL(
          new Blob([res.data], { type: "application/pdf" })
        );
        const link = document.createElement("a");
        link.href = fileURL;
        link.download = `receipt-${it.code}.pdf`;
        link.click();
        URL.revokeObjectURL(fileURL);

      } catch (e) {
        notification.error({
          message: "Không tải được biên lai",
          description: e?.response?.data?.message || e.message,
        });
      }
    }}
    className="px-5 py-3 rounded-lg border text-gray-900 hover:bg-gray-100 transition text-sm"
  >
    In biên lai PDF
  </button>
)}


                </div>

                <div className="mt-4">
                  {statusKey === "approved" && (
                    <div className="text-sm text-emerald-700 font-medium">Bạn đã đồng ý báo giá. Cửa hàng sẽ thi công.</div>
                  )}
                  {statusKey === "rejected" && (
                    <div className="text-sm text-rose-700 font-medium">Bạn đã từ chối báo giá.</div>
                  )}
                  {statusKey === "canceled" && (
                    <div className="text-sm text-rose-700 font-medium">Bạn đã huỷ yêu cầu.</div>
                  )}
                  {statusKey === "done" && it.paid && (
                    <div className="text-sm text-emerald-700 font-medium">Bạn đã thanh toán thành công.</div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}

      {/* Modal checkout */}
      <ModalCustomCheckout
        open={!!checkoutReq}
        request={checkoutReq}
        price={checkoutReq?.quote?.price || 0}
        onClose={() => setCheckoutReq(null)}
        onPaid={() => {
          setCheckoutReq(null);
          load();
        }}
      />
    </section>
  );
}
