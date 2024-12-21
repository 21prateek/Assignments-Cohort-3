//  start writing from here
const jwt = require("jsonwebtoken");
const JWT_SECRET = "secret";

function userMiddleware(req, res, next) {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "Token not provided" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded) {
      return res.json({ message: "Something went wrong" });
    }

    req.userId = decoded.id;

    next();
  } catch (e) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
}

module.exports =  userMiddleware ;
