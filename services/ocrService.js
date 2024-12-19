const Tesseract = require("tesseract.js");

async function processOCR(imageBuffer) {
  try {
    const {
      data: { text },
    } = await Tesseract.recognize(imageBuffer, "por");
    return text;
  } catch (error) {
    console.error("Erro no OCR:", error);
    throw new Error("Erro ao processar OCR");
  }
}

module.exports = { processOCR };
