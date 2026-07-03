const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: [true, "Budget amount is required"],
      min: [0, "Budget cannot be negative"]
    },
    month: {
      type: String,
      required: [true, "Budget month is required"],
      trim: true
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    }
  },
  { timestamps: true }
);

budgetSchema.index({ month: 1, user: 1 }, { unique: true });

module.exports = mongoose.model("Budget", budgetSchema);
