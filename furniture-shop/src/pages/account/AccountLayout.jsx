




// // src/pages/account/AccountLayout.jsx
// import { NavLink, Outlet } from "react-router-dom";

// export default function AccountLayout() {
//   const item =
//     "flex items-center gap-2 px-3 py-2 rounded-xl text-sm transition";
//   const active =
//     "bg-black text-white shadow-sm";
//   const normal =
//     "text-gray-700 hover:bg-gray-100";

//   return (
//     <section className="max-w-6xl mx-auto px-4 py-8">
//       <h1 className="text-2xl md:text-3xl font-semibold mb-6">Tài khoản</h1>

//       <div className="grid md:grid-cols-[260px_1fr] gap-6">
//         {/* Sidebar */}
//         <aside className="rounded-2xl border bg-white p-4 md:p-5">
//           <nav className="space-y-2">
//             <NavLink
//               to="/account/profile"
//               className={({ isActive }) => `${item} ${isActive ? active : normal}`}
//             >
//               <span>👤</span> <span>Hồ sơ</span>
//             </NavLink>
//             <NavLink
//               to="/account/address"
//               className={({ isActive }) => `${item} ${isActive ? active : normal}`}
//             >
//               <span>📍</span> <span>Địa chỉ</span>
//             </NavLink>
//             <NavLink
//               to="/account/password"
//               className={({ isActive }) => `${item} ${isActive ? active : normal}`}
//             >
//               <span>🔒</span> <span>Đổi mật khẩu</span>
//             </NavLink>
//           </nav>
//         </aside>

//         {/* Content */}
//         <main className="rounded-2xl border bg-white p-4 md:p-6">
//           <Outlet />
//         </main>
//       </div>
//     </section>
//   );
// }//8/11










// src/pages/account/AccountLayout.jsx
import { NavLink, Outlet } from "react-router-dom";

export default function AccountLayout() {
  const itemBase =
    "group flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[15px] transition";
  const active =
    "bg-black text-white shadow-sm dark:bg-white dark:text-black";
  const normal =
    "text-gray-800 hover:bg-black/5 dark:text-gray-200 dark:hover:bg-white/10";

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8 md:py-10">
      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl lg:text-4xl font-semibold tracking-tight">
          Tài khoản
        </h1>
        <p className="mt-1 text-sm md:text-base text-gray-600 dark:text-gray-300">
          Quản lý hồ sơ, địa chỉ và bảo mật của bạn.
        </p>
      </div>

      <div className="grid md:grid-cols-[280px_1fr] gap-6 lg:gap-8">
        {/* Sidebar */}
        <aside
          className="
            surface rounded-2xl p-4 md:p-5 lg:p-6
            md:sticky md:top-[88px]
          "
        >
          <nav className="space-y-2">
            <NavLink
              to="/account/profile"
              className={({ isActive }) =>
                `${itemBase} ${isActive ? active : normal}`
              }
            >
              <span
                className="
                  inline-flex h-8 w-8 items-center justify-center rounded-lg
                  bg-black/10 text-black dark:bg-white/15 dark:text-white
                  group-hover:scale-105 transition
                "
                aria-hidden
              >
                👤
              </span>
              <div className="min-w-0">
                <div className="font-medium leading-tight">Hồ sơ</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Thông tin cá nhân & avatar
                </div>
              </div>
            </NavLink>

            <NavLink
              to="/account/address"
              className={({ isActive }) =>
                `${itemBase} ${isActive ? active : normal}`
              }
            >
              <span
                className="
                  inline-flex h-8 w-8 items-center justify-center rounded-lg
                  bg-black/10 text-black dark:bg-white/15 dark:text-white
                  group-hover:scale-105 transition
                "
                aria-hidden
              >
                📍
              </span>
              <div className="min-w-0">
                <div className="font-medium leading-tight">Địa chỉ</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Giao nhận & liên hệ
                </div>
              </div>
            </NavLink>

            <NavLink
              to="/account/password"
              className={({ isActive }) =>
                `${itemBase} ${isActive ? active : normal}`
              }
            >
              <span
                className="
                  inline-flex h-8 w-8 items-center justify-center rounded-lg
                  bg-black/10 text-black dark:bg-white/15 dark:text-white
                  group-hover:scale-105 transition
                "
                aria-hidden
              >
                🔒
              </span>
              <div className="min-w-0">
                <div className="font-medium leading-tight">Đổi mật khẩu</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  Bảo mật tài khoản
                </div>
              </div>
            </NavLink>
          </nav>
        </aside>

        {/* Content */}
        <main
          className="
            surface rounded-2xl p-4 md:p-6 lg:p-8
          "
        >
          <Outlet />
        </main>
      </div>
    </section>
  );
}



