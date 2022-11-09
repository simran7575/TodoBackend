const mongoose = require("mongoose");
const validator = require("validator");

const taskSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    required: true,
    minlength: [3, "Title should be more than 2 characters"],
  },
  description: {
    type: String,
    required: true,
    minlength: [5, "Title should be more than 5 characters"],
  },

  status: {
    type: String,
    enum: {
      values: ["Pending", "Ongoing", "Completed", "Cancelled"],
      message: "Status can only be - Pending, Ongoing, Completed, Cancelled",
    },
    default: "Pending",
  },
  taskCompletionTime: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Task", taskSchema);
