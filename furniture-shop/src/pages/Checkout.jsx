






// // src/pages/Checkout.jsx
// import { useEffect, useMemo, useState } from "react";
// import { useNavigate, Link, useLocation } from "react-router-dom";
// import { useCart } from "../context/CartContext";
// import { useAuth } from "../context/AuthContext";
// import axiosClient from "../services/axiosClient";
// import ImgSafe from "../components/ImgSafe";
// import { vnd } from "../utils/format";

// // Ant Design
// import {
//   Card,
//   Row,
//   Col,
//   Typography,
//   Space,
//   Button,
//   Divider,
//   Radio,
//   Input,
//   Form,
//   Modal,
//   notification,
//   Alert,
// } from "antd";
// import { ShoppingCartOutlined } from "@ant-design/icons";

// const { Title, Text } = Typography;
// const { TextArea } = Input;

// function normAddr(a = {}) {
//   return {
//     id: a._id || a.id,
//     name: a.name || "Chưa đặt tên",
//     phone: a.phone || "",
//     email: a.email || "",
//     line1: a.line1 || a.address || "",
//     isDefault: !!a.isDefault,
//   };
// }
// const FREE_SHIP_THRESHOLD = 2_000_000;
// const BASE_SHIP = 30_000;
// const isValidPhoneVN = (s = "") => {
//   const digits = s.replace(/\D/g, "");
//   return digits.length >= 9 && digits.length <= 11;
// };

// export default function Checkout() {
//   const nav = useNavigate();
//   const loc = useLocation();
//   const { user } = useAuth();
//   const { items, clear } = useCart();

//   const [addresses, setAddresses] = useState([]);
//   const [selected, setSelected] = useState(null);
//   const [addrForm, setAddrForm] = useState({ name: "", phone: "", email: "", line1: "", setDefault: false });
//   const [paymentMethod, setPaymentMethod] = useState("COD");
//   const [note, setNote] = useState("");
//   const [busy, setBusy] = useState(false);
//   const [err, setErr] = useState("");

//   // AntD theme colors used locally
//   const gold = "#B88E2F";
//   const dark = "#2b2b2b";

//   // 1) BẮT BUỘC LOGIN
//   useEffect(() => {
//     if (!user) {
//       const next = encodeURIComponent(loc.pathname);
//       nav(`/login?next=${next}`, { replace: true });
//     }
//   }, [user, nav, loc.pathname]);

//   // 2) nếu giỏ trống → về /cart
//   useEffect(() => {
//     if (!items.length) nav("/cart");
//   }, [items.length, nav]);

//   // 3) tải địa chỉ (có token)
//   async function loadAddresses() {
//     try {
//       const { data } = await axiosClient.get("/api/users/addresses");
//       const arr = Array.isArray(data) ? data.map(normAddr) : [];
//       setAddresses(arr);
//       const def = arr.find((x) => x.isDefault) || arr[0];
//       setSelected(def?.id || null);
//     } catch {
//       nav(`/login?next=${encodeURIComponent("/checkout")}`, { replace: true });
//     }
//   }
//   useEffect(() => { if (user) loadAddresses(); }, [user]);

//   const subTotal = useMemo(
//     () => items.reduce((s, it) => s + (Number(it.price) || 0) * (Number(it.qty) || 0), 0),
//     [items]
//   );
//   const shippingFee = useMemo(() => (subTotal >= FREE_SHIP_THRESHOLD ? 0 : BASE_SHIP), [subTotal]);
//   const discount = 0;
//   const grandTotal = Math.max(0, subTotal + shippingFee - discount);

//   // 4) Thêm địa chỉ
//   async function onAddAddress(e) {
//     e.preventDefault();
//     setErr("");
//     if (!addrForm.name.trim()) return setErr("Vui lòng nhập họ tên");
//     if (!isValidPhoneVN(addrForm.phone)) return setErr("Số điện thoại chưa hợp lệ");
//     if (!addrForm.line1.trim()) return setErr("Vui lòng nhập địa chỉ");
//     try {
//       setBusy(true);
//       const { data } = await axiosClient.post("/api/users/addresses", {
//         name: addrForm.name.trim(),
//         phone: addrForm.phone.trim(),
//         email: addrForm.email.trim(),
//         line1: addrForm.line1.trim(),
//         isDefault: !!addrForm.setDefault,
//       });
//       const n = normAddr(data);
//       setAddresses((arr) => [n, ...arr]);
//       setSelected(n.id);
//       setAddrForm({ name: "", phone: "", email: "", line1: "", setDefault: false });
//     } catch (e) {
//       setErr(e?.response?.data?.message || "Không thêm được địa chỉ");
//     } finally {
//       setBusy(false);
//     }
//   }

//   // 5) Đặt hàng COD
//   async function onSubmitCOD(e) {
//     e.preventDefault();
//     setErr("");

//     const chosen = addresses.find(a => a.id === selected);
//     if (!chosen) return setErr("Vui lòng chọn hoặc thêm địa chỉ giao hàng");

//     const customer = {
//       name: chosen.name,
//       phone: chosen.phone,
//       email: chosen.email,
//       address: chosen.line1,
//       note,
//     };

