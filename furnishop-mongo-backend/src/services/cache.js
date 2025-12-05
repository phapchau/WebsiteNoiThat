// src/services/cache.js
const Redis = require('ioredis');
const redis = new Redis(process.env.REDIS_URL);

async function get(key) {
  const v = await redis.get(key);
  return v ? JSON.parse(v) : null;
}
async function set(key, value, ttl = 60) {
  await redis.set(key, JSON.stringify(value), 'EX', ttl);
}
module.exports = { get, set, client: redis };
