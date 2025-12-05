// import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { useAuth } from "../context/AuthContext.jsx";

// /**
//  * Guard mặc định: yêu cầu đăng nhập.
//  * - Nếu truyền prop `roles`, sẽ kiểm tra thêm quyền (vd: roles={['admin']}).
//  * - Tự chờ `hydrated` để không nháy trang khi refresh.
//  * - Giữ lại đường dẫn hiện tại trong ?redirect=... để quay lại sau khi login.
//  */
// export default function ProtectedRoute({ roles }) {
//   const { user, hydrated } = useAuth();
//   const loc = useLocation();

//   // Chưa khôi phục trạng thái -> tạm chưa render (hoặc trả spinner)
//   if (!hydrated) return null;

//   // Chưa đăng nhập -> đưa về /login + giữ đường dẫn cũ
//   if (!user) {
//     const redirect = encodeURIComponent(loc.pathname + loc.search);
//     return <Navigate to={`/login?redirect=${redirect}`} replace />;
//   }

//   // Có yêu cầu role mà không khớp -> đưa về trang chủ
//   if (roles && !roles.includes(user.role)) {
//     return <Navigate to="/" replace />;
//   }

//   // Ok -> render các route con
//   return <Outlet />;
// }//



import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProtectedRoute({ roles }) {
  const { user, hydrated } = useAuth();
  const loc = useLocation();

  if (!hydrated) return null;
  if (!user) {
    const redirect = encodeURIComponent(loc.pathname + loc.search);
    return <Navigate to={`/login?redirect=${redirect}`} replace />;
  }
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <Outlet />;
}

