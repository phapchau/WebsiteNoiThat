// src/components/MessageProvider.jsx
import { createContext, useContext, useMemo } from "react";
import { message,Button, Modal } from "antd";

/** Context để dùng message ở mọi nơi */
const MessageCtx = createContext(null);

/** Hook sử dụng trong component để gọi message */
export function useNotify() {
  // Nếu lỡ chưa có provider, fallback về antd.message (vẫn chạy được)
  return useContext(MessageCtx) || message;
}

/** Provider gắn contextHolder 1 lần ở gốc cây component */
export default function MessageProvider({ children }) {
  const [api, contextHolder] = message.useMessage();
  const value = useMemo(() => api, [api]);

  return (
    <MessageCtx.Provider value={value}>
      {contextHolder}
      {children}
    </MessageCtx.Provider>
  );




  
}
