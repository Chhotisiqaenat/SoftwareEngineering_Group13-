const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true
  },
  title: String,
  date: String,
  time: String
});

module.exports = mongoose.model("Meeting", meetingSchema);