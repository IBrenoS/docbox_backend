const mongoose = require("mongoose");

const DocumentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  originalName: { type: String, required: true },
  s3Key: { type: String, required: true },
  category: { type: String, required: true, enum: ["RG", "CPF", "CNH"] }, // Adiciona a categoria com opções pré-definidas
  ocrData: { type: String },
  previewData: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Document", DocumentSchema);
