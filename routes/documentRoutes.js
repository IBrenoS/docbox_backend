const express = require("express");
const router = express.Router();
const { uploadDocument, getDocument, updateDocument, deleteDocument } = require("../controllers/documentController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/upload-document", authMiddleware, uploadDocument);
router.get("/get-document/:documentId", authMiddleware, getDocument);
router.put("/update-document/:documentId", authMiddleware, updateDocument);
router.delete("/delete-document/:documentId", authMiddleware, deleteDocument);

module.exports = router;
