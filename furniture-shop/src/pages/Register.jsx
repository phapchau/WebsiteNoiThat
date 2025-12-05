// import { useState } from "react";
// import { Link, useNavigate, useSearchParams } from "react-router-dom";
// import { useAuth } from "../context/AuthContext.jsx";

// export default function Register() {
//   const nav = useNavigate();
//   const [sp] = useSearchParams();
//   const redirect = sp.get("redirect") || "/";
//   const { register, loading, error, setError } = useAuth();
//   const [form, setForm] = useState({ name: "", email: "", password: "" });

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await register(form);
//       nav(redirect, { replace: true });
//     } catch {
//       /* error đã set trong context */
//     }
//   };

//   return (
//     <section className="max-w-md mx-auto px-4 py-10">
//       <h1 className="text-2xl font-semibold">Đăng ký</h1>
//       <form className="mt-6 space-y-4" onSubmit={onSubmit} onChange={()=>error && setError("")}>
//         {error && <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">{error}</div>}
//         <div>
//           <label className="block text-sm font-medium">Họ tên</label>
//           <input
//             className="mt-1 w-full rounded-xl border px-3 py-2 outline-none"
//             value={form.name}
//             onChange={(e)=>setForm(f=>({...f, name: e.target.value}))}
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Email</label>
//           <input
//             type="email"
//             className="mt-1 w-full rounded-xl border px-3 py-2 outline-none"
//             value={form.email}
//             onChange={(e)=>setForm(f=>({...f, email: e.target.value}))}
//             required
//           />
//         </div>
//         <div>
//           <label className="block text-sm font-medium">Mật khẩu</label>
//           <input
//             type="password"
//             className="mt-1 w-full rounded-xl border px-3 py-2 outline-none"
//             value={form.password}
//             onChange={(e)=>setForm(f=>({...f, password: e.target.value}))}
//             required
//             minLength={6}
//           />
//         </div>
//         <button
//           disabled={loading}
//           className="w-full rounded-xl border px-4 py-2 hover:bg-black hover:text-white transition disabled:opacity-60"
//         >
//           {loading ? "Đang đăng ký..." : "Tạo tài khoản"}
//         </button>
//         <p className="text-sm text-gray-600">
//           Đã có tài khoản?{" "}
//           <Link className="text-black underline" to={`/login?redirect=${encodeURIComponent(redirect)}`}>
//             Đăng nhập
//           </Link>
//         </p>
//       </form>
//     </section>
//   );
// }//




