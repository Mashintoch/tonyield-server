const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    reward: {
      type: Number,
      default: 0,
    },
    level: {
      type: Number,
      default: 1,
    },
    experience: {
      type: Number,
      default: 0,
    },
    rewardsHistory: [
      {
        amount: Number,
        type: {
          type: String,
          enum: ["shake", "mining", "spin"],
          required: true,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
        transactionHash: String,
      },
    ],
    lastMiningTime: {
      type: Date,
      default: Date.now,
    },
    lastShakeTime: {
      type: Date,
      default: Date.now,
    },
    dailyGain: { type: Number, default: 0 },
    rank: { type: Number },
    previousRank: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Game", gameSchema);
