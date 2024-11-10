const UserController = require("../controllers/user");
const express = require("express");

const router = express.Router();

router.post("/user", UserController.authenticateUser);

module.exports = router;