//     if (!isValidPhoneVN(customer.phone)) return setErr("Số điện thoại chưa hợp lệ");
//     if (!items.length) return setErr("Giỏ hàng trống");

//     try {
//       setBusy(true);
//       const payload = {
//         items: items.map((it) => ({ id: it.id, quantity: Number(it.qty) || 1 })),
//         customer,
//         paymentMethod: "COD",
//         shippingFee,
//         discount,
//       };
//       const { data } = await axiosClient.post("/api/orders", payload);

//       // Thành công: modal to, kèm nút "Xem đơn hàng" chuyển sang trang order tương ứng
//       Modal.success({
//         title: "Đặt hàng thành công!",
//         content: (
//           <div>
//             <Text>Cảm ơn bạn đã mua sắm 🎉</Text>
//             <div style={{ marginTop: 8 }}>
//               <Text type="secondary">Đơn hàng của bạn đang chờ xác nhận.</Text>
//             </div>
//           </div>
//         ),
//         okText: "Xem đơn hàng",
//         centered: true,
//         onOk: () => {
//           nav(`/orders/me?created=${data._id}`, { replace: true });
//           setTimeout(() => clear(), 300);
//           // chuyển vào chính đơn hàng mới tạo (giữ logic cũ: /orders/me?created=... → FE list)
          
//         }
//       });

//     } catch (e) {
//       setErr(e?.response?.data?.message || "Tạo đơn thất bại");
//       notification.error({ message: "Lỗi", description: err || "Tạo đơn thất bại" });
//     } finally {
//       setBusy(false);
//     }
//   }

//   // 6) Chuyển khoản VNPay (giữ nguyên logic)
//   async function onSubmitBank(e) {
//     e.preventDefault();
//     setErr("");

//     const chosen = addresses.find(a => a.id === selected);
//     if (!chosen) return setErr("Vui lòng chọn hoặc thêm địa chỉ giao hàng");

//     const customer = {
//       name: chosen.name,
//       phone: chosen.phone,
//       email: chosen.email,
//       address: chosen.line1,
//       note,
//     };

//     if (!isValidPhoneVN(customer.phone)) return setErr("Số điện thoại chưa hợp lệ");
//     if (!items.length) return setErr("Giỏ hàng trống");

//     try {
//       setBusy(true);

//       const payload = {
//         items: items.map((it) => ({ id: it.id, quantity: Number(it.qty) || 1 })),
//         customer,
//         paymentMethod: "VNPAY",
//         shippingFee,
//         discount,
//       };

//       const { data } = await axiosClient.post("/api/pay/vnpay/create", payload);
//       if (data?.payUrl) {
//         // thông báo nhỏ trước khi chuyển
//         notification.info({ message: "Đang chuyển tới cổng VNPay..." });
//         window.location.href = data.payUrl; // chuyển sang VNPay (logic giữ nguyên)
//       } else {
//         setErr("Không tạo được link thanh toán VNPay");
//         notification.error({ message: "Lỗi", description: "Không tạo được link thanh toán VNPay" });
//       }

//     } catch (e) {
//       setErr(e?.response?.data?.message || "Không tạo được thanh toán VNPay");
//       notification.error({ message: "Lỗi", description: e?.response?.data?.message || "Không tạo được thanh toán VNPay" });
//     } finally {
//       setBusy(false);
//     }
//   }

//   // (Stripe path left as-is in your code — not modified)

//   return (
//     <section className="max-w-7xl mx-auto px-6 py-12">
//       {/* Header / Hero (phần 1 bạn muốn) */}
//       <Card
//         bordered={false}
//         style={{
//           borderRadius: 14,
//           background: "linear-gradient(90deg,#fffaf1,#fff8ee)",
//           marginBottom: 20,
//           boxShadow: "0 10px 30px rgba(184,142,47,0.07)"
//         }}
//       >
//         <Row align="middle" gutter={20}>
//           <Col xs={24} md={18}>
//             <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
//               <div style={{
//                 width: 86, height: 86, borderRadius: 12, background: gold,
//                 display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: 24
//               }}>
//                 🪑
//               </div>
//               <div>
//                 <Title level={3} style={{ margin: 0, color: dark }}>Thanh toán</Title>
//                 <Text type="secondary">Hoàn tất đơn hàng — chọn phương thức và xác nhận</Text>
//               </div>
//             </div>
//           </Col>
//           <Col xs={24} md={6} style={{ textAlign: "right" }}>
//             <Button type="text" onClick={() => nav("/cart")}>← Quay lại giỏ hàng</Button>
//           </Col>
//         </Row>
//       </Card>

//       <Row gutter={[24, 24]}>
//         {/* Left: Form chính */}
//         <Col xs={24} md={16}>
//           <Card bordered={false} style={{ borderRadius: 12, padding: 22, boxShadow: "0 10px 30px rgba(0,0,0,0.03)" }}>
//             {/* Địa chỉ đã lưu */}
//             <div style={{ marginBottom: 18 }}>
//               <Title level={4} style={{ margin: 0 }}>Địa chỉ giao hàng</Title>
//               <Text type="secondary" style={{ display: "block", marginTop: 6 }}>Đăng nhập: {user?.email}</Text>
//             </div>

