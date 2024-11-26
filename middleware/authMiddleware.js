const jwt = require("jsonwebtoken");
const logger = require("../logger");
require("dotenv").config();

function verifyToken(req, res, next) {
  logger.info("Verifying token");
  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    return res.status(403).json({ message: "Token not provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(403).json({ message: "Token not provided" });
  }

  jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
    if (err) {
      return res
        .status(401)
        .json({ message: "Unauthorized", error: err.message });
    }
    req.user = decoded;
    next();
  });
}

module.exports = {
  verifyToken,
};
