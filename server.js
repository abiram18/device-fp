const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const sendVerificationEmail = require("./emailService");

const app = express();
const PORT = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// MongoDB connection
mongoose.connect("your_mongo_url")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Schemas
const User = mongoose.model("User", new mongoose.Schema({
  username: String,
  password: String,
  email: String,
  primaryFingerprint: String,
  primaryDeviceInfo: Object,
}));

const Fingerprint = mongoose.model("Fingerprint", new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  timestamp: String,
  fingerprint: String,
  deviceInfo: Object,
}));

// Routes
app.get("/", (req, res) => res.sendFile(path.join(__dirname, "public", "index.html")));
app.get("/login", (req, res) => res.sendFile(path.join(__dirname, "public", "login.html")));
app.get("/verification-sent", (req, res) => res.sendFile(path.join(__dirname, "public", "verification.html")));
app.get("/registered", (req, res) => res.sendFile(path.join(__dirname, "public", "registered.html")));

app.post("/signup", async (req, res) => {
  const { username, password, email, timestamp, fingerprint, deviceInfo } = req.body;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const user = new User({
      username,
      password,
      email,
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

    res.redirect("/registered.html");
  } catch (err) {
    console.error("❌ Error in sign-up:", err);
    res.status(500).json({ message: "Server error during sign-up" });
  }
});

app.post("/login", async (req, res) => {
  const { username, password, timestamp, fingerprint, deviceInfo } = req.body;

  try {
    const user = await User.findOne({ username, password });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isPrimary = user.primaryFingerprint === fingerprint;

    const fp = new Fingerprint({
      userId: user._id,
      timestamp,
      fingerprint,
      deviceInfo,
    });
    await fp.save();

    if (isPrimary) {
      return res.json({ message: "✅ Logged in from primary device" });
    } else {
      const code = Math.floor(100000 + Math.random() * 900000); // 6-digit code
      await sendVerificationEmail(user.email, code);
      return res.redirect("/email-sent.html");
    }
  } catch (err) {
    console.error("❌ Error in login:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});