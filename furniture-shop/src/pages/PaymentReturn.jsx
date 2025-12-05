// src/pages/PaymentReturn.jsx
import { Result, Button, Card } from "antd";
import { Link } from "react-router-dom";

const GOLD = "#B88E2F";
const BG = "linear-gradient(180deg, #fffaf1, #fff8ee)";

export default function PaymentReturn() {
  const params = new URLSearchParams(window.location.search);

  const status = params.get("status");
  const amount = params.get("amount");
  const orderId = params.get("orderId");

  // Custom request only
  const type = params.get("type");
  const customRequestId = params.get("customRequestId");

  const isSuccess = status === "success";

  return (
    <section
      className="flex justify-center items-center min-h-screen px-4"
      style={{ background: BG }}
    >
      <Card
        bordered={false}
        style={{
          maxWidth: 520,
          width: "100%",
          borderRadius: 20,
          padding: "30px 20px",
          textAlign: "center",
          background: "#fff",
          boxShadow: "0 20px 60px rgba(184,142,47,0.12)",
        }}
      >
        {/* ICON */}
        <div
          style={{
            width: 88,
            height: 88,
            borderRadius: "50%",
            background: isSuccess ? "#E8FFE8" : "#FFECEC",
            margin: "0 auto 20px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 40,
            color: isSuccess ? "#52c41a" : "#ff4d4f",
            boxShadow: "0 0 20px rgba(0,0,0,0.05)",
          }}
        >
          {isSuccess ? "✔" : "✖"}
        </div>

        {/* TITLE */}
        <h1
          style={{
            fontSize: 28,
            fontWeight: 800,
            color: isSuccess ? GOLD : "#D4380D",
          }}
        >
          {isSuccess ? "Thanh toán thành công!" : "Thanh toán thất bại"}
        </h1>

        {/* SUBTEXT */}
        {isSuccess ? (
          <p style={{ color: "#555", marginTop: 10 }}>
            Bạn đã thanh toán <b style={{ color: GOLD }}>{amount} VND</b>.
            <br />
            Mã giao dịch: <b>{orderId}</b>
          </p>
        ) : (
          <p style={{ color: "#777", marginTop: 10 }}>
            Giao dịch không thành công. Vui lòng thử lại.
          </p>
        )}

        {/* ACTION BUTTONS (ONLY CASE 1) */}
        <div style={{ marginTop: 30 }}>
          {isSuccess ? (
            <>
              <Link to="/custom/requests">
                <Button
                  type="primary"
                  size="large"
                  block
                  className="fx-push"
                  style={{
                    background: GOLD,
                    borderColor: GOLD,
                    height: 52,
                    borderRadius: 14,
                    fontWeight: 700,
                    marginBottom: 12,
                  }}
                >
                  Xem thiết kế của bạn
                </Button>
              </Link>

              <Link to="/products">
                <Button
                  size="large"
                  block
                  className="fx-push"
                  style={{
                    height: 52,
                    borderRadius: 14,
                    border: `1px solid ${GOLD}`,
                    color: GOLD,
                    fontWeight: 700,
                  }}
                >
                  Tiếp tục xem sản phẩm
                </Button>
              </Link>
            </>
          ) : (
            <>
              <Link to="/">
                <Button
                  type="primary"
                  size="large"
                  block
                  className="fx-push"
                  style={{
                    background: GOLD,
                    borderColor: GOLD,
                    height: 52,
                    borderRadius: 14,
                    fontWeight: 700,
                    marginBottom: 12,
                  }}
                >
                  Thử lại thanh toán
                </Button>
              </Link>

              <Link to="/custom/requests">
                <Button
                  size="large"
                  block
                  className="fx-push"
                  style={{
                    height: 52,
                    borderRadius: 14,
                    border: `1px solid ${GOLD}`,
                    color: GOLD,
                    fontWeight: 700,
                  }}
                >
                  Quay lại thiết kế
                </Button>
              </Link>
            </>
          )}
        </div>
      </Card>
    </section>
  );
}
