const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const verifyToken = require("./middleware/verifyToken");
const { keycloak, memoryStore } = require("./keycloak-config");

const authRoutes = require("./routes/authRoutes");
const projectRoutes = require("./routes/projectRoutes");
const taskRoutes = require("./routes/taskRoutes");
const userRoutes = require("./routes/userRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

app.use(cors({
  origin: "http://localhost:3000",
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.use(session({
  secret: "some-secret",
  resave: false,
  saveUninitialized: true,
  store: memoryStore,
}));

app.use(keycloak.middleware());

app.use("/api/auth", authRoutes);

app.use("/api/projects",  projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/users",userRoutes);
app.use("/api/dashboard", dashboardRoutes);

app.get("/", (req, res) => {
  res.send("API running");
});

app.listen(5001, () => {
  console.log("Server running on port 5001");
});