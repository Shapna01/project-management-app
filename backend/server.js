const express = require("express");
const cors = require("cors");
const pool = require("./db");

const app = express();


app.use(cors());
app.use(express.json());


app.get("/projects", async (req, res) => {
  try {
    const data = await pool.query(`
      SELECT 
        p.*,
        COALESCE(
          json_agg(DISTINCT pm) FILTER (WHERE pm.id IS NOT NULL),
          '[]'
        ) AS team,
        COUNT(DISTINCT t.id) AS issues
      FROM projects p
      LEFT JOIN project_members pm ON p.id = pm.project_id
      LEFT JOIN tasks t ON p.id = t.project_id
      GROUP BY p.id
      ORDER BY p.id DESC
    `);

    return res.status(200).json(data.rows);
  } catch (err) {
    console.error("❌ PROJECT ERROR FULL:", err);

    return res.status(500).json({
      error: "Database query failed",
      details: err.message
    });
  }
});

app.get("/projects/:id", async (req, res) => {
  try {
    const { id } = req.params;

   const data = await pool.query(`
  SELECT p.*, 
  COALESCE(
    json_agg(DISTINCT pm) FILTER (WHERE pm.id IS NOT NULL), '[]'
  ) AS team,
  COUNT(DISTINCT t.id) AS issues
  FROM projects p
  LEFT JOIN project_members pm ON p.id = pm.project_id
  LEFT JOIN tasks t ON p.id = t.project_id
  GROUP BY p.id
  ORDER BY p.id DESC
`);

    if (data.rows.length === 0) {
      return res.status(404).json({ error: "Project not found" });
    }

    res.json(data.rows[0]);
  } catch (err) {
    console.error("❌ PROJECT ID ERROR:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

app.post("/projects", async (req, res) => {
  try {
    const { title, description } = req.body;

    const data = await pool.query(
      "INSERT INTO projects (title, description, status) VALUES ($1,$2,$3) RETURNING *",
      [title, description, "On Track"]
    );

    res.json(data.rows[0]);
  } catch (err) {
    console.error("❌ CREATE PROJECT ERROR:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});


app.get("/tasks/:projectId", async (req, res) => {
  try {
    const { projectId } = req.params;

    const data = await pool.query(
      "SELECT * FROM tasks WHERE project_id = $1",
      [projectId]
    );

    res.json(data.rows);
  } catch (err) {
    console.error("❌ TASK ERROR:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});
app.get("/tasks", async (req, res) => {
  try {
    const data = await pool.query("SELECT * FROM tasks");
    res.json(data.rows);
  } catch (err) {
    console.error("❌ TASK ERROR:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});


app.get("/", (req, res) => {
  res.send("API is running ");
});


const PORT = 5001;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

app.get("/tasks", async (req, res) => {
  const data = await pool.query("SELECT * FROM tasks ORDER BY id DESC");
  res.json(data.rows);
});

