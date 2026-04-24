const express = require("express");
const router = express.Router();

const Availability = require("../models/Availability");
const Group = require("../models/Group");
const User = require("../models/User");

// ================= SAVE AVAILABILITY =================
router.post("/submit-availability", async (req, res) => {
  try {
    const { username, groupId, slots } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    let record = await Availability.findOne({
      userId: user._id,
      groupId
    });

    if (record) {
      record.slots = slots;
      await record.save();
    } else {
      await Availability.create({
        userId: user._id,
        groupId,
        slots
      });
    }

    res.json({ message: "Availability saved successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ================= GET USER AVAILABILITY =================
router.get("/my-availability/:username/:groupId", async (req, res) => {
  try {
    const { username, groupId } = req.params;

    const User = require("../models/User");
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const record = await Availability.findOne({
      userId: user._id,
      groupId
    });

    if (!record) {
      return res.json([]);
    }

    res.json(record.slots);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// ================= GET GROUP OVERLAP =================
router.get("/group-availability/:groupId", async (req, res) => {
  try {
    const { groupId } = req.params;

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const totalMembers = group.members.length;

    const records = await Availability.find({ groupId });

    const counter = {};

    // Count how many users selected each slot
    records.forEach(user => {
      user.slots.forEach(slot => {
        const key = `${slot.day}-${slot.time}`;
        if (!counter[key]) counter[key] = 0;
        counter[key]++;
      });
    });

    // Convert to array with percentages
    const result = Object.keys(counter).map(key => ({
      slot: key,
      count: counter[key],
      percent: Math.round((counter[key] / totalMembers) * 100)
    }));

    // Sort best (highest overlap) first
    result.sort((a, b) => b.percent - a.percent);

    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;