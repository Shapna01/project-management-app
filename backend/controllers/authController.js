const pool = require("../db");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "your_secret_key";

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = result.rows[0];

    if (user.password !== password) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role || "viewer" },
      JWT_SECRET
    );

    res.cookie("jwtToken", token, { httpOnly: true });

    res.json({ success: true });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const result = await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role`,
      [name, email, password, role]
    );

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};