const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// MongoDB connection
mongoose.connect("mongodb+srv://abiram:abi18@cluster0.tklkrqn.mongodb.net/deviceFP?retryWrites=true&w=majority&appName=Cluster0")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Schema
const User = mongoose.model("User", new mongoose.Schema({
  username: String,
  password: String,
  primaryFingerprint: String,
  primaryDeviceInfo: Object,
}));

const Fingerprint = mongoose.model("Fingerprint", new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  timestamp: String,
  fingerprint: String,
  deviceInfo: Object,
}));

// Serve HTML
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

// 🔐 Signup
app.post("/signup", async (req, res) => {
  const { username, password, timestamp, fingerprint, deviceInfo } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const user = new User({
      username,
      password,
      primaryFingerprint: fingerprint,
      primaryDeviceInfo: deviceInfo,
    });
    await user.save();

    const fp = new Fingerprint({
      userId: user._id,
      timestamp,
      fingerprint,
      deviceInfo,
    });
    await fp.save();

    console.log("✅ New user registered with primary device");
    res.json({ message: "Sign-up successful" });
  } catch (err) {
    console.error("❌ Error in sign-up:", err);
    res.status(500).json({ message: "Server error during sign-up" });
  }
});

// 🔑 Login
app.post("/", async (req, res) => {
  const { username, timestamp, fingerprint, deviceInfo } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(401).json({ message: "Invalid username" });

    const isPrimary = user.primaryFingerprint === fingerprint;

    const fp = new Fingerprint({
      userId: user._id,
      timestamp,
      fingerprint,
      deviceInfo,
    });
    await fp.save();

    res.json({
      message: isPrimary
        ? "✅ Logged in from primary device"
        : "⚠️ Logged in from a secondary device",
    });
  } catch (err) {
    console.error("❌ Error saving fingerprint:", err);
    res.status(500).json({ error: "Failed to log fingerprint" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});