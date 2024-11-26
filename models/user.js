const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    telegram_id: {
      type: String,
      unique: true,
    },
    username: {
      type: String,
      unique: true,
    },
    first_name: String,
    last_name: String,
    email: {
      type: String,
      unique: true,
    },
    avatar_url: String,
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
    },
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Game",
    },
    is_bot: {
      type: Boolean,
    },
    language_code: {
      type: String,
    },
    invite_code: {
      type: String,
      unique: true,
      default: () => Math.random().toString(36).substring(2, 10).toUpperCase(),
    },
    referred_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    total_referrals: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
