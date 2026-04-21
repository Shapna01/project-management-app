const authMiddleware = (req, res, next) => {
  const token = req.cookies.jwtToken;

  if (!token) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ error: "Invalid token" });
  }
};