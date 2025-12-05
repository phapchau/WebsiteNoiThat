






// // ReviewModal.jsx
// import { useState } from "react";
// import axiosClient from "../services/axiosClient";

// export default function ReviewModal({ open, onClose, product, order }) {
//   const [rating, setRating] = useState(5);
//   const [comment, setComment] = useState("");
//   const [busy, setBusy] = useState(false);
//   if (!open) return null;

//   const productId = product?._id;
//   async function submit() {
//     if (!productId) { alert("Thiếu productId"); return; }
//     try {
//       setBusy(true);
//       await axiosClient.post(`/api/products/${productId}/reviews`, {
//         rating,
//         comment,
//         orderId: order?._id || order?.id || undefined,
//       });
//       onClose(true);
//     } catch (e) {
//       alert(e?.response?.data?.message || "Gửi đánh giá thất bại");
//     } finally {
//       setBusy(false);
//     }
//   }

//   return (
//     <div className="fixed inset-0 bg-black/40 grid place-items-center z-50">
//       <div className="bg-white rounded-2xl p-5 w-full max-w-md">
//         <h3 className="text-lg font-semibold">Đánh giá: {product?.name}</h3>
//         <div className="mt-3">
//           <label className="block text-sm mb-1">Điểm (1–5)</label>
//           <input type="number" min={1} max={5} value={rating} onChange={e=>setRating(e.target.value)} className="border rounded p-2 w-24" />
//         </div>
//         <div className="mt-3">
//           <label className="block text-sm mb-1">Nhận xét</label>
//           <textarea rows={3} value={comment} onChange={e=>setComment(e.target.value)} className="border rounded p-2 w-full" />
//         </div>
//         <div className="mt-4 flex gap-2">
//           <button onClick={submit} disabled={busy} className="px-4 py-2 rounded bg-black text-white disabled:opacity-50">
//             {busy ? "Đang gửi..." : "Gửi đánh giá"}
//           </button>
//           <button onClick={() => onClose(false)} className="px-4 py-2 rounded border">Đóng</button>
//         </div>
//       </div>
//     </div>
//   );
// }///15/11


















// // src/components/ReviewModal.jsx
// import { useState, useEffect } from "react";
// import { Rate, Input, Modal, Button, message } from "antd";
// import axiosClient from "../services/axiosClient";

// export default function ReviewModal({ open, onClose, product, order }) {
//   const [rating, setRating] = useState(5);
//   const [comment, setComment] = useState("");
//   const [busy, setBusy] = useState(false);

//   useEffect(() => {
//     if (!open) {
//       setRating(5);
//       setComment("");
//       setBusy(false);
//     }
//   }, [open]);

//   const productId = product?._id || product?.id;

//   async function submit() {
//     if (!productId) {
//       message.error("Thiếu productId");
//       return;
//     }
//     if (!comment.trim()) {
//       message.warn("Vui lòng nhập nhận xét");
//       return;
//     }

//     try {
//       setBusy(true);
//       await axiosClient.post(`/api/products/${productId}/reviews`, {
//         rating,
//         comment,
//         orderId: order?._id || order?.id || undefined,
//       });

//       // Set a flag so ProductDetail will refresh its reviews when opened/visited
//       try {
//         localStorage.setItem("refresh-product", productId);
//       } catch (e) {
//         // ignore
//       }

//       message.success("Gửi đánh giá thành công");
//       onClose(true); // notify parent (MyOrders) that a review was submitted
//     } catch (e) {
//       message.error(e?.response?.data?.message || "Gửi đánh giá thất bại");
//     } finally {
//       setBusy(false);
//     }
//   }

//   return (
//     <Modal
//       open={!!open}
//       onCancel={() => onClose(false)}
//       footer={null}
//       title={`Đánh giá: ${product?.name || ""}`}
//       centered
//     >
//       <div className="flex flex-col gap-4">
//         <div>
//           <label className="block text-sm mb-1">Chấm điểm</label>
//           <Rate allowHalf={false} value={rating} onChange={setRating} />
//         </div>

//         <div>
//           <label className="block text-sm mb-1">Nhận xét</label>
//           <Input.TextArea
//             rows={4}
//             value={comment}
//             onChange={(e) => setComment(e.target.value)}
//             placeholder="Viết cảm nhận của bạn về sản phẩm..."
//           />
//         </div>

//         <div className="flex gap-2 justify-end mt-2">
//           <Button onClick={() => onClose(false)}>Đóng</Button>
//           <Button type="primary" loading={busy} onClick={submit}>
//             Gửi đánh giá
//           </Button>
//         </div>
//       </div>
//     </Modal>
//   );
// }//16/11











// src/components/ReviewModal.jsx
import { useState, useEffect } from "react";
import { Rate, Input, Modal, Button, message, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import axiosClient from "../services/axiosClient";

export default function ReviewModal({ open, onClose, product, order }) {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [busy, setBusy] = useState(false);
  const [fileList, setFileList] = useState([]); // ảnh upload

  useEffect(() => {
    if (!open) {
      setRating(5);
      setComment("");
      setBusy(false);
      setFileList([]);
    }
  }, [open]);

  const productId = product?._id || product?.id;

  async function submit() {
    if (!productId) return message.error("Thiếu productId");
    if (!comment.trim()) return message.warn("Vui lòng nhập nhận xét");

    try {
      setBusy(true);

      const form = new FormData();
      form.append("rating", rating);
      form.append("comment", comment);
      if (order?._id) form.append("orderId", order._id);

      fileList.forEach((f) => {
        form.append("images", f.originFileObj);
      });

      await axiosClient.post(`/api/products/${productId}/reviews`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      localStorage.setItem("refresh-product", productId);
      message.success("Gửi đánh giá thành công");
      onClose(true);
    } catch (e) {
      message.error(e?.response?.data?.message || "Gửi đánh giá thất bại");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Modal open={open} onCancel={() => onClose(false)} footer={null} title={`Đánh giá: ${product?.name}`} centered>
      <div className="flex flex-col gap-4">
        
        <div>
          <label className="block text-sm mb-1">Chấm điểm</label>
          <Rate value={rating} onChange={setRating} />
        </div>

        <div>
          <label className="block text-sm mb-1">Nhận xét</label>
          <Input.TextArea rows={4} value={comment} onChange={(e) => setComment(e.target.value)} />
        </div>

        <div>
          <label className="block text-sm mb-1">Hình ảnh (tối đa 5 ảnh)</label>

          <Upload
            listType="picture-card"
            maxCount={5}
            fileList={fileList}
            onChange={({ fileList }) => setFileList(fileList)}
            beforeUpload={() => false} // KHÔNG upload ngay
          >
            {fileList.length >= 5 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Tải ảnh</div>
              </div>
            )}
          </Upload>
        </div>

        <div className="flex justify-end gap-2">
          <Button onClick={() => onClose(false)}>Đóng</Button>
          <Button type="primary" loading={busy} onClick={submit}>Gửi đánh giá</Button>
        </div>
      </div>
    </Modal>
  );
}

