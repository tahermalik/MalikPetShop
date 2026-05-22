// connection.js
import IORedis from 'ioredis';

// const connection = new IORedis(process.env.REDIS_URL,{
//   maxRetriesPerRequest: null
// });

const connection = new IORedis({
  host:"127.0.0.1",
  maxRetriesPerRequest: null
});

export default connection;