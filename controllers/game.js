const GameService = require("../services/game");
const response = require("../helpers/responseHelper");

const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await GameService.getLeaderboard();
    return response(res, 200, "Leaderboard retrieved", leaderboard);
  } catch (error) {
    console.error("Error retrieving leaderboard:", error);
    return response(res, 500, "Error retrieving leaderboard", error.message);
  }
};

const claimRewards = async (req, res) => {
  try {
    const { score, address, webAppData } = req.body;

    if (
      typeof score !== "number" ||
      typeof address !== "string" ||
      typeof webAppData !== "object"
    ) {
      return response(
        res,
        400,
        "Invalid request data",
        "Ensure score is a number, address is a string, and webAppData is an object"
      );
    }

    const rewardResult = await GameService.claimRewards(
      score,
      address,
      webAppData
    );
    return response(res, 200, "Rewards claimed", rewardResult);
  } catch (error) {
    console.error("Error claiming rewards:", error);
    return response(res, 500, "Error claiming rewards", error.message);
  }
};

const submitScore = async (req, res) => {
  try {
    const { score, address, webAppData } = req.body;

    if (
      typeof score !== "number" ||
      typeof address !== "string" ||
      typeof webAppData !== "object"
    ) {
      return response(
        res,
        400,
        "Invalid request data",
        "Ensure score is a number, address is a string, and webAppData is an object"
      );
    }

    const rewardResult = await GameService.submitScore(
      score,
      address,
      webAppData
    );
    return response(res, 200, "Rewards claimed", rewardResult);
  } catch (error) {
    console.error("Error claiming rewards:", error);
    return response(res, 500, "Error claiming rewards", error.message);
  }
};

module.exports = {
  getLeaderboard,
  claimRewards,
  submitScore,
};
