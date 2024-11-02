const Tesseract = require("tesseract.js");

const processImage = async (imagePath) => {
  return Tesseract.recognize(imagePath, "por")
    .then(({ data: { text } }) => text);
};

module.exports = { processImage };
