// src/services/redisHelper.js
const Redis = require('ioredis');
require('dotenv').config();

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

function float32Buffer(arr) {
  const f32 = new Float32Array(arr);
  return Buffer.from(f32.buffer);
}

async function hsetBuffer(key, obj) {
  // build args for HSET; ioredis.callBuffer will accept Buffer values
  const args = [key];
  for (const k of Object.keys(obj)) {
    args.push(k);
    args.push(obj[k]);
  }
  return redis.callBuffer('HSET', ...args);
}

async function knnSearch(indexName, vectorField, vectorBuffer, topK = 6) {
  const query = `*=>[KNN ${topK} @${vectorField} $vec]`;
  const res = await redis.callBuffer(
    'FT.SEARCH',
    indexName,
    query,
    'PARAMS',
    '2',
    'vec',
    vectorBuffer,
    'RETURN',
    '4',
    'name',
    'price',
    'slug',
    'description',
    'DIALECT',
    '2'
  );

  if (!Array.isArray(res) || res.length < 1) return [];
  const out = [];
  for (let i = 1; i < res.length; i += 2) {
    const id = res[i];
    const fieldsArr = res[i+1] || [];
    const obj = { _id: id && id.toString ? id.toString() : id };
    for (let j = 0; j < fieldsArr.length; j += 2) {
      const f = fieldsArr[j]?.toString?.() || fieldsArr[j];
      const v = fieldsArr[j+1];
      obj[f] = v && v.toString ? v.toString() : v;
    }
    out.push(obj);
  }
  return out;
}

module.exports = { redis, float32Buffer, hsetBuffer, knnSearch };
