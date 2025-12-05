



// // src/pages/account/Profile.jsx
// import { useEffect, useState, useRef } from "react";
// import axiosClient from "../../services/axiosClient";

// // helper: rút phone từ nhiều key khác nhau
// function pickPhone(u = {}) {
//   return (
//     u.phone ??
//     u.phoneNumber ??
//     u.sdt ??
//     u.tel ??
//     ""
//   );
// }

// // Avatar fallback (giống Header)
// const BASE = import.meta.env.BASE_URL || "/";
// const DEFAULT_AVATAR = BASE + "user.png";

// // API base (dùng chung với các màn khác)
// const API = import.meta.env.VITE_API_URL || "http://localhost:8081/api";

// function normalizeAvatar(u) {
//   if (!u) return DEFAULT_AVATAR;
//   if (/^https?:\/\//i.test(u)) return u;
//   if (u.startsWith(BASE)) return u;
//   return u.startsWith("/") ? u : BASE + u;
// }

// // Upload 1 file -> trả { url }
// async function uploadFile(file, token) {
//   const fd = new FormData();
//   fd.append("file", file);

//   const res = await fetch(`${API}/uploads/file`, {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${token || ""}`, // KHÔNG tự set Content-Type
//     },
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
//   if (!data?.url) throw new Error("Upload: phản hồi không có url");
//   return data.url;
// }

// export default function Profile() {
//   const [f, setF] = useState({ name: "", phone: "", address: "", avatar: "" });
//   const [msg, setMsg] = useState("");
//   const [busy, setBusy] = useState(false);
//   const [avatarPreview, setAvatarPreview] = useState(DEFAULT_AVATAR);
//   const [uploading, setUploading] = useState(false);
//   const fileRef = useRef(null);

//   // lấy token từ localStorage (giống các chỗ khác)
//   const token = typeof window !== "undefined" ? (localStorage.getItem("token") || "") : "";

//   useEffect(() => {
//     let alive = true;
//     (async () => {
//       try {
//         const { data } = await axiosClient.get("/api/users/me");
//         const u = data?.user || data || {};
//         if (!alive) return;
//         const phoneStr = String(pickPhone(u) ?? "");
//         const avatarUrl = normalizeAvatar(u.avatar);
//         setF({
//           name: u.name || "",
//           phone: phoneStr,
//           address: u.address || "",
//           avatar: u.avatar || "",
//         });
//         setAvatarPreview(avatarUrl || DEFAULT_AVATAR);
//       } catch {
//         setMsg("❌ Không tải được hồ sơ");
//       }
//     })();
//     return () => {
//       alive = false;
//     };
//   }, []);

//   const onChange = (k) => (e) => {
//     const val = e.target.value;
//     setF((s) => ({ ...s, [k]: val }));
//     if (k === "avatar") {
//       setAvatarPreview(normalizeAvatar(val));
//     }
//   };

//   async function onSubmit(e) {
//     e.preventDefault();
//     setMsg("");
//     try {
//       setBusy(true);

//       // payload tương thích nhiều BE (thêm avatar nếu có – BE có thể bỏ qua)
//       const payload = {
//         name: f.name?.trim() ?? "",
//         address: f.address?.trim() ?? "",
//         phone: f.phone?.trim() ?? "",
//         phoneNumber: f.phone?.trim() ?? "",
//         ...(f.avatar ? { avatar: f.avatar.trim() } : {}),
//       };

//       const { data } = await axiosClient.patch("/api/users/me", payload);
//       const u = data?.user || data || {};

//       const nextPhone = String(pickPhone(u) || f.phone || "");
//       const nextAvatar = normalizeAvatar(u.avatar || f.avatar || "");

//       setF({
//         name: u.name ?? f.name,
//         phone: nextPhone,
//         address: u.address ?? f.address,
//         avatar: u.avatar ?? f.avatar,
//       });
//       setAvatarPreview(nextAvatar || DEFAULT_AVATAR);
//       setMsg("✅ Đã cập nhật hồ sơ");
//     } catch (err) {
//       setMsg("❌ " + (err?.response?.data?.message || err.message));
//     } finally {
//       setBusy(false);
//     }
//   }

//   // Upload avatar từ file
//   async function handleUploadAvatar(e) {
//     const file = e.target.files?.[0];
//     if (!file) return;
//     try {
//       setUploading(true);
//       setMsg("");
//       const url = await uploadFile(file, token);
//       // cập nhật field & preview
//       setF((s) => ({ ...s, avatar: url }));
//       setAvatarPreview(normalizeAvatar(url));
//       setMsg("✅ Đã tải lên ảnh đại diện");
//     } catch (err) {
//       setMsg("❌ Upload thất bại: " + err.message);
//     } finally {
//       setUploading(false);
//       if (fileRef.current) fileRef.current.value = "";
//     }
//   }

