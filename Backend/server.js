require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const { nanoid } = require("nanoid");

const User = require("./models/User");
const Group = require("./models/Group");
const Availability = require("./models/Availability");

const app = express();

// ============================
// MIDDLEWARE
// ============================
app.use(cors());
app.use(express.json());

// ============================
// DATABASE CONNECTION
// ============================
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    console.log("Connected to DB:", mongoose.connection.name);
  })
  .catch((err) => {
    console.log("❌ MongoDB Error:", err);
  });

// ============================
// TEST ROUTE
// ============================
app.get("/", (req, res) => {
  res.send("Server is working ✅");
});

// ============================
// REGISTER
// ============================
app.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, username, password } = req.body;

    if (!firstName || !lastName || !email || !username || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email or Username already exists" });
    }

    const newUser = new User({
      firstName,
      lastName,
      email,
      username,
      password
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });

  } catch (error) {
    console.log("🔥 Register Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// ============================
// LOGIN
// ============================
app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    res.json({
      message: "Login successful",
      username: user.username
    });

  } catch (error) {
    console.log("🔥 Login Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// ============================
// GET USER INFO
// ============================
app.get("/user/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username
    });

  } catch (error) {
    console.log("🔥 Fetch User Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// ============================
// CREATE GROUP
// ============================
app.post("/create-group", async (req, res) => {
  try {
    const { groupName, username } = req.body;

    const inviteCode = nanoid(6);

    const newGroup = new Group({
      name: groupName,
      inviteCode,
      members: [username]
    });

    await newGroup.save();

    res.json(newGroup);

  } catch (error) {
    console.log("🔥 Create Group Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// ============================
// JOIN GROUP
// ============================
app.post("/join-group", async (req, res) => {
  try {
    const { inviteCode, username } = req.body;

    const group = await Group.findOne({ inviteCode });

    if (!group) {
      return res.status(404).json({ message: "Invalid invite code" });
    }

    if (!group.members.includes(username)) {
      group.members.push(username);
      await group.save();
    }

    res.json(group);

  } catch (error) {
    console.log("🔥 Join Group Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// ============================
// GET USER GROUPS
// ============================
app.get("/get-user-groups/:username", async (req, res) => {
  try {
    const groups = await Group.find({ members: req.params.username });
    res.json(groups);
  } catch (error) {
    console.log("🔥 Get User Groups Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// ============================
// GET GROUP DETAILS
// ============================
app.get("/group-details/:groupId", async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.json(group);

  } catch (error) {
    console.log("🔥 Group Details Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// ============================
// SUBMIT AVAILABILITY
// ============================
app.post("/submit-availability", async (req, res) => {
  try {
    const { username, groupId, slots } = req.body;

    let record = await Availability.findOne({ username, groupId });

    if (record) {
      record.slots = slots;
      await record.save();
    } else {
      await Availability.create({ username, groupId, slots });
    }

    res.json({ message: "Availability saved" });

  } catch (error) {
    console.log("🔥 Availability Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// ============================
// GET GROUP AVAILABILITY OVERLAP
// ============================
app.get("/group-availability/:groupId", async (req, res) => {
  try {
    const group = await Group.findById(req.params.groupId);
    const totalMembers = group.members.length;

    const records = await Availability.find({ groupId: req.params.groupId });

    const counter = {};

    records.forEach(user => {
      user.slots.forEach(slot => {
        const key = `${slot.day}-${slot.time}`;
        if (!counter[key]) counter[key] = 0;
        counter[key]++;
      });
    });

    const result = Object.keys(counter).map(key => ({
      slot: key,
      percent: (counter[key] / totalMembers) * 100
    }));

    res.json(result);

  } catch (error) {
    console.log("🔥 Overlap Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// ============================
// START SERVER
// ============================
const PORT = process.env.PORT || 5055;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// ============================
// CREATE GROUP (NEW PROJECT)
// ============================
app.post("/create-group", async (req, res) => {
  try {
    const { groupName, username, members } = req.body;

    const inviteCode = nanoid(6);

    // Always include creator
    const allMembers = [...new Set([username, ...(members || [])])];

    const newGroup = new Group({
      name: groupName,
      inviteCode,
      members: allMembers
    });

    await newGroup.save();

    res.json({
      message: "Project created successfully",
      group: newGroup
    });

  } catch (error) {
    console.log("🔥 Create Group Error:", error);
    res.status(500).json({ message: error.message });
  }
});