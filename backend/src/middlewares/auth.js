const { verifyAccessToken } = require("../utils/jwt");

const authMiddleware = (requiredRole) => (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  const decoded = verifyAccessToken(token);
  if (!decoded) {
    return res.status(401).json({ message: "Invalid token" });
  }

  if (requiredRole && decoded.role !== requiredRole) {
    return res
      .status(403)
      .json({ message: "Access forbidden: insufficient permissions" });
  }

  console.log({decoded});
  req.user = decoded;
  next();
};

module.exports = { authMiddleware };
