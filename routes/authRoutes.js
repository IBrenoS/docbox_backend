const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  register,
  login,
  verifyPin,
  setupBiometrics,
  setSessionTimeout,
  revokeToken,
} = require("../controllers/authController");


router.post("/register", register);
router.post("/login", login);
router.post("/verify-pin", verifyPin);
router.post("/setup-biometrics", setupBiometrics);
router.post("/session-timeout", setSessionTimeout);
router.post("/revoke-token", revokeToken);
router.post('/revoke-token', authMiddleware, revokeToken);
router.post('/logout', authMiddleware, revokeToken);


module.exports = router;
