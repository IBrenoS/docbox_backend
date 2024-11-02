const fs = require("fs");
const path = require("path");

const logFile = path.join(__dirname, "../logs/audit.log");

const logAction = (userId, action, details = "") => {
  const logEntry = `${new Date().toISOString()} | User: ${userId} | Action: ${action} | Details: ${details}\n`;
  fs.appendFileSync(logFile, logEntry, "utf8");
};

module.exports = { logAction };
