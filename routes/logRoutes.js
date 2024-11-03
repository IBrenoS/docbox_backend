const express = require("express");
const router = express.Router();
const { getAuditLog } = require("../controllers/logController");
const authMiddleware = require("../middleware/authMiddleware");

// Rota protegida para consulta de auditoria
router.get("/get-audit-log", authMiddleware, getAuditLog);

module.exports = router;
