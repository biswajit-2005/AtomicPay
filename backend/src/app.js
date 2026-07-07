import express from "express";
import cors from "cors";
import authRoutes from "./modules/auth/authRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1/auth", authRoutes);

app.get("/health", (req, res) => {
  return res.send({ message: "Health OK" });
});

export default app;