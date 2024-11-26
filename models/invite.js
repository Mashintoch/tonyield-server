const mongoose = require('mongoose')

const inviteSchema = new mongoose.Schema(
  {
    referrer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    referred_user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    invite_code: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['pending', 'completed'],
      default: 'pending'
    }
  },
  { timestamps: true }
)

const Invite = mongoose.model('Invite', inviteSchema)
module.exports = Invite