const express = require("express");
const Availability = require("../models/Availability");
const Group = require("../models/Group");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, async (req, res) => {
  const { groupId, slots } = req.body;

  let record = await Availability.findOne({
    userId: req.user.id,
    groupId
  });

  if (record) {
    record.slots = slots;
    await record.save();
  } else {
    await Availability.create({
      userId: req.user.id,
      groupId,
      slots
    });
  }

  res.json({ message: "Availability saved" });
});

router.get("/:groupId", protect, async (req, res) => {
  const { groupId } = req.params;

  const group = await Group.findById(groupId);
  const totalMembers = group.members.length;

  const records = await Availability.find({ groupId });

  const counter = {};

  records.forEach(user => {
    user.slots.forEach(slot => {
      const key = `${slot.date}-${slot.time}`;
      if (!counter[key]) counter[key] = 0;
      counter[key]++;
    });
  });

  const result = Object.keys(counter).map(key => ({
    slot: key,
    percent: (counter[key] / totalMembers) * 100
  }));

  res.json(result);
});

module.exports = router;