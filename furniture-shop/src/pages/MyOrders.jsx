

// // src/pages/MyOrders.jsx
// import { useEffect, useState, useMemo } from "react";
// import { Link, useNavigate, useSearchParams } from "react-router-dom";
// import axiosClient from "../services/axiosClient";
// import { vnd } from "../utils/format";
// import { useAuth } from "../context/AuthContext";
// import { useCart } from "../context/CartContext";
// import ReviewModal from "../components/ReviewModal";

// // Ant Design
// import {
//   Card,
//   List,
//   Avatar,
//   Space,
//   Typography,
//   Button,
//   Empty,
//   Divider,
//   Row,
//   Col,
//   Modal,
//   notification,
// } from "antd";
// import {
//   ShoppingCartOutlined,
//   ReloadOutlined,
//   StarOutlined,
//   DeleteOutlined,
// } from "@ant-design/icons";

// const { Title, Text } = Typography;

// const GOLD = "#B88E2F";
// const GOLD_LIGHT = "#fff8ec";
// const CARD_SHADOW = "0 10px 30px rgba(184,142,47,0.08)";

// export default function MyOrders() {
//   const [sp] = useSearchParams();
//   const createdId = sp.get("created");
//   const nav = useNavigate();
//   const { user, hydrated } = useAuth();

//   const [orders, setOrders] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [err, setErr] = useState("");
//   const [busyId, setBusyId] = useState("");

//   // giỏ hàng
//   const { addItem, clearCart, clear } = useCart();
//   const resetCart = clearCart || clear; // fallback an toàn

//   // Modal đánh giá
//   const [reviewOpen, setReviewOpen] = useState(false);
//   const [reviewProduct, setReviewProduct] = useState(null);
//   const [reviewOrder, setReviewOrder] = useState(null);

//   // antd notification
//   const openNotification = (type, message, description) => {
//     notification[type]({
//       message,
//       description,
//       placement: "topRight",
//       duration: 3,
//     });
//   };

//   // Bắt buộc login
//   useEffect(() => {
//     if (!hydrated) return;
//     if (!user) nav(`/login?next=${encodeURIComponent("/orders/me")}`, { replace: true });
//   }, [hydrated, user, nav]);

//   async function fetchOrders() {
//     const { data } = await axiosClient.get("/api/orders/me", { params: { page: 1, limit: 50 } });
//     const items = Array.isArray(data?.items) ? data.items : (Array.isArray(data) ? data : []);
//     setOrders(items || []);
//   }

//   useEffect(() => {
//     if (!user) return;
//     let alive = true;
//     (async () => {
//       try {
//         setLoading(true);
//         setErr("");
//         await fetchOrders();
//       } catch (e) {
//         if (alive) setErr(e?.response?.data?.message || "Không tải được danh sách đơn.");
//       } finally {
//         if (alive) setLoading(false);
//       }
//     })();
//     return () => {
//       alive = false;
//     };
//   }, [user]);

//   const sorted = useMemo(() => [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), [orders]);

//   async function onCancel(id) {
//     if (!id) return;
//     try {
//       setBusyId(id);
//       await axiosClient.patch(`/api/orders/${id}/cancel`);
//       await fetchOrders();
//       openNotification("success", "Đã huỷ đơn", "Đơn hàng đã được huỷ thành công.");
//     } catch (e) {
//       openNotification("error", "Hủy đơn thất bại", e?.response?.data?.message || "Hủy đơn thất bại");
//     } finally {
//       setBusyId("");
//     }
//   }

//   // MUA LẠI
//   function buyAgain(order, onlyItem) {
//     const list = onlyItem ? [onlyItem] : (order?.items || []);
//     if (!list.length) return;
//     resetCart();
//     for (const it of list) {
//       const qty = Number(it.quantity ?? it.qty ?? 1);
//       addItem(
//         {
//           id: it.product ?? it._id ?? it.id,
//           name: it.name,
//           price: Number(it.price) || 0,
//           img: it.image || it.poster || "",
//           slug: it.slug || it.product,
//         },
//         qty
//       );
//     }
//     nav("/checkout");
//   }

//   // ĐÁNH GIÁ
//   function openReview(order, item) {
//     setReviewProduct({
//       _id: item.product ?? item._id ?? item.id,
//       name: item.name,
//       poster: item.image || item.poster || "",
//     });
//     setReviewOrder(order);
//     setReviewOpen(true);
//   }

