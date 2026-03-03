require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const User = require("./models/User");

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

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      email,
      username,
      password: hashedPassword
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

    const isMatch = await bcrypt.compare(password, user.password);

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
// START SERVER (UPDATED PORT)
// ============================
const PORT = 5055;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});