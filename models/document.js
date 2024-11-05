const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  originalName: { type: String, required: true },
  s3Key: { type: String, required: true },
  ocrData: { type: String }, // Dados extraídos pelo OCR (completo)
  previewData: { type: String }, // Dados de pré-visualização (ocultos)
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Document", DocumentSchema);
