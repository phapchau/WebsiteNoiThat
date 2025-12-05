import { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../services/axiosClient";
import { vnd } from "../utils/format";

// Các khung giờ hiển thị giống Shopee
const SLOTS = [
  { label: "09:00", start: 9, end: 11 },
  { label: "12:00", start: 12, end: 14 },
  { label: "15:00", start: 15, end: 17 },
  { label: "20:00", start: 20, end: 22 },
];

export default function FlashSalePro() {
  const [products, setProducts] = useState([]);
  const [session, setSession] = useState(null); // { label, start, end } nếu BE có trả
  const [timeLeft, setTimeLeft] = useState("");
  const [activeSlot, setActiveSlot] = useState("");

  // Chọn slot hiện tại dựa vào giờ hệ thống (fallback nếu BE không gửi session)
  function pickCurrentSlot() {
    const h = new Date().getHours();
    const found =
      SLOTS.find((s) => h >= s.start && h < s.end) ||
      SLOTS[0];
    return found.label;
  }

  // LOAD FLASH SALE
  useEffect(() => {
    (async () => {
      try {
        const res = await axiosClient.get("/api/products/flash-sale");

        const rawProducts = res.data?.products || [];
        const mapped = rawProducts.map((p) => {
          // Giá gốc
          const oldPrice =
            Number(p.oldPrice) ||
            Number(p.comparePrice) ||
            Number(p.price) ||
            0;

          // Giá sale
          let salePrice = 0;
          if (p.salePrice != null) {
            salePrice = Number(p.salePrice);
          } else if (oldPrice && p.salePercent) {
            salePrice = Math.round(
              (oldPrice * (100 - Number(p.salePercent))) / 100
            );
          } else {
            // Nếu không có gì, coi như chưa giảm
            salePrice = oldPrice;
          }

          // % giảm
          let salePercent = 0;
          if (p.salePercent != null) {
            salePercent = Number(p.salePercent);
          } else if (oldPrice && salePrice && salePrice < oldPrice) {
            salePercent = Math.round(
              ((oldPrice - salePrice) / oldPrice) * 100
            );
          }

          // Đã bán
          const soldPercent =
            p.soldPercent != null
              ? Number(p.soldPercent)
              : Math.floor(Math.random() * 60 + 20); // random 20–80%

          return {
            ...p,
            oldPrice,
            salePrice,
            salePercent,
            soldPercent,
          };
        });

        setProducts(mapped);

        const svSession = res.data?.session || null;
        setSession(svSession);

        // Active slot: ưu tiên từ BE, nếu không thì tự tính
        if (svSession?.label) {
          setActiveSlot(svSession.label);
        } else {
          setActiveSlot(pickCurrentSlot());
        }
      } catch (e) {
        console.error("FLASH SALE ERROR:", e);
      }
    })();
  }, []);

  // COUNTDOWN
  useEffect(() => {
    // Ưu tiên end từ BE (session.end = hour)
    let endDate = null;

    if (session?.end != null) {
      endDate = new Date();
      endDate.setHours(session.end, 0, 0, 0);
    } else if (activeSlot) {
      // Nếu không có từ BE, dựa theo SLOTS
      const slot = SLOTS.find((s) => s.label === activeSlot);
      if (slot) {
        endDate = new Date();
        endDate.setHours(slot.end, 0, 0, 0);
      }
    }

    if (!endDate) return;

    const timer = setInterval(() => {
      const diff = endDate - new Date();
      if (diff <= 0) {
        setTimeLeft("00:00:00");
        return;
      }
      const h = String(Math.floor(diff / 3600000)).padStart(2, "0");
      const m = String(Math.floor((diff % 3600000) / 60000)).padStart(2, "0");
      const s = String(Math.floor((diff % 60000) / 1000)).padStart(2, "0");
      setTimeLeft(`${h}:${m}:${s}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [session, activeSlot]);

  // Trong tương lai nếu BE trả phân chia theo slot,
  // có thể filter theo slot. Hiện tại dùng chung 1 list.
  const visibleProducts = useMemo(() => products, [products]);

  return (
    <section className="max-w-[1320px] mx-auto px-4 py-8">
      {/* Thanh slot khung giờ kiểu Shopee */}
      <div className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-2xl md:text-3xl font-extrabold text-red-600 flex items-center gap-2">
          ⚡ FLASH SALE
          {session?.label && (
            <span className="hidden md:inline-block text-base font-semibold text-gray-700">
              Khung giờ <span className="text-red-600">{session.label}</span>
            </span>
          )}
        </h1>

        {timeLeft && (
          <div className="flex items-center gap-2 text-sm md:text-base">
            <span className="font-medium text-gray-700">Kết thúc trong</span>
            <span className="bg-black text-white px-3 py-1 rounded-lg font-mono text-sm md:text-base">
              {timeLeft}
            </span>
          </div>
        )}
      </div>

      <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
        {SLOTS.map((slot) => {
          const active = slot.label === activeSlot;
          return (
            <button
              key={slot.label}
              onClick={() => setActiveSlot(slot.label)}
              className={`min-w-[80px] px-4 py-2 rounded-xl text-center text-sm font-semibold border transition ${
                active
                  ? "bg-red-600 text-white border-red-600 shadow-md"
                  : "bg-white text-red-600 border-red-200 hover:bg-red-50"
              }`}
            >
              <div>{slot.label}</div>
              <div className="text-[11px] font-normal">
                {active ? "Đang diễn ra" : "Sắp diễn ra"}
              </div>
            </button>
          );
        })}
      </div>

      {/* Banner gradient to cho đẹp */}
      <div className="rounded-2xl p-5 md:p-6 bg-gradient-to-r from-red-500 via-orange-500 to-yellow-400 text-white shadow-xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 bg-black/15 px-3 py-1 rounded-full text-xs font-semibold mb-2">
            SIÊU DEAL NỘI THẤT • SỐ LƯỢNG CÓ HẠN
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold drop-shadow-sm">
            Giảm sốc đến 50% cho nội thất cao cấp
          </h2>
          <p className="mt-1 text-sm md:text-base opacity-90">
            Sofa, giường ngủ, tủ kệ… đồng loạt giảm giá trong khung giờ Flash
            Sale hôm nay!
          </p>
        </div>

        {timeLeft && (
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs uppercase tracking-wide">
              Thời gian còn lại
            </span>
            <div className="flex gap-1 text-lg md:text-2xl font-bold font-mono">
              {timeLeft.split(":").map((t, i) => (
                <div
                  key={i}
                  className="px-2 md:px-3 py-1 rounded-lg bg-black/20 shadow-inner"
                >
                  {t}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* GRID SẢN PHẨM */}
      {visibleProducts.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          Hiện chưa có sản phẩm Flash Sale trong khung giờ này.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 md:gap-6">
          {visibleProducts.map((p) => {
            const sold = Math.max(0, Math.min(100, Number(p.soldPercent) || 0));
            const isSoldOut = sold >= 100;

            return (
              <Link
                key={p._id}
                to={`/products/${p.slug}`}
                className="group block rounded-2xl border border-red-100 bg-white shadow-sm hover:-translate-y-1 hover:shadow-xl transition overflow-hidden"
              >
                {/* Ảnh + badge */}
                <div className="relative">
                  <img
                    src={p.poster}
                    alt={p.name}
                    className="w-full h-40 md:h-48 object-cover"
                  />

                  <div className="absolute top-2 left-2 bg-red-600 text-white px-3 py-1 text-[11px] font-bold rounded-full shadow">
                    FLASH SALE
                  </div>

                  {p.salePercent > 0 && (
                    <div className="absolute top-2 right-2 bg-yellow-300 text-red-700 px-2 py-1 text-[11px] font-bold rounded-full shadow">
                      -{p.salePercent}%
                    </div>
                  )}

                  {isSoldOut && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white font-bold text-lg">
                      HẾT HÀNG
                    </div>
                  )}
                </div>

                {/* Nội dung */}
                <div className="p-3 md:p-4">
                  <div className="font-medium text-sm md:text-[15px] line-clamp-2 min-h-[40px] group-hover:text-[#B88E2F]">
                    {p.name}
                  </div>

                  {/* Giá */}
                  <div className="mt-2">
                    <div className="text-red-600 font-bold text-lg md:text-xl">
                      {vnd(p.salePrice)}
                    </div>
                    {p.oldPrice > p.salePrice && (
                      <div className="text-gray-400 text-xs md:text-sm line-through">
                        {vnd(p.oldPrice)}
                      </div>
                    )}
                  </div>

                  {/* Thanh đã bán */}
                  <div className="mt-3">
                    <div className="relative bg-gray-200 h-2 rounded-full overflow-hidden">
                      <div
                        className="absolute top-0 left-0 h-2 bg-red-500 transition-all"
                        style={{ width: `${sold}%` }}
                      />
                    </div>
                    <div className="text-[11px] md:text-xs text-red-600 font-semibold mt-1">
                      Đã bán {sold}%
                    </div>
                  </div>

                  <button
                    className={`mt-3 md:mt-4 w-full font-semibold py-2 rounded-xl text-sm md:text-[15px] transition ${
                      isSoldOut
                        ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                        : "bg-[#B88E2F] hover:bg-[#9d7626] text-white"
                    }`}
                  >
                    {isSoldOut ? "Hết hàng" : "Mua ngay"}
                  </button>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
