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

module.exports = { login };
