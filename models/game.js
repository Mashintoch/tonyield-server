const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    rewards: {
      type: Number,
    },
    levels: {
      type: String,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Game", gameSchema);
