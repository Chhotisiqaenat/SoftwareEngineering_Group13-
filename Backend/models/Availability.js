const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema({
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  // store structured slots
  slots: [
    {
      day: String,
      time: String
    }
  ]
});

module.exports = mongoose.model("Availability", availabilitySchema);