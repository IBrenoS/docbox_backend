const mongoose = require("mongoose");

const AuditLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Document",
    required: true,
  },
  action: { type: String, enum: ["preview", "full_view"], required: true }, // Tipo de ação
  timestamp: { type: Date, default: Date.now }, // Data e hora da ação
});

module.exports = mongoose.model("AuditLog", AuditLogSchema);
