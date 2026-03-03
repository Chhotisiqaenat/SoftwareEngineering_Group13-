const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true
  },
  title: String,
  description: String,
  status: {
    type: String,
    enum: ["backlog", "in-progress", "done"],
    default: "backlog"
  }
});

module.exports = mongoose.model("Task", taskSchema);