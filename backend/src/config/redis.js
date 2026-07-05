// Redis connection configuration
import { createClient } from "redis";

export const redisClient = createClient({
  url: process.env.REDIS_URL,
});
redisClient.on("ready", () => {
  console.log("Redis Connected");
});

redisClient.on("error", (err) => {
  console.log("Redis Client Error", err);
});

redisClient.on("end", () => {
  console.log("Redis Connection Closed");
});
export async function connectRedis() {
  await redisClient.connect();
}
