require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const { nanoid } = require("nanoid");
const Meeting = require("./models/Meetings");
const User = require("./models/User");
const Group = require("./models/Group");
const Message = require("./models/Message");
const app = express();
const Availability = require("./models/Availability");
const Task = require("./models/Task");

app.use(cors());
app.use(express.json());

/* ============================
   DATABASE CONNECTION
============================ */
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
    console.log("Connected to DB:", mongoose.connection.name);
  })
  .catch((err) => {
    console.log("❌ MongoDB Error:", err);
  });

/* ============================
   TEST ROUTE
============================ */
app.get("/", (req, res) => {
  res.send("Server is working ✅");
});

/* ============================
   REGISTER
============================ */
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
    console.log("Register Error:", error);
    res.status(500).json({ message: error.message });
  }
});

/* ============================
   LOGIN
============================ */
app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({
      $or: [{ username }, { email: username }]
    });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    res.json({
      message: "Login successful",
      username: user.username
    });

  } catch (error) {
    console.log("Login Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

/* ============================
   SEARCH USERS
============================ */
app.get("/search-users", async (req, res) => {
  try {
    const query = req.query.query;
    if (!query) return res.json([]);

    const users = await User.find({
      username: { $regex: query, $options: "i" }
    }).select("_id username");

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

/* ============================
   CREATE GROUP (FIXED)
============================ */
app.post("/create-group", async (req, res) => {
  try {
    const { groupName, members, username } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    const inviteCode = nanoid(6);

    const newGroup = new Group({
      name: groupName,
      inviteCode,
      members: [user._id, ...members]
    });

    await newGroup.save();

    res.status(201).json({ message: "Project successfully created" });

  } catch (error) {
    console.log("Create Group Error:", error);
    res.status(500).json({ message: error.message });
  }
});

/* ============================
   JOIN GROUP (FIXED ObjectId)
============================ */
app.post("/join-group", async (req, res) => {
  try {
    const { inviteCode, username } = req.body;

    const group = await Group.findOne({ inviteCode });
    if (!group) {
      return res.status(404).json({ message: "Invalid invite code" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!group.members.includes(user._id)) {
      group.members.push(user._id);
      await group.save();
    }

    res.json({ success: true, group });

  } catch (error) {
    console.log("Join Group Error:", error);
    res.status(500).json({ message: error.message });
  }
});

/* ============================
   GET USER GROUPS
============================ */
app.get("/get-user-groups/:username", async (req, res) => {
  try {
    console.log("------------------------------------------------");
    console.log("Username received:", req.params.username);

    const user = await User.findOne({ username: req.params.username });
    console.log("User found:", user);

    if (!user) {
      console.log("User NOT found in DB");
      return res.json([]);
    }

    console.log("User ID:", user._id);

    const allGroups = await Group.find({});
    console.log("ALL GROUPS IN DB:");
    console.log(JSON.stringify(allGroups, null, 2));
    
    const availabilityRoutes = require("./routes/availabilityRoutes");
    app.use("/", availabilityRoutes);
    
    const matchingGroups = await Group.find({
      members: user._id
    });

    console.log("MATCHING GROUPS:");
    console.log(JSON.stringify(matchingGroups, null, 2));

    res.json(matchingGroups);

  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});
/* ============================
   GET SINGLE GROUP
============================ */
app.get("/group/:id", async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate("members", "username");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    res.json(group);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ============================
   DELETE GROUP
============================ */
app.delete("/delete-group/:id", async (req, res) => {
  try {
    await Group.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

/* ============================
   GET USER INFO
============================ */
app.get("/user/:username", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});


//TOGGLE ROUTES
app.post("/toggle-availability", async (req, res) => {
  const { groupId, userId, day, hour } = req.body;

  const existing = await Availability.findOne({
    groupId,
    userId,
    day,
    hour
  });

  if (existing) {
    await Availability.deleteOne({ _id: existing._id });
    return res.json({ status: "removed" });
  }

  await Availability.create({ groupId, userId, day, hour });
  res.json({ status: "added" });
});
// HEATMAP COUNTS 
app.get("/availability-heatmap/:groupId", async (req, res) => {
  const groupId = req.params.groupId;

  const result = await Availability.aggregate([
    { $match: { groupId: new mongoose.Types.ObjectId(groupId) } },
    {
      $group: {
        _id: { day: "$day", hour: "$hour" },
        count: { $sum: 1 }
      }
    }
  ]);

  res.json(result);
});
// ============================
// CREATE TASK
// ============================
app.post("/create-task", async (req, res) => {
  try {
    const {
      groupId,
      title,
      description,
      priority,
      assignedTo,
      dueDate,
      status
    } = req.body;

    if (!groupId || !title) {
      return res.status(400).json({ message: "groupId and title are required" });
    }

    const task = await Task.create({
      groupId,
      title,
      description: description || "",
      priority: priority || "medium",
      assignedTo: assignedTo || "",
      dueDate: dueDate || null,
      status: status || "backlog"
    });

    res.status(201).json(task);
  } catch (error) {
    console.log("Create Task Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// ============================
// GET TASKS FOR A GROUP
// ============================
app.get("/tasks/:groupId", async (req, res) => {
  try {
    const tasks = await Task.find({ groupId: req.params.groupId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (error) {
    console.log("Get Tasks Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// ============================
// UPDATE TASK STATUS
// ============================
app.put("/update-task-status", async (req, res) => {
  try {
    const { taskId, status } = req.body;

    const allowedStatuses = ["backlog", "in-progress", "review", "complete"];

    if (!taskId || !status) {
      return res.status(400).json({ message: "taskId and status are required" });
    }

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    await Task.findByIdAndUpdate(taskId, { status });

    res.json({ message: "Updated" });
  } catch (error) {
    console.log("Update Task Status Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// ============================
// CREATE MEETING
// ============================
app.post("/create-meeting", async (req, res) => {
  const { groupId, title, date, time } = req.body;

  const meeting = await Meeting.create({
    groupId,
    title,
    date,
    time
  });

  res.json(meeting);
});

// ============================
// GET MEETINGS FOR GROUP
// ============================
app.get("/meetings/:groupId", async (req, res) => {
  const meetings = await Meeting.find({
    groupId: req.params.groupId
  });

  res.json(meetings);
});
// ============================
// SEND MESSAGE
// ============================
app.post("/send-message", async (req, res) => {
  const { groupId, userId, text } = req.body;

  await Message.create({
    groupId,
    userId,
    text
  });

  res.json({ message: "Sent" });
});

// ============================
// GET GROUP MESSAGES
// ============================
app.get("/messages/:groupId", async (req, res) => {
  const messages = await Message.find({
    groupId: req.params.groupId
  })
    .populate("userId", "username")
    .sort({ createdAt: 1 });

  res.json(messages);
});

// ================= SAVE AVAILABILITY =================
app.post("/save-availability", async (req, res) => {
  try {
    const { groupId, username, slots } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if availability already exists
    let existing = await Availability.findOne({
      groupId,
      userId: user._id
    });

    if (existing) {
      // Update existing record
      existing.slots = slots;
      await existing.save();
    } else {
      // Create new record
      await Availability.create({
        groupId,
        userId: user._id,
        slots
      });
    }

    res.json({ message: "Availability saved successfully" });

  } catch (error) {
    console.log("Save Availability Error:", error);
    res.status(500).json({ message: error.message });
  }
});
// ================= GET AVAILABILITY =================
app.get("/get-availability/:groupId", async (req, res) => {
  try {
    const availability = await Availability.find({
      groupId: req.params.groupId
    });

    res.json(availability);

  } catch (error) {
    console.log("Get Availability Error:", error);
    res.status(500).json({ message: error.message });
  }
});

// Matchinng algorithm
app.get("/match-availability/:groupId", async (req, res) => {
  const records = await Availability.find({
    groupId: req.params.groupId
  });

  if (!records.length) return res.json({});

  const allSlots = records.map(r => r.slots);

  const intersection = allSlots.reduce((a, b) =>
    a.filter(slot => b.includes(slot))
  );

  const result = {};

  intersection.forEach(slot => {
    const [day, hour] = slot.split("-");
    if (!result[day]) result[day] = [];
    result[day].push(hour + ":00");
  });

  res.json(result);
});

//
app.post("/save-availability", async (req, res) => {
  const { groupId, username, slots } = req.body;

  const user = await User.findOne({ username });

  await Availability.findOneAndUpdate(
    { groupId, userId: user._id },
    { slots },
    { upsert: true, new: true }
  );

  res.json({ message: "Saved" });
});
// ============================
// CHANGE PASSWORD
// ============================
app.post("/change-password", async (req, res) => {
  try {
    const { username, currentPassword, newPassword } = req.body;

    if (!username || !currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields required" });
    }

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const taskRoutes = require("./routes/taskRoutes");
    app.use("/tasks", taskRoutes);

    const isMatch = await bcrypt.compare(currentPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Current password incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password successfully changed" });
  } catch (error) {
    console.log("Change Password Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// ============================
// START SERVER
// ============================
const PORT = 5055;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});