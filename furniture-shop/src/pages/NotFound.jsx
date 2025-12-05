// src/pages/NotFound.jsx
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <section className="text-center py-16">
      <h1 className="text-3xl font-semibold">Không tìm thấy trang</h1>
      <p className="text-gray-600 mt-2">Đường dẫn bạn truy cập không tồn tại.</p>
      <Link
        to="/"
        className="inline-block mt-6 rounded-xl border px-4 py-2 hover:bg-black hover:text-white transition"
      >
        Về trang chủ
      </Link>
    </section>
  );
}
