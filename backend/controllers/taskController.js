const pool = require("../db");

exports.getTasks = async (req, res) => {
  const data = await pool.query("SELECT * FROM tasks ORDER BY id DESC");
  res.json(data.rows);
};

exports.createTask = async (req, res) => {
  const { title, description, assigned_to, status, time_spent } = req.body;

  const data = await pool.query(
    `INSERT INTO tasks (title, description, assigned_to, status, time_spent)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [title, description, assigned_to, status, time_spent]
  );

  res.json(data.rows[0]);
};