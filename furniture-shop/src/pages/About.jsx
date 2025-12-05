// src/pages/About.jsx
import { Link } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";

const GOLD = "#B88E2F";
const GOLD_LIGHT = "rgba(184,142,47,0.08)";

const HIGHLIGHTS = [
  { k: "Năm thành lập", v: "2020+" },
  { k: "Dự án đã hoàn thiện", v: "2.500+" },
  { k: "Khách hàng hài lòng", v: "98%" },
  { k: "Bảo hành", v: "5 năm" },
];

const VALUES = [
  {
    title: "Thiết kế tinh tế",
    desc: "Tối giản, ấm áp, nhấn mạnh công năng – mang hơi thở Bắc Âu phù hợp không gian Việt.",
    icon: "🎨",
  },
  {
    title: "Vật liệu bền vững",
    desc: "Gỗ trồng rừng, veneer đạt chuẩn; sơn, keo đạt chứng chỉ an toàn sức khỏe.",
    icon: "🌱",
  },
  {
    title: "Gia công chuẩn xác",
    desc: "Quy trình CNC – sơn UV – QC 3 bước, đảm bảo độ bền & tính thẩm mỹ lâu dài.",
    icon: "🧰",
  },
  {
    title: "Giá trị thật",
    desc: "Tối ưu chuỗi cung ứng & vận hành, minh bạch chi phí – giá cạnh tranh.",
    icon: "💎",
  },
];

const STEPS = [
  { n: "01", title: "Tư vấn miễn phí", desc: "Đo đạc, gợi ý phong cách – bố cục – vật liệu theo ngân sách." },
  { n: "02", title: "Thiết kế & Dự toán", desc: "Phối cảnh 3D, bản vẽ kỹ thuật, bảng giá chi tiết." },
  { n: "03", title: "Sản xuất", desc: "CNC – sơn – ráp – QC. Chủ động timeline, cập nhật tiến độ." },
  { n: "04", title: "Lắp đặt & Bảo hành", desc: "Bàn giao sạch sẽ – hướng dẫn sử dụng – bảo hành 5 năm." },
];

