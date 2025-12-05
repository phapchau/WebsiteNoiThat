




// // src/components/Footer.jsx
// import { Link } from "react-router-dom";
// import { useState } from "react";

// export default function Footer() {
//   const [email, setEmail] = useState("");
//   const year = new Date().getFullYear();

//   function onSubscribe(e) {
//     e.preventDefault();
//     if (!/^\S+@\S+\.\S+$/.test(email)) {
//       alert("Vui lòng nhập email hợp lệ");
//       return;
//     }
//     // TODO: gọi API subscribe nếu có
//     alert("Cảm ơn bạn! Chúng tôi sẽ gửi những tin tốt nhất đến email của bạn.");
//     setEmail("");
//   }

//   return (
//     <footer className="border-t bg-white mt-24">
//       {/* Top CTA */}
//       <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
//         <div className="rounded-3xl border bg-gradient-to-r from-orange-50 to-amber-50 p-6 md:p-8 -mt-10 mb-10 shadow-sm">
//           <div className="flex flex-col md:flex-row items-center justify-between gap-4">
//             <div>
//               <h3 className="text-xl md:text-2xl font-semibold">Đăng ký nhận tin mới</h3>
//               <p className="text-gray-700 mt-1">
//                 Ưu đãi độc quyền, bộ sưu tập mới và mẹo bài trí nội thất mỗi tháng.
//               </p>
//             </div>
//             <form onSubmit={onSubscribe} className="flex w-full md:w-auto gap-2">
//               <input
//                 type="email"
//                 className="flex-1 md:w-80 rounded-xl border px-4 py-2 outline-none"
//                 placeholder="you@example.com"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//               />
//               <button className="rounded-xl bg-black text-white px-5 py-2 hover:opacity-90">
//                 Đăng ký
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>

//       {/* Main grid */}
//       <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 pb-10">
//         <div className="grid md:grid-cols-4 gap-8 pb-8">
//           {/* Brand */}
//           <div className="space-y-3">
//             <div className="flex items-center gap-3">
//               <div className="h-10 w-10 rounded-xl bg-black text-white grid place-items-center font-semibold">
//                 NH
//               </div>
//               <div className="text-xl font-semibold">Natura Home</div>
//             </div>
//             <p className="text-gray-600">
//               Kiến tạo không gian sống ấm áp – tối giản – bền vững. Chất lượng chuẩn mực, giá trị thực.
//             </p>
//             <div className="flex items-center gap-3 pt-2">
//               <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:opacity-80" aria-label="Facebook">
//                 {/* FB icon */}
//                 <svg width="24" height="24" fill="currentColor" className="text-gray-700"><path d="M13.5 9H15V6h-1.5C11.57 6 10 7.57 10 9.5V11H8v3h2v7h3v-7h2.1l.4-3H13v-1.5c0-.28.22-.5.5-.5Z"/></svg>
//               </a>
//               <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:opacity-80" aria-label="Instagram">
//                 {/* IG icon */}
//                 <svg width="24" height="24" fill="currentColor" className="text-gray-700"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5a5.5 5.5 0 1 1 0 11.001A5.5 5.5 0 0 1 12 7.5Zm0 2a3.5 3.5 0 1 0 0 7.001 3.5 3.5 0 0 0 0-7Zm5.25-2.75a1 1 0 1 1 0 2.001 1 1 0 0 1 0-2Z"/></svg>
//               </a>
//               <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="hover:opacity-80" aria-label="TikTok">
//                 {/* TikTok icon */}
//                 <svg width="24" height="24" fill="currentColor" className="text-gray-700"><path d="M16 2c.6 2.3 2 4.2 4 4.8v3a8.3 8.3 0 0 1-4-1.1V15a6 6 0 1 1-6-6c.3 0 .7 0 1 .1V12a3 3 0 1 0 3 3V2h2Z"/></svg>
//               </a>
//             </div>
//           </div>

//           {/* Hỗ trợ */}
//           <div>
//             <h4 className="font-semibold text-lg mb-3">Hỗ trợ</h4>
//             <ul className="space-y-2 text-gray-700">
//               <li><Link to="/contact" className="hover:underline">Liên hệ</Link></li>
//               <li><Link to="/orders/me" className="hover:underline">Theo dõi đơn hàng</Link></li>
//               <li><Link to="/faq" className="hover:underline">Câu hỏi thường gặp</Link></li>
//               <li><Link to="/warranty" className="hover:underline">Bảo hành & bảo trì</Link></li>
//             </ul>
//           </div>

