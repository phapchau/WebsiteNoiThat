// src/services/geminiHandler.js
const ai = require('./geminiClient');
require('dotenv').config();

const DEFAULT_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';
const TOP_K = Number(process.env.GEMINI_TOP_K || 6);

function extractTextFromResp(resp) {
  if (!resp) return '';
  if (typeof resp === 'string') return resp;
  if (resp.text) return resp.text;
  if (resp.output && Array.isArray(resp.output) && resp.output.length) {
    const content = resp.output[0].content;
    if (Array.isArray(content)) {
      const t = content.find(c => typeof c === 'string' || c?.text);
      if (typeof t === 'string') return t;
      if (t?.text) return t.text;
    } else if (typeof content === 'string') return content;
  }
  if (resp.candidates && resp.candidates[0]) {
    const c = resp.candidates[0];
    if (c?.content) {
      if (typeof c.content === 'string') return c.content;
      if (Array.isArray(c.content)) {
        const f = c.content.find(x => x?.text);
        return f?.text || String(c.content[0]);
      }
    }
  }
  try { return JSON.stringify(resp).slice(0, 4000); } catch (e) { return ''; }
}

function buildDocsContext(docs = []) {
  if (!Array.isArray(docs) || docs.length === 0) return '';
  return docs.slice(0, TOP_K).map((d, i) => {
    const name = d.name || '';
    const desc = (d.description || '').replace(/\s+/g, ' ').trim().slice(0, 300);
    const price = d.price ? `Giá: ${(d.price||0).toLocaleString()}đ` : '';
    const slug = d.slug ? `/products/${d.slug}` : (d._id ? `/products/${d._id}` : '');
    return `${i+1}) ${name} — ${desc} ${price} — ${slug}`.trim();
  }).join('\n');
}

async function generateWithGemini({ message, docs = [], options = {} }) {
  if (!ai) throw new Error('Gemini client not initialized');
  const model = options.model || DEFAULT_MODEL;
  const ctx = buildDocsContext(docs);
  const prompt = `
Bạn là trợ lý bán hàng bằng tiếng Việt, thân thiện và súc tích.
Dưới đây là danh sách sản phẩm (context). Chỉ dùng những sản phẩm có trong danh sách này để gợi ý.
Nhiệm vụ:
1) Nếu có sản phẩm phù hợp, liệt kê tối đa 3 sản phẩm: tên, giá đã format (vd: 1.200.000đ), đường dẫn tương đối /products/<slug>, và 1 câu ngắn lý do.
2) Nếu thiếu thông tin để chọn (ví dụ: chỉ nói "ghế trắng"), hỏi 1 câu ngắn làm rõ.
3) Nếu không có sản phẩm phù hợp, trả lời lịch sự và gợi ý cách mở rộng tìm kiếm.
Trả lời bằng tiếng Việt, ngắn gọn.

Context:
${ctx}

User: ${message}

Answer:
`.trim();

  const resp = await ai.models.generateContent({
    model,
    contents: prompt,
  });

  const text = extractTextFromResp(resp);
  return { answer: String(text).trim(), raw: resp };
}

module.exports = { generateWithGemini };
