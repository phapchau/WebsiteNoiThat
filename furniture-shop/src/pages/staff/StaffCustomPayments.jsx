// src/pages/admin/AdminCustomPayments.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../services/axiosClient";
import {
  Table,
  Tag,
  Select,
  Space,
  Input,
  Button,
  message,
  Tooltip,
} from "antd";
import { FilePdfOutlined, ReloadOutlined } from "@ant-design/icons";
import { vnd } from "../../utils/format";

const { Option } = Select;

// Nhãn trạng thái yêu cầu
const STATUS_LABELS_VI = {
  SUBMITTED: "Khách đã gửi yêu cầu",
  REVIEWING: "Đang xem xét",
  QUOTED: "Đã báo giá",
  ACCEPTED: "Khách chấp nhận",
  REJECTED: "Khách từ chối",
  CANCELED: "Khách hủy yêu cầu",
  IN_PROGRESS: "Đang thi công",
  DONE: "Hoàn thành",
};

const STATUS_COLOR = {
  SUBMITTED: "default",
  REVIEWING: "processing",
  QUOTED: "gold",
  ACCEPTED: "green",
  REJECTED: "red",
  CANCELED: "red",
  IN_PROGRESS: "blue",
  DONE: "success",
};

const PAYMENT_STATUS_LABEL = {
  NONE: "Chưa thanh toán",
  DEPOSIT_PAID: "Đã cọc",
  COMPLETED: "Hoàn tất",
  REFUNDED: "Đã hoàn tiền",
};

const PAYMENT_STATUS_COLOR = {
  NONE: "default",
  DEPOSIT_PAID: "gold",
  COMPLETED: "green",
  REFUNDED: "red",
};

function getStatusTag(status) {
  const code = (status || "").toString().toUpperCase();
  return (
    <Tag color={STATUS_COLOR[code] || "default"}>
      {STATUS_LABELS_VI[code] || code || "Không rõ"}
    </Tag>
  );
}

// Hiển thị trạng thái thanh toán dựa trên các field trong CustomRequest
function getPaymentInfo(row) {
  const statusCode = (row.paymentStatus || "").toUpperCase();
  const paid = !!row.paid;
  const paidAmount = Number(row.paidAmount || 0);
  const price = Number(row.quote?.price || 0);
  const depositAmount = Number(row.quote?.depositAmount || 0);
  const depositPaid = !!row.depositPayment?.amount;

  // Ưu tiên flag paid
  if (paid || statusCode === "COMPLETED") {
    return {
      label: "Đã thanh toán đủ",
      color: "green",
      detail: price ? `Số tiền: ${vnd(price)}` : paidAmount ? `Đã thu: ${vnd(paidAmount)}` : "",
    };
  }

  // Đã cọc
  if (statusCode === "DEPOSIT_PAID" || depositPaid) {
    const amt = row.depositPayment?.amount || depositAmount;
    return {
      label: "Đã thanh toán cọc",
      color: "gold",
      detail: amt ? `Tiền cọc: ${vnd(amt)}` : "",
    };
  }

  // Hoàn tiền
  if (statusCode === "REFUNDED") {
    return {
      label: "Đã hoàn tiền",
      color: "red",
      detail: row.refundAmount ? `Đã hoàn: ${vnd(row.refundAmount)}` : "",
    };
  }

  // Mặc định
  return {
    label: "Chưa thanh toán",
    color: "default",
    detail: "",
  };
}

