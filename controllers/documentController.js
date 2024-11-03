const s3 = require("../config/cloudStorage");
const { processImage } = require("../services/ocrService");
const Document = require("../models/documentModel");

const uploadDocument = async (req, res) => {
  const { userId, documentType } = req.body;
  const documentFile = req.file;

  // Upload do documento para o S3
  const uploadParams = {
    Bucket: process.env.CLOUD_STORAGE_BUCKET,
    Key: `${userId}/${documentFile.originalname}`,
    Body: documentFile.buffer,
  };
  const uploadResult = await s3.upload(uploadParams).promise();

  // Processamento do OCR
  const extractedText = await processImage(uploadResult.Location);

  // Salvando metadados no MongoDB
  const newDocument = new Document({
    userId,
    fileUrl: uploadResult.Location,
    type: documentType,
    dataExtracted: { text: extractedText },
  });
  await newDocument.save();

  res
    .status(201)
    .json({
      message: "Documento carregado e processado com sucesso",
      document: newDocument,
    });
};

module.exports = { uploadDocument };
