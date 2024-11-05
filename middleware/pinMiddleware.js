function pinMiddleware(req, res, next) {
  const { pin } = req.body; // Recebe o PIN no corpo da requisição
  const userPin = "1234"; // Exemplo de PIN (substituir por verificação real)

  if (pin === userPin) {
    next();
  } else {
    res.status(403).json({ error: "PIN inválido" });
  }
}

module.exports = pinMiddleware;
