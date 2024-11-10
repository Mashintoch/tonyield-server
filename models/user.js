const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
  {
    telegramId: {
      type: String,
      unique: true,
    },
    username: {
      type: String,
      unique: true,
    },
    email: {
      type: String,
      unique: true,
    },
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wallet',
    },
    game: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
    },
    is_bot: {
      type: Boolean,
    },
    language_code: {
      type: String,
    }
  },
  { timestamps: true }
)

const User = mongoose.model('User', userSchema)
module.exports = User
