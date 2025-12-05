// import { NavLink, Outlet } from "react-router-dom";
// import { useAuth } from "../../context/AuthContext.jsx";

// const NavItem = ({ to, icon, children }) => (
//   <NavLink
//     to={to}
//     end
//     className={({ isActive }) =>
//       `flex items-center gap-2 px-3 py-2 rounded-xl text-[15px]
//        ${isActive ? "bg-white/10 text-white" : "text-gray-300 hover:bg-white/5"}`
//     }
//   >
//     <span className="inline-block w-5 text-center">{icon}</span>
//     <span>{children}</span>
//   </NavLink>
// );

// export default function AdminLayout() {
//   const { user, logout } = useAuth();

//   return (
//     <div className="min-h-screen bg-[#0f172a] text-white">
//       {/* full width + lớn hơn: max-w-[1760px] */}
//       <div className="mx-auto w-full max-w-[1760px] px-4 md:px-8 lg:px-12 py-6 grid grid-cols-12 gap-6">
//         {/* Sidebar rộng hơn  */}
//         <aside className="col-span-12 md:col-span-3 lg:col-span-2 bg-white/5 backdrop-blur rounded-2xl p-5 sticky top-6 h-fit">
//           <div className="flex items-center gap-3 mb-5">
//             <div className="w-10 h-10 rounded-full bg-white/10 grid place-items-center text-lg">🛒</div>
//             <div>
//               <div className="text-sm opacity-70">Admin Panel</div>
//               <div className="text-xs opacity-50">{user?.email}</div>
//             </div>
//           </div>

//           <div className="space-y-1">
//             <NavItem to="/admin" icon="🏠">Dashboard</NavItem>
//             <NavItem to="/admin/orders" icon="📦">Orders</NavItem>
//             <NavItem to="/admin/customers" icon="👤">Customers</NavItem>
//             <NavItem to="/admin/products" icon="🛍️">Products</NavItem>
//             <NavItem to="/admin/analytics" icon="📈">Analytics</NavItem>
//             <NavItem to="/admin/payment" icon="💳">Payment</NavItem>
//             <NavItem to="/admin/settings" icon="⚙️">Settings</NavItem>
//           </div>

//           <button
//             onClick={logout}
//             className="mt-6 w-full bg-white/10 hover:bg-white/20 text-sm py-2.5 rounded-lg"
//           >
//             Đăng xuất
//           </button>
//         </aside>

//         {/* Content rộng – chữ to hơn */}
//         <main className="col-span-12 md:col-span-9 lg:col-span-10 text-[15px]">
//           <div className="bg-white/5 rounded-2xl p-6 mb-5 flex items-center justify-between">
//             <div>
//               <div className="text-xl font-semibold">Welcome back, Admin! 👋</div>
//               <div className="text-xs opacity-70">{new Date().toLocaleString()}</div>
//             </div>
//             <div className="hidden md:flex gap-3">
//               <input placeholder="Tìm kiếm…" className="bg-white/10 px-4 py-2 rounded-lg text-sm outline-none" />
//               <button className="bg-white/10 px-4 py-2 rounded-lg text-sm">Quick Action</button>
//             </div>
//           </div>

//           <Outlet />
//         </main>
//       </div>
//     </div>
//   );
// }///




import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const NavItem = ({ to, icon, children }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `flex items-center gap-2 px-4 py-2.5 rounded-xl text-[15px] lg:text-[16px]
       ${isActive ? "bg-white/15 text-white" : "text-gray-300 hover:bg-white/10"}`
    }
  >
    <span className="inline-block w-5 text-center">{icon}</span>
    <span className="truncate">{children}</span>
  </NavLink>
);

export default function AdminLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      {/* container rộng hơn: max 1840–1920px, padding lớn, gap rộng */}
      <div className="mx-auto w-full max-w-[1840px] 2xl:max-w-[1920px] px-6 lg:px-10 py-8 grid grid-cols-12 gap-8">
        {/* Sidebar: rộng & thoáng hơn */}
        <aside className="col-span-12 md:col-span-3 lg:col-span-2 bg-white/5 backdrop-blur rounded-2xl p-6 sticky top-8 h-fit">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-white/10 grid place-items-center text-xl">🛒</div>
            <div>
              <div className="text-base font-semibold">Admin Panel</div>
              <div className="text-xs opacity-60 truncate">{user?.email}</div>
            </div>
          </div>

          <nav className="space-y-1.5">
            <NavItem to="/admin" icon="🏠">Dashboard</NavItem>
            <NavItem to="/admin/orders" icon="📦">Orders</NavItem>
            <NavItem to="/admin/customers" icon="👤">Customers</NavItem>
            <NavItem to="/admin/products" icon="🛍️">Products</NavItem>
            <NavItem to="/admin/categories" icon="🗂️">Categories</NavItem>

             <NavItem to="/admin/custom-requests" icon="🎨">Custom</NavItem>
<NavItem to="/admin/custom-payments"  icon="💳">Custom Payments</NavItem>

            <NavItem to="/admin/analytics" icon="📈">Analytics</NavItem>
            <NavItem to="/admin/payment" icon="💳">Payment</NavItem>
            <NavItem to="/admin/settings" icon="⚙️">Settings</NavItem>
          </nav>

          <button
            onClick={logout}
            className="mt-6 w-full bg-white/10 hover:bg-white/20 text-sm py-2.5 rounded-lg"
          >
            Đăng xuất
          </button>
        </aside>

        {/* Content: rộng hơn, chữ to hơn, header input rõ chữ */}
        <main className="col-span-12 md:col-span-9 lg:col-span-10 text-[15px] lg:text-[16px]">
          <div className="bg-white/5 rounded-2xl p-6 lg:p-8 mb-6 flex items-center justify-between">
            <div>
              <div className="text-2xl lg:text-3xl font-semibold">Welcome back, Admin! 👋</div>
              <div className="text-xs opacity-70 mt-1">{new Date().toLocaleString()}</div>
            </div>

            {/* Tìm kiếm: màu chữ/placeholder/caret trắng để không bị “mất chữ” */}
            <div className="hidden md:flex gap-3">
              <input
                placeholder="Tìm kiếm…"
                className="bg-white/10 border border-white/20 text-white placeholder:text-white/60 caret-white
                           px-4 py-2 rounded-lg text-sm outline-none focus:ring-2 focus:ring-white/30 focus:border-white/40"
              />
              <button className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg text-sm">
                Quick Action
              </button>
            </div>
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
}