//             <Space direction="vertical" size="middle" style={{ width: "100%" }}>
//               {addresses.length ? addresses.map((a) => (
//                 <div key={a.id}
//                   onClick={() => setSelected(a.id)}
//                   style={{
//                     borderRadius: 10,
//                     border: selected === a.id ? `2px solid ${gold}` : "1px solid #f0f0f0",
//                     padding: 12,
//                     cursor: "pointer",
//                     display: "flex",
//                     gap: 12,
//                     alignItems: "center",
//                     background: selected === a.id ? "#fffdf5" : "#fff"
//                   }}
//                 >
//                   <div style={{ width: 8, height: 8, borderRadius: 8, background: selected === a.id ? gold : "#ddd" }} />
//                   <div style={{ flex: 1 }}>
//                     <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
//                       <Text strong>{a.name}</Text>
//                       {a.isDefault && <TagDefault />}
//                       <Text type="secondary" style={{ marginLeft: 8 }}>{a.phone}</Text>
//                     </div>
//                     <div style={{ marginTop: 6 }}>
//                       <Text type="secondary">{a.line1}</Text>
//                     </div>
//                   </div>
//                 </div>
//               )) : (
//                 <Alert message="Chưa có địa chỉ. Thêm địa chỉ mới bên dưới." type="info" showIcon />
//               )}

//               {/* Thêm địa chỉ */}
//               <Card size="small" style={{ borderRadius: 10 }}>
//                 <Form layout="vertical" onFinish={onAddAddress}>
//                   <Row gutter={12}>
//                     <Col span={12}>
//                       <Form.Item label="Họ tên">
//                         <Input value={addrForm.name} onChange={(e) => setAddrForm(s => ({ ...s, name: e.target.value }))} />
//                       </Form.Item>
//                     </Col>
//                     <Col span={12}>
//                       <Form.Item label="SĐT">
//                         <Input value={addrForm.phone} onChange={(e) => setAddrForm(s => ({ ...s, phone: e.target.value }))} />
//                       </Form.Item>
//                     </Col>
//                   </Row>
//                   <Form.Item label="Email (tuỳ chọn)">
//                     <Input value={addrForm.email} onChange={(e) => setAddrForm(s => ({ ...s, email: e.target.value }))} />
//                   </Form.Item>
//                   <Form.Item label="Địa chỉ">
//                     <TextArea rows={3} value={addrForm.line1} onChange={(e) => setAddrForm(s => ({ ...s, line1: e.target.value }))} />
//                   </Form.Item>

//                   <div style={{ display: "flex", gap: 10 }}>
//                     <Button htmlType="submit" type="primary" style={{ background: gold, borderColor: gold }}>
//                       Lưu địa chỉ
//                     </Button>
//                     <Button onClick={() => setAddrForm({ name: "", phone: "", email: "", line1: "", setDefault: false })}>Huỷ</Button>
//                   </div>
//                 </Form>
//               </Card>

//               {err && <div className="text-red-600">⚠ {err}</div>}
//             </Space>
//           </Card>

//           {/* Payment method card */}
//           <Card bordered={false} style={{ borderRadius: 12, padding: 22, marginTop: 18, boxShadow: "0 10px 30px rgba(0,0,0,0.03)" }}>
//             <Title level={4} style={{ marginBottom: 8 }}>Phương thức thanh toán</Title>
//             <Text type="secondary">Chọn phương thức phù hợp</Text>

//             <div style={{ marginTop: 14 }}>
//               <Radio.Group value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
//                 <Space direction="vertical">
//                   <Radio value="COD">COD (Thanh toán khi nhận hàng)</Radio>
//                   <Radio value="VIETQR">Chuyển khoản (VNPay)</Radio>
//                   <Radio value="STRIPE" disabled>Stripe (Thẻ quốc tế) — tạm ẩn</Radio>
//                 </Space>
//               </Radio.Group>
//             </div>

//             <div style={{ marginTop: 16 }}>
//               <div style={{ marginBottom: 8 }}>
//                 <Text strong>Ghi chú</Text>
//               </div>
//               <TextArea rows={3} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao..." />
//             </div>

//             <div style={{ marginTop: 18 }}>
//               <Space size="middle">
//                 {paymentMethod === "COD" ? (
//                   <Button onClick={onSubmitCOD} type="primary" size="large" style={{ background: gold, borderColor: gold }} loading={busy}>
//                     {busy ? "Đang tạo đơn..." : "Đặt hàng"}
//                   </Button>
//                 ) : paymentMethod === "VIETQR" ? (
//                   <Button onClick={onSubmitBank} type="primary" size="large" style={{ background: gold, borderColor: gold }} loading={busy}>
//                     {busy ? "Đang tạo đơn..." : "Lấy QR chuyển khoản"}
//                   </Button>
//                 ) : (
//                   <Button disabled>Thanh toán bằng Stripe</Button>
//                 )}
//                 <Button type="default" onClick={() => nav("/cart")}>Quay lại giỏ hàng</Button>
//               </Space>
//             </div>
//           </Card>
//         </Col>