//   // UI helper cho thông báo
//   const isOK = msg.startsWith("✅");
//   const noticeCls = isOK
//     ? "bg-emerald-50 text-emerald-700 border-emerald-200"
//     : "bg-rose-50 text-rose-700 border-rose-200";

//   return (
//     <div className="space-y-5">
//       {msg && (
//         <div className={`border rounded-xl px-4 py-2 text-sm ${noticeCls}`}>
//           {msg}
//         </div>
//       )}

//       {/* Card tổng: avatar + form */}
//       <div className="grid lg:grid-cols-[320px_1fr] gap-6">
//         {/* Avatar Card */}
//         <div className="surface rounded-2xl p-5">
//           <h3 className="text-base font-medium mb-4">Ảnh đại diện</h3>

//           <div className="flex items-start gap-4">
//             <div className="relative">
//               <img
//                 src={avatarPreview}
//                 alt="Avatar"
//                 className="h-28 w-28 rounded-full object-cover border border-black/10 dark:border-white/10"
//                 onError={(e) => (e.currentTarget.src = DEFAULT_AVATAR)}
//               />
//               <button
//                 type="button"
//                 onClick={() => fileRef.current?.click()}
//                 className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-1.5 rounded-full text-xs bg-black text-white shadow dark:bg-white dark:text-black"
//                 disabled={uploading}
//               >
//                 {uploading ? "Đang tải..." : "Tải lên"}
//               </button>
//               <input
//                 ref={fileRef}
//                 type="file"
//                 accept="image/*"
//                 className="hidden"
//                 onChange={handleUploadAvatar}
//               />
//             </div>

//             <div className="flex-1">
//               <label className="text-sm text-gray-600 dark:text-gray-300">
//                 URL ảnh (jpg, png…)
//               </label>
//               <input
//                 className="mt-1 w-full border rounded-xl px-3 py-2 bg-white dark:bg-transparent"
//                 placeholder="https://..."
//                 value={f.avatar}
//                 onChange={onChange("avatar")}
//               />
//               <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
//                 • Bạn có thể dán URL ảnh hoặc bấm <b>Tải lên</b> để chọn file từ máy.
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* Profile Form Card */}
//         <form onSubmit={onSubmit} className="surface rounded-2xl p-5 space-y-5">
//           <h3 className="text-base font-medium">Thông tin cá nhân</h3>

//           <div className="grid md:grid-cols-2 gap-5">
//             <div className="space-y-1.5">
//               <label className="text-sm text-gray-600 dark:text-gray-300">Họ tên</label>
//               <input
//                 className="w-full border rounded-xl px-3 py-2 bg-white dark:bg-transparent"
//                 value={f.name}
//                 onChange={onChange("name")}
//                 required
//               />
//             </div>

//             <div className="space-y-1.5">
//               <label className="text-sm text-gray-600 dark:text-gray-300">Số điện thoại</label>
//               <input
//                 type="tel"
//                 inputMode="numeric"
//                 className="w-full border rounded-xl px-3 py-2 bg-white dark:bg-transparent"
//                 value={f.phone}
//                 onChange={onChange("phone")}
//                 placeholder="VD: 0987 654 321"
//               />
//             </div>

//             <div className="md:col-span-2 space-y-1.5">
//               <label className="text-sm text-gray-600 dark:text-gray-300">Địa chỉ mặc định</label>
//               <input
//                 className="w-full border rounded-xl px-3 py-2 bg-white dark:bg-transparent"
//                 value={f.address}
//                 onChange={onChange("address")}
//                 placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành…"
//               />
//             </div>
//           </div>

//           <div className="pt-2">
//             <button
//               disabled={busy}
//               className="px-5 py-2.5 rounded-xl bg-black text-white disabled:opacity-50 dark:bg-white dark:text-black"
//             >
//               {busy ? "Đang lưu…" : "Lưu thay đổi"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }//2/12






















// src/pages/account/Profile.jsx
import { useEffect, useState, useRef } from "react";
import axiosClient from "../../services/axiosClient";

import {
  Card,
  Form,
  Input,
  Button,
  Upload,
  Avatar,
  message,
  Row,
  Col,
} from "antd";
import { UploadOutlined, UserOutlined } from "@ant-design/icons";

// helper: rút phone từ nhiều key
function pickPhone(u = {}) {
  return (
    u.phone ??
    u.phoneNumber ??
    u.sdt ??
    u.tel ??
    ""
  );
}

const BASE = import.meta.env.BASE_URL || "/";
const DEFAULT_AVATAR = BASE + "user.png";
const API = import.meta.env.VITE_API_URL || "http://localhost:8081/api";

