const jwt = require("jsonwebtoken");

const JWT_SECRET = "SECRET_USER";

function userMiddleware(req, res, next) {
  // Implement user auth logic
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}

module.exports = userMiddleware;
