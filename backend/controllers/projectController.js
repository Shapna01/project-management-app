const pool = require("../db");

exports.getProjects = async (req, res) => {
  const data = await pool.query("SELECT * FROM projects ORDER BY id DESC");
  res.json(data.rows);
};

exports.createProject = async (req, res) => {
  const { title, description, type, startDate, endDate } = req.body;

  const data = await pool.query(
    `INSERT INTO projects 
    (title, description, type, start_date, end_date, status) 
    VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [title, description, type, startDate, endDate, "On Track"]
  );

  res.json(data.rows[0]);
};