// src/pages/Register.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Register() {
  const nav = useNavigate();
  const [sp] = useSearchParams();
  const redirect = sp.get("redirect") || "/";

  const { register, loading, error, setError, user, hydrated } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [showPw2, setShowPw2] = useState(false);
  const [agree, setAgree] = useState(true);

  // Nếu đã đăng nhập thì tự chuyển hướng
  useEffect(() => {
    if (!hydrated || !user) return;
    nav(redirect, { replace: true });
  }, [hydrated, user, nav, redirect]);

  function validate() {
    if (!form.name.trim()) return "Vui lòng nhập họ tên";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Email chưa hợp lệ";
    if ((form.password || "").length < 6) return "Mật khẩu tối thiểu 6 ký tự";
    if (form.password !== form.confirm) return "Xác nhận mật khẩu chưa khớp";
    if (!agree) return "Vui lòng đồng ý điều khoản sử dụng";
    return "";
  }

  async function onSubmit(e) {
    e.preventDefault();
    const msg = validate();
    if (msg) {
      setError?.(msg);
      return;
    }
    try {
      await register({ name: form.name.trim(), email: form.email.trim(), password: form.password });
      nav(redirect, { replace: true });
    } catch {
      /* error đã được set trong AuthContext */
    }
  }

  const pwScore = (() => {
    const s = form.password;
    let score = 0;
    if (s.length >= 6) score++;
    if (/[A-Z]/.test(s)) score++;
    if (/\d/.test(s)) score++;
    if (/[^A-Za-z0-9]/.test(s)) score++;
    return score; // 0..4
  })();

  return (
    <section className="min-h-[80vh] grid place-items-center px-4 py-10">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 rounded-3xl border bg-white shadow-sm overflow-hidden">

        {/* Ảnh hero (ẩn trên mobile) */}
        <div className="hidden md:block relative">
          <img
            src="/anh3.jpg"
            alt="Natura Home"
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => (e.currentTarget.src = "/anh1.jpg")}
          />
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute bottom-6 left-6 right-6 text-white drop-shadow">
            <div className="text-3xl font-semibold">Tạo tài khoản mới ✨</div>
            <p className="mt-2 opacity-90">Mua sắm nhanh hơn và theo dõi đơn hàng tiện lợi.</p>
          </div>
        </div>

        {/* Form */}
        <div className="p-7 md:p-10">
          <div className="mb-7">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-black text-white grid place-items-center font-semibold">
                NH
              </div>
              <div className="text-xl font-semibold">Natura Home</div>
            </div>
            <h1 className="mt-6 text-2xl md:text-3xl font-semibold">Đăng ký</h1>
            <p className="mt-1 text-gray-600">
              Đã có tài khoản?{" "}
              <Link
                className="underline hover:opacity-80"
                to={`/login?redirect=${encodeURIComponent(redirect)}`}
              >
                Đăng nhập
              </Link>
            </p>
          </div>

          <form
            className="space-y-4"
            onSubmit={onSubmit}
            onChange={() => error && setError?.("")}
          >
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">
                {error}
              </div>
            )}

            {/* Họ tên */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Họ tên</label>
              <input
                className="mt-1 w-full rounded-xl border px-4 py-2.5 outline-none focus:ring-2 focus:ring-black/10"
                placeholder="Nguyễn Văn A"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="mt-1 w-full rounded-xl border px-4 py-2.5 outline-none focus:ring-2 focus:ring-black/10"
                placeholder="you@example.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                required
              />
            </div>

            {/* Mật khẩu */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
              <div className="mt-1 relative">
                <input
                  type={showPw ? "text" : "password"}
                  className="w-full rounded-xl border px-4 py-2.5 pr-12 outline-none focus:ring-2 focus:ring-black/10"
                  placeholder="••••••••"
                  minLength={6}
                  value={form.password}
                  onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                  onClick={() => setShowPw((v) => !v)}
                  aria-label={showPw ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPw ? "🙈" : "👁️"}
                </button>
              </div>

              {/* Thanh gợi ý độ mạnh (đơn giản) */}
              {!!form.password && (
                <div className="mt-2 h-1.5 rounded-full bg-gray-100 overflow-hidden">
                  <div
                    className={[
                      "h-full transition-all",
                      pwScore <= 1 ? "bg-red-400 w-1/4" : "",
                      pwScore === 2 ? "bg-yellow-400 w-2/4" : "",
                      pwScore === 3 ? "bg-emerald-400 w-3/4" : "",
                      pwScore >= 4 ? "bg-emerald-500 w-full" : "",
                    ].join(" ")}
                  />
                </div>
              )}
            </div>

            {/* Xác nhận mật khẩu */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu</label>
              <div className="mt-1 relative">
                <input
                  type={showPw2 ? "text" : "password"}
                  className="w-full rounded-xl border px-4 py-2.5 pr-12 outline-none focus:ring-2 focus:ring-black/10"
                  placeholder="••••••••"
                  minLength={6}
                  value={form.confirm}
                  onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-black"
                  onClick={() => setShowPw2((v) => !v)}
                  aria-label={showPw2 ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {showPw2 ? "🙈" : "👁️"}
                </button>
              </div>
              {!!form.confirm && form.confirm !== form.password && (
                <div className="mt-1 text-xs text-red-600">Mật khẩu nhập lại chưa khớp</div>
              )}
            </div>

            {/* Điều khoản */}
            <label className="inline-flex items-center gap-2 text-sm text-gray-700 select-none">
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
              <span>
                Tôi đồng ý với{" "}
                <button
                  type="button"
                  className="underline hover:opacity-80"
                  onClick={() => alert("Trang điều khoản sẽ cập nhật sau.")}
                >
                  Điều khoản sử dụng
                </button>
              </span>
            </label>

            {/* Submit */}
            <button
              disabled={loading}
              className="w-full rounded-xl bg-black text-white px-4 py-3 font-medium hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Đang đăng ký..." : "Tạo tài khoản"}
            </button>

            <p className="text-xs text-gray-500">
              Bạn có thể thay đổi thông tin cá nhân sau khi đăng nhập.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

