const express = require("express");
const { upload, uploadToS3 } = require("../middleware/uploadMiddleware");
const { processOCR } = require("../services/ocrService");
const Document = require("../models/document");
const authMiddleware = require("../middleware/authMiddleware");
const pinMiddleware = require("../middleware/pinMiddleware");
const { logAuditAction } = require("../services/auditLogService");

const router = express.Router();

router.post(
  "/upload",
  authMiddleware,
  upload.single("document"),
  async (req, res) => {
    try {
      const userId = req.user.id;
      const { originalname } = req.file;
      const { category } = req.body; // Recebe a categoria do corpo da requisição

      // Validação da categoria
      if (!["RG", "CPF", "CNH"].includes(category)) {
        return res
          .status(400)
          .json({
            error: "Categoria inválida. Use uma das categorias: RG, CPF, CNH",
          });
      }

      // Executar OCR e salvar no S3
      const ocrData = await processOCR(req.file.buffer);
      const s3Upload = await uploadToS3(req.file);

      // Salvar documento com categoria
      const newDocument = new Document({
        userId,
        originalName: originalname,
        s3Key: s3Upload.key,
        category,
        ocrData,
      });

      await newDocument.save();
      res
        .status(201)
        .json({
          message: "Documento enviado com sucesso!",
          document: newDocument,
        });
    } catch (error) {
      console.error("Erro ao fazer upload do documento:", error);
      res.status(500).json({ error: "Erro ao fazer upload do documento" });
    }
  }
);

router.get("/category/:category", authMiddleware, async (req, res) => {
  try {
    const { category } = req.params;
    const userId = req.user.id;

    if (!["RG", "CPF", "CNH"].includes(category)) {
      return res
        .status(400)
        .json({
          error: "Categoria inválida. Use uma das categorias: RG, CPF, CNH",
        });
    }

    const documents = await Document.find({ userId, category });
    res.json(documents);
  } catch (error) {
    console.error("Erro ao buscar documentos por categoria:", error);
    res.status(500).json({ error: "Erro ao buscar documentos por categoria" });
  }
});

router.get("/preview/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const document = await Document.findById(id).select(
      "originalName previewData"
    );

    if (!document)
      return res.status(404).json({ error: "Documento não encontrado" });
    if (document.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Acesso não autorizado ao documento" });
    }

    // Registrar log de auditoria para pré-visualização
    await logAuditAction(req.user.id, document._id, "preview");

    res.json({
      originalName: document.originalName,
      previewData: document.previewData,
    });
  } catch (error) {
    console.error("Erro ao buscar pré-visualização:", error);
    res.status(500).json({ error: "Erro ao buscar pré-visualização" });
  }
});

router.get("/full/:id", authMiddleware, pinMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const document = await Document.findById(id).select("originalName ocrData");

    if (!document)
      return res.status(404).json({ error: "Documento não encontrado" });
    if (document.userId.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Acesso não autorizado ao documento" });
    }

    // Registrar log de auditoria para visualização completa
    await logAuditAction(req.user.id, document._id, "full_view");

    res.json({
      originalName: document.originalName,
      ocrData: document.ocrData,
    });
  } catch (error) {
    console.error("Erro ao buscar visualização completa:", error);
    res.status(500).json({ error: "Erro ao buscar visualização completa" });
  }
});

// Rota para listar logs de auditoria de um documento
router.get('/logs/:documentId', authMiddleware, async (req, res) => {
  try {
    const { documentId } = req.params;
    const logs = await AuditLog.find({ documentId }).sort({ timestamp: -1 });

    if (logs.length === 0) return res.status(404).json({ error: "Nenhum log encontrado para este documento" });

    res.json(logs);
  } catch (error) {
    console.error("Erro ao buscar logs de auditoria:", error);
    res.status(500).json({ error: "Erro ao buscar logs de auditoria" });
  }
});

// Rota para excluir um documento
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Verificar se o documento pertence ao usuário
    const document = await Document.findById(id);
    if (!document)
      return res.status(404).json({ error: "Documento não encontrado" });
    if (document.userId.toString() !== userId) {
      return res.status(403).json({ error: "Acesso não autorizado" });
    }

    // Excluir do S3 e do MongoDB
    await deleteFromS3(document.s3Key);
    await Document.findByIdAndDelete(id);

    res.json({ message: "Documento excluído com sucesso" });
  } catch (error) {
    console.error("Erro ao excluir documento:", error);
    res.status(500).json({ error: "Erro ao excluir documento" });
  }
});


module.exports = router;
