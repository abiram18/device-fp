const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const sendVerificationEmail = require("./emailService"); // 💌

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

// Schemas
const User = mongoose.model("User", new mongoose.Schema({
  username: String,
  password: String,
  email: String, // ✅ added email
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
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

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
      email, // ✅ store email
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

app.post("/", async (req, res) => {
  const { username, timestamp, fingerprint, deviceInfo } = req.body;

  try {
    const fp = new Fingerprint({
      username,
      timestamp,
      fingerprint,
      deviceInfo,
    });
    await fp.save();
    res.json({ message: "Fingerprint saved to DB" });
  } catch (err) {
    console.error("❌ Error saving fingerprint:", err);
    res.status(500).json({ error: "Failed to save fingerprint" });
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
      return res.json({
        message: "✅ Logged in from primary device",
      });
    } else {
      // 🔐 Generate and send verification code
      const verificationCode = Math.floor(100000 + Math.random() * 900000);
      await sendVerificationEmail(user.email, verificationCode);

      return res.json({
        message: "⚠️ Logged in from secondary device. Verification code sent to email.",
        requireVerification: true,
        codeSent: true,
      });
    }
  } catch (err) {
    console.error("❌ Error in login:", err);
    res.status(500).json({ message: "Login failed" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://0.0.0.0:${PORT}`);
});