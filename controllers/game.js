require("dotenv").config();
const { TonClient, WalletContractV4, internal } = require("@ton/ton");
const { mnemonicToPrivateKey } = require("@ton/crypto");
const { verifyTelegramWebAppData } = require("../helpers/verifyTelegram");
const Game = require("../models/game");


const client = new TonClient({
  endpoint: process.env.TON_ENDPOINT,
});

class GameContract {
  constructor(client, address) {
    this.client = client;
    this.address = address;
  }

  static async create(client, mnemonic) {
    const key = await mnemonicToPrivateKey(mnemonic.split(" "));
    const wallet = WalletContractV4.create({ publicKey: key.publicKey });

    return new GameContract(client, wallet.address);
  }

  async sendRewards(userAddress, amount) {
    const wallet = await this.client.open(this.address);

    const transfer = await wallet.createTransfer({
      validUntil: Math.floor(Date.now() / 1000) + 600,
      messages: [
        internal({
          to: userAddress,
          value: amount.toString(),
          body: "Reward payment",
        }),
      ],
    });

    return await wallet.send(transfer);
  }
}

let gameContract;
(async () => {
  gameContract = await new GameContract(client, process.env.CONTRACT_MNEMONIC);
})();

const getUserRewards = async (req, res) => {
  try {
    const { webAppData } = req.body;

    if (!verifyTelegramWebAppData(webAppData)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = webAppData.user.id;
    let userGame = await Game.findOne({ user: userId });

    if (!userGame) {
      userGame = await Game.create({
        user: userId,
        reward: 0,
        level: 1,
        experience: 0,
      });
    }

    // Check if mining reward is available (30 minutes cooldown)
    const miningAvailable =
      Date.now() - new Date(userGame.lastMiningTime).getTime() > 1800000;

    return res.status(200).json({
      success: true,
      data: {
        totalRewards: userGame.reward,
        level: userGame.level,
        experience: userGame.experience,
        rewardsHistory: userGame.rewardsHistory,
        miningAvailable,
      },
    });
  } catch (error) {
    console.error("Error fetching rewards:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

const updateRewards = async (req, res) => {
  try {
    const { webAppData, rewardAmount, rewardType, experience = 0 } = req.body;

    if (!verifyTelegramWebAppData(webAppData)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = webAppData.user.id;
    let userGame = await Game.findOne({ user: userId });

    if (!userGame) {
      userGame = await Game.create({
        user: userId,
        reward: 0,
        level: 1,
        experience: 0,
      });
    }

    // Validate cooldowns
    if (rewardType === "mining") {
      const timeSinceLastMining =
        Date.now() - new Date(userGame.lastMiningTime).getTime();
      if (timeSinceLastMining < 1800000) {
        // 30 minutes
        return res.status(400).json({ error: "Mining cooldown not finished" });
      }
    }

    if (rewardType === "shake") {
      const timeSinceLastShake =
        Date.now() - new Date(userGame.lastShakeTime).getTime();
      if (timeSinceLastShake < 100) {
        // 100ms cooldown
        return res.status(400).json({ error: "Shake cooldown not finished" });
      }
    }

    // Send TON rewards if applicable
    let transactionHash = null;
    if (rewardAmount >= 1000) {
      // Minimum threshold for TON rewards
      try {
        const tx = await gameContract.sendRewards(
          userGame.walletAddress,
          Math.floor((rewardAmount / 1000) * 1_000_000_000) // Convert to TON
        );
        transactionHash = tx.hash;
      } catch (error) {
        console.error("Error sending TON rewards:", error);
        // Continue with updating database even if blockchain transfer fails
      }
    }

    // Update experience and level
    let newExperience = userGame.experience + experience;
    let newLevel = userGame.level;

    while (newExperience >= 100) {
      newLevel += 1;
      newExperience -= 100;
    }

    // Update the game document
    const update = {
      $inc: { reward: rewardAmount },
      $set: {
        level: newLevel,
        experience: newExperience,
        ...(rewardType === "mining" && { lastMiningTime: new Date() }),
        ...(rewardType === "shake" && { lastShakeTime: new Date() }),
      },
      $push: {
        rewardsHistory: {
          amount: rewardAmount,
          type: rewardType,
          timestamp: new Date(),
          ...(transactionHash && { transactionHash }),
        },
      },
    };

    userGame = await Game.findOneAndUpdate({ user: userId }, update, {
      new: true,
    });

    return res.status(200).json({
      success: true,
      data: {
        totalRewards: userGame.reward,
        level: userGame.level,
        experience: userGame.experience,
        rewardsHistory: userGame.rewardsHistory,
        transactionHash,
      },
    });
  } catch (error) {
    console.error("Error updating rewards:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

const getLeaderboard = async (req, res) => {
  try {
    const { webAppData } = req.body;

    if (!verifyTelegramWebAppData(webAppData)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const leaderboard = await Game.find({})
      .sort({ reward: -1 })
      .limit(100)
      .populate("user", "username");

    const userRank =
      (await Game.countDocuments({
        reward: { $gt: userGame.reward },
      })) + 1;

    return res.status(200).json({
      success: true,
      data: {
        leaderboard,
        userRank,
      },
    });
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getUserRewards,
  updateRewards,
  getLeaderboard,
};
