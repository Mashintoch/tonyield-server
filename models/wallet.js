const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true,
      ref: "User",
    },
    balance: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "coins",
    },
    items: [
      {
        itemId: String,
        name: String,
        description: String,
        quantity: { type: Number, default: 1 },
        acquiredAt: { type: Date, default: Date.now },
      },
    ],
    transactions: [
      {
        type: { type: String, enum: ["credit", "debit"], required: true },
        amount: { type: Number, required: true },
        description: String,
        date: { type: Date, default: Date.now },
      },
    ],
    achievements: [
      {
        achievementId: String,
        name: String,
        description: String,
        acquiredAt: { type: Date, default: Date.now },
      },
    ],
    lastLogin: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Define methods for wallet operations
walletSchema.methods = {
  addBalance: function (amount, description = "Credit added") {
    this.balance += amount;
    this.transactions.push({
      type: "credit",
      amount,
      description,
    });
    return this.save();
  },
  deductBalance: function (amount, description = "Debit") {
    if (this.balance < amount) throw new Error("Insufficient balance");
    this.balance -= amount;
    this.transactions.push({
      type: "debit",
      amount,
      description,
    });
    return this.save();
  },
  addItem: function (item) {
    this.items.push(item);
    return this.save();
  },
};

const Wallet = mongoose.model("Wallet", walletSchema);
module.exports = Wallet;
