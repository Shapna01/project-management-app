const pool = require("../db");

exports.getTasks = async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM tasks ORDER BY id DESC");
    res.json(data.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
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
