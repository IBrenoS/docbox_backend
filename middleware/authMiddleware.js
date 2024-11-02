const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/auth");

const authMiddleware = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "Token não fornecido" });

  jwt.verify(token.split(" ")[1], jwtSecret, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Token inválido" });
    req.userId = decoded.id;
    next();
  });
};

module.exports = authMiddleware;
