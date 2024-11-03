const fs = require("fs");
const path = require("path");
const logFile = path.join(__dirname, "../logs/audit.log");

const getAuditLog = (req, res) => {
  try {
    const logs = fs.readFileSync(logFile, "utf8");
    const logEntries = logs.split("\n").filter((entry) => entry);
    res.json({ logs: logEntries });
  } catch (err) {
    res.status(500).json({ message: "Erro ao ler logs de auditoria" });
  }
};

module.exports = { getAuditLog };
