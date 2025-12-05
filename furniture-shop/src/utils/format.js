export const vnd = (n) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" })
    .format(Number(n || 0));