//   // handle review modal close: if success, refresh orders and set localStorage flag so ProductDetail can refresh when visited
//   const handleReviewClose = (submitted) => {
//     setReviewOpen(false);
//     if (submitted && reviewProduct?._id) {
//       try {
//         localStorage.setItem("refresh-product", reviewProduct._id);
//       } catch (e) {}
//       // reload orders to reflect that user has reviewed (if you track that in orders)
//       fetchOrders().catch(() => {});
//       openNotification("success", "Đã gửi đánh giá", "Đánh giá của bạn đã được ghi nhận.");
//     }
//     setReviewProduct(null);
//     setReviewOrder(null);
//   };

//   if (!hydrated || loading) {
//     return (
//       <section className="max-w-7xl mx-auto px-6 py-12">
//         <div style={{ height: 10 }} />
//         <div className="space-y-4">
//           <div className="h-8 w-64 bg-gray-100 rounded animate-pulse" />
//           <div className="h-28 bg-gray-100 rounded animate-pulse" />
//           <div className="h-28 bg-gray-100 rounded animate-pulse" />
//         </div>
//       </section>
//     );
//   }

//   if (err) {
//     return (
//       <section className="max-w-7xl mx-auto px-6 py-12 text-red-600">
//         ⚠ {err}
//       </section>
//     );
//   }

//   return (
//     <section className="max-w-7xl mx-auto px-6 py-12">
//       <Row justify="space-between" align="middle" style={{ marginBottom: 22 }}>
//         <Col>
//           <Title level={2} style={{ margin: 0, color: GOLD }}>
//             Đơn hàng của tôi
//           </Title>
//           <Text type="secondary">Quản lý mọi đơn hàng — lịch sử, trạng thái và hành động nhanh</Text>
//         </Col>
//         <Col>
//           <Space>
//             <Button icon={<ReloadOutlined />} onClick={fetchOrders}>
//               Làm mới
//             </Button>
//             <Button
//               type="primary"
//               icon={<ShoppingCartOutlined />}
//               style={{ background: GOLD, borderColor: GOLD }}
//             >
//               <Link to="/products" style={{ color: "white" }}>
//                 Mua sắm
//               </Link>
//             </Button>
//           </Space>
//         </Col>
//       </Row>

//       {!sorted.length ? (
//         <Card style={{ borderRadius: 14, boxShadow: CARD_SHADOW }}>
//           <Empty
//             description={<Text>Chưa có đơn hàng nào.</Text>}
//             imageStyle={{ height: 140 }}
//           />
//         </Card>
//       ) : (
//         <List
//           itemLayout="vertical"
//           dataSource={sorted}
//           split
//           renderItem={(od) => {
//             const st = String(od.status || "").toLowerCase();
//             const canCancel = st === "pending";
//             const isDone = st === "completed" || st === "paid";
//             const items = Array.isArray(od.items) ? od.items : [];
//             const total = od.grandTotal ?? od.total ?? od.amount ?? 0;

//             return (
//               <Card
//                 key={od._id}
//                 style={{
//                   borderRadius: 14,
//                   marginBottom: 16,
//                   boxShadow: createdId === od._id ? "0 0 0 6px rgba(184,142,47,0.14)" : CARD_SHADOW,
//                   background: GOLD_LIGHT,
//                   border: "1px solid rgba(184,142,47,0.06)",
//                 }}
//                 styles={{ body: { padding: 18 } }}
//               >
//                 <Row align="middle" justify="space-between" gutter={16}>
//                   <Col flex="1 1 60%">
//                     <Link to={`/orders/${od._id}`} className="font-medium hover:underline" style={{ fontSize: 18 }}>
//                       #{od.code || od._id?.slice(-8)}
//                     </Link>
//                     <div className="text-sm" style={{ marginTop: 8 }}>
//                       {(items.length || 0)} sản phẩm • <b>{vnd(total)}</b>
//                     </div>
//                   </Col>

//                   <Col>
//                     <Space>
//                       <Link to={`/orders/${od._id}`}>
//                         <Button style={{ borderRadius: 8 }}>Chi tiết</Button>
//                       </Link>
//                     </Space>
//                   </Col>
//                 </Row>

//                 <Divider style={{ margin: "14px 0" }} />

