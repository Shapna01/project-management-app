const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    console.log("❌ No Authorization header");
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );

    console.log(" USER:", decoded);

    req.user = decoded;
    next();
  } catch (err) {
    console.log("❌ Invalid token:", err);
    return res.status(403).json({ message: "Invalid token" });
  }
};

module.exports = verifyToken;