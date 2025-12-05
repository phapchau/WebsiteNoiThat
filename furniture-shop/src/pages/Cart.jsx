
// import { useNavigate, Link } from "react-router-dom";
// import { useCart } from "../context/CartContext";
// import { vnd } from "../utils/format";





// export default function Cart() {
//   const nav = useNavigate();
//   const { items, updateQty, removeItem, clear, total } = useCart();
  

//   return (
//     <section className="max-w-6xl mx-auto px-4 py-8">
//       <h2 className="text-2xl font-semibold mb-4">Giỏ hàng</h2>

//       {items.length === 0 ? (
//         <p className="text-gray-600">Chưa có sản phẩm nào.</p>
//       ) : (
//         <>
//           <div className="space-y-4">
//             {items.map((x) => (
//               <div key={x.id} className="flex items-center gap-4 border rounded-2xl bg-white p-4">
//                 <img
//                   src={x.img}
//                   alt={x.name}
//                   className="h-16 w-16 object-cover rounded-lg"
//                   onError={(e)=>{ e.currentTarget.src="/react.svg" }}
//                 />
//                 <div className="flex-1">
//                   <div className="font-medium">{x.name}</div>
//                   <div className="text-gray-700">{vnd(x.price)}</div>
//                 </div>
//                 <div className="flex items-center gap-2">
//                   <button
//                     className="px-3 py-1 border rounded-lg"
//                     onClick={() => updateQty(x.id, x.qty - 1)}
//                   >
//                     -
//                   </button>
//                   <span className="w-8 text-center">{x.qty}</span>
//                   <button
//                     className="px-3 py-1 border rounded-lg"
//                     onClick={() => updateQty(x.id, x.qty + 1)}
//                   >
//                     +
//                   </button>
//                 </div>
//                 <button
//                   className="px-3 py-1 border rounded-lg hover:bg-black hover:text-white transition"
//                   onClick={() => removeItem(x.id)}
//                 >
//                   Xoá
//                 </button>
//               </div>
//             ))}
//           </div>

//           <div className="flex items-center justify-between mt-6">
//             <div className="text-lg">
//               Tổng: <span className="font-semibold">{vnd(total)}</span>
//             </div>
//             <div className="flex gap-3">
//               <button className="rounded-xl border px-4 py-2" onClick={clear}>
//                 Xoá tất cả
//               </button>
//               {/* <button className="rounded-xl border px-4 py-2 hover:bg-black hover:text-white transition">
//                 Tiến hành thanh toán
//               </button> */}

//               <button
//                 className="rounded-xl border px-4 py-2 hover:bg-black hover:text-white transition"
//                 onClick={() => nav("/checkout")}
//               >
//                 Tiến hành thanh toán
//               </button>              
//             </div>
//           </div>
//         </>
//       )}
//     </section>
//   );
// }
///11/11







// src/pages/Cart.jsx
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { vnd } from "../utils/format";

// Ant Design
import {
  Button,
  Card,
  List,
  Image,
  Typography,
  Space,
  InputNumber,
  Popconfirm,
  Empty,
  Divider,
  Tag,
  Row,
  Col,
  Statistic,
} from "antd";
import {
  DeleteOutlined,
  MinusOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
  ArrowRightOutlined,
  ClearOutlined,
} from "@ant-design/icons";

const { Title, Text } = Typography;