export default function About() {
  return (
    <main className="space-y-24">
      {/* HERO */}
      <section className="relative overflow-hidden full-bleed">
        <div className="w-full h-[56vh] min-h-[420px] relative">
          <img
            src="/anh2.jpg"
            alt="Natura Home"
            className="w-full h-full object-cover filter saturate-95"
            onError={(e) => (e.currentTarget.src = "/anh1.jpg")}
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.45))" }} />
          <div className="absolute inset-0">
            <div className="max-w-[1440px] mx-auto h-full px-6 md:px-12 lg:px-16 flex items-center">
              <div className="text-white drop-shadow space-y-4 max-w-2xl">
                <p className="uppercase tracking-widest text-sm md:text-base" style={{ letterSpacing: 1.2 }}>
                  Natura Home
                </p>
                <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">
                  Về chúng tôi
                </h1>
                <p className="max-w-xl text-white/90 text-lg">
                  Kiến tạo không gian sống ấm áp, tối giản và bền vững – với chất lượng chuẩn mực, giá trị thực cho mọi gia đình Việt.
                </p>

                <div className="mt-4 flex gap-3">
                  <Link
                    to="/contact"
                    className="rounded-full px-5 py-3 font-medium"
                    style={{
                      background: `linear-gradient(90deg, ${GOLD}, #ffd88a)`,
                      boxShadow: "0 10px 30px rgba(184,142,47,0.18)",
                      color: "#111",
                    }}
                  >
                    Bắt đầu tư vấn
                  </Link>
                  <Link
                    to="/products"
                    className="rounded-full px-5 py-3 font-medium bg-white/10 hover:bg-white/20 transition"
                    style={{ border: "1px solid rgba(255,255,255,0.12)", color: "white" }}
                  >
                    Khám phá sản phẩm
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SỨ MỆNH + HIGHLIGHTS */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 grid md:grid-cols-2 gap-10 items-center">
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-semibold">Sứ mệnh</h2>
          <p className="text-gray-700 leading-relaxed text-lg">
            Chúng tôi tin rằng nội thất tốt có thể thay đổi chất lượng sống. Từ thiết kế đến sản xuất, mọi chi tiết đều được
            chăm chút để tạo nên sản phẩm đẹp, bền và an toàn – đồng thời tối ưu chi phí để nhiều người có thể tiếp cận.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Natura Home theo đuổi triết lý tối giản (minimal), thiên nhiên (natural) và công năng (functional) – hài hoà cùng
            nhịp sống đô thị Việt Nam.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {HIGHLIGHTS.map((h) => (
            <div
              key={h.k}
              className="rounded-2xl border bg-white p-6 transform hover:-translate-y-1 transition shadow-sm"
              style={{ borderColor: GOLD_LIGHT }}
            >
              <div className="text-3xl font-semibold" style={{ color: GOLD }}>{h.v}</div>
              <div className="text-gray-600 mt-1">{h.k}</div>
            </div>
          ))}
        </div>
      </section>

      {/* GIÁ TRỊ CỐT LÕI */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        <h2 className="text-3xl md:text-4xl font-semibold">Giá trị cốt lõi</h2>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {VALUES.map((v, i) => (
            <article
              key={i}
              className="rounded-3xl border bg-white p-6 hover:shadow-lg transition transform hover:-translate-y-1"
              style={{ borderColor: GOLD_LIGHT }}
            >
              <div className="text-4xl">{v.icon}</div>
              <h3 className="mt-4 font-semibold text-xl">{v.title}</h3>
              <p className="mt-2 text-gray-600">{v.desc}</p>
            </article>
          ))}
        </div>
      </section>

      {/* QUY TRÌNH */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        <div className="rounded-3xl border bg-white p-8" style={{ borderColor: GOLD_LIGHT }}>
          <h2 className="text-3xl md:text-4xl font-semibold">Quy trình làm việc</h2>
          <div className="mt-6 grid md:grid-cols-4 gap-6">
            {STEPS.map((s) => (
              <div
                key={s.n}
                className="rounded-2xl border bg-white p-6 flex flex-col gap-3 hover:shadow-md transition transform hover:-translate-y-1"
                style={{ borderColor: "rgba(16,16,16,0.04)" }}
              >
                <div className="inline-flex items-center justify-center rounded-lg w-12 h-12 bg-gradient-to-br from-amber-50 to-amber-100 text-[14px] font-mono text-[14px]" style={{ color: GOLD }}>
                  {s.n}
                </div>
                <div className="font-semibold text-lg">{s.title}</div>
                <p className="text-gray-600 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VẬT LIỆU & CAM KẾT */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 grid md:grid-cols-2 gap-10">
        <div className="rounded-3xl border bg-white p-6 hover:shadow-md transition" style={{ borderColor: GOLD_LIGHT }}>
          <h3 className="text-2xl font-semibold">Vật liệu & hoàn thiện</h3>
          <ul className="list-disc pl-5 mt-3 text-gray-700 space-y-1">
            <li>Gỗ công nghiệp tiêu chuẩn CARB-P2, MDF chống ẩm, veneer tự nhiên.</li>
            <li>Phụ kiện bản lề, ray giảm chấn từ các thương hiệu uy tín.</li>
            <li>Sơn UV/PU ít mùi, an toàn sức khoẻ người dùng.</li>
          </ul>
        </div>
        <div className="rounded-3xl border bg-white p-6 hover:shadow-md transition" style={{ borderColor: GOLD_LIGHT }}>
          <h3 className="text-2xl font-semibold">Cam kết bền vững</h3>
          <p className="text-gray-700 mt-2">
            Tối ưu cắt gỗ – giảm lãng phí; ưu tiên vật liệu tái tạo; đóng gói hạn chế nhựa; tái chế pallet. Chúng tôi nỗ lực
            giảm dấu chân carbon trong suốt vòng đời sản phẩm.
          </p>
        </div>
      </section>

      {/* BẢO HÀNH – GIAO HÀNG */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 grid md:grid-cols-3 gap-6">
        <div className="rounded-3xl border bg-white p-6 hover:shadow-md transition" style={{ borderColor: GOLD_LIGHT }}>
          <h3 className="text-2xl font-semibold">Bảo hành 5 năm</h3>
          <p className="text-gray-700 mt-2">
            Hỗ trợ kỹ thuật trọn vòng đời sản phẩm. Đổi trả trong 7 ngày nếu lỗi nhà sản xuất.
          </p>
        </div>
        <div className="rounded-3xl border bg-white p-6 hover:shadow-md transition" style={{ borderColor: GOLD_LIGHT }}>
          <h3 className="text-2xl font-semibold">Giao nhanh 24–48h</h3>
          <p className="text-gray-700 mt-2">
            Đội ngũ lắp đặt chuyên nghiệp, bảo vệ sàn & vệ sinh sau thi công.
          </p>
        </div>
        <div className="rounded-3xl border bg-white p-6 hover:shadow-md transition" style={{ borderColor: GOLD_LIGHT }}>
          <h3 className="text-2xl font-semibold">Tư vấn vật liệu</h3>
          <p className="text-gray-700 mt-2">
            Mẫu gỗ/sơn thực tế, bảng phối màu phù hợp ánh sáng & công năng không gian.
          </p>
        </div>
      </section>

      {/* CTA LIÊN HỆ */}
      <section className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        <div
          className="rounded-3xl border p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-6"
          style={{
            background: "linear-gradient(90deg, rgba(255,250,240,1), rgba(255,247,232,1))",
            borderColor: GOLD_LIGHT,
            boxShadow: "0 14px 40px rgba(16,24,40,0.06)",
          }}
        >
          <div>
            <h3 className="text-2xl md:text-3xl font-semibold">Bắt đầu dự án nội thất của bạn</h3>
            <p className="text-gray-700 mt-2">Đặt lịch tư vấn miễn phí – nhận đề xuất phù hợp ngân sách.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/products"
              className="rounded-xl px-5 py-3 border hover:bg-black hover:text-white transition"
              style={{ borderColor: "rgba(0,0,0,0.06)" }}
            >
              Khám phá sản phẩm
            </Link>
            <Link
              to="/contact"
              className="rounded-xl px-5 py-3 text-white transition"
              style={{ background: `linear-gradient(90deg, ${GOLD}, #ffd88a)`, boxShadow: "0 10px 30px rgba(184,142,47,0.16)" }}
            >
              Liên hệ chúng tôi
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