function normalizeAvatar(u) {
  if (!u) return DEFAULT_AVATAR;
  if (/^https?:\/\//i.test(u)) return u;
  if (u.startsWith(BASE)) return u;
  return u.startsWith("/") ? u : BASE + u;
}

// Upload 1 file → trả về URL
async function uploadFile(file, token) {
  const fd = new FormData();
  fd.append("file", file);

  const res = await fetch(`${API}/uploads/file`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token || ""}`,
    },
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
  if (!data?.url) throw new Error("Upload: không có URL trả về");
  return data.url;
}

export default function Profile() {
  const [f, setF] = useState({ name: "", phone: "", address: "", avatar: "" });
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(DEFAULT_AVATAR);
  const fileRef = useRef(null);

  const token = localStorage.getItem("token") || "";

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await axiosClient.get("/api/users/me");
        const u = data?.user || data || {};
        if (!alive) return;

        const phoneStr = String(pickPhone(u) ?? "");
        const avatarUrl = normalizeAvatar(u.avatar);

        setF({
          name: u.name || "",
          phone: phoneStr,
          address: u.address || "",
          avatar: u.avatar || "",
        });
        setAvatarPreview(avatarUrl || DEFAULT_AVATAR);
      } catch {
        message.error("Không tải được hồ sơ");
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const onSubmit = async () => {
    try {
      setBusy(true);

      const payload = {
        name: f.name?.trim() || "",
        address: f.address?.trim() || "",
        phone: f.phone?.trim() || "",
        phoneNumber: f.phone?.trim() || "",
        ...(f.avatar ? { avatar: f.avatar.trim() } : {}),
      };

      const { data } = await axiosClient.patch("/api/users/me", payload);
      const u = data?.user || data || {};

      const nextPhone = String(pickPhone(u) || f.phone || "");
      const nextAvatar = normalizeAvatar(u.avatar || f.avatar || "");

      setF({
        name: u.name ?? f.name,
        phone: nextPhone,
        address: u.address ?? f.address,
        avatar: u.avatar ?? f.avatar,
      });
      setAvatarPreview(nextAvatar || DEFAULT_AVATAR);

      message.success("Đã cập nhật hồ sơ");
    } catch (err) {
      message.error(err?.response?.data?.message || err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleUploadAvatar = async (info) => {
    const file = info.file;
    if (!file) return;

    try {
      setUploading(true);
      const url = await uploadFile(file, token);

      setF((s) => ({ ...s, avatar: url }));
      setAvatarPreview(normalizeAvatar(url));

      message.success("Đã upload ảnh đại diện");
    } catch (err) {
      message.error("Upload thất bại: " + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">

      {/* Avatar Card */}
      <Card title="Ảnh đại diện" bordered className="rounded-xl shadow-sm">
        <Row gutter={20}>
          <Col>
            <Avatar
              src={avatarPreview}
              size={120}
              icon={<UserOutlined />}
              style={{ border: "1px solid #ddd" }}
            />
          </Col>

          <Col flex="auto">
            <Upload
              showUploadList={false}
              beforeUpload={() => false}
              customRequest={({ file }) => handleUploadAvatar({ file })}
            >
              <Button icon={<UploadOutlined />} loading={uploading}>
                Tải ảnh lên
              </Button>
            </Upload>

            <Input
              style={{ marginTop: 12 }}
              value={f.avatar}
              onChange={(e) => {
                setF({ ...f, avatar: e.target.value });
                setAvatarPreview(normalizeAvatar(e.target.value));
              }}
              placeholder="Hoặc dán URL ảnh..."
            />
          </Col>
        </Row>
      </Card>

      {/* Profile Form */}
      <Card title="Thông tin cá nhân" bordered className="rounded-xl shadow-sm">
        <Form layout="vertical" onFinish={onSubmit}>
          <Row gutter={16}>
            <Col xs={24} md={12}>
              <Form.Item label="Họ tên" required>
                <Input
                  value={f.name}
                  onChange={(e) => setF({ ...f, name: e.target.value })}
                />
              </Form.Item>
            </Col>

            <Col xs={24} md={12}>
              <Form.Item label="Số điện thoại">
                <Input
                  value={f.phone}
                  onChange={(e) => setF({ ...f, phone: e.target.value })}
                  placeholder="VD: 0987 654 321"
                />
              </Form.Item>
            </Col>

            <Col xs={24}>
              <Form.Item label="Địa chỉ mặc định">
                <Input
                  value={f.address}
                  onChange={(e) => setF({ ...f, address: e.target.value })}
                  placeholder="Số nhà, đường, phường/xã..."
                />
              </Form.Item>
            </Col>
          </Row>

          <Button
            type="primary"
            htmlType="submit"
            loading={busy}
            style={{ background: "#000" }}
          >
            Lưu thay đổi
          </Button>
        </Form>
      </Card>
    </div>
  );
}