//                 <div>
//                   {items.map((it, idx) => (
//                     <div key={idx} style={{ display: "flex", gap: 16, alignItems: "center", padding: "12px 0" }}>
//                       <Avatar
//                         shape="square"
//                         size={84}
//                         src={it.image || it.poster || "/react.svg"}
//                         style={{ borderRadius: 10, border: "1px solid #eee" }}
//                       />
//                       <div style={{ flex: 1, minWidth: 0 }}>
//                         <div style={{ fontWeight: 700, fontSize: 16 }}>{it.name}</div>
//                         <div style={{ color: "rgba(0,0,0,0.6)", marginTop: 6 }}>
//                           SL: {it.quantity ?? it.qty ?? 1} • {vnd(it.price)}
//                         </div>
//                       </div>

//                       <div style={{ display: "flex", gap: 10 }}>
//                         {isDone && (
//                           <>
//                             <Button
//                               icon={<StarOutlined />}
//                               onClick={() => openReview(od, it)}
//                               size="small"
//                               style={{ borderRadius: 8 }}
//                             >
//                               Đánh giá
//                             </Button>
//                             <Button
//                               icon={<ShoppingCartOutlined />}
//                               onClick={() => buyAgain(od, it)}
//                               size="small"
//                               style={{ borderRadius: 8 }}
//                             >
//                               Mua lại
//                             </Button>
//                           </>
//                         )}
//                       </div>
//                     </div>
//                   ))}
//                 </div>

//                 <Divider style={{ margin: "12px 0" }} />

//                 <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
//                   <div>
//                     <Text type="secondary">Tổng</Text>
//                     <div style={{ fontWeight: 800, fontSize: 18 }}>{vnd(total)}</div>
//                   </div>

//                   <Space>
//                     <Button
//                       icon={<DeleteOutlined />}
//                       onClick={() =>
//                         Modal.confirm({
//                           title: "Bạn muốn thêm sản phẩm của đơn vào giỏ?",
//                           content: "Hành động này sẽ xóa giỏ hiện tại và thêm lại các sản phẩm.",
//                           okText: "Thêm vào giỏ",
//                           cancelText: "Huỷ",
//                           onOk: () => buyAgain(od),
//                         })
//                       }
//                       style={{ borderRadius: 8 }}
//                     >
//                       Mua lại tất cả
//                     </Button>
//                   </Space>
//                 </div>
//               </Card>
//             );
//           }}
//         />
//       )}

//       {/* Modal đánh giá */}
//       <ReviewModal
//         open={reviewOpen}
//         onClose={handleReviewClose}
//         product={reviewProduct}
//         order={reviewOrder}
//       />
//     </section>
//   );
// }////21/11














// src/pages/MyOrders.jsx
import { useEffect, useState, useMemo } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import axiosClient from "../services/axiosClient";
import { vnd } from "../utils/format";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import ReviewModal from "../components/ReviewModal";

// Ant Design
import {
  Card,
  List,
  Avatar,
  Space,
  Typography,
  Button,
  Empty,
  Divider,
  Row,
  Col,
  Modal,
  notification,
  Tag,
} from "antd";

