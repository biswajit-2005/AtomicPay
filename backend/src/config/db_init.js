import { pool } from "./pg.js";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const initDB = async () => {
  try {
    const schemaPath = path.join(__dirname, "schema.sql");
    const schemaSql = await fs.readFile(schemaPath, "utf-8");
    await pool.query(schemaSql);
    console.log("Database initialized from schema.sql successfully");
  } catch (error) {
    console.error("Error initializing database tables from schema.sql:", error);
    throw error;
  }
};