//           {/* Chính sách */}
//           <div>
//             <h4 className="font-semibold text-lg mb-3">Chính sách</h4>
//             <ul className="space-y-2 text-gray-700">
//               <li><Link to="/policies/shipping" className="hover:underline">Vận chuyển</Link></li>
//               <li><Link to="/policies/return" className="hover:underline">Đổi trả 7 ngày</Link></li>
//               <li><Link to="/policies/payment" className="hover:underline">Thanh toán</Link></li>
//               <li><Link to="/policies/privacy" className="hover:underline">Bảo mật</Link></li>
//             </ul>
//           </div>

//           {/* Liên hệ */}
//           <div>
//             <h4 className="font-semibold text-lg mb-3">Liên hệ</h4>
//             <ul className="space-y-2 text-gray-700">
//               <li><span className="text-gray-500">Hotline:</span> 0900 000 000</li>
//               <li><span className="text-gray-500">Email:</span> hello@natura.home</li>
//               <li>
//                 <span className="text-gray-500">Địa chỉ:</span> 123 Nguyễn Trãi, Q.1, TP.HCM
//               </li>
//               <li>
//                 <Link to="/about" className="underline">Về chúng tôi</Link>
//               </li>
//             </ul>
//           </div>
//         </div>

//         {/* Payment + security row */}
//         <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t">
//           <div className="text-sm text-gray-600">
//             © {year} Natura Home — All rights reserved.
//           </div>

//           <div className="flex items-center gap-2 text-xs text-gray-600">
//             <span className="px-3 py-1 rounded border bg-white">COD</span>
//             <span className="px-3 py-1 rounded border bg-white">VietQR</span>
//             <span className="px-3 py-1 rounded border bg-white">VNPay</span>
//             <span className="px-3 py-1 rounded border bg-white">Visa</span>
//             <span className="px-3 py-1 rounded border bg-white">Mastercard</span>
//           </div>
//         </div>
//       </div>
//     </footer>
//   );
// }//13/11










