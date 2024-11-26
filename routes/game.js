const GameController = require("../controllers/game");
const express = require("express");

const router = express.Router();

router.post('/rewards', GameController.getUserRewards);
router.post('/rewards/update', GameController.updateRewards);
router.post('/leaderboard', GameController.getLeaderboard);

module.exports = router;
