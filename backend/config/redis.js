import { createClient } from 'redis';

const redisClient = createClient({
  url: process.env.REDIS_URL,
  socket: {
    keepAlive: 10_000, // 🔑 prevents idle disconnects
    reconnectStrategy: (retries) => {
      return Math.min(retries * 100, 3000); // graceful backoff
    }
  }
});

redisClient.on("connect", () => {
  console.log("✅ Redis connected");
});

redisClient.on('error', err => console.log('Redis Client Error', err));

await redisClient.connect();

export default redisClient;

