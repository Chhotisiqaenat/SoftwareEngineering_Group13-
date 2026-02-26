const mongoose = require("mongoose");

const availabilitySchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
    slots: [
      {
        date: String,
        time: String
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Availability", availabilitySchema);