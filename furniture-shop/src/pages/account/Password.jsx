






// // src/pages/account/Password.jsx
// import { useState } from "react";
// import axiosClient from "../../services/axiosClient";
// // 👇 THÊM: hook message toàn cục
// import { useNotify } from "../../components/MessageProvider";

// export default function Password() {
//   const [f, setF] = useState({ currentPassword: "", newPassword: "", confirm: "" });
//   const [msg, setMsg] = useState("");
//   const [busy, setBusy] = useState(false);

//   // 👇 THÊM
//   const notify = useNotify();

//   const onChange = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     setMsg("");

//     if (!f.currentPassword || !f.newPassword) {
//       const m = "Vui lòng nhập đầy đủ mật khẩu.";
//       setMsg(m);
//       // 👇 THÊM: thông báo lỗi (không bắt buộc nhưng hữu ích)
//       notify.error?.(m);
//       return;
//     }
//     if (f.newPassword !== f.confirm) {
//       const m = "Xác nhận mật khẩu chưa khớp.";
//       setMsg(m);
//       notify.error?.(m);
//       return;
//     }

//     try {
//       setBusy(true);
//       await axiosClient.patch("/api/users/me/password", {
//         currentPassword: f.currentPassword,
//         newPassword: f.newPassword,
//       });

//       const okMsg = "✅ Đổi mật khẩu thành công";
//       setMsg(okMsg);
//       // 👇 THÊM: message success của antd
//       notify.success?.("Đổi mật khẩu thành công");

//       setF({ currentPassword: "", newPassword: "", confirm: "" });
//     } catch (err) {
//       const errMsg = "❌ " + (err?.response?.data?.message || err.message);
//       setMsg(errMsg);
//       // 👇 THÊM: message error của antd
//       notify.error?.(err?.response?.data?.message || err.message || "Đổi mật khẩu thất bại");
//     } finally {
//       setBusy(false);
//     }
//   };

//   return (
//     <section className="space-y-4">
//       {msg && (
//         <div
//           className={`px-4 py-2 rounded ${
//             msg.startsWith("✅") ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
//           }`}
//         >
//           {msg}
//         </div>
//       )}

//       <form onSubmit={onSubmit} className="grid md:grid-cols-2 gap-5">
//         <div className="space-y-1 md:col-span-2">
//           <label className="text-sm text-gray-600">Mật khẩu hiện tại</label>
//           <input
//             type="password"
//             className="w-full border rounded-xl p-2.5"
//             value={f.currentPassword}
//             onChange={onChange("currentPassword")}
//             required
//           />
//         </div>

//         <div className="space-y-1">
//           <label className="text-sm text-gray-600">Mật khẩu mới</label>
//           <input
//             type="password"
//             className="w-full border rounded-xl p-2.5"
//             value={f.newPassword}
//             onChange={onChange("newPassword")}
//             required
//             minLength={6}
//           />
//         </div>

//         <div className="space-y-1">
//           <label className="text-sm text-gray-600">Xác nhận mật khẩu mới</label>
//           <input
//             type="password"
//             className="w-full border rounded-xl p-2.5"
//             value={f.confirm}
//             onChange={onChange("confirm")}
//             required
//             minLength={6}
//           />
//         </div>

//         <div className="md:col-span-2">
//           <button
//             disabled={busy}
//             className="px-5 py-2.5 rounded-xl bg-black text-white disabled:opacity-50"
//           >
//             {busy ? "Đang đổi…" : "Đổi mật khẩu"}
//           </button>
//         </div>
//       </form>
//     </section>
//   );
// }2/12
















// src/pages/account/Password.jsx
import { useState } from "react";
import axiosClient from "../../services/axiosClient";
import { useNotify } from "../../components/MessageProvider";

// Ant Design
import { Card, Form, Input, Button, Alert } from "antd";

export default function Password() {
  const [f, setF] = useState({
    currentPassword: "",
    newPassword: "",
    confirm: "",
  });

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const notify = useNotify();

  const onChange = (k) => (e) =>
    setF((s) => ({ ...s, [k]: e.target.value }));

  const onSubmit = async () => {
    setMsg("");

    if (!f.currentPassword || !f.newPassword) {
      const m = "Vui lòng nhập đầy đủ mật khẩu.";
      setMsg(m);
      notify.error?.(m);
      return;
    }
    if (f.newPassword !== f.confirm) {
      const m = "Xác nhận mật khẩu chưa khớp.";
      setMsg(m);
      notify.error?.(m);
      return;
    }

    try {
      setBusy(true);

      await axiosClient.patch("/api/users/me/password", {
        currentPassword: f.currentPassword,
        newPassword: f.newPassword,
      });

      const okMsg = "✅ Đổi mật khẩu thành công";
      setMsg(okMsg);
      notify.success?.("Đổi mật khẩu thành công");

      setF({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (err) {
      const errMsg =
        err?.response?.data?.message ||
        err.message ||
        "Đổi mật khẩu thất bại";

      setMsg("❌ " + errMsg);
      notify.error?.(errMsg);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Card title="Đổi mật khẩu" className="rounded-xl shadow-sm">
      {msg && (
        <Alert
          className="mb-4"
          type={msg.startsWith("✅") ? "success" : "error"}
          message={msg.replace("✅ ", "").replace("❌ ", "")}
          showIcon
        />
      )}

      <Form layout="vertical" onFinish={onSubmit}>
        <Form.Item label="Mật khẩu hiện tại" required>
          <Input.Password
            value={f.currentPassword}
            onChange={onChange("currentPassword")}
            placeholder="Nhập mật khẩu hiện tại"
          />
        </Form.Item>

        <Form.Item label="Mật khẩu mới" required>
          <Input.Password
            value={f.newPassword}
            onChange={onChange("newPassword")}
            placeholder="Nhập mật khẩu mới"
            minLength={6}
          />
        </Form.Item>

        <Form.Item label="Xác nhận mật khẩu" required>
          <Input.Password
            value={f.confirm}
            onChange={onChange("confirm")}
            placeholder="Nhập lại mật khẩu mới"
            minLength={6}
          />
        </Form.Item>

        <Button
          type="primary"
          htmlType="submit"
          loading={busy}
          className="mt-1"
          block
        >
          {busy ? "Đang đổi…" : "Đổi mật khẩu"}
        </Button>
      </Form>
    </Card>
  );
}