import {
  ShoppingCartOutlined,
  ReloadOutlined,
  StarOutlined,
  DeleteOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

const GOLD = "#B88E2F";
const WALNUT = "#3E2E1A";
const BACKGROUND = "#FAF8F0";
const CARD_SHADOW = "0 14px 40px rgba(0,0,0,0.06)"; 
const CARD_BORDER = "1px solid rgba(184,142,47,0.15)";
const BTN_ROUND = { borderRadius: 10 };

// ===============================================================
// UI TONE: Luxury nội thất – Gold + Walnut + Kem
// ===============================================================

export default function MyOrders() {
  const [sp] = useSearchParams();
  const createdId = sp.get("created");
  const nav = useNavigate();

  const { user, hydrated } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [busyId, setBusyId] = useState("");

  const { addItem, clearCart, clear } = useCart();
  const resetCart = clearCart || clear;

  const [reviewOpen, setReviewOpen] = useState(false);
  const [reviewProduct, setReviewProduct] = useState(null);
  const [reviewOrder, setReviewOrder] = useState(null);

  



  const openNotification = (type, message, description) => {
    notification[type]({
      message,
      description,
      placement: "topRight",
      duration: 3,
    });
  };

  // ===============================================================
  //  Auth
  // ===============================================================
  useEffect(() => {
    if (!hydrated) return;
    if (!user) {
      nav(`/login?next=${encodeURIComponent("/orders/me")}`, { replace: true });
    }
  }, [hydrated, user, nav]);

  async function fetchOrders() {
    const { data } = await axiosClient.get("/api/orders/me", {
      params: { page: 1, limit: 50 },
    });
    setOrders(data?.items ?? []);
  }

  useEffect(() => {
    if (!user) return;
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        await fetchOrders();
      } catch (e) {
        alive && setErr(e?.response?.data?.message || "Không tải được đơn hàng.");
      } finally {
        alive && setLoading(false);
      }
    })();
    return () => (alive = false);
  }, [user]);

  const sorted = useMemo(
    () => [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [orders]
  );

  async function onCancel(id) {
    try {
      setBusyId(id);
      await axiosClient.patch(`/api/orders/${id}/cancel`);
      await fetchOrders();
      openNotification("success", "Đã huỷ đơn", "Đơn hàng đã được hủy thành công.");
    } catch (e) {
      openNotification("error", "Lỗi hủy đơn", e?.response?.data?.message);
    } finally {
      setBusyId("");
    }
  }

  function buyAgain(order, onlyItem) {
    const list = onlyItem ? [onlyItem] : (order?.items ?? []);
    if (!list.length) return;

    resetCart();
    for (const it of list) {
      addItem(
        {
          id: it.product,
          name: it.name,
          price: Number(it.price),
          img: it.image,
          slug: it.slug,
        },
        it.quantity
      );
    }
    nav("/checkout");
  }

  function openReview(order, item) {
    setReviewProduct({
      _id: item.product,
      name: item.name,
      poster: item.image,
    });
    setReviewOrder(order);
    setReviewOpen(true);
  }

  const handleReviewClose = (submitted) => {
    setReviewOpen(false);
    if (submitted && reviewProduct?._id) {
      localStorage.setItem("refresh-product", reviewProduct._id);
      fetchOrders();
      openNotification("success", "Đã gửi đánh giá", "Cảm ơn bạn!");
    }
    setReviewProduct(null);
    setReviewOrder(null);
  };

  // ===============================================================
  //  Loading & Error UI (Luxury style)
  // ===============================================================

  if (!hydrated || loading) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-12">
        <div className="space-y-4">
          <div className="h-8 w-64 bg-gray-200/70 rounded-xl animate-pulse" />
          <div className="h-24 bg-gray-200/70 rounded-xl animate-pulse" />
          <div className="h-24 bg-gray-200/70 rounded-xl animate-pulse" />
        </div>
      </section>
    );
  }

  if (err) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-12">
        <Card style={{ background: "#fff1f0", borderColor: "#ffccc7" }}>
          <Text type="danger" style={{ fontSize: 16 }}>
            ⚠ {err}
          </Text>
        </Card>
      </section>
    );
  }

  // ===============================================================
  //  MAIN UI – LUXURY DESIGN
  // ===============================================================

  return (
    <section className="max-w-6xl mx-auto px-6 py-10" style={{ background: BACKGROUND, borderRadius: 22 }}>

      {/* Title */}
      <Row justify="space-between" align="middle" style={{ marginBottom: 28 }}>
        <Col>
          <Title level={2} style={{ margin: 0, color: WALNUT, fontWeight: 800 }}>
            Đơn hàng của tôi
          </Title>
          <Text style={{ color: "rgba(0,0,0,0.55)" }}>
            Theo dõi chi tiết đơn hàng – Giao diện sang trọng & dễ theo dõi
          </Text>
        </Col>
        <Col>
          <Space>
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchOrders}
              style={{ ...BTN_ROUND }}
            >
              Làm mới
            </Button>

            <Button
              type="primary"
              icon={<ShoppingCartOutlined />}
              style={{
                background: GOLD,
                borderColor: GOLD,
                color: "white",
                fontWeight: 600,
                ...BTN_ROUND,
              }}
            >
              <Link to="/products" style={{ color: "white" }}>Mua thêm</Link>
            </Button>
          </Space>
        </Col>
      </Row>

      {/* EMPTY */}
      {!sorted.length && (
        <Card style={{ borderRadius: 18, boxShadow: CARD_SHADOW }}>
          <Empty description={<Text>Chưa có đơn hàng nào</Text>} />
        </Card>
      )}

      {/* LIST */}
      <List
        itemLayout="vertical"
        dataSource={sorted}
        split={false}
        renderItem={(od) => {
          const items = od.items ?? [];
          const total = od.grandTotal ?? 0;
          const st = String(od.status).toLowerCase();
          const allowDelete = ["cancelled", "completed"].includes(od.status);


          const canCancel = st === "pending";
          const isDone = st === "completed" || st === "paid";
         

          return (
            <Card
              key={od._id}
              style={{
                borderRadius: 18,
                marginBottom: 26,
                background: "white",
                border: CARD_BORDER,
                boxShadow: CARD_SHADOW,
              }}
              bodyStyle={{ padding: 22 }}
            >
              {/* Header */}
              <Row justify="space-between" align="middle">
                <Col>
                  <Link
                    to={`/orders/${od._id}`}
                    className="hover:underline"
                    style={{ fontSize: 20, fontWeight: 700, color: WALNUT }}
                  >
                    #{od.code || od._id?.slice(-8)}
                  </Link>
                  <div className="mt-1 text-gray-600 text-sm">
                    {items.length} sản phẩm • Tổng <b>{vnd(total)}</b>
                  </div>
                </Col>

                <Col>
                  <Space>
                    <Tag color="gold" style={{ borderRadius: 10, padding: "4px 10px" }}>
                      {od.status?.toUpperCase()}
                    </Tag>
                    <Link to={`/orders/${od._id}`}>
                      <Button style={{ ...BTN_ROUND }}>Chi tiết</Button>
                    </Link>
                  </Space>
                </Col>
              </Row>

              <Divider />

              {/* Items */}
              {items.map((it, idx) => (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    gap: 16,
                    padding: "14px 0",
                    alignItems: "center",
                    borderBottom: idx < items.length - 1 ? "1px dashed #eee" : "none",
                  }}
                >
                  <Avatar
                    shape="square"
                    size={92}
                    src={it.image}
                    style={{ borderRadius: 14, border: "1px solid #eee" }}
                  />

                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 17, fontWeight: 700 }}>{it.name}</div>
                    <div style={{ marginTop: 6, color: "#555" }}>
                      SL: {it.quantity} • {vnd(it.price)}
                    </div>
                  </div>

                  <Space direction="vertical">
                    {isDone && (
                      <>
                        <Button
                          icon={<StarOutlined />}
                          size="small"
                          style={{ ...BTN_ROUND }}
                          onClick={() => openReview(od, it)}
                        >
                          Đánh giá
                        </Button>
                        <Button
                          icon={<ShoppingCartOutlined />}
                          size="small"
                          style={{ ...BTN_ROUND }}
                          onClick={() => buyAgain(od, it)}
                        >
                          Mua lại
                        </Button>
                      </>
                    )}
                  </Space>
                </div>
              ))}

              <Divider />

              {/* Footer */}
              <Row justify="space-between" align="middle">
                <Col>
                  <div className="text-gray-500 text-sm">Tổng thanh toán</div>
                  <div className="text-xl font-bold text-[#B88E2F]">{vnd(total)}</div>
                </Col>

                <Col>
                  <Space>
                    {canCancel && (
                      <Button
                        danger
                        loading={busyId === od._id}
                        style={{ borderRadius: 10 }}
                        onClick={() =>
                          Modal.confirm({
                            title: "Hủy đơn hàng?",
                            content: "Bạn có chắc muốn hủy đơn?",
                            okText: "Hủy",
                            cancelText: "Đóng",
                            onOk: () => onCancel(od._id),
                          })
                        }
                      >
                        Hủy đơn
                      </Button>
                    )}
                    <Button
                      icon={<ShoppingCartOutlined />}
                      style={{ ...BTN_ROUND }}
                      onClick={() =>
                        Modal.confirm({
                          title: "Mua lại toàn bộ?",
                          content: "Giỏ hiện tại sẽ bị thay thế.",
                          okText: "Mua lại",
                          cancelText: "Đóng",
                          onOk: () => buyAgain(od),
                        })
                      }
                    >
                      Mua lại tất cả
                    </Button>


                 {allowDelete && (
  <Button
    danger
    style={{ borderRadius: 10 }}
    onClick={() =>
      Modal.confirm({
        title: "Xóa đơn?",
        content: "Bạn có chắc muốn xóa đơn này vĩnh viễn?",
        okText: "Xóa",
        cancelText: "Đóng",
        onOk: async () => {
          await axiosClient.delete(`/api/orders/${od._id}`);
          fetchOrders();
          openNotification("success", "Đã xóa đơn", "Đơn hàng đã bị xoá.");
        },
      })
    }
  >
    Xóa đơn
  </Button>
)}

                  </Space>
                     



                </Col>
              </Row>
            </Card>
          );
        }}
      />

      {/* REVIEW MODAL */}
      <ReviewModal
        open={reviewOpen}
        onClose={handleReviewClose}
        product={reviewProduct}
        order={reviewOrder}
      />
    </section>
  );
}



