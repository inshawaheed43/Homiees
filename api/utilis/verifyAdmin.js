import jwt from "jsonwebtoken";

const verifyAdmin = (req, res, next) => {
  const token = req.cookies.access_token;
  if (!token) return res.status(401).json("No token, access denied.");

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json("Invalid token.");
    if (user.role !== "admin") return res.status(403).json("Access denied.");

    req.user = user;
    next();
  });
};

export default verifyAdmin;
