// src/pages/admin/AdminPayments.jsx
import { useEffect, useState } from "react";
import { Table, Tag, Select, DatePicker, Space, Typography, Card } from "antd";
import axiosClient from "../../services/axiosClient";

const { RangePicker } = DatePicker;
const { Title } = Typography;

export default function AdminPayments() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState("all");
  const [status, setStatus] = useState("all");
  const [dateRange, setDateRange] = useState(null);

  async function load() {
    try {
      setLoading(true);
      const res = await axiosClient.get("/api/admin/payments", {
        params: {
          method: method !== "all" ? method : undefined,
          status: status !== "all" ? status : undefined,
          from: dateRange?.[0] ? dateRange[0].toISOString() : undefined,
          to: dateRange?.[1] ? dateRange[1].toISOString() : undefined,
        },
      });
      setList(res.data.items || []);
    } catch (err) {
      console.error("ERR LOAD PAYMENTS", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [method, status, dateRange]);

  const columns = [
    {
      title: "Mã giao dịch",
      dataIndex: "code",
      render: (t) => <b>{t}</b>,
    },
    {
      title: "Đơn hàng",
      dataIndex: "orderId",
      render: (id) => <span>#{id.slice(-6)}</span>,
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      render: (c) => c?.name || c?.email || "—",
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      render: (v) => v.toLocaleString("vi-VN") + " đ",
    },
    {
      title: "Phương thức",
      dataIndex: "method",
      render: (m) =>
        m === "vnpay" ? (
          <Tag color="blue">VNPay</Tag>
        ) : (
          <Tag color="green">COD</Tag>
        ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (s) => {
        const map = {
          success: "green",
          pending: "gold",
          failed: "red",
        };
        return <Tag color={map[s] || "default"}>{s.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (d) => new Date(d).toLocaleString("vi-VN"),
    },
  ];

  return (
    <section className="space-y-6 animate-fadeIn">
      <Title level={3}>Quản lý thanh toán</Title>

      <Card>
        <Space wrap>
          <Select value={method} onChange={setMethod} style={{ width: 150 }}>
            <Select.Option value="all">Tất cả phương thức</Select.Option>
            <Select.Option value="vnpay">VNPay</Select.Option>
            <Select.Option value="cod">COD</Select.Option>
          </Select>

          <Select value={status} onChange={setStatus} style={{ width: 150 }}>
            <Select.Option value="all">Tất cả trạng thái</Select.Option>
            <Select.Option value="success">Thành công</Select.Option>
            <Select.Option value="pending">Đang xử lý</Select.Option>
            <Select.Option value="failed">Thất bại</Select.Option>
          </Select>

          <RangePicker onChange={setDateRange} />
        </Space>
      </Card>

      <Card>
        <Table
          rowKey="_id"
          dataSource={list}
          columns={columns}
          loading={loading}
        />
      </Card>
    </section>
  );
}
