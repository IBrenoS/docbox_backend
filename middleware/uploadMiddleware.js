const multer = require("multer");
const { PutObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/s3");

// Configuração de multer para receber o arquivo
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Função para fazer upload manual ao S3
async function uploadToS3(file) {
  const uploadParams = {
    Bucket: process.env.S3_BUCKET_NAME,
    Key: `${Date.now()}_${file.originalname}`,
    Body: file.buffer,
  };

  try {
    const result = await s3.send(new PutObjectCommand(uploadParams));
    return { key: uploadParams.Key, result };
  } catch (error) {
    console.error("Erro ao fazer upload para o S3:", error);
    throw new Error("Erro ao fazer upload para o S3");
  }
}

module.exports = { upload, uploadToS3 };
