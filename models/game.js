const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema(
  {
    reward: {
      type: Number,
      default: 0,
    },
    level: {
      type: String,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Game", gameSchema);
