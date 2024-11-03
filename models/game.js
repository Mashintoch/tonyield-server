const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    rewards: {
      type: [Number],
    },
    leaderboard: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Game", gameSchema);
