const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();

app.use(cors());
app.use(express.json());


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


app.get("/projects/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const data = await pool.query(
      "SELECT * FROM projects WHERE id = $1",
      [id]
    );

    res.json(data.rows[0]);
  } catch (err) {
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
    const { email, password } = req.body;

    const user = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (user.rows.length === 0) {
      return res.status(401).json({ error: "User not found" });
    }

    if (user.rows[0].password !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    res.json({ message: "Login success", user: user.rows[0] });

  } catch (err) {
    console.error("❌ LOGIN ERROR:", err.message);
    res.status(500).json({ error: "Server error" });
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

app.post("/tasks", async (req, res) => {
  try {
    const { title, status } = req.body;

    const data = await pool.query(
      `INSERT INTO tasks (title, status)
       VALUES ($1,$2)
       RETURNING *`,
      [title, status]
    );

    res.json(data.rows[0]);

  } catch (err) {
    console.error("TASK INSERT ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
