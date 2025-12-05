



// // src/pages/Login.jsx
// import { useEffect, useState } from "react";
// import { Link, useNavigate, useSearchParams } from "react-router-dom";
// import { useAuth } from "../context/AuthContext.jsx";

// export default function Login() {
//   const nav = useNavigate();
//   const [sp] = useSearchParams();
//   const redirect = sp.get("redirect") || "/";

//   // lấy thêm user & hydrated để auto-redirect nếu đã đăng nhập
//   const { login, loading, error, setError, user, hydrated } = useAuth();
//   const [form, setForm] = useState({ email: "", password: "" });

//   const onSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const u = await login(form); // <— đảm bảo AuthContext.login trả về user
//       if (u?.role === "admin") nav("/admin", { replace: true });
//       else nav(redirect, { replace: true });
//     } catch {
//       /* error đã set trong context */
//     }
//   };

//   // Nếu đã đăng nhập mà vẫn vào /login → tự chuyển hướng
//   useEffect(() => {
//     if (!hydrated) return;
//     if (!user) return;
//     if (user.role === "admin") nav("/admin", { replace: true });
//     else nav(redirect, { replace: true });
//   }, [hydrated, user, nav, redirect]);

//   return (
//     <section className="max-w-md mx-auto px-4 py-10">
//       <h1 className="text-2xl font-semibold">Đăng nhập</h1>
//       <form
//         className="mt-6 space-y-4"
//         onSubmit={onSubmit}
//         onChange={() => error && setError("")}
//       >
//         {error && (
//           <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm">
//             {error}
//           </div>
//         )}

//         <div>
//           <label className="block text-sm font-medium">Email</label>
//           <input
//             type="email"
//             className="mt-1 w-full rounded-xl border px-3 py-2 outline-none"
//             value={form.email}
//             onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium">Mật khẩu</label>
//           <input
//             type="password"
//             className="mt-1 w-full rounded-xl border px-3 py-2 outline-none"
//             value={form.password}
//             onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
//             required
//           />
//         </div>

//         <button
//           disabled={loading}
//           className="w-full rounded-xl border px-4 py-2 hover:bg-black hover:text-white transition disabled:opacity-60"
//         >
//           {loading ? "Đang đăng nhập..." : "Đăng nhập"}
//         </button>

//         <p className="text-sm text-gray-600">
//           Chưa có tài khoản?{" "}
//           <Link
//             className="text-black underline"
//             to={`/register?redirect=${encodeURIComponent(redirect)}`}
//           >
//             Đăng ký
//           </Link>
//         </p>
//       </form>
//     </section>
//   );
// }///






// src/pages/Login.jsx
import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
  const nav = useNavigate();
  const [sp] = useSearchParams();
  const redirect = sp.get("redirect") || "/";

  const { login, loading, error, setError, user, hydrated } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);

  async function onSubmit(e) {
    e.preventDefault();
    try {
      const u = await login(form, { remember }); // nếu context bỏ qua option này cũng không sao
      if (u?.role === "admin") nav("/admin", { replace: true });
      else nav(redirect, { replace: true });
    } catch {
      /* error đã được set trong AuthContext */
    }
  }

  // Tự đẩy ra ngoài nếu đã đăng nhập
  useEffect(() => {
    if (!hydrated || !user) return;
    // if (user.role === "admin") nav("/admin", { replace: true });
    // else nav(redirect, { replace: true });
    if (user.role === "admin") {
  nav("/admin", { replace: true });
}
else if (user.role === "staff") {
  nav("/staff", { replace: true });
}
else {
  nav(redirect, { replace: true });
}

  }, [hydrated, user, nav, redirect]);

  return (
    <section className="min-h-[80vh] grid place-items-center px-4 py-10">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 rounded-3xl border bg-white shadow-sm overflow-hidden">

        {/* Ảnh/hero (ẩn mobile) */}
        <div className="hidden md:block relative">
          <img
            src="/anh2.jpg"
            alt="Natura Home"
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => (e.currentTarget.src = "/anh1.jpg")}
          />
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute bottom-6 left-6 right-6 text-white drop-shadow">
            <div className="text-3xl font-semibold">Chào mừng trở lại 👋</div>
            <p className="mt-2 opacity-90">
              Đăng nhập để tiếp tục mua sắm nội thất sang trọng, tinh tế.
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="p-7 md:p-10">
          {/* Logo + heading */}
          <div className="mb-7">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-black text-white grid place-items-center font-semibold">
                NH
              </div>
              <div className="text-xl font-semibold">Natura Home</div>
            </div>
            <h1 className="mt-6 text-2xl md:text-3xl font-semibold">
              Đăng nhập tài khoản
            </h1>
            <p className="mt-1 text-gray-600">
              Chưa có tài khoản?{" "}
              <Link
                className="underline hover:opacity-80"
                to={`/register?redirect=${encodeURIComponent(redirect)}`}
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>

          <form
            onSubmit={onSubmit}
            onChange={() => error && setError("")}
            className="space-y-4"
          >
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 text-red-700 px-3 py-2 text-sm">
                {error}
              </div>
            )}

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <div className="mt-1 relative">
                <input
                  type="email"
                  required
                  className="w-full rounded-xl border px-4 py-2.5 outline-none focus:ring-2 focus:ring-black/10"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">
                  Mật khẩu
                </label>
                {/* Link quên mật khẩu (tùy bạn xử lý sau) */}
                <button
                  type="button"
                  className="text-sm text-gray-500 hover:text-black"
                  onClick={() => alert("Tính năng 'Quên mật khẩu' sẽ cập nhật sau.")}
                >
                  Quên mật khẩu?
                </button>
              </div>
              <div className="mt-1 relative">
                <input
                  type={showPw ? "text" : "password"}
                  required
                  className="w-full rounded-xl border px-4 py-2.5 pr-12 outline-none focus:ring-2 focus:ring-black/10"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
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
            </div>

            {/* Remember me */}
            <label className="inline-flex items-center gap-2 text-sm text-gray-700 select-none">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Ghi nhớ đăng nhập
            </label>

            {/* Submit */}
            <button
              disabled={loading}
              className="w-full rounded-xl bg-black text-white px-4 py-3 font-medium hover:opacity-90 transition disabled:opacity-60"
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>

            {/* Tips nhỏ */}
            <p className="text-xs text-gray-500">
              Tip: Bạn có thể dùng tài khoản admin để vào trang quản trị. Nếu
              không, bạn sẽ được chuyển về trang trước đó sau khi đăng nhập.
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}


