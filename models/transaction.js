const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    enum: ["deposit", "withdrawal"],
    required: true,
  },
  status: {
    type: String,
    enum: [" pending", " approved", "declined"],
    default: "pending",
  },
});

const Transaction = mongoose.model("Transaction", transactionSchema);

export default Transaction;
