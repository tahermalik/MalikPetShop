import { createClient } from 'redis';

// for deployment
// const redisClient = createClient({
//   url: process.env.REDIS_URL
// });

// for localhost
const redisClient = createClient();

redisClient.on("connect", () => {
  console.log("✅ Redis connected");
});

redisClient.on('error', err => console.log('Redis Client Error', err));

await redisClient.connect();

export default redisClient;

