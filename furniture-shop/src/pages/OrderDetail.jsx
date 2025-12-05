


// // src/pages/OrderDetail.jsx
// import { useEffect, useMemo, useState } from "react";
// import { Link, useParams, useSearchParams } from "react-router-dom";
// import ImgSafe from "../components/ImgSafe";
// import { vnd } from "../utils/format";
// import axiosClient from "../services/axiosClient";
// import { useAuth } from "../context/AuthContext";



// const ORIGIN = import.meta.env.VITE_API_ORIGIN || "http://localhost:8081";

// function Badge({ children, tone = "gray" }) {
//   const map = {
//     gray: "bg-gray-100 text-gray-700",
//     blue: "bg-blue-100 text-blue-700",
//     green: "bg-green-100 text-green-700",
//     yellow: "bg-yellow-100 text-yellow-700",
//     red: "bg-red-100 text-red-700",
//   };
//   return (
//     <span className={`px-2.5 py-1 rounded-md text-xs font-medium ${map[tone] || map.gray}`}>
//       {children}
//     </span>
//   );
// }

// function toAbs(url) {
//   if (!url) return "";
//   if (/^https?:\/\//i.test(url)) return url;
//   if (url.startsWith("/")) return ORIGIN + url;
//   return url;
// }



// export default function OrderDetail() {
//   const { id } = useParams();
//   const [sp] = useSearchParams();
//   const success = sp.get("success") === "1";

//   const { user } = useAuth();

//   const [order, setOrder] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");
//   const [cancelling, setCancelling] = useState(false);

//   useEffect(() => {
//     let stop = false;
//     (async () => {
//       try {
//         setLoading(true);
//         setErr("");
//         const { data } = await axiosClient.get(`/api/orders/${id}`);
//         if (!stop) setOrder(data);
//       } catch (e) {
//         const status = e?.response?.status;
//         const msg =
//           e?.response?.data?.message ||
//           (status === 401 || status === 403
//             ? "Bạn cần đăng nhập và chỉ có thể xem đơn của chính mình."
//             : "Không tải được đơn hàng");
//         if (!stop) setErr(msg);
//       } finally {
//         if (!stop) setLoading(false);
//       }
//     })();
//     return () => {
//       stop = true;
//     };
//   }, [id]);

//   // Hủy đơn (chỉ khi pending, đúng chủ)
//   async function handleCancel() {
//     if (!window.confirm("Bạn có chắc muốn hủy đơn này?")) return;
//     try {
//       setCancelling(true);
//       const { data } = await axiosClient.patch(`/api/orders/${order._id}/cancel`, {
//         reason: "Khách hủy trên website",
//       });
//       setOrder(data);
//     } catch (e) {
//       alert(e?.response?.data?.message || "Hủy đơn thất bại");
//     } finally {
//       setCancelling(false);
//     }
//   }










//   const toneByStatus = useMemo(() => {
//     switch (order?.status) {
//       case "pending":
//         return "yellow";
//       case "paid":
//       case "completed":
//         return "green";
//       case "shipping":
//         return "blue";
//       case "cancelled":
//       case "failed":
//         return "red";
//       default:
//         return "gray";
//     }
//   }, [order?.status]);

//   if (loading) {
//     return (
//       <section className="max-w-5xl mx-auto px-4 py-10">
//         <div className="h-8 w-64 bg-gray-100 rounded animate-pulse mb-6" />
//         <div className="grid md:grid-cols-2 gap-8">
//           <div className="space-y-3">
//             <div className="h-5 w-1/2 bg-gray-100 rounded animate-pulse" />
//             <div className="h-5 w-2/3 bg-gray-100 rounded animate-pulse" />
//             <div className="h-28 w-full bg-gray-100 rounded animate-pulse" />
//           </div>
//           <div className="h-64 bg-gray-100 rounded animate-pulse" />
//         </div>
//       </section>
//     );
//   }

//   if (err || !order) {
//     return (
//       <section className="max-w-5xl mx-auto px-4 py-10">
//         <p className="text-red-600">⚠ {err || "Không tìm thấy đơn hàng."}</p>
//         <div className="mt-4 flex items-center gap-3">
//           <Link to="/orders/me" className="rounded-xl border px-4 py-2 hover:bg-black hover:text-white transition">
//             Đơn hàng của tôi
//           </Link>
//           <Link to="/products" className="rounded-xl border px-4 py-2 hover:bg-black hover:text-white transition">
//             Tiếp tục mua sắm
//           </Link>
//         </div>
//       </section>
//     );
//   }

