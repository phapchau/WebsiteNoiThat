// ======================================
// src/pages/staff/StaffCustomRequests.jsx
// ======================================

import { useEffect, useState } from "react";
import axios from "../../services/axiosClient";

import {
  Button,
  Tag,
  Modal,
  InputNumber,
  Form,
  message,
  Select,
  Divider,
  Card,
} from "antd";

import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  ToolOutlined,
} from "@ant-design/icons";

// ========= Static helpers ==========
const ORIGIN = import.meta.env.VITE_API_ORIGIN || "http://localhost:8081";
const fileUrl = (u = "") =>
  /^https?:/i.test(u) ? u : `${ORIGIN}${u.startsWith("/") ? u : "/" + u}`;

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

const STATUS_COLORS = {
  SUBMITTED: "gold",
  REVIEWING: "blue",
  QUOTED: "purple",
  ACCEPTED: "green",
  REJECTED: "red",
  CANCELED: "red",
  IN_PROGRESS: "geekblue",
  DONE: "lime",
};

const dimText = (brief = {}) => {
  const L = brief.length ?? brief.L;
  const W = brief.width ?? brief.W;
  const H = brief.height ?? brief.H;
  const unit = brief.unit || "cm";
  const parts = [
    (L || L === 0) && `D:${L}`,
    (W || W === 0) && `R:${W}`,
    (H || H === 0) && `C:${H}`,
  ].filter(Boolean);

  return parts.length ? `${parts.join(" × ")} ${unit}` : "—";
};

// =================================
// MAIN COMPONENT FOR STAFF
// =================================
export default function StaffCustomRequests() {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("all");
  const [busy, setBusy] = useState("");
  const [err, setErr] = useState("");

  async function load() {
    try {
      setErr("");
      const params = {};
      if (status !== "all") params.status = status;

      const { data } = await axios.get("/api/custom-requests", { params });
      setRows(Array.isArray(data) ? data : data.items || []);
    } catch (e) {
      setErr(e?.response?.data?.message || "Không tải được danh sách yêu cầu");
    }
  }

  useEffect(() => {
    load();
  }, [status]);

  async function setStatusReq(id, s) {
    setBusy(id);
    try {
      await axios.patch(`/api/custom-requests/${id}/status`, { status: s });
      message.success("Đã cập nhật trạng thái");
      await load();
    } finally {
      setBusy("");
    }
  }

  return (
    <section className="max-w-[1400px] mx-auto px-6 py-8 space-y-6">

      {/* HEADER */}
      <Card bordered className="shadow-sm">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div>
            <h1 className="font-semibold text-xl">Yêu cầu thiết kế (Nhân viên)</h1>
            <p className="text-gray-600 text-sm mt-1">
              Nhân viên xem & cập nhật tiến độ yêu cầu.
            </p>
          </div>

          <Select
            value={status}
            onChange={(v) => setStatus(v)}
            style={{ width: 240 }}
            options={[
              { label: "Tất cả", value: "all" },
              ...Object.entries(STATUS_LABELS_VI).map(([k, v]) => ({
                label: v,
                value: k,
              })),
            ]}
          />
        </div>
      </Card>

      {err && (
        <Card>
          <div className="text-red-600">{err}</div>
        </Card>
      )}

      {/* LIST */}
      <div className="space-y-6">
        {rows.map((r) => (
          <Card
            key={r._id}
            className="shadow-sm"
            style={{ borderRadius: 16 }}
          >
            {/* TITLE */}
            <div className="flex justify-between items-start flex-wrap gap-3">
              <div>
                <h2 className="font-semibold text-lg">{r.brief?.title || "Yêu cầu không tên"}</h2>
                <div className="text-gray-500 text-sm">
                  #{r.code} • {r.customer?.name} •{" "}
                  {new Date(r.createdAt).toLocaleString("vi-VN")}
                </div>
              </div>

              <Tag color={STATUS_COLORS[r.status] || "default"} style={{ padding: "6px 12px" }}>
                {STATUS_LABELS_VI[r.status] || "Không rõ"}
              </Tag>
            </div>

            <Divider />

            <p className="text-gray-700">{r.brief?.description}</p>

            <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700">
              <div>Kích thước: <b>{dimText(r.brief)}</b></div>
              <div>Chất liệu: <b>{r.brief?.materials || "—"}</b></div>
              <div>Màu sắc: <b>{r.brief?.color || "—"}</b></div>
            </div>

            {/* Images */}
            {!!r.files?.length && (
              <div className="mt-4 flex flex-wrap gap-3">
                {r.files.map((f, i) => (
                  <img
                    key={i}
                    src={fileUrl(f.url)}
                    className="w-28 h-28 object-cover rounded-lg border"
                  />
                ))}
              </div>
            )}

            <Divider />

            {/* STAFF ACTIONS */}
            <div className="flex flex-wrap gap-3">
              {/* 1 — REVIEWING */}
              <Button
                icon={<ClockCircleOutlined />}
                onClick={() => setStatusReq(r._id, "REVIEWING")}
                loading={busy === r._id}
              >
                Đánh giá yêu cầu
              </Button>

              {/* 2 — IN_PROGRESS */}
              <Button
                icon={<ToolOutlined />}
                onClick={() => setStatusReq(r._id, "IN_PROGRESS")}
                loading={busy === r._id}
              >
                Bắt đầu thi công
              </Button>

              {/* 3 — DONE */}
              <Button
                icon={<CheckCircleOutlined />}
                onClick={() => setStatusReq(r._id, "DONE")}
                loading={busy === r._id}
              >
                Hoàn thành
              </Button>
            </div>
          </Card>
        ))}

        {!rows.length && !err && (
          <Card className="text-center py-10">
            <p className="text-gray-500">Không có yêu cầu nào</p>
          </Card>
        )}
      </div>
    </section>
  );
}
