const express = require("express");
const router = express.Router();
const { uploadDocument } = require("../controllers/documentController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/upload-document", authMiddleware, uploadDocument);

module.exports = router;
