const mongoose = require("mongoose");

const expenseSchema = new mongoose.Schema({
  amount: {
    type: Number,
    required: [true, "Amount is required"],
    min: [0.01, "Amount must be greater than 0"]
  },

  category: {
    type: String,
    required: [true, "Category is required"],
    trim: true
  },

  date: {
    type: Date,
    required: [true, "Date is required"]
  },

  note: {
    type: String,
    trim: true,
    default: ""
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Expense", expenseSchema);
