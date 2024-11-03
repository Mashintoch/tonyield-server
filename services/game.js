require("dotenv").config();
const { TonClient, WalletContractV4, internal } = require("@ton/ton");
const { mnemonicToPrivateKey } = require("@ton/crypto");
const { verifyTelegramWebAppData, generateMnemonic } = require("../helpers/verifyTelegram")
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
  gameContract = await GameContract.create(
    client,
    process.env.CONTRACT_MNEMONIC
  );
})();

let leaderboard = [];


const submitScore = () => {
  try {
    const { userId, score, webAppData } = req.body;

    if (!verifyTelegramWebAppData(webAppData)) {
      return new Error("Unauthorized");
    }

    leaderboard.push({
      userId,
      score,
      timestamp: Date.now(),
    });

    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 100);

    res.json({ success: true });
  } catch (error) {
    console.error("Error submitting score:", error);
    return new Error("Server error");
  }
};

const claimRewards = async () => {
  try {
    const { userId, score, address, webAppData } = req.body;

    if (!verifyTelegramWebAppData(webAppData)) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Calculate rewards (1 TON per 1000 points)
    const rewardAmount = Math.floor((score / 1000) * 1_000_000_000);

    const tx = await gameContract.sendRewards(address, rewardAmount);

    res.json({
      success: true,
      transaction: tx.hash,
    });
  } catch (error) {
    console.error("Error claiming rewards:", error);
    return new Error("Server error");
  }
};

const getLeaderboard = () => {
  try {
    return leaderboard.slice(0, 10);
  } catch (error) {
    return new Error("server error", error);
  }
};

module.exports = {
  claimRewards,
  getLeaderboard,
  submitScore,
};
