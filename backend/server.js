const express = require("express");
const cors = require("cors");
const pool = require("./db");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const JWT_SECRET = "your_secret_key";
const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());

app.use(cookieParser());


app.get("/projects", async (req, res) => {
  try {
    const data = await pool.query(
      "SELECT * FROM projects ORDER BY id DESC"
    );
    res.json(data.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


app.post("/projects", async (req, res) => {
  try {
    const { title, description, type, startDate, endDate } = req.body;

    const data = await pool.query(
      `INSERT INTO projects 
      (title, description, type, start_date, end_date, status) 
      VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
      [title, description, type, startDate, endDate, "On Track"]
    );

    res.json(data.rows[0]);
  } catch (err) {
    console.error("❌ ERROR:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});




app.get("/tasks", async (req, res) => {
  try {
    const data = await pool.query(
      "SELECT * FROM tasks ORDER BY id DESC"
    );
    res.json(data.rows);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});


app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // ✅ Validate input
    if (!username || !password) {
      return res.status(400).json({ message: "Email & password required" });
    }

    const result = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [username]
    );

    // ✅ User not found
    if (result.rows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const user = result.rows[0];

    // ✅ Password check
    if (user.password !== password) {
      return res.status(401).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role || "viewer" },
      JWT_SECRET
    );

    res.cookie("jwtToken", token, {
      httpOnly: true,
    });

    res.json({ success: true });

  } catch (err) {
    console.error("LOGIN ERROR:", err);  
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/", (req, res) => {
  res.send("API is running");
});



app.get("/dashboard", async (req, res) => {
  try {
    const { filter } = req.query;

    let dateFilter = "";

    if (filter === "week") {
      dateFilter = `WHERE start_date >= NOW() - INTERVAL '7 days'`;
    } else {
      dateFilter = `WHERE DATE_TRUNC('month', start_date) = DATE_TRUNC('month', NOW())`;
    }

    const performanceResult = await pool.query(`
      SELECT 
        TO_CHAR(start_date, 'Mon') AS month,
        COUNT(*) AS achieved,
        AVG(target) AS target
      FROM projects
      ${dateFilter}
      GROUP BY month
      ORDER BY MIN(start_date)
    `);

    const performance = performanceResult.rows.map((row) => ({
      month: row.month,
      achieved: Number(row.achieved),
      target: Math.round(row.target || 0),
    }));

    const worklogResult = await pool.query(`
      SELECT status AS name, COUNT(*) AS value
      FROM tasks
      GROUP BY status
    `);

    const worklog = worklogResult.rows.map((row) => ({
      name: row.name,
      value: Number(row.value),
    }));

    const taskResult = await pool.query(`
      SELECT title, status
      FROM tasks
      ORDER BY id DESC
      LIMIT 5
    `);

    const tasks = taskResult.rows;

    res.json({ performance, worklog, tasks });

  } catch (err) {
    console.error("DASHBOARD ERROR:", err);
    res.status(500).json({ error: "Dashboard error" });
  }
});



app.post("/api/tasks", async (req, res) => {
  try {
    const { title, assigned_to } = req.body;

    const result = await pool.query(
      "INSERT INTO tasks (title, assigned_to) VALUES ($1, $2) RETURNING *",
      [title, assigned_to]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


app.post("/tasks", async (req, res) => {
  try {
    const { title, description, assigned_to, status, time_spent } = req.body;

    const data = await pool.query(
      `INSERT INTO tasks (title, description, assigned_to, status, time_spent)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        title,
        description || "",
        assigned_to,
        status || "pending",
        time_spent || "00:00:00",
      ]
    );

    res.json(data.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});   

app.get("/profile", authMiddleware, async (req, res) => {
  try {
    const user = await pool.query(
      `SELECT id, name, email, role, location, bio, phone, avatar
       FROM users WHERE id = $1`,
      [req.user.id]
    );

    res.json(user.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.put("/profile", authMiddleware, async (req, res) => {
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
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

app.get("/users", async (req, res) => {
  try {
    const users = await pool.query(
      "SELECT id, name, avatar FROM users ORDER BY id"
    );

    res.json(users.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});
app.post("/register", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existing = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const result = await pool.query(
      `INSERT INTO users (name, email, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, role`,
      [name, email, password, role]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
