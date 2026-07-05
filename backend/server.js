import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();

import { connectDB, pool } from "./src/config/pg.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/health", (req, res) => {
  return res.send({ message: "Health OK" });
});

const port = process.env.PORT || 5000;
app.listen(port, async () => {
  await connectDB();
  //   pool.query('SELECT * from "testTable" ', (err, res) => {
  //     if (err) throw err;
  //     console.log(res.rows);
  //   });
  console.log(`Server running on port ${process.env.PORT}`);
});
