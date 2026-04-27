const pool = require("../db");

exports.getProjects = async (req, res) => {
  try {
    const data = await pool.query(
      "SELECT * FROM projects ORDER BY id DESC"
    );
    res.json(data.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.createProject = async (req, res) => {
  try {
    const { title, description, type, startDate, endDate } = req.body;

    const data = await pool.query(
      `INSERT INTO projects
      (title, description, type, start_date, end_date, status)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *`,
      [title, description, type, startDate, endDate, "On Track"]
    );

    res.json(data.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Insert failed" });
  }
};