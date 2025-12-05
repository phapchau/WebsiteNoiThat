// scripts/index_embeddings.js
require('dotenv').config();
const mongoose = require('mongoose');
const { hsetBuffer, float32Buffer, redis } = require('../src/services/redisHelper');
const { embedText } = require('../src/services/retriever');

const Product = require('../src/models/Product'); // adjust path nếu cần
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/yourdb';
const INDEX_NAME = process.env.REDIS_INDEX || 'idx:products';
const BATCH = 32;

async function connectDB() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log('Mongo connected');
}

async function processBatch(batch) {
  const texts = batch.map(p => `${p.name || ''}. ${p.description || ''}`);
  const embs = [];
  for (const t of texts) {
    const e = await embedText(t);
    embs.push(e);
  }
  for (let i = 0; i < batch.length; i++) {
    const p = batch[i];
    const emb = embs[i];
    const key = `product:${p._id}`;
    const buf = float32Buffer(emb);
    await hsetBuffer(key, {
      name: p.name || '',
      price: String(p.price || 0),
      description: p.description || '',
      slug: p.slug || '',
      vec: buf,
    });
    console.log('Indexed', p._id);
  }
}

async function run() {
  await connectDB();
  const cursor = Product.find({ isActive: { $ne: false } }).cursor();
  let batch = [];
  for await (const doc of cursor) {
    batch.push(doc);
    if (batch.length >= BATCH) {
      await processBatch(batch);
      batch = [];
    }
  }
  if (batch.length) await processBatch(batch);
  console.log('Indexing completed.');
  await mongoose.disconnect();
  redis.disconnect();
}

run().catch(err => { console.error(err); process.exit(1); });
