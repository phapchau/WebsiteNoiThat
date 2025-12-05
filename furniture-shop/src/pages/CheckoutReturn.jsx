





// import { useEffect } from "react";
// import { useNavigate, useLocation } from "react-router-dom";

// export default function CheckoutReturn() {
//   const nav = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const q = new URLSearchParams(location.search);
//     const ok = q.get("ok") === "true";
//     const orderId = q.get("orderId");

//     if (ok && orderId) {
//       nav(`/orders/${orderId}?success=1`, { replace: true });
//     } else {
//       nav(`/checkout?payment_fail=1`, { replace: true });
//     }
//   }, [location.search, nav]);

//   return (
//     <div className="p-10 text-center">
//       Đang xử lý thanh toán...
//     </div>
//   );
// }///11/11





// src/pages/CheckoutReturn.jsx
import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function CheckoutReturn() {
  const nav = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const q = new URLSearchParams(location.search);
    const status = q.get("status");   // success | failed
    const orderId = q.get("orderId");

    if (status === 'success' && orderId) {
      nav(`/orders/${orderId}?success=1`, { replace: true });
    } else {
      nav(`/checkout?payment_fail=1`, { replace: true });
    }
  }, [location.search, nav]);

  return <div className="p-10 text-center">Đang xử lý thanh toán...</div>;
}

