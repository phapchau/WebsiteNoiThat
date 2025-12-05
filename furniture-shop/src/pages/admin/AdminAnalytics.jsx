import { useEffect, useState } from "react";
import axiosClient from "../../services/axiosClient";

// Ant Design
import { Card, Typography, Row, Col, Spin, Statistic, message } from "antd";

// Recharts
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend,
  ResponsiveContainer,
} from "recharts";

const { Title } = Typography;

const COLORS = ["#B88E2F", "#2F80ED", "#27AE60", "#EB5757", "#9B51E0"];
const MONTHS = ["T1","T2","T3","T4","T5","T6","T7","T8","T9","T10","T11","T12"];

export default function AdminAnalytics() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    newUsers: 0,
    revenueByMonth: [],
    orderStatus: [],
  });

  async function load() {
    try {
      setLoading(true);
      const res = await axiosClient.get("/api/admin/analytics");
      setData(res.data);
    } catch (e) {
      message.error("Không tải được dữ liệu analytics");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const revenueChartData = data.revenueByMonth.map((x) => ({
    month: MONTHS[(x._id || 1) - 1],
    revenue: x.value,
  }));

  const statusChartData = data.orderStatus.map((x, idx) => ({
    name: x._id,
    value: x.value,
    color: COLORS[idx % COLORS.length],
  }));

  const lineChartData = revenueChartData;

  return (
    <section className="space-y-8 animate-fadeIn">
      <Title level={2}>📊 Analytics Dashboard</Title>

      {loading ? (
        <div className="flex justify-center py-20">
          <Spin size="large" />
        </div>
      ) : (
        <>
          {/* SUMMARY CARDS */}
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={8}>
              <Card
                style={{ borderRadius: 12 }}
                styles={{ body: { padding: 20 } }}
              >
                <Statistic
                  title="Tổng đơn hàng"
                  value={data.totalOrders}
                  valueStyle={{ color: "#2F80ED" }}
                />
              </Card>
            </Col>

            <Col xs={24} sm={8}>
              <Card
                style={{ borderRadius: 12 }}
                styles={{ body: { padding: 20 } }}
              >
                <Statistic
                  title="Doanh thu"
                  value={data.totalRevenue}
                  suffix="đ"
                  valueStyle={{ color: "#B88E2F" }}
                />
              </Card>
            </Col>

            <Col xs={24} sm={8}>
              <Card
                style={{ borderRadius: 12 }}
                styles={{ body: { padding: 20 } }}
              >
                <Statistic
                  title="Người dùng mới (7 ngày)"
                  value={data.newUsers}
                  valueStyle={{ color: "#27AE60" }}
                />
              </Card>
            </Col>
          </Row>

          {/* BIỂU ĐỒ DOANH THU THEO THÁNG */}
          <Card
            title="📈 Doanh thu theo tháng"
            style={{ borderRadius: 14 }}
            styles={{ body: { padding: 20 } }}
          >
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={revenueChartData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="revenue" fill="#B88E2F" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* BIỂU ĐỒ TRẠNG THÁI ĐƠN HÀNG */}
          <Card
            title="📦 Phân loại trạng thái đơn hàng"
            style={{ borderRadius: 14 }}
            styles={{ body: { padding: 20 } }}
          >
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={statusChartData}
                  nameKey="name"
                  dataKey="value"
                  outerRadius={110}
                  label
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* BIỂU ĐỒ ĐƯỜNG - XU HƯỚNG DOANH THU */}
          <Card
            title="📉 Xu hướng doanh thu"
            style={{ borderRadius: 14 }}
            styles={{ body: { padding: 20 } }}
          >
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={lineChartData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#2F80ED"
                  strokeWidth={3}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </>
      )}
    </section>
  );
}
