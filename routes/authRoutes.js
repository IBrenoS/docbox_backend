const express = require("express");
const router = express.Router();
const {
  login,
  verifyPin,
  setupBiometrics,
  setSessionTimeout,
  revokeToken,
} = require("../controllers/authController");

router.post("/login", login);
router.post("/verify-pin", verifyPin);
router.post("/setup-biometrics", setupBiometrics);
router.post("/session-timeout", setSessionTimeout);
router.post("/revoke-token", revokeToken);

module.exports = router;