export default function AdminCustomPayments() {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("all");
  const [code, setCode] = useState("");
  const [page, setPage] = useState(1);
  const [limit] = useState(20);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [printingId, setPrintingId] = useState("");

  async function load() {
    try {
      setLoading(true);
      const params = { page, limit };
      if (status && status !== "all") params.status = status;
      if (code && code.trim()) params.code = code.trim();

      const { data } = await axiosClient.get("/api/custom-requests", { params });
      const items = Array.isArray(data?.items) ? data.items : [];
      setRows(items);
      setTotal(data?.total || items.length);
    } catch (e) {
      console.error("[AdminCustomPayments] load error:", e);
      message.error(e?.response?.data?.message || "Không tải được danh sách đơn custom.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, page]);

  const handleSearch = () => {
    setPage(1);
    load();
  };

  const handleRefresh = () => {
    load();
  };

  const handlePrintReceipt = async (row) => {
    try {
      setPrintingId(row._id);
      const res = await axiosClient.get(`/api/custom-requests/${row._id}/receipt`, {
        responseType: "blob",
      });

      const blob = new Blob([res.data], { type: "application/pdf" });
      const fileURL = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = `receipt-${row.code || row._id}.pdf`;
      link.click();
      URL.revokeObjectURL(fileURL);
    } catch (e) {
      message.error(e?.response?.data?.message || e.message || "Không tải được biên lai");
    } finally {
      setPrintingId("");
    }
  };

  const columns = [
    {
      title: "Mã yêu cầu",
      dataIndex: "code",
      render: (t, row) => t || row._id?.slice(-6) || "—",
    },
    {
      title: "Tiêu đề",
      dataIndex: ["brief", "title"],
      ellipsis: true,
      render: (t) => t || "—",
    },
    {
      title: "Khách hàng",
      dataIndex: "customer",
      render: (c) => c?.name || c?.email || "—",
    },
    {
      title: "Email",
      dataIndex: ["customer", "email"],
      render: (t) => t || "—",
    },
    {
      title: "Trạng thái yêu cầu",
      dataIndex: "status",
      render: (s) => getStatusTag(s),
    },
    {
      title: "Báo giá",
      dataIndex: "quote",
      align: "right",
      render: (q) => (q?.price ? vnd(q.price) : "—"),
    },
    {
      title: "Thanh toán",
      dataIndex: "paymentStatus",
      render: (ps, row) => {
        const info = getPaymentInfo(row);
        return (
          <div>
            <Tag color={info.color}>{info.label}</Tag>
            {info.detail && (
              <div style={{ fontSize: 12, opacity: 0.75 }}>{info.detail}</div>
            )}
          </div>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      render: (d) =>
        d ? new Date(d).toLocaleString("vi-VN") : "—",
    },
    {
      title: "Hành động",
      dataIndex: "_id",
      fixed: "right",
      render: (id, row) => {
        const info = getPaymentInfo(row);
        const canPrint =
          info.label === "Đã thanh toán đủ" ||
          row.paid ||
          row.paymentFull?.amount;

        return (
          <Space size="small">
            <Link
              to="/custom/requests"
              className="text-xs px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
            >
              Chi tiết
            </Link>

            {canPrint && (
              <Tooltip title="In biên lai PDF">
                <Button
                  type="default"
                  size="small"
                  icon={<FilePdfOutlined />}
                  loading={printingId === id}
                  onClick={() => handlePrintReceipt(row)}
                >
                  Biên lai
                </Button>
              </Tooltip>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Đơn hàng thiết kế theo yêu cầu
          </h1>
          <p className="text-sm opacity-70">
            Quản lý trạng thái thi công & thanh toán cho các yêu cầu custom.
          </p>
        </div>

        <Space wrap>
          {/* Lọc trạng thái */}
          <Select
            value={status}
            onChange={(v) => {
              setStatus(v);
              setPage(1);
            }}
            size="middle"
            style={{ minWidth: 200 }}
          >
            <Option value="all">Tất cả trạng thái</Option>
            {Object.entries(STATUS_LABELS_VI).map(([code, label]) => (
              <Option key={code} value={code}>
                {label}
              </Option>
            ))}
          </Select>

          {/* Tìm theo mã */}
          <Input.Search
            allowClear
            placeholder="Tìm theo mã yêu cầu (VD: CR-...)"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            onSearch={handleSearch}
            style={{ width: 260 }}
          />

          <Button
            icon={<ReloadOutlined />}
            onClick={handleRefresh}
          >
            Tải lại
          </Button>
        </Space>
      </div>

      {/* Table */}
      <Table
        rowKey="_id"
        columns={columns}
        dataSource={rows}
        loading={loading}
        scroll={{ x: 1000 }}
        pagination={{
          current: page,
          pageSize: limit,
          total,
          onChange: (p) => setPage(p),
          showSizeChanger: false,
          showTotal: (t) => `Tổng ${t} yêu cầu`,
        }}
        className="bg-white/5 rounded-2xl p-4"
      />
    </section>
  );
}
