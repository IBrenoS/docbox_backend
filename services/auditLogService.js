const AuditLog = require("../models/auditLog");

async function logAuditAction(userId, documentId, action) {
  try {
    const log = new AuditLog({ userId, documentId, action });
    await log.save();
    console.log(
      `Log de auditoria salvo: ${action} para o documento ${documentId}`
    );
  } catch (error) {
    console.error("Erro ao salvar log de auditoria:", error);
  }
}

module.exports = { logAuditAction };