export default function Cart() {
  const nav = useNavigate();
  const { items, updateQty, removeItem, clear, total } = useCart();

  const gold = "#B88E2F";

  return (
    <section className="max-w-7xl mx-auto px-4 py-10">
      <Space direction="vertical" size={20} style={{ width: "100%" }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Title level={2} style={{ margin: 0, color: gold, fontWeight: 700, letterSpacing: 0.5 }}>
            Giỏ hàng <Tag color={gold}>{items.length}</Tag>
          </Title>

          {items.length > 0 && (
            // <Button
            //   icon={<ClearOutlined />}
            //   onClick={clear}
            //   type="text"
            //   size="large"
            //   danger
            //   style={{ fontWeight: 500 }}
            // >
            //   Xoá tất cả
            // </Button>
            <Button
  className="fx-push"
  icon={<ClearOutlined />}
  onClick={clear}
  type="text"
  size="large"
  danger
  style={{ fontWeight: 500 }}
>
  Xoá tất cả
</Button>

          )}
        </div>

        {items.length === 0 ? (
          <Card
            bordered={false}
            style={{
              textAlign: "center",
              padding: "50px 0",
              background: "#fffaf1",
              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
              borderRadius: 20,
            }}
          >
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Space direction="vertical">
                  <Text style={{ fontSize: 16 }}>Chưa có sản phẩm nào.</Text>
                  <Button
                    type="primary"
                    size="large"
                    style={{ backgroundColor: gold, borderColor: gold, fontWeight: 500 }}
                  >
                    <Link to="/products" style={{ color: "white" }}>
                      Mua sắm ngay
                    </Link>
                  </Button>
                </Space>
              }
            />
          </Card>
        ) : (
          <Row gutter={[24, 24]}>
            {/* Left column: items */}
            <Col xs={24} md={16}>
              <Card bordered={false} style={{ borderRadius: 20, boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
                <List
                  itemLayout="horizontal"
                  dataSource={items}
                  renderItem={(x) => (
                    <List.Item
                      key={x.id}
                      style={{
                        padding: 10,
                        marginBottom: 20,
                        borderRadius: 20,
                        background: "#fff",
                        boxShadow: "0 6px 10px #B88E2F",
                      }}
                      actions={[
                        <Space key="qty" align="center">
                          <Button size="middle" icon={<MinusOutlined />} onClick={() => updateQty(x.id, x.qty - 1)} />
                          <InputNumber
                            min={1}
                            value={x.qty}
                            onChange={(val) => updateQty(x.id, Number(val) || 1)}
                            style={{ width: 90, textAlign: "center", fontSize: 16 }}
                          />
                          <Button size="middle" icon={<PlusOutlined />} onClick={() => updateQty(x.id, x.qty + 1)} />
                        </Space>,
                        <Popconfirm
                          key="rm"
                          title="Xoá sản phẩm này?"
                          okText="Xoá"
                          cancelText="Huỷ"
                          onConfirm={() => removeItem(x.id)}
                        >
                          <Button type="text" danger icon={<DeleteOutlined />} style={{ fontWeight: 500 }}>
                            Xoá
                          </Button>
                        </Popconfirm>,
                      ]}
                    >
                      {/* custom left: image */}
                      <List.Item.Meta
                        avatar={
                          <div style={{ width: 160, height: 140, borderRadius: 12, overflow: "hidden", flex: "none" }}>
                            <Image
                              width="100%"
                              height="100%"
                              src={x.img}
                              alt={x.name}
                              style={{ objectFit: "cover" }}
                              preview={false}
                              onError={(e) => (e.currentTarget.src = "/react.svg")}
                            />
                          </div>
                        }
                        title={
                          // Use a row flex box for name + price tag on top
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12 }}>
                            <div style={{ flex: 1 }}>
                              <Text strong style={{ fontSize: 18, display: "block", whiteSpace: "normal", wordBreak: "break-word", overflowWrap: "break-word" }}>
                                {x.name}
                              </Text>
                              <div style={{ marginTop: 6 }}>
                                <Tag color="gold" style={{ background: "#fff7e6", color: gold, border: `1px solid ${gold}` }}>
                                  {vnd(x.price)}
                                </Tag>
                              </div>
                            </div>

                            <div style={{ textAlign: "right", minWidth: 140 }}>
                              <Text type="secondary" style={{ display: "block", fontSize: 13 }}>
                                Mã: {x.id}
                              </Text>
                              <div style={{ marginTop: 22 }}>
                                <Text strong style={{ color: gold, fontSize: 18 }}>
                                  {vnd((x.price || 0) * (x.qty || 0))}
                                </Text>
                                <div style={{ fontSize: 12, color: "#999" }}>Thành tiền</div>
                              </div>
                            </div>
                          </div>
                        }
                        description={null}
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>

            {/* Right column: summary */}
            {/* Cột phải: tóm tắt đơn hàng */}
<Col xs={24} md={8}>
  <Card
    bordered={false}
    style={{
      borderRadius: 18,
      padding: 24,
      background: "linear-gradient(180deg,#fffaf1,#fff8ee)",
      boxShadow: "0 30px 60px rgba(184,142,47,0.06)",
    }}
  >
    <div style={{ marginBottom: 18 }}>
      <Title level={4} style={{ margin: 0, color: "#B88E2F" }}>
        Tóm tắt đơn hàng
      </Title>
      <Text type="secondary">Xem lại trước khi thanh toán</Text>
    </div>

    <Divider />

    <Space direction="vertical" style={{ width: "100%" }} size="large">
      <Statistic
        title={<span style={{ fontSize: 14 }}>Tạm tính</span>}
        value={total}
        formatter={(val) => (
          <span style={{ fontSize: 20, fontWeight: 800, color: "#6b4e16" }}>
            {vnd(Number(val) || 0)}
          </span>
        )}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text type="secondary">Phí vận chuyển</Text>
        <Text strong>Tính ở bước thanh toán</Text>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text type="secondary">Giảm giá</Text>
        <Text strong>- {vnd(0)}</Text>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          paddingTop: 8,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: 700 }}>Tổng thanh toán</Text>
        <div style={{ fontSize: 22, fontWeight: 900, color: "#B88E2F" }}>
          {vnd(total)}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {/* <Button
          type="primary"
          size="large"
          icon={<ShoppingCartOutlined />}
          onClick={() => nav("/checkout")}
          style={{
            background: "linear-gradient(90deg, #B88E2F, #f6d58a)",
            borderColor: "#B88E2F",
            height: 54,
            borderRadius: 12,
            fontWeight: 800,
            boxShadow: "0 4px 10px rgba(184,142,47,0.3)",
          }}
          block
        >
          Tiến hành thanh toán
        </Button> */}
        <Button
  className="fx-push fx-gold"
  type="primary"
  size="large"
  icon={<ShoppingCartOutlined />}
  onClick={() => nav("/checkout")}
  style={{
    background: "linear-gradient(90deg, #B88E2F, #f6d58a)",
    borderColor: "#B88E2F",
    height: 54,
    borderRadius: 12,
    fontWeight: 800,
  }}
  block
>
  Tiến hành thanh toán
</Button>


        <Button
  className="fx-push"
  size="large"
  icon={<ArrowRightOutlined />}
  block
  style={{
    height: 54,
    borderRadius: 12,
    border: "1px solid #B88E2F",
    color: "#6b4e16",
    fontWeight: 700,
  }}
>
  <Link to="/products" style={{ color: "#6b4e16" }}>
    Tiếp tục mua sắm
  </Link>
</Button>


       <Button className="fx-push" type="text" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })} style={{ color: "#B88E2F" }}>
  Quay lại đầu trang
</Button>

      </div>
    </Space>
  </Card>
</Col>

          </Row>
        )}
      </Space>
    </section>
  );
}

