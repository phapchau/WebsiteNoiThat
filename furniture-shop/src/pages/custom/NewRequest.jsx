





// // src/pages/custom/NewRequest.jsx
// import { useState } from "react";
// import axiosClient from "../../services/axiosClient";
// import { useNavigate } from "react-router-dom";
// import { useNotify } from "../../components/MessageProvider";


// export default function NewRequest() {
//   const nav = useNavigate();
//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     length: "",
//     width: "",
//     height: "",
//     unit: "cm",
//     materials: "",
//     color: "",
//     budgetMax: "",
//   });
//   const [files, setFiles] = useState([]);
//   const [msg, setMsg] = useState("");
//   const [busy, setBusy] = useState(false);



//   const notify = useNotify();

//   const onFile = (e) => setFiles(Array.from(e.target.files || []));

//   async function submit(e) {
//     e.preventDefault();
//     setMsg(""); setBusy(true);
//     try {
//       const fd = new FormData();
//       Object.entries(form).forEach(([k, v]) => fd.append(k, v));
//       files.forEach((f) => fd.append("files", f));

//       const { data } = await axiosClient.post("/api/custom-requests", fd, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       // setMsg(`🎉 Gửi yêu cầu thành công (#${data.code})`);

//       // ✅ thông báo thành công (text + toast)
//      const okText = `🎉 Gửi yêu cầu thành công${data?.code ? ` (#${data.code})` : ""}`;
//       setMsg(okText);
//      notify?.success?.(okText);
//      setTimeout(() => nav("/custom/requests"), 800);
    
//       setForm({
//         title: "", description: "", length: "", width: "",
//         height: "", unit: "cm", materials: "", color: "", budgetMax: ""
//       });
//       setFiles([]);
//     } catch (err) {
//       console.log(err);
//       // setMsg(err?.response?.data?.message || "Lỗi khi gửi yêu cầu");
//       const errText = err?.response?.data?.message || "Lỗi khi gửi yêu cầu";
//       setMsg(errText);
//      // ✅ toast lỗi
//       notify?.error?.(errText);
     
//     } finally {
//       setBusy(false);
//     }
//   }

//   return (
//     <section className="max-w-3xl mx-auto px-4 py-10">
//       <h1 className="text-2xl font-semibold mb-4">Thiết kế theo yêu cầu</h1>
//       <form onSubmit={submit} className="space-y-4">
//         <input className="border rounded-xl px-3 py-2 w-full" placeholder="Tiêu đề *"
//           value={form.title} onChange={e=>setForm(s=>({...s,title:e.target.value}))} required />
//         <textarea className="border rounded-xl px-3 py-2 w-full" rows={4} placeholder="Mô tả chi tiết"
//           value={form.description} onChange={e=>setForm(s=>({...s,description:e.target.value}))} />

//         <div className="grid sm:grid-cols-4 gap-3">
//           {["length","width","height"].map(f=>(
//             <input key={f} type="number" min="0" step="0.1"
//               className="border rounded-xl px-3 py-2"
//               placeholder={`${f === "length" ? "Dài" : f === "width" ? "Rộng" : "Cao"} *`}
//               value={form[f]} onChange={e=>setForm(s=>({...s,[f]:e.target.value}))} required />
//           ))}
//           <select className="border rounded-xl px-3 py-2"
//             value={form.unit} onChange={e=>setForm(s=>({...s,unit:e.target.value}))}>
//             <option>mm</option><option>cm</option><option>m</option>
//           </select>
//         </div>

//         <input className="border rounded-xl px-3 py-2 w-full" placeholder="Chất liệu"
//           value={form.materials} onChange={e=>setForm(s=>({...s,materials:e.target.value}))} />
//         <input className="border rounded-xl px-3 py-2 w-full" placeholder="Màu sắc"
//           value={form.color} onChange={e=>setForm(s=>({...s,color:e.target.value}))} />
//         <input type="number" className="border rounded-xl px-3 py-2 w-full" placeholder="Ngân sách tối đa (VNĐ)"
//           value={form.budgetMax} onChange={e=>setForm(s=>({...s,budgetMax:e.target.value}))} />

