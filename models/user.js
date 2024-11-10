const mongoose = require('mongoose')

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
