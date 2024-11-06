const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const s3 = require("../config/s3");

async function deleteFromS3(s3Key) {
  const params = { Bucket: process.env.S3_BUCKET_NAME, Key: s3Key };
  try {
    await s3.send(new DeleteObjectCommand(params));
    console.log("Arquivo excluído do S3:", s3Key);
  } catch (error) {
    console.error("Erro ao excluir do S3:", error);
    throw new Error("Erro ao excluir do S3");
  }
}

module.exports = { deleteFromS3 };
