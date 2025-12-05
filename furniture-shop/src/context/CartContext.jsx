



// CartContext.jsx
import { createContext, useContext, useMemo, useState, useCallback, useEffect } from "react";

const CartContext = createContext(null);
const ORIGIN = import.meta.env.VITE_API_ORIGIN || "http://localhost:8081";
const normalize = (u) => (!u ? "" : (u.startsWith("http") ? u : `${ORIGIN}${u.startsWith("/") ? u : "/" + u}`));

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      const raw = JSON.parse(localStorage.getItem("cart_items") || "[]");
      return Array.isArray(raw) ? raw : [];
    } catch { return []; }
  });

  // migrate cũ -> đảm bảo có id
  useEffect(() => {
    setItems(prev => {
      let changed = false;
      const next = prev.map(it => {
        const id = it.id || it.productId || it.product || it._id || it.slug; // slug dùng tạm nếu BE nhận slug
        if (id && id !== it.id) { changed = true; return { ...it, id }; }
        return it;
      });
      if (changed) { try { localStorage.setItem("cart_items", JSON.stringify(next)); } catch {} }
      return next;
    });
  }, []);

  const persist = (arr) => { setItems(arr); try { localStorage.setItem("cart_items", JSON.stringify(arr)); } catch {} };

  const addItem = useCallback((raw, qty = 1) => {
    // CHUẨN HÓA ĐẦU VÀO
    const id = raw?.id || raw?.product || raw?._id || raw?.slug;
    const name = raw?.name ?? "";
    const price = Number(raw?.price) || 0;
    const img = normalize(raw?.img || raw?.image || raw?.poster || (raw?.images?.[0] ?? ""));
    const slug = raw?.slug || id;

    if (!id) {
      console.warn("addItem: missing product id", raw);
      return;
    }

    persist(prev => {
      const arr = typeof prev === "function" ? prev(items) : prev; // phòng trường hợp truyền hàm
      const ex = arr.find(x => x.id === id);
      if (ex) {
        ex.qty = Math.max(1, (Number(ex.qty) || 1) + (Number(qty) || 1));
        return [...arr];
      }
      return [...arr, { id, name, price, img, slug, qty: Math.max(1, Number(qty) || 1) }];
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items]);

  const removeItem = useCallback((id) => persist(items.filter(x => x.id !== id)), [items]);
  const updateQty  = useCallback((id, q) => persist(items.map(x => x.id === id ? { ...x, qty: Math.max(1, q) } : x)), [items]);
  const clear      = useCallback(() => persist([]), []);
  const clearCart  = clear;

  const total = useMemo(() => items.reduce((s, x) => s + (Number(x.price)||0) * (Number(x.qty)||0), 0), [items]);
  const value = useMemo(() => ({ items, addItem, removeItem, updateQty, clear, clearCart, total }), [items, addItem, removeItem, updateQty, clear, total]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};//21/11











