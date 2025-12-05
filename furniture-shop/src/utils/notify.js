// src/utils/notify.js
import { App } from "antd";

/** Sử dụng trong component thông qua hook */
export function useNotify() {
  const { message, modal, notification } = App.useApp();
  return {
    message,        // message.success / warning / error / info / loading
    modal,          // modal.confirm / info / success / error / warning
    notification,   // notification.open / success / error ...
  };
}
