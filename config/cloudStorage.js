const AWS = require("aws-sdk");

const s3 = new AWS.S3({
  accessKeyId: process.env.CLOUD_STORAGE_KEY,
  secretAccessKey: process.env.CLOUD_STORAGE_SECRET,
  region: process.env.CLOUD_STORAGE_REGION,
});

module.exports = s3;
