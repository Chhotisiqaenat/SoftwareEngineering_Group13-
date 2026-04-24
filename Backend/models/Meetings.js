const mongoose = require("mongoose");

const meetingSchema = new mongoose.Schema({
  title: String,
  date: String,
  time: String,
  projectName: String
});

module.exports = mongoose.model("Meeting", meetingSchema);
