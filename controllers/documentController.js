const s3 = require("../config/cloudStorage");
const { processImage } = require("../services/ocrService");
const Document = require("../models/documentModel");
const { logAction } = require("../utils/logger");
require("dotenv").config();


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

  // Log do upload de documento
  logAction(
    userId,
    "upload-document",
    `Documento ${documentFile.originalname} carregado`
  );

  res.status(201).json({
    message: "Documento carregado e processado com sucesso",
    document: newDocument,
  });
};

const getDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const document = await Document.findById(documentId);

    if (!document) {
      return res.status(404).json({ message: "Documento não encontrado" });
    }

    res.status(200).json({ document });
  } catch (error) {
    res.status(500).json({ message: "Erro ao recuperar documento", error });
  }
};

const updateDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const updates = req.body;

    const document = await Document.findByIdAndUpdate(documentId, updates, {
      new: true,
    });

    if (!document) {
      return res
        .status(404)
        .json({ message: "Documento não encontrado para atualização" });
    }

    res
      .status(200)
      .json({ message: "Documento atualizado com sucesso", document });
  } catch (error) {
    res.status(500).json({ message: "Erro ao atualizar documento", error });
  }
};

const deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    const document = await Document.findByIdAndDelete(documentId);
    if (!document) {
      return res
        .status(404)
        .json({ message: "Documento não encontrado para exclusão" });
    }

    // Exclui o arquivo da nuvem (AWS S3, Google Cloud, etc.)
    const params = {
      Bucket: process.env.CLOUD_STORAGE_BUCKET,
      Key: document.fileUrl.split("/").pop(), // Nome do arquivo a ser excluído
    };
    await s3.deleteObject(params).promise();

    res.status(200).json({ message: "Documento excluído com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir documento", error });
  }
};

module.exports = {
  uploadDocument,
  getDocument,
  updateDocument,
  deleteDocument,
};
