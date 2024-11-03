const { S3Client } = require("@aws-sdk/client-s3");

const s3 = new S3Client({
  region: process.env.CLOUD_STORAGE_REGION,
  credentials: {
    accessKeyId: process.env.CLOUD_STORAGE_KEY,
    secretAccessKey: process.env.CLOUD_STORAGE_SECRET,
  },
});

module.exports = s3;
