import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const JWT_SECRET = process.env.JWT_SECRET || "default_access_secret_123456";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "default_refresh_secret_123456";

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

export const comparePassword = async (password, hash) => {
  return bcrypt.compare(password, hash);
};

export const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, status: user.status },
    JWT_SECRET,
    { expiresIn: "15m" }
  );
};

export const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, jti: crypto.randomUUID() },
    JWT_REFRESH_SECRET,
    { expiresIn: "7d" }
  );
};

export const verifyAccessToken = (token) => {
  return jwt.verify(token, JWT_SECRET);
};

export const verifyRefreshToken = (token) => {
  return jwt.verify(token, JWT_REFRESH_SECRET);
};

export const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString("hex");
};
