const pool = require("../db");

exports.getDashboard = async (req, res) => {
  try {
    const taskResult = await pool.query(
      "SELECT * FROM tasks ORDER BY id DESC"
    );

    const performanceResult = await pool.query(`
      SELECT 
        TO_CHAR(created_at, 'Mon') AS month,
        COUNT(*)::int AS achieved
      FROM projects
      GROUP BY month
      ORDER BY MIN(created_at)
    `);

    const worklogResult = await pool.query(`
      SELECT status AS name, COUNT(*)::int AS value
      FROM tasks
      GROUP BY status
    `);

    res.json({
      tasks: taskResult.rows,
      performance: performanceResult.rows,
      worklog: worklogResult.rows,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Dashboard error" });
  }
};