// src/components/Footer.jsx
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const year = new Date().getFullYear();

  function onSubscribe(e) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert("Vui lòng nhập email hợp lệ");
      return;
    }
    // TODO: gọi API subscribe nếu có
    alert("Cảm ơn bạn! Chúng tôi sẽ gửi những tin tốt nhất đến email của bạn.");
    setEmail("");
  }

  const GOLD = "#B88E2F";
  const GOLD_LIGHT = "rgba(184,142,47,0.08)";

  return (
    <footer className="border-t bg-white mt-24">
      {/* Top CTA */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16">
        <div
          className="rounded-3xl border p-6 md:p-8 -mt-10 mb-10 shadow-md"
          style={{
            background: "linear-gradient(90deg, rgba(255,250,240,1), rgba(255,247,232,1))",
            borderColor: "rgba(184,142,47,0.12)",
          }}
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl md:text-2xl font-semibold" style={{ color: "#222" }}>
                Đăng ký nhận tin mới
              </h3>
              <p className="text-gray-700 mt-1">
                Ưu đãi độc quyền, bộ sưu tập mới và mẹo bài trí nội thất mỗi tháng.
              </p>
            </div>

            <form onSubmit={onSubscribe} className="flex w-full md:w-auto gap-2 items-center">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  background: "#fff",
                  borderRadius: 12,
                  boxShadow: "0 8px 24px rgba(11,12,16,0.04)",
                  border: "1px solid rgba(0,0,0,0.04)",
                  padding: "6px 8px",
                }}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ marginRight: 8, color: GOLD }}
                >
                  <path d="M3 8.5v7A3.5 3.5 0 006.5 19h11A3.5 3.5 0 0021 15.5v-7" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M21 8.5l-9 6-9-6" stroke={GOLD} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <input
                  type="email"
                  className="flex-1 md:w-80 rounded-lg outline-none px-3 py-2 text-sm"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-label="Email đăng ký"
                  style={{ border: "none", background: "transparent" }}
                />
              </div>

              <button
                className="rounded-xl text-white px-5 py-2 hover:opacity-95 transition"
                style={{
                  background: GOLD,
                  boxShadow: `0 10px 30px ${GOLD_LIGHT}`,
                  border: "1px solid rgba(0,0,0,0.04)",
                }}
                type="submit"
              >
                Đăng ký
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 lg:px-16 pb-10">
        <div className="grid md:grid-cols-4 gap-8 pb-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div
                className="h-10 w-10 rounded-xl grid place-items-center font-semibold text-white"
                style={{
                  background: GOLD,
                  boxShadow: `${GOLD_LIGHT}`,
                }}
              >
                NH
              </div>
              <div className="text-xl font-semibold">Natura Home</div>
            </div>
            <p className="text-gray-600">
              Kiến tạo không gian sống ấm áp – tối giản – bền vững. Chất lượng chuẩn mực, giá trị thực.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="hover:opacity-80" aria-label="Facebook">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-gray-700"><path d="M13.5 9H15V6h-1.5C11.57 6 10 7.57 10 9.5V11H8v3h2v7h3v-7h2.1l.4-3H13v-1.5c0-.28.22-.5.5-.5Z"/></svg>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:opacity-80" aria-label="Instagram">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-gray-700"><path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5Zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7Zm5 3.5a5.5 5.5 0 1 1 0 11.001A5.5 5.5 0 0 1 12 7.5Zm0 2a3.5 3.5 0 1 0 0 7.001 3.5 3.5 0 0 0 0-7Zm5.25-2.75a1 1 0 1 1 0 2.001 1 1 0 0 1 0-2Z"/></svg>
              </a>
              <a href="https://tiktok.com" target="_blank" rel="noreferrer" className="hover:opacity-80" aria-label="TikTok">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="text-gray-700"><path d="M16 2c.6 2.3 2 4.2 4 4.8v3a8.3 8.3 0 0 1-4-1.1V15a6 6 0 1 1-6-6c.3 0 .7 0 1 .1V12a3 3 0 1 0 3 3V2h2Z"/></svg>
              </a>
            </div>
          </div>

          {/* Hỗ trợ */}
          <div>
            <h4 className="font-semibold text-lg mb-3">Hỗ trợ</h4>
            <ul className="space-y-2 text-gray-700">
              <li><Link to="/contact" className="hover:underline">Liên hệ</Link></li>
              <li><Link to="/orders/me" className="hover:underline">Theo dõi đơn hàng</Link></li>
              <li><Link to="/faq" className="hover:underline">Câu hỏi thường gặp</Link></li>
              <li><Link to="/warranty" className="hover:underline">Bảo hành & bảo trì</Link></li>
            </ul>
          </div>

          {/* Chính sách */}
          <div>
            <h4 className="font-semibold text-lg mb-3">Chính sách</h4>
            <ul className="space-y-2 text-gray-700">
              <li><Link to="/policies/shipping" className="hover:underline">Vận chuyển</Link></li>
              <li><Link to="/policies/return" className="hover:underline">Đổi trả 7 ngày</Link></li>
              <li><Link to="/policies/payment" className="hover:underline">Thanh toán</Link></li>
              <li><Link to="/policies/privacy" className="hover:underline">Bảo mật</Link></li>
            </ul>
          </div>

          {/* Liên hệ */}
          <div>
            <h4 className="font-semibold text-lg mb-3">Liên hệ</h4>
            <ul className="space-y-2 text-gray-700">
              <li><span className="text-gray-500">Hotline:</span> 0900 000 000</li>
              <li><span className="text-gray-500">Email:</span> hello@natura.home</li>
              <li>
                <span className="text-gray-500">Địa chỉ:</span> 123 Nguyễn Trãi, Q.1, TP.HCM
              </li>
              <li>
                <Link to="/about" className="underline">Về chúng tôi</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Payment + security row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6 border-t">
          <div className="text-sm text-gray-600">
            © {year} Natura Home — All rights reserved.
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span className="px-3 py-1 rounded border bg-white">COD</span>
            <span className="px-3 py-1 rounded border bg-white">VietQR</span>
            <span className="px-3 py-1 rounded border bg-white">VNPay</span>
            <span className="px-3 py-1 rounded border bg-white">Visa</span>
            <span className="px-3 py-1 rounded border bg-white">Mastercard</span>
          </div>
        </div>
      </div>
    </footer>
  );
}