//         {/* Right: Summary (phần 3 bạn muốn) */}
//         <Col xs={24} md={8}>
//           <Card
//             bordered={false}
//             style={{
//               borderRadius: 18,
//               padding: 24,
//               background: "linear-gradient(180deg,#fffaf1,#fff8ee)",
//               boxShadow: "0 30px 60px rgba(184,142,47,0.06)",
//             }}
//           >
//             <div style={{ marginBottom: 18 }}>
//               <Title level={4} style={{ margin: 0, color: dark }}>
//                 Tóm tắt đơn hàng
//               </Title>
//               <Text type="secondary">Xem lại trước khi thanh toán</Text>
//             </div>

//             <Divider />

//             <Space direction="vertical" style={{ width: "100%" }} size="large">
//               <div style={{ display: "flex", justifyContent: "space-between" }}>
//                 <Text type="secondary">Tạm tính</Text>
//                 <Text strong style={{ fontSize: 18 }}>{vnd(subTotal)}</Text>
//               </div>

//               <div style={{ display: "flex", justifyContent: "space-between" }}>
//                 <Text type="secondary">Phí vận chuyển</Text>
//                 <Text>{shippingFee === 0 ? "Miễn phí" : vnd(shippingFee)}</Text>
//               </div>

//               <div style={{ display: "flex", justifyContent: "space-between" }}>
//                 <Text type="secondary">Giảm giá</Text>
//                 <Text>- {vnd(discount)}</Text>
//               </div>

//               <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8 }}>
//                 <Text style={{ fontSize: 16, fontWeight: 700 }}>Tổng thanh toán</Text>
//                 <div style={{ fontSize: 22, fontWeight: 900, color: gold }}>{vnd(grandTotal)}</div>
//               </div>

//               <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
//                 <Button
//                   type="primary"
//                   size="large"
//                   icon={<ShoppingCartOutlined />}
//                   // onClick={() => nav("/checkout")}
//                   onClick={paymentMethod === "COD" ? onSubmitCOD : paymentMethod === "VIETQR" ? onSubmitBank : undefined}
//                   style={{
//                     background: `linear-gradient(90deg, ${gold}, #f6d58a)`,
//                     borderColor: gold,
//                     height: 54,
//                     borderRadius: 12,
//                     fontWeight: 800,
//                   }}
//                   block
//                 >
//                   Tiến hành thanh toán
//                 </Button>

//                 <Button
//                   size="large"
//                   block
//                   onClick={() => nav("/products")}
//                   style={{
//                     height: 54,
//                     borderRadius: 12,
//                     border: `1px solid ${gold}`,
//                     color: dark,
//                     fontWeight: 700,
//                     background: "#fff"
//                   }}
//                 >
//                   Tiếp tục mua sắm
//                 </Button>

//                 <Button
//                   type="text"
//                   onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
//                 >
//                   Quay lại đầu trang
//                 </Button>
//               </div>
//             </Space>
//           </Card>
//         </Col>
//       </Row>
//     </section>
//   );
// }

// // small helper tag for default address
// function TagDefault() {
//   return (
//     <span style={{
//       background: "#f0f0f0",
//       padding: "2px 8px",
//       borderRadius: 8,
//       fontSize: 12,
//       color: "#333"
//     }}>
//       Mặc định
//     </span>
//   );
// }///21//11













// src/pages/Checkout.jsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import axiosClient from "../services/axiosClient";
import { vnd } from "../utils/format";

// Ant Design
import {
  Card,
  Row,
  Col,
  Typography,
  Space,
  Button,
  Divider,
  Radio,
  Input,
  Form,
  Modal,
  notification,
  Alert,
} from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { TextArea } = Input;

function normAddr(a = {}) {
  return {
    id: a._id || a.id,
    name: a.name || "Chưa đặt tên",
    phone: a.phone || "",
    email: a.email || "",
    line1: a.line1 || a.address || "",
    isDefault: !!a.isDefault,
  };
}

const FREE_SHIP_THRESHOLD = 2_000_000;
const BASE_SHIP = 30_000;
const GOLD = "#B88E2F";
const WALNUT = "#3E2E1A";
const BG_SOFT = "#FFFCF6";
const BORDER_SOFT = "rgba(184,142,47,0.16)";
const SHADOW_SOFT = "0 22px 60px rgba(0,0,0,0.08)";

const isValidPhoneVN = (s = "") => {
  const digits = s.replace(/\D/g, "");
  return digits.length >= 9 && digits.length <= 11;
};

