const s3 = require("../config/cloudStorage");
const { processImage } = require("../services/ocrService");
const Document = require("../models/documentModel");
const { PutObjectCommand } = require("@aws-sdk/client-s3");

const uploadDocument = async (req, res) => {
  const { userId, documentType } = req.body;
  const documentFile = req.file;

  // Configuração dos parâmetros de upload
  const uploadParams = {
    Bucket: process.env.CLOUD_STORAGE_BUCKET,
    Key: `${userId}/${documentFile.originalname}`,
    Body: documentFile.buffer,
  };

  try {
    // Executando o comando de upload com PutObjectCommand
    const command = new PutObjectCommand(uploadParams);
    const uploadResult = await s3.send(command);

    // Construindo a URL do arquivo (a v3 não retorna Location diretamente)
    const fileUrl = `https://${uploadParams.Bucket}.s3.${process.env.CLOUD_STORAGE_REGION}.amazonaws.com/${uploadParams.Key}`;

    // Processamento do OCR
    const extractedText = await processImage(fileUrl);

    // Salvando metadados no MongoDB
    const newDocument = new Document({
      userId,
      fileUrl,
      type: documentType,
      dataExtracted: { text: extractedText },
    });
    await newDocument.save();

    res.status(201).json({
      message: "Documento carregado e processado com sucesso",
      document: newDocument,
    });
  } catch (error) {
    console.error("Erro ao fazer upload para o S3:", error);
    res.status(500).json({ message: "Erro ao carregar documento", error });
  }
};

module.exports = { uploadDocument };