//         <input type="file" multiple accept="image/*" onChange={onFile} />
//         {!!files.length && <div className="text-xs text-gray-500">{files.map(f=>f.name).join(", ")}</div>}

//         <button disabled={busy} className="px-5 py-2 rounded-xl bg-[#B88E2F] text-white disabled:opacity-60">
//           {busy ? "Đang gửi..." : "Gửi yêu cầu"}
//         </button>

//         {msg && <p className="mt-2 text-sm text-gray-700">{msg}</p>}
//       </form>
//     </section>
//   );
// }///11/11






// // src/pages/custom/NewRequest.jsx
// import { useState } from "react";
// import axiosClient from "../../services/axiosClient";
// import { useNavigate } from "react-router-dom";
// import { useNotify } from "../../components/MessageProvider";

// // 🧱 Ant Design
// import {
//   Form,
//   Input,
//   InputNumber,
//   Select,
//   Upload,
//   Button,
//   Card,
//   Typography,
//   Divider,
//   Space,
// } from "antd";
// import { InboxOutlined } from "@ant-design/icons";

// const { Title, Paragraph, Text } = Typography;
// const { Dragger } = Upload;

// export default function NewRequest() {
//   const nav = useNavigate();
//   const [form, setForm] = useState({
//     title: "",
//     description: "",
//     length: "",
//     width: "",
//     height: "",
//     unit: "cm",
//     materials: "",
//     color: "",
//     budgetMax: "",
//   });
//   const [files, setFiles] = useState([]);
//   const [msg, setMsg] = useState("");
//   const [busy, setBusy] = useState(false);

//   const notify = useNotify();

//   const fileProps = {
//     name: "files",
//     multiple: true,
//     accept: "image/*",
//     beforeUpload: () => false, // ✅ không upload tự động — giữ nguyên logic tự post qua axiosClient
//     onChange(info) {
//       const list = (info.fileList || []).map((f) => f.originFileObj).filter(Boolean);
//       setFiles(list);
//     },
//   };

//   function updateField(key, value) {
//     setForm((s) => ({ ...s, [key]: value }));
//   }

//   async function submit(e) {
//     e?.preventDefault?.();
//     setMsg("");
//     setBusy(true);
//     try {
//       const fd = new FormData();
//       Object.entries(form).forEach(([k, v]) => fd.append(k, v));
//       files.forEach((f) => fd.append("files", f));

//       const { data } = await axiosClient.post("/api/custom-requests", fd, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       const okText = `🎉 Gửi yêu cầu thành công${data?.code ? ` (#${data.code})` : ""}`;
//       setMsg(okText);
//       notify?.success?.(okText);
//       setTimeout(() => nav("/custom/requests"), 800);

//       setForm({
//         title: "",
//         description: "",
//         length: "",
//         width: "",
//         height: "",
//         unit: "cm",
//         materials: "",
//         color: "",
//         budgetMax: "",
//       });
//       setFiles([]);
//     } catch (err) {
//       const errText = err?.response?.data?.message || "Lỗi khi gửi yêu cầu";
//       setMsg(errText);
//       notify?.error?.(errText);
//     } finally {
//       setBusy(false);
//     }
//   }

//   return (
//     <section className="max-w-4xl mx-auto px-3 md:px-6 py-8">
//       <Card
//         bordered={false}
//         className="shadow-xl rounded-2xl"
//         style={{ background: "#ffffff" }}
//       >
//         <Space direction="vertical" size={12} style={{ width: "100%" }}>
//           <div className="flex items-center justify-between gap-3 flex-wrap">
//             <Title level={3} style={{ margin: 0 }}>Thiết kế theo yêu cầu</Title>
//             <Text type="secondary">Vui lòng điền thông tin chi tiết để chúng tôi tư vấn tốt hơn</Text>
//           </div>

//           <Divider style={{ margin: "12px 0 0" }} />

//           <Form
//             layout="vertical"
//             onSubmitCapture={submit}
//             requiredMark
//             style={{ marginTop: 12 }}
//           >
//             <Form.Item label="Tiêu đề" required>
//               <Input
//                 size="large"
//                 placeholder="Tiêu đề *"
//                 value={form.title}
//                 onChange={(e) => updateField("title", e.target.value)}
//                 allowClear
//               />
//             </Form.Item>

