const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const router = express.Router();

// Rota de Registro
router.post("/register", async (req, res) => {
  const { cpf, email, password, confirmPassword, nome, sobrenome } = req.body;
  if (password !== confirmPassword) {
    return res.status(400).json({ error: "As senhas não coincidem" });
  }
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ cpf, password: hashedPassword, email, nome, sobrenome });
    await newUser.save();
    res.status(201).json({ message: "Usuário registrado com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao registrar o usuário" });
  }
});

// Rota de Login
router.post("/login", async (req, res) => {
  const { cpf, password } = req.body;
  try {
    const user = await User.findOne({ cpf });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Credenciais inválidas" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ message: "Login realizado com sucesso!", token });
  } catch (error) {
    res.status(500).json({ error: "Erro ao fazer login" });
  }
});

module.exports = router;
