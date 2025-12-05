// src/controllers/bank.controller.js
const qs = require("qs");

exports.makeVietQR = async (req, res) => {
  // amount & code là optional để thử dev
  const rawAmount = req.query.amount ?? req.body?.amount;
  const amountNum = Number(rawAmount);
  const amount = Number.isFinite(amountNum) && amountNum > 0 ? Math.round(amountNum) : undefined;

  const code = (req.query.code || req.body?.code || "").toString().trim();

  const BIN  = process.env.BANK_BIN;
  const ACC  = process.env.BANK_ACCOUNT;
  const NAME = process.env.BANK_ACCOUNT_NAME || "";
  const PREFIX = process.env.BANK_NOTE_PREFIX || "ORD-";

  if (!BIN || !ACC) {
    return res.status(500).json({ message: "Thiếu BANK_BIN hoặc BANK_ACCOUNT" });
  }

  const addInfo = `${PREFIX}${code}`.trim();  // để nguyên, để qs tự encode

  // https://img.vietqr.io/image/<BIN>-<ACC>-compact.png?amount=...&addInfo=...&accountName=...
  const base = `https://img.vietqr.io/image/${BIN}-${ACC}-compact.png`;

  const params = {};
  if (amount) params.amount = amount;           // chỉ gắn khi có >0
  if (addInfo) params.addInfo = addInfo;
  if (NAME) params.accountName = NAME;

  const url = `${base}?${qs.stringify(params)}`;

  res.json({
    bank: { bin: BIN, account: ACC, name: NAME },
    amount: amount || 0,
    note: addInfo,
    qrImage: url,          // ảnh PNG QR (public)
  });
};
