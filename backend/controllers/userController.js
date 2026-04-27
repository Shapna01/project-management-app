const pool = require("../db");

exports.getProfile = async (req, res) => {
  try {
    const user = await pool.query(
      `SELECT id, name, email, role, location, bio, phone, avatar
       FROM users WHERE id = $1`,
      [req.user.id]
    );

    res.json(user.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, location, bio, phone } = req.body;

    await pool.query(
      `UPDATE users
       SET name=$1, location=$2, bio=$3, phone=$4
       WHERE id=$5`,
      [name, location, bio, phone, req.user.id]
    );

    res.json({ message: "Profile updated" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};

exports.getUsers = async (req, res) => {
  try {
    const users = await pool.query(
      "SELECT id, name, avatar FROM users ORDER BY id"
    );

    res.json(users.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};