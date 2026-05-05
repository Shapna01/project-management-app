const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "project_tracker",
  password: "postgres",
  port: 5432,
});
pool.connect((err, client, release) => {
  if (err) {
    console.error("❌ DB CONNECTION ERROR:", err);
  } else {
    console.log("✅ DB CONNECTED SUCCESSFULLY");
    release();
  }
});

module.exports = pool;