//   const createdAt = order.createdAt ? new Date(order.createdAt).toLocaleString() : "—";
//   const items = Array.isArray(order.items) ? order.items : [];
//   const amount = Number(order.amount || order.subtotal || 0);
//   const shippingFee = Number(order.shippingFee || 0);
//   const discount = Number(order.discount || 0);
//   const total = Number(order.total ?? order.grandTotal ?? amount + shippingFee - discount) || 0;

//   // Chỉ hiển thị nút Hủy khi đã đăng nhập và trạng thái pending
//   const canCancel = !!user && order.status === "pending";

//   return (
//     <section className="max-w-5xl mx-auto px-4 py-10 space-y-8">
//       {success && (
//         <div className="rounded-xl border bg-green-50 text-green-800 p-4">
//           🎉 <b>Đặt hàng thành công!</b> Chúng tôi sẽ liên hệ xác nhận và giao hàng sớm nhất.
//         </div>
//       )}

//       {/* Header */}
//       <div className="flex items-start justify-between">
//         <div>
//           <h1 className="text-2xl md:text-3xl font-semibold">Đơn hàng #{order.code || order._id}</h1>
//           <p className="text-gray-600 mt-1">Tạo lúc: {createdAt}</p>
//         </div>
//         <div className="flex items-center gap-3">
//           <Badge tone={toneByStatus}>Trạng thái: {order.status || "pending"}</Badge>
//           {canCancel && (
//             <button
//               onClick={handleCancel}
//               disabled={cancelling}
//               className="px-3 py-2 rounded-lg border border-red-500 text-red-600 disabled:opacity-50 hover:bg-red-50"
//             >
//               {cancelling ? "Đang hủy..." : "Hủy đơn"}
//             </button>
//           )}
//         </div>
//       </div>

//       <div className="grid md:grid-cols-2 gap-8">
//         {/* Thông tin nhận hàng */}
//         <div className="bg-white border rounded-2xl p-5">
//           <h2 className="text-lg font-medium mb-3">Thông tin nhận hàng</h2>
//           <div className="space-y-1 text-gray-800">
//             <div><b>Họ tên:</b> {order.customer?.name || "—"}</div>
//             <div><b>Điện thoại:</b> {order.customer?.phone || "—"}</div>
//             <div><b>Email:</b> {order.customer?.email || "—"}</div>
//             <div><b>Địa chỉ:</b> {order.customer?.address || "—"}</div>
//             {order.customer?.note && <div><b>Ghi chú:</b> {order.customer.note}</div>}
//             <div className="mt-2"><b>Thanh toán:</b> {order.paymentMethod || "COD"}</div>
//           </div>
//         </div>

//         {/* Tổng tiền */}
//         <div className="bg-white border rounded-2xl p-5 h-fit">
//           <h2 className="text-lg font-medium mb-3">Thanh toán</h2>
//           <div className="space-y-2">
//             <Row label="Tạm tính" value={vnd(amount)} />
//             <Row label={`Phí vận chuyển${shippingFee === 0 ? " (Miễn phí)" : ""}`} value={vnd(shippingFee)} />
//             {discount > 0 && <Row label="Giảm giá" value={`- ${vnd(discount)}`} />}
//             <Row label="Tổng thanh toán" value={vnd(total)} bold />
//           </div>







//           <div className="mt-4 text-sm text-gray-500">Cảm ơn bạn đã mua sắm tại cửa hàng!</div>
//         </div>
//       </div>

