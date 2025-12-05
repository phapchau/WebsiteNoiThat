import { useEffect, useState } from "react";
import {
  Modal,
  Radio,
  Input,
  Select,
  Button,
  notification,
  Spin,
  Form,
} from "antd";
import axiosClient from "../services/axiosClient";
import { vnd } from "../utils/format";

const { TextArea } = Input;

export default function ModalCustomCheckout({
  open,
  onClose,
  request,
  price,
  onPaid,
}) {
  const [addresses, setAddresses] = useState([]);
  const [selectedAddr, setSelectedAddr] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  // Thêm địa chỉ mới
  const [newAddr, setNewAddr] = useState({
    name: "",
    phone: "",
    email: "",
    line1: "",
  });
  const [adding, setAdding] = useState(false);

  // Validate SĐT VN
  const isValidPhone = (s = "") => /^[0-9]{9,11}$/.test(s.trim());

  // Load danh sách địa chỉ
  async function loadAddresses() {
    try {
      const { data } = await axiosClient.get("/api/users/addresses");
      const arr = Array.isArray(data) ? data : [];
      setAddresses(arr);

      const def = arr.find((x) => x.isDefault) || arr[0];
      setSelectedAddr(def?._id || null);
    } catch (e) {
      notification.error({ message: "Không tải được địa chỉ" });
    }
  }

  useEffect(() => {
    if (open) loadAddresses();
  }, [open]);

  // ----------------------------
  // ➕ THÊM ĐỊA CHỈ MỚI
  // ----------------------------
  async function addNewAddress() {
    const { name, phone, email, line1 } = newAddr;

    if (!name.trim()) return notification.warning({ message: "Vui lòng nhập họ tên" });
    if (!phone.trim()) return notification.warning({ message: "Vui lòng nhập số điện thoại" });

    if (!isValidPhone(phone))
      return notification.warning({ message: "Số điện thoại không hợp lệ" });

    if (!line1.trim()) return notification.warning({ message: "Vui lòng nhập địa chỉ" });

    try {
      setAdding(true);
      const { data } = await axiosClient.post("/api/users/addresses", {
        name,
        phone,
        email,
        line1,
        isDefault: false,
      });

      notification.success({ message: "Đã thêm địa chỉ mới!" });

      await loadAddresses();
      setSelectedAddr(data._id);

      setNewAddr({ name: "", phone: "", email: "", line1: "" });
    } catch (e) {
      notification.error({
        message: "Lỗi thêm địa chỉ",
        description: e?.response?.data?.message || "Không thể thêm địa chỉ",
      });
    } finally {
      setAdding(false);
    }
  }

  // ----------------------------
  // SUBMIT THANH TOÁN
  // ----------------------------
  async function submit() {
    if (!selectedAddr)
      return notification.warning({ message: "Vui lòng chọn địa chỉ" });

    setBusy(true);

    // COD
    if (paymentMethod === "COD") {
      try {
        await axiosClient.post(`/api/pay/custom/${request._id}/pay-cod`, {
          addressId: selectedAddr,
          note,
        });

        notification.success({ message: "Đã ghi nhận thanh toán COD" });
        onPaid?.();
        onClose();
      } catch (e) {
        notification.error({
          message: "Lỗi COD",
          description: e?.response?.data?.message || e.message,
        });
      } finally {
        setBusy(false);
      }
      return;
    }

    // VNPay
    try {
      const { data } = await axiosClient.post("/api/pay/vnpay/custom/full", {
        customRequestId: request._id,
        addressId: selectedAddr,
        note,
      });

      if (data?.payUrl) {
        window.location.href = data.payUrl;
      } else {
        notification.error({ message: "Không tạo được link VNPay" });
      }
    } catch (e) {
      notification.error({
        message: "Lỗi VNPay",
        description: e?.response?.data?.message || e.message,
      });
      setBusy(false);
    }
  }

  return (
    <Modal
      title="Thanh toán thiết kế"
      open={open}
      onCancel={onClose}
      footer={null}
      centered
      width={560}
    >
      {!request ? (
        <div className="py-10 flex justify-center">
          <Spin />
        </div>
      ) : (
        <div className="space-y-6">

          {/* TIỀN */}
          <div className="p-4 rounded-xl bg-gray-50 border">
            <div className="text-sm text-gray-600">Số tiền cần thanh toán</div>
            <div className="text-2xl font-bold text-[#B88E2F]">{vnd(price)}</div>
          </div>

          {/* CHỌN ĐỊA CHỈ */}
          <div>
            <div className="font-medium mb-1">Địa chỉ nhận hàng</div>
            <Select
              className="w-full"
              placeholder="Chọn địa chỉ"
              value={selectedAddr}
              onChange={setSelectedAddr}
              options={addresses.map((a) => ({
                value: a._id,
                label: `${a.name} — ${a.phone} — ${a.line1}`,
              }))}
            />
          </div>

          {/* ➕ FORM THÊM ĐỊA CHỈ */}
          {/* <div className="p-4 border rounded-xl bg-white">
            <div className="font-medium mb-2">Thêm địa chỉ mới</div>

            <Form layout="vertical">
              <Form.Item label="Họ tên">
                <Input
                  value={newAddr.name}
                  onChange={(e) =>
                    setNewAddr((s) => ({ ...s, name: e.target.value }))
                  }
                />
              </Form.Item>

              <Form.Item label="Số điện thoại (bắt buộc)">
                <Input
                  value={newAddr.phone}
                  onChange={(e) =>
                    setNewAddr((s) => ({ ...s, phone: e.target.value }))
                  }
                  maxLength={11}
                />
              </Form.Item>

              <Form.Item label="Email (tuỳ chọn)">
                <Input
                  value={newAddr.email}
                  onChange={(e) =>
                    setNewAddr((s) => ({ ...s, email: e.target.value }))
                  }
                />
              </Form.Item>

              <Form.Item label="Địa chỉ">
                <TextArea
                  rows={2}
                  value={newAddr.line1}
                  onChange={(e) =>
                    setNewAddr((s) => ({ ...s, line1: e.target.value }))
                  }
                />
              </Form.Item>

              <Button
                type="dashed"
                loading={adding}
                onClick={addNewAddress}
                block
                style={{
                  borderColor: "#B88E2F",
                  color: "#B88E2F",
                  fontWeight: 600,
                }}
              >
                + Thêm địa chỉ
              </Button>
            </Form>
          </div> */}

          {/* ➕ FORM THÊM ĐỊA CHỈ — BẢN NHỎ GỌN */}
<div
  className="border rounded-lg bg-white"
  style={{
    padding: "12px 14px",
    background: "#fff",
  }}
>
  <div
    className="font-medium"
    style={{ marginBottom: 6, fontSize: 14 }}
  >
    Thêm địa chỉ mới
  </div>

  <Form
    layout="vertical"
    style={{ gap: 4 }}
  >
    <Form.Item
      label="Họ tên"
      style={{ marginBottom: 10 }}
      labelCol={{ style: { fontSize: 13 } }}
    >
      <Input
        size="small"
        value={newAddr.name}
        onChange={(e) =>
          setNewAddr((s) => ({ ...s, name: e.target.value }))
        }
      />
    </Form.Item>

    <Form.Item
      label="Số điện thoại"
      style={{ marginBottom: 10 }}
      labelCol={{ style: { fontSize: 13 } }}
    >
      <Input
        size="small"
        maxLength={11}
        value={newAddr.phone}
        onChange={(e) =>
          setNewAddr((s) => ({ ...s, phone: e.target.value }))
        }
      />
    </Form.Item>

    <Form.Item
      label="Email (tuỳ chọn)"
      style={{ marginBottom: 10 }}
      labelCol={{ style: { fontSize: 13 } }}
    >
      <Input
        size="small"
        value={newAddr.email}
        onChange={(e) =>
          setNewAddr((s) => ({ ...s, email: e.target.value }))
        }
      />
    </Form.Item>

    <Form.Item
      label="Địa chỉ"
      style={{ marginBottom: 12 }}
      labelCol={{ style: { fontSize: 13 } }}
    >
      <TextArea
        rows={2}
        value={newAddr.line1}
        onChange={(e) =>
          setNewAddr((s) => ({ ...s, line1: e.target.value }))
        }
        style={{ fontSize: 13 }}
      />
    </Form.Item>

    <Button
      type="dashed"
      size="small"
      loading={adding}
      onClick={addNewAddress}
      block
      style={{
        borderColor: "#B88E2F",
        color: "#B88E2F",
        fontWeight: 600,
        padding: "4px 0",
        fontSize: 13,
      }}
    >
      + Thêm địa chỉ
    </Button>
  </Form>
</div>


          {/* PHƯƠNG THỨC */}
          <div>
            <div className="font-medium mb-1">Phương thức thanh toán</div>
            <Radio.Group
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <Radio value="COD">Thanh toán khi hoàn thành (COD)</Radio>
              <Radio value="VNPAY">VNPay</Radio>
            </Radio.Group>
          </div>

          {/* NOTE */}
          <div>
            <div className="font-medium mb-1">Ghi chú</div>
            <TextArea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>

          {/* SUBMIT */}
          <Button
            type="primary"
            block
            size="large"
            loading={busy}
            onClick={submit}
            style={{
              backgroundColor: "#B88E2F",
              borderColor: "#B88E2F",
              fontWeight: 600,
            }}
          >
            Thanh toán ngay
          </Button>
        </div>
      )}
    </Modal>
  );
}