export default function Checkout() {
  const nav = useNavigate();
  const loc = useLocation();
  const { user } = useAuth();
  const { items, clear } = useCart();

  const [addresses, setAddresses] = useState([]);
  const [selected, setSelected] = useState(null);
  const [addrForm, setAddrForm] = useState({
    name: "",
    phone: "",
    email: "",
    line1: "",
    setDefault: false,
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  // 1) Bắt buộc login
  useEffect(() => {
    if (!user) {
      const next = encodeURIComponent(loc.pathname);
      nav(`/login?next=${next}`, { replace: true });
    }
  }, [user, nav, loc.pathname]);

  // 2) Giỏ trống → quay lại /cart
  useEffect(() => {
    if (!items.length) nav("/cart");
  }, [items.length, nav]);

  // 3) Tải địa chỉ
  async function loadAddresses() {
    try {
      const { data } = await axiosClient.get("/api/users/addresses");
      const arr = Array.isArray(data) ? data.map(normAddr) : [];
      setAddresses(arr);
      const def = arr.find((x) => x.isDefault) || arr[0];
      setSelected(def?.id || null);
    } catch {
      nav(`/login?next=${encodeURIComponent("/checkout")}`, { replace: true });
    }
  }

  useEffect(() => {
    if (user) loadAddresses();
  }, [user]);

  const subTotal = useMemo(
    () =>
      items.reduce(
        (s, it) => s + (Number(it.price) || 0) * (Number(it.qty) || 0),
        0
      ),
    [items]
  );
  const shippingFee = useMemo(
    () => (subTotal >= FREE_SHIP_THRESHOLD ? 0 : BASE_SHIP),
    [subTotal]
  );
  const discount = 0;
  const grandTotal = Math.max(0, subTotal + shippingFee - discount);

  // 4) Thêm địa chỉ
  async function onAddAddress() {
    setErr("");
    if (!addrForm.name.trim()) return setErr("Vui lòng nhập họ tên");
    if (!isValidPhoneVN(addrForm.phone))
      return setErr("Số điện thoại chưa hợp lệ");
    if (!addrForm.line1.trim()) return setErr("Vui lòng nhập địa chỉ");

    try {
      setBusy(true);
      const { data } = await axiosClient.post("/api/users/addresses", {
        name: addrForm.name.trim(),
        phone: addrForm.phone.trim(),
        email: addrForm.email.trim(),
        line1: addrForm.line1.trim(),
        isDefault: !!addrForm.setDefault,
      });
      const n = normAddr(data);
      setAddresses((arr) => [n, ...arr]);
      setSelected(n.id);
      setAddrForm({
        name: "",
        phone: "",
        email: "",
        line1: "",
        setDefault: false,
      });
    } catch (e) {
      setErr(e?.response?.data?.message || "Không thêm được địa chỉ");
    } finally {
      setBusy(false);
    }
  }

  const chooseAddress = (id) => setSelected(id);

  // 5) Đặt hàng COD
  async function onSubmitCOD(e) {
    e.preventDefault();
    setErr("");

    const chosen = addresses.find((a) => a.id === selected);
    if (!chosen)
      return setErr("Vui lòng chọn hoặc thêm địa chỉ giao hàng");

    const customer = {
      name: chosen.name,
      phone: chosen.phone,
      email: chosen.email,
      address: chosen.line1,
      note,
    };

    if (!isValidPhoneVN(customer.phone))
      return setErr("Số điện thoại chưa hợp lệ");
    if (!items.length) return setErr("Giỏ hàng trống");

    try {
      setBusy(true);
      const payload = {
        items: items.map((it) => ({
          id: it.id,
          quantity: Number(it.qty) || 1,
        })),
        customer,
        paymentMethod: "COD",
        shippingFee,
        discount,
      };
      const { data } = await axiosClient.post("/api/orders", payload);

      Modal.success({
        title: "Đặt hàng thành công!",
        content: (
          <div>
            <Text>Cảm ơn bạn đã tin tưởng NaturaHome 🪑</Text>
            <div style={{ marginTop: 8 }}>
              <Text type="secondary">
                Đơn hàng của bạn đang chờ xác nhận. Chúng tôi sẽ liên hệ sớm.
              </Text>
            </div>
          </div>
        ),
        okText: "Xem đơn hàng",
        centered: true,
        onOk: () => {
          nav(`/orders/me?created=${data._id}`, { replace: true });
          setTimeout(() => clear(), 300);
        },
      });
    } catch (e) {
      const msg = e?.response?.data?.message || "Tạo đơn thất bại";
      setErr(msg);
      notification.error({ message: "Lỗi", description: msg });
    } finally {
      setBusy(false);
    }
  }

  // 6) Thanh toán VNPay
  // async function onSubmitBank(e) {
  //   e.preventDefault();
  //   setErr("");

  //   const chosen = addresses.find((a) => a.id === selected);
  //   if (!chosen)
  //     return setErr("Vui lòng chọn hoặc thêm địa chỉ giao hàng");

  //   const customer = {
  //     name: chosen.name,
  //     phone: chosen.phone,
  //     email: chosen.email,
  //     address: chosen.line1,
  //     note,
  //   };

  //   if (!isValidPhoneVN(customer.phone))
  //     return setErr("Số điện thoại chưa hợp lệ");
  //   if (!items.length) return setErr("Giỏ hàng trống");

  //   try {
  //     setBusy(true);
  //     const payload = {
  //       items: items.map((it) => ({
  //         id: it.id,
  //         quantity: Number(it.qty) || 1,
  //       })),
  //       customer,
  //       paymentMethod: "VNPAY",
  //       shippingFee,
  //       discount,
  //     };

  //     const { data } = await axiosClient.post(
  //       "/api/pay/vnpay/create",
  //       payload
  //     );

  //     if (data?.payUrl) {
  //       notification.info({
  //         message: "Đang chuyển tới VNPay...",
  //         description: "Vui lòng không tắt trình duyệt trong khi thanh toán.",
  //       });
  //       window.location.href = data.payUrl;
  //     } else {
  //       const msg = "Không tạo được link thanh toán VNPay";
  //       setErr(msg);
  //       notification.error({ message: "Lỗi", description: msg });
  //     }
  //   } catch (e) {
  //     const msg =
  //       e?.response?.data?.message || "Không tạo được thanh toán VNPay";
  //     setErr(msg);
  //     notification.error({ message: "Lỗi", description: msg });
  //   } finally {
  //     setBusy(false);
  //   }
  // }


async function onSubmitBank(e) {
  e.preventDefault();
  setErr("");

  const chosen = addresses.find(a => a.id === selected);
  if (!chosen) return setErr("Vui lòng chọn địa chỉ giao hàng");
  if (!items.length) return setErr("Giỏ hàng trống");

  try {
    setBusy(true);

    // 1) Tạo đơn hàng trước
    const orderPayload = {
      items: items.map(it => ({
        id: it.id,
        quantity: Number(it.qty) || 1,
      })),
      customer: {
        name: chosen.name,
        phone: chosen.phone,
        email: chosen.email,
        address: chosen.line1,
        note,
      },
      paymentMethod: "VNPAY",
      shippingFee,
      discount,
    };

    const orderRes = await axiosClient.post("/api/orders", orderPayload);
    const orderId = orderRes.data._id;

    if (!orderId) throw new Error("Không tạo được đơn hàng");

    // 2) Gọi API tạo link VNPay
    const payRes = await axiosClient.post("/api/pay/vnpay/create", {
      orderId,
    });

    if (!payRes.data?.payUrl)
      throw new Error("Không tạo được liên kết VNPay");

    window.location.href = payRes.data.payUrl;

  } catch (e) {
    const msg =
      e?.response?.data?.message ||
      e.message ||
      "Không thể thanh toán VNPay";
    setErr(msg);
  } finally {
    setBusy(false);
  }
}




  // UI
  return (
    <section
      className="max-w-7xl mx-auto px-6 py-12"
      style={{ background: "transparent" }}
    >
      {/* HEADER HERO */}
      <Card
        bordered={false}
        style={{
          borderRadius: 18,
          background:
            "linear-gradient(105deg,#FAF6EB 0%,#FFF9EE 55%,#FFFDF7 100%)",
          marginBottom: 24,
          boxShadow: SHADOW_SOFT,
          border: `1px solid ${BORDER_SOFT}`,
        }}
      >
        <Row align="middle" gutter={24}>
          <Col xs={24} md={17}>
            <div style={{ display: "flex", gap: 18, alignItems: "center" }}>
              <div
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 20,
                  background:
                    "radial-gradient(circle at 30% 20%,#FFF7DE 0,#B88E2F 65%,#8A6720 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#fff",
                  fontSize: 34,
                  boxShadow: "0 14px 40px rgba(0,0,0,0.25)",
                }}
              >
                🛒
              </div>
              <div>
                <div
                  style={{
                    fontSize: 13,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                    color: "rgba(62,46,26,0.72)",
                    marginBottom: 4,
                  }}
                >
                  NATURAHOME CHECKOUT
                </div>
                <Title
                  level={3}
                  style={{
                    margin: 0,
                    color: WALNUT,
                    fontWeight: 800,
                    letterSpacing: 0.3,
                  }}
                >
                  Hoàn tất đơn hàng nội thất cao cấp
                </Title>
                <Text type="secondary">
                  Chọn địa chỉ, phương thức thanh toán và xác nhận đơn hàng.
                </Text>
              </div>
            </div>
          </Col>
          <Col
            xs={24}
            md={7}
            style={{ textAlign: "right", marginTop: 10 }}
          >
            <Space direction="vertical" align="end">
              <div
                style={{
                  padding: "4px 12px",
                  borderRadius: 999,
                  background: "rgba(184,142,47,0.08)",
                  fontSize: 12,
                  color: WALNUT,
                }}
              >
                Bước 2 / 3 • Thanh toán
              </div>
              <Button type="text" onClick={() => nav("/cart")}>
                ← Quay lại giỏ hàng
              </Button>
            </Space>
          </Col>
        </Row>
      </Card>

      <Row gutter={[24, 24]}>
        {/* LEFT: ĐỊA CHỈ + PHƯƠNG THỨC */}
        <Col xs={24} md={16}>
          {/* Địa chỉ */}
          <Card
            bordered={false}
            style={{
              borderRadius: 16,
              padding: 22,
              marginBottom: 18,
              boxShadow: "0 14px 40px rgba(0,0,0,0.03)",
              border: "1px solid #F3EEE3",
              background: "#FFFEFA",
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <Title
                level={4}
                style={{ margin: 0, color: WALNUT, fontWeight: 700 }}
              >
                Địa chỉ giao hàng
              </Title>
              <Text type="secondary">
                Đăng nhập: <b>{user?.email}</b>
              </Text>
            </div>

            <Space
              direction="vertical"
              size="middle"
              style={{ width: "100%" }}
            >
              {addresses.length ? (
                addresses.map((a) => (
                  <button
                    key={a.id}
                    type="button"
                    onClick={() => chooseAddress(a.id)}
                    style={{
                      borderRadius: 12,
                      border:
                        selected === a.id
                          ? `2px solid ${GOLD}`
                          : "1px solid #EFE7D8",
                      padding: 12,
                      cursor: "pointer",
                      display: "flex",
                      gap: 12,
                      alignItems: "center",
                      background:
                        selected === a.id ? "#FFF9EE" : "rgba(255,255,255,0.9)",
                      width: "100%",
                    }}
                  >
                    <div
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: 99,
                        border: "2px solid rgba(0,0,0,0.12)",
                        background:
                          selected === a.id ? GOLD : "transparent",
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                        }}
                      >
                        <Text strong style={{ fontSize: 15 }}>
                          {a.name}
                        </Text>
                        {a.isDefault && <TagDefault />}
                        <Text
                          type="secondary"
                          style={{ marginLeft: 8, fontSize: 13 }}
                        >
                          {a.phone}
                        </Text>
                      </div>
                      <div style={{ marginTop: 4 }}>
                        <Text type="secondary" style={{ fontSize: 13 }}>
                          {a.line1}
                        </Text>
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <Alert
                  message="Chưa có địa chỉ giao hàng. Thêm địa chỉ mới bên dưới."
                  type="info"
                  showIcon
                />
              )}

              {/* Thêm địa chỉ mới */}
              <Card
                size="small"
                style={{
                  borderRadius: 12,
                  border: "1px dashed #E2D7C1",
                  background: "#FFFEFC",
                }}
              >
                <div
                  style={{
                    marginBottom: 6,
                    fontWeight: 600,
                    color: WALNUT,
                  }}
                >
                  Thêm địa chỉ mới
                </div>
                <Form layout="vertical" onFinish={onAddAddress}>
                  <Row gutter={12}>
                    <Col span={12}>
                      <Form.Item label="Họ tên">
                        <Input
                          value={addrForm.name}
                          onChange={(e) =>
                            setAddrForm((s) => ({
                              ...s,
                              name: e.target.value,
                            }))
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Số điện thoại">
                        <Input
                          value={addrForm.phone}
                          onChange={(e) =>
                            setAddrForm((s) => ({
                              ...s,
                              phone: e.target.value,
                            }))
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>

                  <Form.Item label="Email (tuỳ chọn)">
                    <Input
                      value={addrForm.email}
                      onChange={(e) =>
                        setAddrForm((s) => ({
                          ...s,
                          email: e.target.value,
                        }))
                      }
                    />
                  </Form.Item>

                  <Form.Item label="Địa chỉ chi tiết">
                    <TextArea
                      rows={3}
                      value={addrForm.line1}
                      onChange={(e) =>
                        setAddrForm((s) => ({
                          ...s,
                          line1: e.target.value,
                        }))
                      }
                    />
                  </Form.Item>

                  <Space>
                    <Button
                      htmlType="submit"
                      type="primary"
                      loading={busy}
                      style={{
                        background: GOLD,
                        borderColor: GOLD,
                        borderRadius: 999,
                        paddingInline: 22,
                      }}
                    >
                      Lưu địa chỉ
                    </Button>
                    <Button
                      onClick={() =>
                        setAddrForm({
                          name: "",
                          phone: "",
                          email: "",
                          line1: "",
                          setDefault: false,
                        })
                      }
                    >
                      Hủy
                    </Button>
                  </Space>
                </Form>

                {err && (
                  <div
                    className="text-red-600"
                    style={{ marginTop: 10, fontSize: 13 }}
                  >
                    ⚠ {err}
                  </div>
                )}
              </Card>
            </Space>
          </Card>

          {/* Phương thức thanh toán */}
          <Card
            bordered={false}
            style={{
              borderRadius: 16,
              padding: 22,
              boxShadow: "0 14px 40px rgba(0,0,0,0.03)",
              border: "1px solid #F3EEE3",
              background: "#FFFEFA",
            }}
          >
            <Title
              level={4}
              style={{ marginBottom: 4, color: WALNUT, fontWeight: 700 }}
            >
              Phương thức thanh toán
            </Title>
            <Text type="secondary">
              Chọn hình thức thanh toán phù hợp với bạn.
            </Text>

            <div style={{ marginTop: 16 }}>
              <Radio.Group
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <Space direction="vertical">
                  <Radio value="COD">
                    <b>COD</b> — Thanh toán khi nhận hàng
                  </Radio>
                  <Radio value="VIETQR">
                    <b>Chuyển khoản VNPay</b> — Thanh toán online an toàn
                  </Radio>
                  <Radio value="STRIPE" disabled>
                    Thẻ quốc tế (Stripe) — đang phát triển
                  </Radio>
                </Space>
              </Radio.Group>
            </div>

            <div style={{ marginTop: 18 }}>
              <div style={{ marginBottom: 6 }}>
                <Text strong>Ghi chú cho cửa hàng</Text>
              </div>
              <TextArea
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Ví dụ: Giao giờ hành chính, gọi trước khi giao, lưu ý khi lắp đặt..."
              />
            </div>

            <Divider />

            <Space size="middle">
              {paymentMethod === "COD" ? (
                <Button
                  onClick={onSubmitCOD}
                  type="primary"
                  size="large"
                  loading={busy}
                  style={{
                    background: GOLD,
                    borderColor: GOLD,
                    borderRadius: 999,
                    paddingInline: 30,
                    fontWeight: 700,
                  }}
                >
                  {busy ? "Đang tạo đơn..." : "Đặt hàng COD"}
                </Button>
              ) : paymentMethod === "VIETQR" ? (
                <Button
                  onClick={onSubmitBank}
                  type="primary"
                  size="large"
                  loading={busy}
                  style={{
                    background: GOLD,
                    borderColor: GOLD,
                    borderRadius: 999,
                    paddingInline: 30,
                    fontWeight: 700,
                  }}
                >
                  {busy ? "Đang tạo thanh toán..." : "Thanh toán qua VNPay"}
                </Button>
              ) : (
                <Button disabled>Thanh toán bằng Stripe</Button>
              )}
              <Button type="default" onClick={() => nav("/cart")}>
                Quay lại giỏ hàng
              </Button>
            </Space>
          </Card>
        </Col>

        {/* RIGHT: TÓM TẮT ĐƠN */}
        <Col xs={24} md={8}>
          <Card
            bordered={false}
            style={{
              borderRadius: 20,
              padding: 24,
              background: BG_SOFT,
              border: `1px solid ${BORDER_SOFT}`,
              boxShadow: SHADOW_SOFT,
            }}
          >
            <div style={{ marginBottom: 16 }}>
              <Title
                level={4}
                style={{ margin: 0, color: WALNUT, fontWeight: 700 }}
              >
                Tóm tắt đơn hàng
              </Title>
              <Text type="secondary">
                Kiểm tra lại thông tin trước khi thanh toán.
              </Text>
            </div>

            <Divider style={{ margin: "12px 0 16px" }} />

            <Space
              direction="vertical"
              style={{ width: "100%" }}
              size="middle"
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 14,
                }}
              >
                <Text type="secondary">Tạm tính</Text>
                <Text strong>{vnd(subTotal)}</Text>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 14,
                }}
              >
                <Text type="secondary">Phí vận chuyển</Text>
                <Text>
                  {shippingFee === 0 ? "Miễn phí" : vnd(shippingFee)}
                </Text>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 14,
                }}
              >
                <Text type="secondary">Giảm giá</Text>
                <Text>- {vnd(discount)}</Text>
              </div>

              <Divider style={{ margin: "8px 0" }} />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                }}
              >
                <div>
                  <Text
                    style={{ fontSize: 15, fontWeight: 700, color: WALNUT }}
                  >
                    Tổng thanh toán
                  </Text>
                  <div style={{ fontSize: 12, color: "rgba(0,0,0,0.45)" }}>
                    Đã bao gồm VAT (nếu có)
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 900,
                    color: GOLD,
                    letterSpacing: 0.4,
                  }}
                >
                  {vnd(grandTotal)}
                </div>
              </div>

              <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
                <Button
               className="fx-push fx-gold"
                  type="primary"
                  size="large"
                  icon={<ShoppingCartOutlined />}
                  onClick={
                    paymentMethod === "COD"
                      ? onSubmitCOD
                      : paymentMethod === "VIETQR"
                      ? onSubmitBank
                      : undefined
                  }
                  style={{
                    background: `linear-gradient(90deg, ${GOLD}, #F5D691)`,
                    borderColor: GOLD,
                    height: 52,
                    borderRadius: 14,
                    fontWeight: 800,
                  }}
                  block
                >
                  Tiến hành thanh toán
                </Button>

                <Button
                className="fx-push fx-gold"
                  size="large"
                  block
                  onClick={() => nav("/products")}
                  style={{
                    height: 50,
                    borderRadius: 14,
                    border: `1px solid ${GOLD}`,
                    color: WALNUT,
                    fontWeight: 600,
                    background: "#fff",
                  }}
                >
                  Tiếp tục mua sắm
                </Button>

                <Button
                  type="text"
                  onClick={() =>
                    window.scrollTo({ top: 0, behavior: "smooth" })
                  }
                  style={{ fontSize: 13 }}
                >
                  ⬆ Quay lại đầu trang
                </Button>
              </div>
            </Space>
          </Card>
        </Col>
      </Row>
    </section>
  );
}

// Tag địa chỉ mặc định
function TagDefault() {
  return (
    <span
      style={{
        background: "rgba(184,142,47,0.1)",
        padding: "2px 8px",
        borderRadius: 999,
        fontSize: 11,
        color: "#5a4524",
        textTransform: "uppercase",
        letterSpacing: 0.4,
      }}
    >
      Mặc định
    </span>
  );
}


