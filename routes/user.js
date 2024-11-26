const UserController = require("../controllers/user");
const express = require("express");

const router = express.Router();

router.post("/user", UserController.authenticateUser);

router.post("/user/invite", UserController.getInviteLink);

router.post("/user/qr-code", UserController.getInviteQRCode);

module.exports = router;
