function createPreviewData(ocrData) {
  // Exemplo simples: Oculta dígitos de CPF e RG
  const preview = ocrData.replace(
    /\d{3}\.\d{3}\.\d{3}-\d{2}/g,
    "***.***.***-**"
  );
  return preview.replace(/\d{2}\.\d{3}\.\d{3}/g, "**.***.***");
}

module.exports = { createPreviewData };
