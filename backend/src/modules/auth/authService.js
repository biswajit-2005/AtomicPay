 import * as authRepository from "./authRepository.js";
import { redisClient } from "../../config/redis.js";
import {
  hashPassword,
  comparePassword,
  generateAccessToken,
  generateRefreshToken,
  generateVerificationToken,
  verifyRefreshToken
} from "./authUtils.js";
import { validateEmail, validateRegisterInput } from "./authValidation.js";
import { authEmitter } from "./authEvent.js";

import crypto from "crypto";

const hashToken = (token) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};

export const register = async ({ email, phone, password, firstName, lastName }) => {
  // 1. Validate email
  const validation = validateRegisterInput({ email, password, firstName, lastName });
  if (!validation.isValid) {
    throw new Error(validation.message);
  }

  // 2. Check duplicate user
  const existingUser = await authRepository.findByEmail(email);
  if (existingUser) {
    throw new Error("Email is already registered");
  }

  // 3. Hash password
  const passwordHash = await hashPassword(password);

  // 4. Create user
  const user = await authRepository.createUser(email, phone, passwordHash, firstName, lastName);

  // 5. Generate verification token
  const verifyToken = generateVerificationToken();
  await redisClient.set(`verify_token:${verifyToken}`, user.id, { EX: 86400 });

  // 6. Generate access & refresh tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  // 7. Store refresh token
  const tokenHash = hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await authRepository.saveRefreshToken(user.id, tokenHash, expiresAt);

  // 8. Send email event
  authEmitter.emit("email:verify", { email: user.email, token: verifyToken });

  // 9. Return JWT and user info
  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      phone: user.phone,
      firstName: user.first_name,
      lastName: user.last_name,
      emailVerified: user.email_verified,
      status: user.status
    }
  };
};

export const login = async ({ email, password }) => {
  const user = await authRepository.findByEmail(email);
  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isMatch = await comparePassword(password, user.password_hash);
  if (!isMatch) {
    throw new Error("Invalid email or password");
  }

  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);

  const tokenHash = hashToken(refreshToken);
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  await authRepository.saveRefreshToken(user.id, tokenHash, expiresAt);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      email: user.email,
      phone: user.phone,
      firstName: user.first_name,
      lastName: user.last_name,
      emailVerified: user.email_verified,
      status: user.status
    }
  };
};

export const logout = async (refreshToken) => {
  if (!refreshToken) {
    throw new Error("Refresh token is required");
  }
  const tokenHash = hashToken(refreshToken);
  await authRepository.deleteRefreshToken(tokenHash);
  return { message: "Logged out successfully" };
};

export const refreshToken = async (token) => {
  if (!token) {
    throw new Error("Refresh token is required");
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch (err) {
    throw new Error("Invalid or expired refresh token");
  }

  const tokenHash = hashToken(token);
  const tokenRecord = await authRepository.findRefreshToken(tokenHash);

  if (!tokenRecord) {
    throw new Error("Refresh token not found or revoked");
  }

  if (new Date(tokenRecord.expires_at) < new Date()) {
    await authRepository.deleteRefreshToken(tokenHash);
    throw new Error("Refresh token has expired");
  }

  const user = await authRepository.findById(tokenRecord.user_id);
  if (!user) {
    throw new Error("User not found");
  }

  const accessToken = generateAccessToken(user);
  return { accessToken };
};

export const verifyEmail = async (token) => {
  if (!token) {
    throw new Error("Verification token is required");
  }

  const userId = await redisClient.get(`verify_token:${token}`);
  if (!userId) {
    throw new Error("Invalid or expired verification token");
  }

  const user = await authRepository.verifyUser(userId);
  await redisClient.del(`verify_token:${token}`);

  return { message: "Email verified successfully", user };
};

export const forgotPassword = async (email) => {
  if (!email || !validateEmail(email)) {
    throw new Error("Valid email is required");
  }

  const user = await authRepository.findByEmail(email);
  if (!user) {
    return { message: "If that email exists, a password reset link has been sent." };
  }

  const resetToken = generateVerificationToken();
  await redisClient.set(`reset_token:${resetToken}`, user.id, { EX: 3600 });

  authEmitter.emit("password:reset", { email: user.email, token: resetToken });

  return { message: "Password reset link sent successfully" };
};

export const resetPassword = async (token, newPassword) => {
  if (!token) {
    throw new Error("Reset token is required");
  }
  if (!newPassword || newPassword.length < 6) {
    throw new Error("New password must be at least 6 characters long");
  }

  const userId = await redisClient.get(`reset_token:${token}`);
  if (!userId) {
    throw new Error("Invalid or expired reset token");
  }

  const newPasswordHash = await hashPassword(newPassword);
  await authRepository.updatePassword(userId, newPasswordHash);
  await redisClient.del(`reset_token:${token}`);

  return { message: "Password reset successfully" };
};
