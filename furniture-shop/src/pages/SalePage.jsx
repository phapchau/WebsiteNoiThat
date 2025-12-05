import { useEffect, useState } from "react";
import axiosClient from "../services/axiosClient";
import { Link } from "react-router-dom";
import { vnd } from "../utils/format";

export default function SalePage() {
  const [items, setItems] = useState([]);
  const [endTime] = useState(() => {
    // Flash sale 3 tiếng
    const t = new Date();
    t.setHours(t.getHours() + 3);
    return t;
  });
  const [timeLeft, setTimeLeft] = useState("");

  // COUNTDOWN
  useEffect(() => {
    const tick = () => {
      const now = new Date();
      const diff = endTime - now;

      if (diff <= 0) {
        setTimeLeft("00:00:00");
        return;
      }

      const h = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, "0");
      const m = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, "0");
      const s = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");

      setTimeLeft(`${h}:${m}:${s}`);
    };

    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  // LOAD FLASH SALE PRODUCTS
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axiosClient.get("/api/products/sale");
        setItems(data || []);
      } catch (e) {
        console.error("SALE LOAD ERR", e);
      }
    })();
  }, []);

  return (
    <section className="max-w-[1280px] mx-auto px-4 py-8">
      {/* Banner Flash Sale */}
      <div className="rounded-2xl p-6 bg-gradient-to-r from-[#ff4d4f] via-[#ff7f50] to-[#ffa940] text-white shadow-lg">
        <h1 className="text-4xl font-extrabold tracking-wide drop-shadow">
          ⚡ FLASH SALE TOÀN BỘ NỘI THẤT
        </h1>
        <p className="mt-2 text-lg opacity-80">
          Nhanh tay săn deal – số lượng có hạn!
        </p>

        {/* Timer */}
        <div className="mt-4 flex items-center gap-3">
          <span className="text-xl font-semibold">Kết thúc trong:</span>
          <span className="px-4 py-2 bg-black/30 text-white text-2xl font-bold rounded-lg shadow">
            {timeLeft}
          </span>
        </div>
      </div>

      {/* Product GRID */}
      <div className="mt-10 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((p) => (
          <Link
            key={p._id}
            to={`/products/${p.slug}`}
            className="group block rounded-xl border bg-white overflow-hidden shadow hover:shadow-xl hover:-translate-y-1 transition"
          >
            {/* Image */}
            <div className="relative">
              <img
                src={p.poster || p.images?.[0]}
                alt={p.name}
                className="w-full h-48 object-cover"
              />

              <span className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 text-sm font-bold rounded-lg">
                Flash Sale
              </span>

              {p.salePercent > 0 && (
                <span className="absolute top-2 right-2 bg-yellow-400 text-red-700 px-3 py-1 text-sm font-bold rounded-lg">
                  -{p.salePercent}%
                </span>
              )}
            </div>

            {/* Info */}
            <div className="p-3">
              <div className="font-semibold text-gray-900 group-hover:text-[#B88E2F] line-clamp-2 h-12">
                {p.name}
              </div>

              {/* Price */}
              <div className="mt-2">
                <div className="text-xl text-red-600 font-extrabold">
                  {vnd(p.salePrice)}
                </div>
                <div className="text-gray-400 text-sm line-through">
                  {vnd(p.oldPrice)}
                </div>
              </div>

              {/* SOLD PROGRESS */}
              <div className="mt-3">
                <div className="relative w-full bg-gray-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500 transition-all"
                    style={{ width: `${Math.min(p.soldPercent || 35, 100)}%` }}
                  ></div>
                </div>
                <div className="text-xs text-red-600 font-semibold mt-1">
                  Đã bán {p.soldPercent || 35}%
                </div>
              </div>

              {/* BUY BUTTON */}
              <button className="w-full mt-4 py-2 bg-[#B88E2F] text-white font-bold rounded-lg group-hover:bg-[#9b7424] transition">
                Mua ngay
              </button>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
