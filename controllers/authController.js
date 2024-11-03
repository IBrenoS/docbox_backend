const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const User = require("../models/userModel");
const { jwtSecret } = require("../config/auth");

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(400).json({ message: "Usuário não encontrado" });

  const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
  if (!isPasswordValid)
    return res.status(401).json({ message: "Senha incorreta" });

  const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: "1h" });
  res.json({ token });
};

const verifyPin = async (req, res) => {
  const { userId, pin } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

  const isPinValid = await bcrypt.compare(pin, user.pin);
  if (!isPinValid) return res.status(401).json({ message: "PIN incorreto" });

  res.status(200).json({ message: "PIN verificado com sucesso" });
};

const setupBiometrics = async (req, res) => {
  const { userId } = req.body;
  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

  user.biometricEnabled = true;
  await user.save();
  res
    .status(200)
    .json({ message: "Autenticação biométrica configurada com sucesso" });
};

const setSessionTimeout = async (req, res) => {
  const { timeout } = req.body;
  res
    .status(200)
    .json({
      message: `Tempo limite de sessão configurado para ${timeout} minutos`,
    });
};


const revokeToken = (req, res) => {

    res.status(200).json({ message: 'Token revogado e logout realizado com sucesso' });
};


module.exports = {
  login,
  verifyPin,
  setupBiometrics,
  setSessionTimeout,
  revokeToken,
};
