const GameController = require("../controllers/game");
const express = require("express");

const router = express.Router();

router.get("/leaderboard", GameController.getLeaderboard);

router.post("/claim-rewards", GameController.claimRewards);

router.post("/submit-score", GameController.submitScore);

module.exports = router;
