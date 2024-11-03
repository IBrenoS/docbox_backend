const express = require("express");
const mongoose = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");
const logRoutes = require("./routes/logRoutes");

const app = express();

// Middlewares globais
app.use(express.json());

// Configuração das rotas
app.use("/auth", authRoutes);
app.use("/documents", documentRoutes);
app.use("/logs", logRoutes);


module.exports = app;
