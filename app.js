const express = require("express");
const mongoose = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const documentRoutes = require("./routes/documentRoutes");
const logRoutes = require("./routes/logRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

// Middlewares globais
app.use(express.json());

// Configuração das rotas
app.use("/api/auth", authRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/logs", logRoutes);

// Middleware de tratamento de erros
app.use(errorHandler);

module.exports = app;
