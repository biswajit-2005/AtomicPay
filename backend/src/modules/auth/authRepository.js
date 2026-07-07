import { pool } from "../../config/pg.js";

export const createUser = async (email, phone, passwordHash, firstName, lastName) => {
  const query = `
    INSERT INTO users (email, phone, password_hash, first_name, last_name, email_verified, status)
    VALUES ($1, $2, $3, $4, $5, false, 'pending')
    RETURNING id, email, phone, first_name, last_name, email_verified, status, created_at, updated_at
  `;
  const values = [email, phone, passwordHash, firstName, lastName];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const findByEmail = async (email) => {
  const query = `
    SELECT id, email, phone, password_hash, first_name, last_name, email_verified, status, created_at, updated_at
    FROM users
    WHERE email = $1
  `;
  const { rows } = await pool.query(query, [email]);
  return rows[0];
};

export const findById = async (id) => {
  const query = `
    SELECT id, email, phone, first_name, last_name, email_verified, status, created_at, updated_at
    FROM users
    WHERE id = $1
  `;
  const { rows } = await pool.query(query, [id]);
  return rows[0];
};

export const verifyUser = async (userId) => {
  const query = `
    UPDATE users
    SET email_verified = true, status = 'active', updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
    RETURNING id, email, email_verified, status
  `;
  const { rows } = await pool.query(query, [userId]);
  return rows[0];
};

export const updatePassword = async (userId, passwordHash) => {
  const query = `
    UPDATE users
    SET password_hash = $2, updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
  `;
  await pool.query(query, [userId, passwordHash]);
};

export const saveRefreshToken = async (userId, tokenHash, expiresAt) => {
  const query = `
    INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
    VALUES ($1, $2, $3)
    RETURNING id, user_id, token_hash, expires_at, created_at
  `;
  const { rows } = await pool.query(query, [userId, tokenHash, expiresAt]);
  return rows[0];
};

export const findRefreshToken = async (tokenHash) => {
  const query = `
    SELECT id, user_id, token_hash, expires_at, revoked_at, created_at
    FROM refresh_tokens
    WHERE token_hash = $1
  `;
  const { rows } = await pool.query(query, [tokenHash]);
  return rows[0];
};

export const deleteRefreshToken = async (tokenHash) => {
  const query = `
    DELETE FROM refresh_tokens
    WHERE token_hash = $1
  `;
  await pool.query(query, [tokenHash]);
};
