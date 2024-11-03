const jwt = require("jsonwebtoken");
const { jwtSecret } = require("../config/auth");
const RevokedToken = require("../models/revokedToken");

const authMiddleware = async (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Token não fornecido" });

  // Verificar se o token está na coleção de tokens revogados
  const isRevoked = await RevokedToken.findOne({ token });
  if (isRevoked) {
    return res
      .status(401)
      .json({ message: "Token revogado. Por favor, faça login novamente." });
  }

  jwt.verify(token, jwtSecret, (err, decoded) => {
    if (err) return res.status(401).json({ message: "Token inválido" });
    req.userId = decoded.id;
    next();
  });
};

module.exports = authMiddleware;
