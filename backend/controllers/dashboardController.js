const pool = require("../db");

exports.getDashboard = async (req, res) => {
  try {
    const performanceResult = await pool.query(`SELECT COUNT(*) FROM projects`);
    res.json({ performance: performanceResult.rows });
  } catch (err) {
    res.status(500).json({ error: "Dashboard error" });
  }
};