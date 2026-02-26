const express = require("express");
const { nanoid } = require("nanoid");
const Group = require("../models/Group");
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/create", protect, async (req, res) => {
  const inviteCode = nanoid(8);

  const group = await Group.create({
    name: req.body.name,
    createdBy: req.user.id,
    members: [req.user.id],
    inviteCode
  });

  await User.findByIdAndUpdate(req.user.id, {
    $push: { groups: group._id }
  });

  res.json(group);
});

router.post("/join", protect, async (req, res) => {
  const group = await Group.findOne({ inviteCode: req.body.inviteCode });

  if (!group) return res.status(404).json({ message: "Invalid code" });

  if (!group.members.includes(req.user.id)) {
    group.members.push(req.user.id);
    await group.save();

    await User.findByIdAndUpdate(req.user.id, {
      $push: { groups: group._id }
    });
  }

  res.json(group);
});

module.exports = router;