const { env, isDbEnabled } = require("./config");
const { Pool } = require("pg");

let pool = null;

function createPool() {
  const base = env.DATABASE_URL
    ? { connectionString: env.DATABASE_URL }
    : {
        host: env.DB_HOST,
        port: env.DB_PORT,
        user: env.DB_USERNAME,
        password: env.DB_PASSWORD,
        database: env.DB_DATABASE,
      };
  pool = new Pool({
    ...base,
    ssl: { rejectUnauthorized: false },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
    keepAlive: true,
    keepAliveInitialDelayMillis: 10000,
  });
  pool.on("error", () => {});
}

if (isDbEnabled) {
  createPool();
}

async function query(text, params) {
  if (!pool) throw new Error("Database is not configured");
  try {
    return await pool.query(text, params);
  } catch (e) {
    if (e.code === "ETIMEDOUT" || e.code === "ECONNRESET") {
      createPool();
      return pool.query(text, params);
    }
    throw e;
  }
}

module.exports = { pool, query };
