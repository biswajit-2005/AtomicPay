import pg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pg;

// 1.create pool
export const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// 2. Handle unexpected errors on idle clients
pool.on("error", (err) => {
  console.error("Unexpected error on idle PostgreSQL client", err);
  process.exit(-1);
});

//function to check database connection
export const connectDB = async () => {
  try {
    const client = await pool.query("SELECT NOW()");
    console.log("Connected to database");
    console.log(client.rows[0]);
  } catch (err) {
    console.error("pg connection failed.", err);
    process.exit(1);
    //stop server
  }
};