//       {/* Danh sách sản phẩm */}
//       <div className="bg-white border rounded-2xl p-5">
//         <h2 className="text-lg font-medium mb-4">Sản phẩm</h2>
//         <div className="divide-y">
//           {items.map((it, idx) => {
//             const qty = Number(it.quantity ?? it.qty ?? 0);
//             const line = (Number(it.price) || 0) * qty;
//             const img = toAbs(it.image);
//             return (
//               <div key={idx} className="py-4 flex items-center gap-4">
//                 <div className="w-16 h-16 border rounded overflow-hidden bg-gray-50">
//                   <ImgSafe src={img} alt={it.name} className="w-full h-full object-cover" />
//                 </div>
//                 <div className="flex-1">
//                   <div className="font-medium">{it.name}</div>
//                   <div className="text-sm text-gray-600">SL: {qty}</div>
//                 </div>
//                 <div className="text-right">
//                   <div className="text-sm text-gray-600">{vnd(it.price)} /sp</div>
//                   <div className="font-medium">{vnd(line)}</div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         <div className="mt-6 flex items-center gap-3">
//           <Link to="/orders/me" className="rounded-xl border px-4 py-2 hover:bg-black hover:text-white transition">
//             Đơn hàng của tôi
//           </Link>
//           <Link to="/products" className="rounded-xl border px-4 py-2 hover:bg-black hover:text-white transition">
//             Tiếp tục mua sắm
//           </Link>
//         </div>
//       </div>
//     </section>
//   );
// }

// function Row({ label, value, bold }) {
//   return (
//     <div className={`flex items-center justify-between ${bold ? "font-semibold text-lg" : ""}`}>
//       <span>{label}</span>
//       <span>{value}</span>
//     </div>
//   );
// }///12/11





// src/pages/OrderDetail.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import ImgSafe from "../components/ImgSafe";
import { vnd } from "../utils/format";
import axiosClient from "../services/axiosClient";
import { useAuth } from "../context/AuthContext";