//             <Form.Item label="Mô tả chi tiết">
//               <Input.TextArea
//                 rows={4}
//                 placeholder="Mô tả chi tiết (nhu cầu, phong cách, không gian...)"
//                 value={form.description}
//                 onChange={(e) => updateField("description", e.target.value)}
//                 allowClear
//               />
//             </Form.Item>

//             <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
//               <Form.Item label="Dài" required>
//                 <InputNumber
//                   min={0}
//                   step={0.1}
//                   className="w-full"
//                   value={form.length}
//                   onChange={(v) => updateField("length", v)}
//                   placeholder="Dài *"
//                 />
//               </Form.Item>

//               <Form.Item label="Rộng" required>
//                 <InputNumber
//                   min={0}
//                   step={0.1}
//                   className="w-full"
//                   value={form.width}
//                   onChange={(v) => updateField("width", v)}
//                   placeholder="Rộng *"
//                 />
//               </Form.Item>

//               <Form.Item label="Cao" required>
//                 <InputNumber
//                   min={0}
//                   step={0.1}
//                   className="w-full"
//                   value={form.height}
//                   onChange={(v) => updateField("height", v)}
//                   placeholder="Cao *"
//                 />
//               </Form.Item>

//               <Form.Item label="Đơn vị">
//                 <Select
//                   size="large"
//                   value={form.unit}
//                   onChange={(v) => updateField("unit", v)}
//                   options={[
//                     { value: "mm", label: "mm" },
//                     { value: "cm", label: "cm" },
//                     { value: "m", label: "m" },
//                   ]}
//                 />
//               </Form.Item>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//               <Form.Item label="Chất liệu">
//                 <Input
//                   size="large"
//                   placeholder="Ví dụ: gỗ sồi, thép, kính..."
//                   value={form.materials}
//                   onChange={(e) => updateField("materials", e.target.value)}
//                 />
//               </Form.Item>

//               <Form.Item label="Màu sắc">
//                 <Input
//                   size="large"
//                   placeholder="Ví dụ: nâu óc chó, trắng kem..."
//                   value={form.color}
//                   onChange={(e) => updateField("color", e.target.value)}
//                 />
//               </Form.Item>
//             </div>

//             <Form.Item label="Ngân sách tối đa (VNĐ)">
//               <InputNumber
//                 className="w-full"
//                 size="large"
//                 min={0}
//                 step={100000}
//                 value={form.budgetMax}
//                 onChange={(v) => updateField("budgetMax", v)}
//                 placeholder="VD: 15.000.000"
//               />
//             </Form.Item>

//             <Form.Item label="Hình ảnh tham khảo">
//               <Dragger {...fileProps} className="rounded-xl">
//                 <p className="ant-upload-drag-icon">
//                   <InboxOutlined />
//                 </p>
//                 <p className="ant-upload-text">Kéo & thả ảnh vào đây hoặc bấm để chọn</p>
//                 <p className="ant-upload-hint">Hỗ trợ nhiều ảnh • Chỉ nhận tập tin hình ảnh</p>
//               </Dragger>
//               {!!files.length && (
//                 <Text type="secondary" style={{ display: "block", marginTop: 8 }}>
//                   {files.map((f) => f?.name).filter(Boolean).join(", ")}
//                 </Text>
//               )}
//             </Form.Item>

//             <div className="flex items-center justify-between mt-2">
//               <Paragraph type="secondary" style={{ margin: 0 }}>
//                 * Thời gian phản hồi dự kiến trong 24–48 giờ làm việc.
//               </Paragraph>
//               <Button
//                 size="large"
//                 type="primary"
//                 htmlType="submit"
//                 loading={busy}
//                 style={{ background: "#B88E2F", borderColor: "#B88E2F" }}
//               >
//                 {busy ? "Đang gửi..." : "Gửi yêu cầu"}
//               </Button>
//             </div>

//             {msg && (
//               <Paragraph style={{ marginTop: 8 }}>
//                 <Text>{msg}</Text>
//               </Paragraph>
//             )}
//           </Form>
//         </Space>
//       </Card>
//     </section>
//   );
// }//12/11













