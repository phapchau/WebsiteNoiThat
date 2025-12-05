


// src/components/Header.jsx
import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import logo from "../assets/logo.png";

const BASE = import.meta.env.BASE_URL || "/";
const DEFAULT_AVATAR = BASE + "user.png";

// Màu sắc sang trọng
const GOLD = "#B88E2F";
const GOLD_LIGHT = "rgba(184,142,47,0.08)";
const GOLD_GRADIENT = "linear-gradient(135deg,#fff8e6, #fff5de)";

function normalizeAvatar(u) {
  if (!u) return DEFAULT_AVATAR;
  if (/^https?:\/\//i.test(u)) return u;
  if (u.startsWith(BASE)) return u;
  return u.startsWith("/") ? u : BASE + u;
}

function UserAvatar({ src, alt = "User", className = "" }) {
  const [url, setUrl] = useState(normalizeAvatar(src));
  useEffect(() => setUrl(normalizeAvatar(src)), [src]);
  return (
    <img
      src={url}
      alt={alt}
      className={`h-9 w-9 md:h-10 md:w-10 rounded-full object-cover ring-1 ring-black/10 shadow-sm ${className}`}
      onError={() => setUrl(DEFAULT_AVATAR)}
      loading="lazy"
    />
  );
}

export default function Header() {
  const { items } = useCart();
  const { user, logout } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();

  const [openUser, setOpenUser] = useState(false);
  const [openCustom, setOpenCustom] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef(null);
  const btnRef = useRef(null);

  const cartCount = Array.isArray(items) ? items.reduce((s, x) => s + (x?.qty || 0), 0) : 0;

  const goLogin = () => {
    const redirect = encodeURIComponent(loc.pathname + loc.search);
    nav(`/login?redirect=${redirect}`);
  };

  useEffect(() => {
    const onDocClick = (e) => {
      if (!openUser) return;
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setOpenUser(false);
      }
    };
    const onEsc = (e) => e.key === "Escape" && setOpenUser(false);
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onEsc);
    };
  }, [openUser]);

  useEffect(() => {
    setOpenUser(false);
    setOpenCustom(false);
  }, [loc.pathname, loc.search]);

  const linkCls =
    "relative inline-flex items-center text-[15px] font-medium text-gray-700 hover:text-black transition";
  const linkActive = ({ isActive }) =>
    `${linkCls} after:absolute after:-bottom-1 after:left-0 after:h-[2px] after:w-0 after:bg-[${GOLD}] after:rounded-full after:transition-all hover:after:w-full ${
      isActive ? "text-black after:w-full" : ""
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 backdrop-blur-md" style={{ background: "rgba(255,255,255,0.92)" }}>
      <div className="mx-auto max-w-[1440px] px-4 sm:px-6 md:px-8">
        <div className="flex h-16 md:h-[74px] items-center justify-between">

          {/* Logo & Brand */}
          <Link to="/" className="group flex items-center gap-3">
            {logo && (
              <div
                className="flex items-center justify-center rounded-xl"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 14,
                  background: GOLD_GRADIENT,
                  boxShadow: `0 6px 20px ${GOLD_LIGHT}`,
                  transition: "transform 200ms ease, box-shadow 200ms ease",
                }}
              >
                <img src={logo} alt="Natura Home" className="h-10 w-10 md:h-11 md:w-11 rounded-lg" />
              </div>
            )}
            <span className="font-semibold text-xl md:text-2xl tracking-wide text-gray-900">Natura Home</span>
            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium text-[15px]" style={{ background: GOLD_LIGHT, color: GOLD }}>
              Nội thất • Thiết kế
            </span>
          </Link>

          {/* Navigation desktop */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-10">
            <NavLink to="/" className={linkActive}>Trang chủ</NavLink>
            <NavLink to="/products" className={linkActive}>Sản phẩm</NavLink>
            <NavLink to="/sale" className={linkActive}>Khuyến mãi</NavLink>
            <NavLink to="/flash-sale" className={linkActive}>
  Flash Sale
</NavLink>


            <NavLink to="/about" className={linkActive}>Về chúng tôi</NavLink>

            {/* Custom select */}
            <div className="relative">
              <select
                className="peer appearance-none min-w-[200px] lg:min-w-[220px] px-4 pr-9 py-2.5 rounded-xl bg-white ring-1 ring-black/10 text-gray-900 font-medium hover:shadow-lg focus:shadow-lg outline-none transition"
                defaultValue=""
                onChange={(e) => {
                  const v = e.target.value;
                  if (v) nav(v);
                }}
                aria-label="Thiết kế theo yêu cầu"
                style={{ boxShadow: "0 6px 20px rgba(11,12,16,0.06)" }}
              >
                <option value="" disabled hidden>Thiết kế theo yêu cầu</option>
                <option value="/custom/new">Tạo yêu cầu</option>
                <option value="/custom/requests">Yêu cầu của tôi</option>
              </select>
              <svg className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-70" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M5 7l5 6 5-6H5z" />
              </svg>
            </div>

            <NavLink to="/cart" className={linkActive}>
              <span className="inline-flex items-center gap-2">
                Giỏ hàng
                <span className="rounded-full text-xs px-2 py-[3px] leading-5 bg-gradient-to-r from-gray-900 to-black text-white font-semibold shadow-lg">
                  {cartCount}
                </span>
              </span>
            </NavLink>

            {/* Auth */}
            {!user ? (
              <>
                <button onClick={goLogin} className="rounded-xl border border-black/10 bg-white px-5 py-2.5 font-medium shadow-lg hover:bg-black hover:text-white transition">
                  Đăng nhập
                </button>
                <Link to="/register" className="rounded-xl border border-black/10 bg-white px-5 py-2.5 font-medium shadow-lg hover:bg-black hover:text-white transition">
                  Đăng ký
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  ref={btnRef}
                  onClick={() => setOpenUser((v) => !v)}
                  className="flex items-center gap-3 rounded-full bg-white px-3 py-1 ring-1 ring-black/10 hover:shadow-lg transition"
                  aria-haspopup="menu"
                  aria-expanded={openUser}
                >
                  <UserAvatar src={user.avatar || DEFAULT_AVATAR} />
                  <div className="max-w-[180px] truncate">
                    <div className="font-semibold text-gray-900">{user.name || user.email}</div>
                    <div className="text-[13px] text-gray-500">{user.email}</div>
                  </div>
                  <svg className={`h-4 w-4 transition ${openUser ? "rotate-180" : ""}`} viewBox="0 0 20 20" fill="currentColor">
                    <path d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" />
                  </svg>
                </button>

                {openUser && (
                  <div
                    ref={menuRef}
                    className="absolute right-0 mt-2 w-64 overflow-hidden rounded-2xl border border-black/10 bg-white backdrop-blur-xl shadow-2xl"
                    role="menu"
                  >
                    <Link to="/account" onClick={() => setOpenUser(false)} className="block px-4 py-3 text-[15px] hover:bg-gray-50" role="menuitem">
                      Tài khoản của tôi
                    </Link>
                    <Link to="/orders/me" onClick={() => setOpenUser(false)} className="block px-4 py-3 text-[15px] hover:bg-gray-50" role="menuitem">
                      Đơn hàng của tôi
                    </Link>
                    <div className="border-t border-black/10" />
                    <button
                      disabled={loggingOut}
                      onClick={async () => {
                        setLoggingOut(true);
                        try {
                          await logout();
                          nav("/", { replace: true });
                        } finally {
                          setLoggingOut(false);
                          setOpenUser(false);
                        }
                      }}
                      className="w-full text-left px-4 py-3 text-[15px] hover:bg-gray-50 disabled:opacity-50"
                      role="menuitem"
                    >
                      Đăng xuất
                    </button>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2">
            <Link to="/cart" className="rounded-xl border border-black/10 bg-white px-3 py-1.5 text-[14px] shadow-md hover:bg-black hover:text-white transition">
              Giỏ ({cartCount})
            </Link>
            {!user ? (
              <button onClick={goLogin} className="rounded-xl border border-black/10 bg-white px-3 py-1.5 text-[14px] shadow-md hover:bg-black hover:text-white transition">
                Đăng nhập
              </button>
            ) : (
              <button onClick={() => nav("/account")} className="rounded-full ring-1 ring-black/10 shadow-sm" aria-label="Tài khoản">
                <UserAvatar src={user.avatar} />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}