// Ant Design
import {
  Card,
  Row,
  Col,
  Typography,
  Button,
  Tag,
  Divider,
  Avatar,
  Space,
  notification,
  Modal,
  Spin,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;
const { confirm } = Modal;

const GOLD = "#B88E2F";
const DARK = "#2b2b2b";
const ORIGIN = import.meta.env.VITE_API_ORIGIN || "http://localhost:8081";

function Badge({ children, tone = "gray" }) {
  const map = {
    gray: { bg: "#f3f4f6", color: "#374151" },
    blue: { bg: "#e6f7ff", color: "#096dd9" },
    green: { bg: "#f6ffed", color: "#389e0d" },
    yellow: { bg: "#fff7e6", color: "#b88e2f" },
    red: { bg: "#fff1f0", color: "#cf1322" },
  };
  const s = map[tone] || map.gray;
  return (
    <span
      style={{
        background: s.bg,
        color: s.color,
        padding: "6px 10px",
        borderRadius: 8,
        fontWeight: 600,
        fontSize: 13,
        display: "inline-block",
      }}
    >
      {children}
    </span>
  );
}

function toAbs(url) {
  if (!url) return "";
  if (/^https?:\/\//i.test(url)) return url;
  if (url.startsWith("/")) return ORIGIN + url;
  return url;
}

export default function OrderDetail() {
  const { id } = useParams();
  const [sp] = useSearchParams();
  const success = sp.get("success") === "1";

  const { user } = useAuth();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    let stop = false;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const { data } = await axiosClient.get(`/api/orders/${id}`);
        if (!stop) setOrder(data);
      } catch (e) {
        const status = e?.response?.status;
        const msg =
          e?.response?.data?.message ||
          (status === 401 || status === 403
            ? "Bạn cần đăng nhập và chỉ có thể xem đơn của chính mình."
            : "Không tải được đơn hàng");
        if (!stop) setErr(msg);
      } finally {
        if (!stop) setLoading(false);
      }
    })();
    return () => {
      stop = true;
    };
  }, [id]);

  // Huỷ đơn (xác nhận)
  async function handleCancel() {
    confirm({
      title: "Bạn có chắc muốn hủy đơn này?",
      icon: <ExclamationCircleOutlined />,
      content: "Hành động này không thể hoàn tác.",
      okText: "Xác nhận huỷ",
      okType: "danger",
      cancelText: "Đóng",
      async onOk() {
        try {
          setCancelling(true);
          const { data } = await axiosClient.patch(`/api/orders/${order._id}/cancel`, {
            reason: "Khách huỷ trên website",
          });
          setOrder(data);
          notification.success({
            message: "Đã huỷ đơn hàng",
            description: "Đơn hàng đã được huỷ thành công.",
            placement: "topRight",
          });
        } catch (e) {
          notification.error({
            message: "Huỷ đơn thất bại",
            description: e?.response?.data?.message || "Đã có lỗi xảy ra.",
            placement: "topRight",
          });
        } finally {
          setCancelling(false);
        }
      },
    });
  }

  const toneByStatus = useMemo(() => {
    switch (order?.status) {
      case "pending":
        return "yellow";
      case "paid":
      case "completed":
        return "green";
      case "shipping":
        return "blue";
      case "cancelled":
      case "failed":
        return "red";
      default:
        return "gray";
    }
  }, [order?.status]);

  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-16">
        <Card
          variant="outlined"
          styles={{ body: { padding: 24 } }}
          style={{
            borderRadius: 12,
            boxShadow: "0 8px 30px rgba(0,0,0,0.05)",
          }}
        >
          <Spin size="large" />
        </Card>
      </section>
    );
  }

  if (err || !order) {
    return (
      <section className="max-w-7xl mx-auto px-4 py-10">
        <Card variant="outlined" styles={{ body: { padding: 24 } }}>
          <Text type="danger">⚠ {err || "Không tìm thấy đơn hàng."}</Text>
          <div style={{ marginTop: 16 }}>
            <Space>
              <Link to="/orders/me">
                <Button>Đơn hàng của tôi</Button>
              </Link>
              <Link to="/products">
                <Button type="primary" style={{ background: GOLD, borderColor: GOLD }}>
                  Tiếp tục mua sắm
                </Button>
              </Link>
            </Space>
          </div>
        </Card>
      </section>
    );
  }

  const createdAt = order.createdAt ? new Date(order.createdAt).toLocaleString() : "—";
  const items = Array.isArray(order.items) ? order.items : [];
  const amount = Number(order.amount || order.subtotal || 0);
  const shippingFee = Number(order.shippingFee || 0);
  const discount = Number(order.discount || 0);
  const total = Number(order.total ?? order.grandTotal ?? amount + shippingFee - discount) || 0;
  const canCancel = !!user && order.status === "pending";

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <Card
        variant="outlined"
        styles={{ body: { padding: 28 } }}
        style={{
          borderRadius: 16,
          boxShadow: "0 10px 35px rgba(0,0,0,0.05)",
        }}
      >
        {success && (
          <Card
            variant="filled"
            styles={{ body: { padding: 16 } }}
            style={{
              background: "#fffbe6",
              borderRadius: 10,
              marginBottom: 20,
              border: `1px solid ${GOLD}33`,
            }}
          >
            <Text strong style={{ color: GOLD }}>
              🎉 Đặt hàng thành công!
            </Text>
            <br />
            <Text>Chúng tôi sẽ liên hệ để xác nhận và giao hàng sớm nhất.</Text>
          </Card>
        )}

        {/* Header */}
        <Row justify="space-between" align="middle">
          <Col>
            <Title level={3} style={{ margin: 0, color: DARK }}>
              Đơn hàng #{order.code || order._id}
            </Title>
            <Text type="secondary">Tạo lúc: {createdAt}</Text>
          </Col>
          <Col>
            <Space>
              <Badge tone={toneByStatus}>Trạng thái: {order.status || "pending"}</Badge>
              {canCancel && (
                <Button danger onClick={handleCancel} loading={cancelling}>
                  Huỷ đơn
                </Button>
              )}
            </Space>
          </Col>
        </Row>

        <Divider />

        <Row gutter={[24, 24]}>
          {/* Cột trái - Thông tin nhận hàng và sản phẩm */}
          <Col xs={24} md={14}>
            <Card
              variant="outlined"
              styles={{ body: { padding: 20 } }}
              style={{
                borderRadius: 12,
                boxShadow: "0 4px 18px rgba(0,0,0,0.03)",
              }}
            >
              <Title level={5}>Thông tin nhận hàng</Title>
              <div style={{ color: "rgba(0,0,0,0.7)" }}>
                <div>
                  <b>Họ tên:</b> {order.customer?.name || "—"}
                </div>
                <div>
                  <b>Điện thoại:</b> {order.customer?.phone || "—"}
                </div>
                <div>
                  <b>Email:</b> {order.customer?.email || "—"}
                </div>
                <div>
                  <b>Địa chỉ:</b> {order.customer?.address || "—"}
                </div>
                {order.customer?.note && (
                  <div>
                    <b>Ghi chú:</b> {order.customer.note}
                  </div>
                )}
                <div style={{ marginTop: 8 }}>
                  <b>Thanh toán:</b> {order.paymentMethod || "COD"}
                </div>
              </div>

              <Divider />

              <Title level={5}>Sản phẩm ({items.length})</Title>
              {items.map((it, idx) => {
                const qty = Number(it.quantity ?? it.qty ?? 0);
                const line = (Number(it.price) || 0) * qty;
                const img = toAbs(it.image);
                return (
                  <div
                    key={idx}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      marginBottom: 16,
                    }}
                  >
                    <Avatar shape="square" size={72} src={img} style={{ borderRadius: 10 }} />
                    <div style={{ flex: 1, marginLeft: 14 }}>
                      <Text strong>{it.name}</Text>
                      <div style={{ color: "rgba(0,0,0,0.6)" }}>SL: {qty}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <Text type="secondary">{vnd(it.price)}</Text>
                      <div style={{ fontWeight: 600 }}>{vnd(line)}</div>
                    </div>
                  </div>
                );
              })}

              <Space style={{ marginTop: 8 }}>
                <Link to="/orders/me">
                  <Button>Đơn hàng của tôi</Button>
                </Link>
                <Link to="/products">
                  <Button type="primary" style={{ background: GOLD, borderColor: GOLD }}>
                    Tiếp tục mua sắm
                  </Button>
                </Link>
              </Space>
            </Card>
          </Col>

          {/* Cột phải - Tổng thanh toán */}
          <Col xs={24} md={10}>
            <Card
              variant="outlined"
              styles={{ body: { padding: 20 } }}
              style={{
                borderRadius: 12,
                background: "linear-gradient(180deg,#fffaf1,#fff8ee)",
                boxShadow: "0 20px 40px rgba(184,142,47,0.06)",
              }}
            >
              <Title level={5}>Thanh toán</Title>
              <Divider />
              <Row justify="space-between">
                <Text>Tạm tính</Text>
                <Text strong>{vnd(amount)}</Text>
              </Row>
              <Row justify="space-between">
                <Text>Phí vận chuyển</Text>
                <Text strong>{shippingFee === 0 ? "Miễn phí" : vnd(shippingFee)}</Text>
              </Row>
              {discount > 0 && (
                <Row justify="space-between">
                  <Text>Giảm giá</Text>
                  <Text strong>- {vnd(discount)}</Text>
                </Row>
              )}
              <Divider />
              <Row justify="space-between">
                <Text strong style={{ fontSize: 16 }}>
                  Tổng thanh toán
                </Text>
                <Text strong style={{ fontSize: 18, color: GOLD }}>
                  {vnd(total)}
                </Text>
              </Row>
              <Divider />
              <Text type="secondary" style={{ fontSize: 12 }}>
                * Cảm ơn bạn đã mua hàng tại cửa hàng của chúng tôi!
              </Text>
              {/* Nút in hóa đơn PDF */}
{order.status === "completed" || order.status === "paid" ? (
  <Button
    block
    icon={<ExclamationCircleOutlined />}
    style={{
      marginTop: 16,
      borderRadius: 10,
      borderColor: GOLD,
      color: GOLD,
    }}
    onClick={async () => {
      try {
        const res = await axiosClient.get(
          `/api/orders/${order._id}/receipt`,
          { responseType: "blob" }
        );

        const fileURL = URL.createObjectURL(
          new Blob([res.data], { type: "application/pdf" })
        );
        const link = document.createElement("a");
        link.href = fileURL;
        link.download = `order-${order.code || order._id}.pdf`;
        link.click();
        URL.revokeObjectURL(fileURL);

        notification.success({
          message: "Đã tạo hóa đơn",
          description: "Hóa đơn PDF đã được tải xuống.",
        });
      } catch (e) {
        notification.error({
          message: "Không in được hóa đơn",
          description: e?.response?.data?.message || e.message,
        });
      }
    }}
  >
    In hóa đơn PDF
  </Button>
) : null}

            </Card>
          </Col>
        </Row>
      </Card>
    </section>
  );
}