// src/pages/custom/NewRequest.jsx
import { useState } from "react";
import axiosClient from "../../services/axiosClient";
import { useNavigate } from "react-router-dom";
import { useNotify } from "../../components/MessageProvider";

// Ant Design
import {
  Form,
  Input,
  Select,
  Upload,
  Button,
  Card,
  Typography,
  Divider,
  Space,
  Row,
  Col,
} from "antd";
import { InboxOutlined } from "@ant-design/icons";

const { Title, Paragraph, Text } = Typography;
const { Dragger } = Upload;

export default function NewRequest() {
  const nav = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    length: "",
    width: "",
    height: "",
    unit: "cm",
    materials: "",
    color: "",
    budgetMax: "",
  });
  const [files, setFiles] = useState([]);
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const notify = useNotify();

  // giữ nguyên logic upload: beforeUpload -> false
  const fileProps = {
    name: "files",
    multiple: true,
    accept: "image/*",
    beforeUpload: () => false,
    onChange(info) {
      const list = (info.fileList || []).map((f) => f.originFileObj).filter(Boolean);
      setFiles(list);
    },
  };

  function updateField(key, value) {
    setForm((s) => ({ ...s, [key]: value }));
  }

  // --- Helper: chuẩn hoá input chiều (cho phép nhập "1805" => 180.5, "180,5" => 180.5, "180.5" => 180.5)
  function normalizeDimension(raw) {
    if (raw === null || raw === undefined) return "";
    if (typeof raw === "number" && Number.isFinite(raw)) return raw;
    const s = String(raw).trim();
    if (s === "") return "";

    // replace comma with dot
    const dotNormalized = s.replace(",", ".");

    // if contains non-digit/dot chars -> remove spaces and non-number except dot and minus
    const cleaned = dotNormalized.replace(/[^\d.\-]/g, "");

    // if contains dot -> parseFloat
    if (cleaned.includes(".")) {
      const v = parseFloat(cleaned);
      return Number.isFinite(v) ? v : cleaned;
    }

    // now cleaned is digits only (maybe with leading minus)
    const digitsOnly = cleaned.replace(/^0+(?=\d)/, ""); // remove leading zeros safely
    // heuristic: if length >= 4, assume last digit is decimal place (e.g. 1805 -> 180.5)
    const digits = digitsOnly.replace("-", "");
    const negative = cleaned.startsWith("-");

    if (/^\d+$/.test(digits)) {
      if (digits.length >= 4) {
        const intPart = digits.slice(0, -1);
        const decPart = digits.slice(-1);
        const num = parseFloat(`${intPart}.${decPart}`);
        return negative ? -num : num;
      }
      // else length 1..3 -> integer
      const num = parseInt(digits, 10);
      return negative ? -num : num;
    }

    // fallback: try parseFloat anyway
    const fallback = parseFloat(cleaned);
    return Number.isFinite(fallback) ? fallback : cleaned;
  }

  async function submit(e) {
    e?.preventDefault?.();
    setMsg("");
    setBusy(true);

    try {
      // normalize dimensions before appending to FormData
      const payload = { ...form };
      payload.length = normalizeDimension(form.length);
      payload.width = normalizeDimension(form.width);
      payload.height = normalizeDimension(form.height);

      const fd = new FormData();
      // append all keys (stringify numbers to string — backend should accept)
      Object.entries(payload).forEach(([k, v]) => {
        // only append if defined (keep empty strings too)
        if (v === null || v === undefined) {
          fd.append(k, "");
        } else {
          fd.append(k, String(v));
        }
      });
      files.forEach((f) => fd.append("files", f));

      const { data } = await axiosClient.post("/api/custom-requests", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const okText = `🎉 Gửi yêu cầu thành công${data?.code ? ` (#${data.code})` : ""}`;
      setMsg(okText);
      notify?.success?.(okText);
      // giữ nguyên hành vi điều hướng
      setTimeout(() => nav("/custom/requests"), 800);

      setForm({
        title: "",
        description: "",
        length: "",
        width: "",
        height: "",
        unit: "cm",
        materials: "",
        color: "",
        budgetMax: "",
      });
      setFiles([]);
    } catch (err) {
      const errText = err?.response?.data?.message || "Lỗi khi gửi yêu cầu";
      setMsg(errText);
      notify?.error?.(errText);
    } finally {
      setBusy(false);
    }
  }

  const GOLD = "#B88E2F";

  return (
    <section className="max-w-4xl md:max-w-6xl mx-auto px-4 md:px-6 py-12">
      <Card
        bordered={false}
        className="rounded-2xl"
        style={{
          background: "linear-gradient(180deg,#fffdfa,#fff8ee)",
          boxShadow: "0 10px 40px rgba(184,142,47,0.08)",
          borderRadius: 20,
          padding: 24,
        }}
      >
        <Space direction="vertical" size="large" style={{ width: "100%" }}>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <Title level={2} style={{ margin: 0, color: "#3b3b3b" }}>
                Thiết kế theo yêu cầu
              </Title>
              <Paragraph style={{ margin: 0, color: "#4b4b4b" }}>
                Điền chi tiết — chúng tôi sẽ báo giá & tư vấn sớm nhất
              </Paragraph>
            </div>

            <div style={{ textAlign: "right" }}>
              <Text style={{ display: "block", color: GOLD, fontWeight: 700 }}>
                Hỗ trợ: tư vấn & báo giá nhanh
              </Text>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Thời gian phản hồi 24–48 giờ
              </Text>
            </div>
          </div>

          <Divider style={{ margin: 0 }} />

          <Form
            layout="vertical"
            onSubmitCapture={submit}
            requiredMark
            style={{ marginTop: 8 }}
          >
            <Row gutter={16}>
              <Col xs={24} lg={16}>
                <Card
                  type="inner"
                  title={<span style={{ fontWeight: 700 }}>Thông tin yêu cầu</span>}
                  style={{ borderRadius: 12 }}
                >
                  <div style={{ padding: 0 }}>
                    <Form.Item label="Tiêu đề" required>
                      <Input
                        size="large"
                        placeholder="Tiêu đề *"
                        value={form.title}
                        onChange={(e) => updateField("title", e.target.value)}
                        allowClear
                      />
                    </Form.Item>

                    <Form.Item label="Mô tả chi tiết">
                      <Input.TextArea
                        rows={6}
                        placeholder="Mô tả chi tiết (nhu cầu, phong cách, không gian...)"
                        value={form.description}
                        onChange={(e) => updateField("description", e.target.value)}
                        allowClear
                        style={{ fontSize: 16 }}
                      />
                    </Form.Item>

                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                      <Form.Item label="Dài" required>
                        {/* dùng Input text để linh hoạt nhập: 1805, 180.5, 180,5 */}
                        <Input
                          size="large"
                          placeholder="Ví dụ: 180 hoặc 1805 (=>180.5)"
                          value={form.length}
                          onChange={(e) => updateField("length", e.target.value)}
                        />
                        <div style={{ fontSize: 12, color: "rgba(0,0,0,0.45)", marginTop: 6 }}>
                          Bạn có thể nhập 180.5 hoặc 180,5. Nếu nhập 1805 (4 chữ số) hệ sẽ hiểu là 180.5.
                        </div>
                      </Form.Item>

                      <Form.Item label="Rộng" required>
                        <Input
                          size="large"
                          placeholder="Ví dụ: 80 hoặc 805 (=>80.5)"
                          value={form.width}
                          onChange={(e) => updateField("width", e.target.value)}
                        />
                        <div style={{ fontSize: 12, color: "rgba(0,0,0,0.45)", marginTop: 6 }}>
                          Hỗ trợ nhập không dấu chấm; ví dụ 805 → 80.5.
                        </div>
                      </Form.Item>

                      <Form.Item label="Cao" required>
                        <Input
                          size="large"
                          placeholder="Ví dụ: 75 hoặc 755 (=>75.5)"
                          value={form.height}
                          onChange={(e) => updateField("height", e.target.value)}
                        />
                        <div style={{ fontSize: 12, color: "rgba(0,0,0,0.45)", marginTop: 6 }}>
                          Bạn cũng có thể dùng dấu phẩy (180,5) hoặc dấu chấm (180.5).
                        </div>
                      </Form.Item>

                      <Form.Item label="Đơn vị">
                        <Select
                          size="large"
                          value={form.unit}
                          onChange={(v) => updateField("unit", v)}
                          options={[
                            { value: "mm", label: "mm" },
                            { value: "cm", label: "cm" },
                            { value: "m", label: "m" },
                          ]}
                        />
                      </Form.Item>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                      <Form.Item label="Chất liệu">
                        <Input
                          size="large"
                          placeholder="Ví dụ: gỗ sồi, thép, kính..."
                          value={form.materials}
                          onChange={(e) => updateField("materials", e.target.value)}
                        />
                      </Form.Item>

                      <Form.Item label="Màu sắc">
                        <Input
                          size="large"
                          placeholder="Ví dụ: nâu óc chó, trắng kem..."
                          value={form.color}
                          onChange={(e) => updateField("color", e.target.value)}
                        />
                      </Form.Item>
                    </div>

                    <Form.Item label="Ngân sách tối đa (VNĐ)">
                      <Input
                        value={form.budgetMax}
                        onChange={(e) => updateField("budgetMax", e.target.value)}
                        placeholder="VD: 15000000"
                        size="large"
                      />
                      <div style={{ fontSize: 12, color: "rgba(0,0,0,0.45)", marginTop: 6 }}>
                        Nhập số nguyên (không bắt buộc dùng dấu phân cách).
                      </div>
                    </Form.Item>
                  </div>
                </Card>
              </Col>

              <Col xs={24} lg={8}>
                <Card
                  type="inner"
                  title={<span style={{ fontWeight: 700 }}>Tệp & Tùy chọn</span>}
                  style={{ borderRadius: 12 }}
                >
                  <Form.Item label="Hình ảnh tham khảo">
                    <Dragger {...fileProps} className="rounded-lg" style={{ padding: 18 }}>
                      <p className="ant-upload-drag-icon">
                        <InboxOutlined style={{ color: GOLD }} />
                      </p>
                      <p className="ant-upload-text">Kéo & thả ảnh hoặc bấm để chọn</p>
                      <p className="ant-upload-hint">Hỗ trợ nhiều ảnh • Chỉ nhận file ảnh</p>
                    </Dragger>

                    {!!files.length && (
                      <div style={{ marginTop: 12 }}>
                        <Text type="secondary" style={{ display: "block", marginBottom: 8 }}>
                          Ảnh đã chọn:
                        </Text>
                        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                          {files.map((f, i) => (
                            <div
                              key={i}
                              style={{
                                width: 72,
                                height: 72,
                                borderRadius: 8,
                                overflow: "hidden",
                                border: "1px solid #eee",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 11,
                                padding: 6,
                                background: "#fff",
                              }}
                              title={f?.name}
                            >
                              <span style={{ textAlign: "center" }}>{f?.name?.slice(0, 16)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </Form.Item>

                  <Divider />

                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    <Button
                      size="large"
                      type="primary"
                      onClick={submit}
                      loading={busy}
                      style={{
                        background: GOLD,
                        borderColor: GOLD,
                        fontWeight: 700,
                        borderRadius: 10,
                      }}
                      block
                    >
                      {busy ? "Đang gửi..." : "Gửi yêu cầu"}
                    </Button>

                    <Button
                      size="large"
                      danger
                      onClick={() => {
                        setForm({
                          title: "",
                          description: "",
                          length: "",
                          width: "",
                          height: "",
                          unit: "cm",
                          materials: "",
                          color: "",
                          budgetMax: "",
                        });
                        setFiles([]);
                        setMsg("");
                        notify?.info?.("Đã xóa form");
                      }}
                      block
                    >
                      Xóa form
                    </Button>
                  </div>

                  <div style={{ marginTop: 12 }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      * Thời gian phản hồi dự kiến trong 24–48 giờ làm việc.
                    </Text>
                  </div>
                </Card>
              </Col>
            </Row>

            {!!msg && (
              <div style={{ marginTop: 16 }}>
                <Paragraph>
                  <Text>{msg}</Text>
                </Paragraph>
              </div>
            )}
          </Form>
        </Space>
      </Card>
    </section>
  );
}
