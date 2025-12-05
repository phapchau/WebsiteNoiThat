import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";

const NavItem = ({ to, icon, children }) => (
  <NavLink
    to={to}
    end
    className={({ isActive }) =>
      `flex items-center gap-2 px-4 py-2.5 rounded-xl text-[15px]
      ${isActive ? "bg-white/20 text-white" : "text-gray-300 hover:bg-white/10"}`
    }
  >
    <span className="inline-block w-5 text-center">{icon}</span>
    <span>{children}</span>
  </NavLink>
);

export default function StaffLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <div className="mx-auto w-full max-w-[1800px] px-6 lg:px-10 py-8 grid grid-cols-12 gap-8">
        
        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3 lg:col-span-2 bg-white/5 backdrop-blur rounded-2xl p-6 sticky top-8 h-fit shadow-lg">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-white/10 grid place-items-center text-xl">👨‍🔧</div>
            <div>
              <div className="text-base font-semibold">Staff Panel</div>
              <div className="text-xs opacity-60 truncate">{user?.email}</div>
            </div>
          </div>

          <nav className="space-y-1.5">
            <NavItem to="/staff" icon="📦">Quản lý đơn hàng</NavItem>
            <NavItem to="/staff/products" icon="🛍️">Quản lý sản phẩm</NavItem>
            <NavItem to="/staff/analytics" icon="📈">Analytics</NavItem>
            <NavItem to="/staff/custom-payments"  icon="💳">Custom Payments</NavItem>
            <NavItem to="/staff/custom-requests" icon="🎨">Yêu cầu thiết kế</NavItem>
            
          </nav>

          <button
            onClick={logout}
            className="mt-6 w-full bg-white/10 hover:bg-white/20 text-sm py-2.5 rounded-lg"
          >
            Đăng xuất
          </button>
        </aside>

        {/* Content */}
        <main className="col-span-12 md:col-span-9 lg:col-span-10 text-[15px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
