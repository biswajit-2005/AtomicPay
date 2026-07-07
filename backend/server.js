import dotenv from "dotenv";
dotenv.config();

import app from "./src/app.js";
import { connectDB } from "./src/config/pg.js";
import { connectRedis } from "./src/config/redis.js";
import { initDB } from "./src/config/db_init.js";

import http from "http";

const server = http.createServer(app);

const port = process.env.PORT || 5000;
server.listen(port, async () => {
  await connectDB();
  await initDB();
  await connectRedis();

  console.log(`Server running on port ${port}`);
});

