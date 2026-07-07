import { EventEmitter } from "events";

export const authEmitter = new EventEmitter();

authEmitter.on("email:verify", ({ email, token }) => {
  const verifyLink = `http://localhost:${process.env.PORT || 3000}/api/v1/auth/verify-email?token=${token}`;
  console.log(`\n==================================================`);
  console.log(`[EMAIL SIMULATION] Verification Email sent to: ${email}`);
  console.log(`Link: ${verifyLink}`);
  console.log(`==================================================\n`);
});

authEmitter.on("password:reset", ({ email, token }) => {
  const resetLink = `http://localhost:${process.env.PORT || 3000}/api/v1/auth/reset-password?token=${token}`;
  console.log(`\n==================================================`);
  console.log(`[EMAIL SIMULATION] Password Reset Email sent to: ${email}`);
  console.log(`Link: ${resetLink}`);
  console.log(`==================================================\n`);
});
