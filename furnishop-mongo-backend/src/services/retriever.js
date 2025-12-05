// src/services/retriever.js
require('dotenv').config();
const ai = require('./geminiClient'); // for embeddings
const { float32Buffer, knnSearch } = require('./redisHelper');

const EMBED_MODEL = process.env.GEMINI_EMBED_MODEL || 'text-embedding-004';
const INDEX_NAME = process.env.REDIS_INDEX || 'idx:products';
const DIM = Number(process.env.GEMINI_EMBED_DIM || 768);

if (!ai) {
  console.warn('Gemini client not initialized; retriever disabled');
}

async function embedText(text) {
  if (!ai) throw new Error('Gemini client not initialized');
  const resp = await ai.embeddings.create({
    model: EMBED_MODEL,
    input: text,
  });
  // resp.data[0].embedding  (may vary by library version)
  const embedding = resp?.data?.[0]?.embedding || resp?.embedding || null;
  if (!embedding) throw new Error('Invalid embedding response shape: ' + JSON.stringify(resp).slice(0,300));
  return embedding;
}

/**
 * retrieve(query, topK) => [{ _id, name, price, slug, description }]
 */
async function retrieve(query, topK = 6) {
  const emb = await embedText(query);
  const buf = float32Buffer(emb);
  const rows = await knnSearch(INDEX_NAME, 'vec', buf, topK);
  return rows.map(r => ({
    _id: r._id,
    name: r.name || '',
    price: r.price ? Number(r.price) : null,
    slug: r.slug || '',
    description: r.description || '',
  }));
}

module.exports = { retrieve, embedText };
