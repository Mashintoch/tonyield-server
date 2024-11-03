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
    points: {
      type: Number,
      default: 0,
    },
    wallet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Wallet',
    },
    game: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Game',
    }]
  },
  { timestamps: true }
)

const User = mongoose.model('User', userSchema)
module.exports = User
